from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import sqlite3
import json
import uuid
from datetime import datetime
import os
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
import base64
import logging
import re  # For Persian RTL detection

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "https://m-for-maniac.github.io"]}})

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# File paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, '..', 'data', 'ingredients.db')
RECIPES_PATH = os.path.join(BASE_DIR, 'recipes.json')

# Daily Value constants (based on 2000-calorie diet)
DAILY_VALUES = {
    'Calories': {'value': 2100, 'unit': 'kcal'},
    'Proteins': {'value': 200, 'unit': 'g'},
    'Fats': {'value': 78, 'unit': 'g'},
    'Carb': {'value': 275, 'unit': 'g'},
    'Fiber(F)': {'value': 28, 'unit': 'g'},
    'Sugars': {'value': 50, 'unit': 'g'},
    'Na': {'value': 2300, 'unit': 'mg'},
    'Potassium(K)': {'value': 4700, 'unit': 'mg'},
    'Phosphorus(P)': {'value': 1250, 'unit': 'mg'},
    'Magnesium(Mg)': {'value': 420, 'unit': 'mg'},
    'Calcium(Ca)': {'value': 1300, 'unit': 'mg'},
    'Iron(Fe)': {'value': 18, 'unit': 'mg'},
    'Zn': {'value': 11, 'unit': 'mg'},
    'Copper(Cu)': {'value': 0.9, 'unit': 'mg'},
    'Manganese(Mn)': {'value': 2.3, 'unit': 'mg'},
    'Se': {'value': 55, 'unit': 'µg'},
    'Fluoride(F)': {'value': 4, 'unit': 'mg'},
    'VitaminA': {'value': 900, 'unit': 'µg'},
    'VitaminC': {'value': 90, 'unit': 'mg'},
    'VitaminD': {'value': 20, 'unit': 'µg'},
    'VitaminE': {'value': 15, 'unit': 'mg'},
    'VitaminK': {'value': 120, 'unit': 'µg'},
    'Thiamin(B1)': {'value': 1.2, 'unit': 'mg'},
    'Ribofavin(B2)': {'value': 1.3, 'unit': 'mg'},
    'Niacin(B3)': {'value': 16, 'unit': 'mg'},
    'VitaminB6': {'value': 1.7, 'unit': 'mg'},
    'VitaminB12': {'value': 2.4, 'unit': 'µg'},
    'PantothenicAcid(B5)': {'value': 5, 'unit': 'mg'},
    'Cholines': {'value': 550, 'unit': 'mg'},
    'SaturatedFattyacid': {'value': 20, 'unit': 'g'},
    'TransFattyacid': {'value': None, 'unit': 'g'},
    'Cholestrols': {'value': 300, 'unit': 'mg'},
    'Alcohol(ethyl)': {'value': None, 'unit': 'g'},
    'Caffeines': {'value': None, 'unit': 'mg'},
    'Water(H2O)': {'value': None, 'unit': 'g'},
    'Ashes': {'value': None, 'unit': 'g'},
    'Cost': {'value': None, 'unit': None}
}

BENEFIT_PERCENT = 1.2  # 20% benefit markup for price per serving

def adjust_cost(cost, currency):
    """Adjust cost based on currency (Toman or IRR)."""
    return cost * 10 if currency == 'IRR' else cost

def get_db_connection():
    """Helper function to get SQLite connection."""
    if not os.path.exists(DB_PATH):
        raise FileNotFoundError(f"Database file not found at {DB_PATH}")
    return sqlite3.connect(DB_PATH)

def calculate_nutrition(ingredient_list, scale_factor, currency):
    """Helper function to calculate nutrition for a list of ingredients."""
    try:
        conn = get_db_connection()
        ingredients = pd.read_sql_query("SELECT * FROM ingredients", conn)
        conn.close()

        ingredients.set_index('ingredient_name', inplace=True)
        nutrient_columns = [col for col in ingredients.columns if col in DAILY_VALUES and col not in ['PurchaseCost', 'PurchaseAmt', 'persian_name', 'dietary', 'category']]
        result = {}

        for nutrient in nutrient_columns:
            try:
                value = sum(ingredients.loc[ing['ingredient'], nutrient] * ing['quantity'] * scale_factor / 100
                           for ing in ingredient_list if ing['ingredient'] in ingredients.index)
                result[nutrient] = {
                    'value': round(value, 2),
                    'unit': DAILY_VALUES[nutrient]['unit'],
                    'percent_dv': round((value / DAILY_VALUES[nutrient]['value'] * 100), 2) if DAILY_VALUES[nutrient]['value'] else None
                }
            except KeyError as e:
                logger.warning(f"Nutrient {nutrient} not found for some ingredients: {str(e)}")
                result[nutrient] = {'value': 0, 'unit': DAILY_VALUES[nutrient]['unit'], 'percent_dv': None}

        cost = sum(ingredients.loc[ing['ingredient'], 'Price/Unit'] * ing['quantity'] * scale_factor
                   for ing in ingredient_list if ing['ingredient'] in ingredients.index)
        result['Cost'] = {'value': round(adjust_cost(cost, currency), 2), 'unit': currency, 'percent_dv': None}

        return result
    except Exception as e:
        logger.error(f"Error in calculate_nutrition: {str(e)}")
        raise

def create_nutrition_label_image(nutrition_data, title, currency):
    """Generate an FDA-style nutrition label image with black and white grids, increased padding, and RTL support for Persian titles."""
    try:
        # Increase width and height for more padding
        width, height = 450, 900  # Adjusted for better spacing
        img = Image.new('RGB', (width, height), color='white')
        draw = ImageDraw.Draw(img)
        try:
            # Use DejaVu Sans fonts available on PythonAnywhere
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 16)
            bold_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 18)
            small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 14)
        except IOError:
            try:
                font = ImageFont.truetype("Vazirmatn-Regular.ttf", 16)
                bold_font = ImageFont.truetype("Vazirmatn-Bold.ttf", 18)
                small_font = ImageFont.truetype("Vazirmatn-Thin.ttf", 14)
            except IOError:
                font = ImageFont.load_default()
                bold_font = ImageFont.load_default()
                small_font = ImageFont.load_default()
                logger.warning("Failed to load fonts, using default")

        # Increased padding and spacing
        y_position = 20  # Increased top margin
        line_height = 25  # Increased line height for better spacing
        left_margin = 20  # Increased left margin
        right_margin = 20  # Increased right margin
        dv_x = width - right_margin - 50  # Adjusted for right-aligned % DV with more padding

        # Detect if title is in Persian (RTL) using Unicode range for Persian characters
        persian_pattern = re.compile(r'[\u0600-\u06FF]')
        is_rtl = bool(persian_pattern.search(title))

        def draw_line(text, x=left_margin, bold=False, small=False, dv_text=None, rtl=is_rtl):
            nonlocal y_position
            font_to_use = bold_font if bold else (small_font if small else font)
            if rtl:
                # Calculate text width to right-align for RTL text
                text_width = draw.textlength(text, font=font_to_use)
                x_position = width - right_margin - text_width
            else:
                x_position = x
            draw.text((x_position, y_position), text, font=font_to_use, fill='black')
            if dv_text is not None:
                # Right-align % DV (always LTR)
                dv_width = draw.textlength(dv_text, font=font_to_use)
                draw.text((dv_x - dv_width, y_position), dv_text, font=font_to_use, fill='black')
            y_position += line_height

        def draw_thick_line(thickness=6):  # Slightly thicker line
            nonlocal y_position
            draw.rectangle([(left_margin, y_position), (width - right_margin, y_position + thickness)], fill='black')
            y_position += thickness + 10  # Increased spacing after thick lines

        def draw_thin_line():
            nonlocal y_position
            draw.line([(left_margin, y_position), (width - right_margin, y_position)], fill='black', width=1)
            y_position += 8  # Increased spacing after thin lines

        # Title (RTL if Persian, LTR if English)
        draw_line(title, bold=True, rtl=is_rtl)
        draw_thick_line()

        # Serving Size (always LTR)
        draw_line("Serving Size: 1 serving")
        draw_thick_line()

        # Calories (always LTR)
        draw_line(f"Calories {nutrition_data.get('Calories', {}).get('value', 0)} kcal", bold=True)
        draw_thick_line()

        # Nutrients with grid (always LTR)
        nutrients_order = [
            ('Fats', left_margin + 10, 'Total Fat'),
            ('SaturatedFattyacid', left_margin + 20, 'Saturated Fat'),
            ('TransFattyacid', left_margin + 20, 'Trans Fat'),
            ('Cholestrols', left_margin + 10, 'Cholesterol'),
            ('Na', left_margin + 10, 'Sodium'),
            ('Carb', left_margin + 10, 'Total Carbohydrate'),
            ('Fiber(F)', left_margin + 20, 'Dietary Fiber'),
            ('Sugars', left_margin + 20, 'Total Sugars'),
            ('Proteins', left_margin + 10, 'Protein'),
            ('VitaminD', left_margin + 10, 'Vitamin D'),
            ('Calcium(Ca)', left_margin + 10, 'Calcium'),
            ('Iron(Fe)', left_margin + 10, 'Iron'),
            ('Potassium(K)', left_margin + 10, 'Potassium')
        ]

        draw_line("% Daily Value*", x=dv_x - draw.textlength("% Daily Value*", small_font), small=True)
        y_position += 8  # Extra spacing after % DV header

        for nutrient, indent_level, display_name in nutrients_order:
            if nutrient in nutrition_data:
                data = nutrition_data[nutrient]
                value = data.get('value', 0)
                unit = data.get('unit', '')
                percent_dv = data.get('percent_dv', None)
                text = f"{display_name} {value} {unit}"
                dv_text = f"{percent_dv}%" if percent_dv is not None else ""
                draw_line(text, x=indent_level, dv_text=dv_text)
                draw_thin_line()

        # Footer (always LTR)
        draw_thick_line()
        draw_line("*Percent Daily Values are based on a 2,000 calorie diet.", x=left_margin, small=True)

        buffered = BytesIO()
        img.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()
        return img_str
    except Exception as e:
        logger.error(f"Error in create_nutrition_label_image: {str(e)}")
        raise

@app.route('/export_nutrition_image', methods=['POST'])
def export_nutrition_image():
    try:
        data = request.get_json()
        logger.debug(f"Received in /export_nutrition_image: {data}")
        ingredient_list = data.get('ingredient_list', [])
        scale_factor = float(data.get('scale_factor', 1.0))
        currency = data.get('currency', 'Toman')
        title = data.get('title', 'Nutrition Facts')

        if not ingredient_list:
            return jsonify({'error': 'No ingredients provided'}), 400

        nutrition_data = calculate_nutrition(ingredient_list, scale_factor, currency)
        img_str = create_nutrition_label_image(nutrition_data, title, currency)
        return jsonify({'image': f'data:image/png;base64,{img_str}'})
    except Exception as e:
        logger.error(f"Error in export_nutrition_image: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/ingredients', methods=['GET'])
def get_ingredients():
    try:
        max_calories = request.args.get('max_calories', type=float)
        min_protein = request.args.get('min_protein', type=float)
        max_fat = request.args.get('max_fat', type=float)
        dietary = request.args.get('dietary', '')
        category = request.args.get('category', '')
        conn = get_db_connection()
        query = "SELECT * FROM ingredients"
        conditions = []
        if max_calories:
            conditions.append(f"Calories <= {max_calories}")
        if min_protein:
            conditions.append(f"Proteins >= {min_protein}")
        if max_fat:
            conditions.append(f"Fats <= {max_fat}")
        if dietary:
            conditions.append(f"dietary = '{dietary}'")
        if category:
            conditions.append(f"category = '{category}'")
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
        df = pd.read_sql(query, conn)
        conn.close()
        if df.empty:
            logger.warning(f"No ingredients found for query: {query}")
        return jsonify(df.to_dict(orient='records'))
    except Exception as e:
        logger.error(f"Error in get_ingredients: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/calculate', methods=['POST'])
def calculate():
    try:
        data = request.get_json()
        logger.debug(f"Received in /calculate: {data}")
        currency = data.get('currency', 'Toman')
        selected = {k: v for k, v in data.items() if k != 'currency' and float(v) > 0}
        if not selected:
            return jsonify({'error': 'No ingredients selected'}), 400

        conn = get_db_connection()
        ingredients = pd.read_sql_query("SELECT * FROM ingredients", conn)
        conn.close()

        ingredients.set_index('ingredient_name', inplace=True)
        nutrient_columns = [col for col in ingredients.columns if col in DAILY_VALUES and col not in ['PurchaseCost', 'PurchaseAmt', 'persian_name', 'dietary', 'category']]
        result = {}

        for nutrient in nutrient_columns:
            try:
                value = sum(ingredients.loc[ing, nutrient] * qty / 100 for ing, qty in selected.items() if ing in ingredients.index)
                result[nutrient] = {
                    'value': round(value, 2),
                    'unit': DAILY_VALUES[nutrient]['unit'],
                    'percent_dv': round((value / DAILY_VALUES[nutrient]['value'] * 100), 2) if DAILY_VALUES[nutrient]['value'] else None
                }
            except KeyError as e:
                logger.warning(f"Nutrient {nutrient} not found for some ingredients: {str(e)}")
                result[nutrient] = {'value': 0, 'unit': DAILY_VALUES[nutrient]['unit'], 'percent_dv': None}

        cost = sum(ingredients.loc[ing, 'Price/Unit'] * qty for ing, qty in selected.items() if ing in ingredients.index)
        result['Cost'] = {'value': round(adjust_cost(cost, currency), 2), 'unit': currency, 'percent_dv': None}

        return jsonify(result)
    except Exception as e:
        logger.error(f"Error in calculate: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/recipes', methods=['POST'])
def get_matching_recipes():
    try:
        data = request.get_json()
        logger.debug(f"Received in /recipes: {data}")
        ingredients = data.get('ingredients', [])
        dietary = data.get('dietary', '')
        complexity = data.get('complexity', '')
        currency = data.get('currency', 'Toman')

        if not os.path.exists(RECIPES_PATH):
            logger.warning(f"Recipes file not found at {RECIPES_PATH}")
            return jsonify([]), 200

        with open(RECIPES_PATH, 'r') as f:
            recipes = json.load(f)

        conn = get_db_connection()
        ingredient_data = pd.read_sql_query("SELECT * FROM ingredients", conn)
        conn.close()

        matching_recipes = []

        for recipe in recipes:
            recipe_ingredients = set(ing['ingredient'].lower() for ing in recipe['ingredient_list'])
            selected_ingredients = set(ing.lower() for ing in ingredients)

            if selected_ingredients & recipe_ingredients:  # Partial match
                if dietary and recipe['dietary'].lower() != dietary.lower():
                    continue
                if complexity and recipe['complexity'].lower() != complexity.lower():
                    continue

                total_calories = 0
                total_protein = 0
                total_cost = 0
                for ing in recipe['ingredient_list']:
                    ingredient = ingredient_data[ingredient_data['ingredient_name'] == ing['ingredient'].strip()]
                    if not ingredient.empty:
                        total_calories += float(ingredient['Calories'].iloc[0]) * ing['quantity'] / 100
                        total_protein += float(ingredient['Proteins'].iloc[0]) * ing['quantity'] / 100
                        total_cost += float(ingredient['Price/Unit'].iloc[0] or 0) * ing['quantity']
                    else:
                        logger.warning(f"Ingredient {ing['ingredient']} not found in database")

                servings = recipe.get('servings', 1)
                per_serving_calories = total_calories / servings
                per_serving_protein = total_protein / servings
                per_serving_cost = (total_cost / servings) * BENEFIT_PERCENT

                recipe_copy = recipe.copy()
                recipe_copy['total_calories'] = round(total_calories, 2)
                recipe_copy['total_protein'] = round(total_protein, 2)
                recipe_copy['total_cost'] = round(adjust_cost(total_cost, currency), 2)
                recipe_copy['per_serving_calories'] = round(per_serving_calories, 2)
                recipe_copy['per_serving_protein'] = round(per_serving_protein, 2)
                recipe_copy['per_serving_cost'] = round(adjust_cost(per_serving_cost, currency), 2)
                matching_recipes.append(recipe_copy)

        return jsonify(matching_recipes)
    except Exception as e:
        logger.error(f"Error in get_matching_recipes: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/get_recipes', methods=['GET'])
def get_recipes():
    try:
        dietary = request.args.get('dietary', '')
        complexity = request.args.get('complexity', '')
        max_calories = request.args.get('max_calories', type=float)
        max_cost = request.args.get('max_cost', type=float)
        currency = request.args.get('currency', 'Toman')

        if not os.path.exists(RECIPES_PATH):
            logger.warning(f"Recipes file not found at {RECIPES_PATH}")
            return jsonify([]), 200

        with open(RECIPES_PATH, 'r') as f:
            recipes = json.load(f)

        conn = get_db_connection()
        df = pd.read_sql_query("SELECT * FROM ingredients", conn)
        conn.close()

        matches = []
        for recipe in recipes:
            if dietary and recipe['dietary'].lower() != dietary.lower():
                continue
            if complexity and recipe['complexity'].lower() != complexity.lower():
                continue

            ingredients = recipe['ingredient_list']
            total_calories = 0
            total_protein = 0
            total_cost = 0
            for ing in ingredients:
                ingredient = df[df['ingredient_name'] == ing['ingredient'].strip()]
                if not ingredient.empty:
                    total_calories += float(ingredient['Calories'].iloc[0]) * ing['quantity'] / 100
                    total_protein += float(ingredient['Proteins'].iloc[0]) * ing['quantity'] / 100
                    total_cost += float(ingredient['Price/Unit'].iloc[0] or 0) * ing['quantity']
                else:
                    logger.warning(f"Ingredient {ing['ingredient']} not found")

            servings = recipe.get('servings', 1)
            per_serving_calories = total_calories / servings
            per_serving_protein = total_protein / servings
            per_serving_cost = (total_cost / servings) * BENEFIT_PERCENT

            if max_calories and total_calories > max_calories:
                continue
            if max_cost and adjust_cost(total_cost, currency) > max_cost:
                continue

            matches.append({
                'recipe_name': recipe['recipe_name'],
                'ingredient_list': recipe['ingredient_list'],
                'instructions': recipe['instructions'],
                'prep_time': recipe['prep_time'],
                'dietary': recipe['dietary'],
                'complexity': recipe['complexity'],
                'servings': servings,
                'total_calories': round(total_calories, 2),
                'total_protein': round(total_protein, 2),
                'total_cost': round(adjust_cost(total_cost, currency), 2),
                'per_serving_calories': round(per_serving_calories, 2),
                'per_serving_protein': round(per_serving_protein, 2),
                'per_serving_cost': round(adjust_cost(per_serving_cost, currency), 2),
                'image': recipe.get('image', '/nutrition-calculator/images/placeholder.jpg'),
                'thumbnails': recipe.get('thumbnails', [
                    '/nutrition-calculator/images/thumbnails/placeholder-1.jpg',
                    '/nutrition-calculator/images/thumbnails/placeholder-2.jpg',
                    '/nutrition-calculator/images/thumbnails/placeholder-3.jpg'
                ])
            })

        return jsonify(matches)
    except Exception as e:
        logger.error(f"Error in get_recipes: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/recipe_nutrition', methods=['POST'])
def recipe_nutrition():
    try:
        data = request.get_json()
        logger.debug(f"Received in /recipe_nutrition: {data}")
        ingredient_list = data.get('ingredient_list', [])
        scale_factor = data.get('scale_factor', 1.0)
        currency = data.get('currency', 'Toman')
        servings = data.get('servings', 1)

        if not ingredient_list:
            return jsonify({'error': 'No ingredients provided'}), 400

        nutrition_data = calculate_nutrition(ingredient_list, scale_factor, currency)

        per_serving_nutrition = {}
        for key, value in nutrition_data.items():
            if key != 'Cost':
                per_serving_nutrition[key] = {
                    'value': round(value['value'] / servings, 2),
                    'unit': value['unit'],
                    'percent_dv': round(value['percent_dv'] / servings, 2) if value['percent_dv'] is not None else None
                }
            else:
                per_serving_cost = (value['value'] / servings) * BENEFIT_PERCENT
                per_serving_nutrition[key] = {
                    'value': round(per_serving_cost, 2),
                    'unit': value['unit'],
                    'percent_dv': None
                }

        return jsonify({
            'total_nutrition': nutrition_data,
            'per_serving_nutrition': per_serving_nutrition
        })
    except Exception as e:
        logger.error(f"Error in recipe_nutrition: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/update_price', methods=['POST'])
def update_price():
    try:
        data = request.get_json()
        logger.debug(f"Received in /update_price: {data}")
        ingredient_name = data.get('ingredient_name')
        purchase_cost = data.get('purchase_cost')
        purchase_amount = data.get('purchase_amount')
        if not ingredient_name or purchase_cost is None or purchase_amount is None:
            return jsonify({"error": "Missing required fields"}), 400
        try:
            purchase_cost = float(purchase_cost)
            purchase_amount = float(purchase_amount)
        except (ValueError, TypeError):
            return jsonify({"error": "Purchase cost and amount must be numbers"}), 400
        if purchase_amount <= 0:
            return jsonify({"error": "Purchase amount must be positive"}), 400
        price_per_unit = purchase_cost / purchase_amount
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE ingredients SET \"Price/Unit\" = ?, PurchaseCost = ?, PurchaseAmt = ? WHERE ingredient_name = ?",
            (price_per_unit, purchase_cost, purchase_amount, ingredient_name)
        )
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({"error": f"Ingredient {ingredient_name} not found"}), 404
        conn.commit()
        conn.close()
        return jsonify({"message": f"Updated Price/Unit for {ingredient_name} to {price_per_unit:.4f}"})
    except Exception as e:
        logger.error(f"Error in update_price: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/add_recipe', methods=['POST'])
def add_recipe():
    try:
        data = request.get_json()
        logger.debug(f"Received in /add_recipe: {data}")
        recipe_name = data.get('recipe_name')
        ingredient_list = data.get('ingredient_list', [])
        instructions = data.get('instructions', '')
        prep_time = data.get('prep_time')
        dietary = data.get('dietary', '')
        complexity = data.get('complexity', '')
        servings = data.get('servings', 1)  # New field, default to 1
        image = data.get('image', '')  # Optional image
        thumbnails = data.get('thumbnails', [])  # Optional thumbnails

        if not recipe_name or not ingredient_list:
            return jsonify({"error": "Recipe name and ingredients are required"}), 400
        try:
            prep_time = int(prep_time)
            servings = int(servings)
        except (ValueError, TypeError):
            return jsonify({"error": "Prep time and servings must be numbers"}), 400
        if prep_time <= 0 or servings <= 0:
            return jsonify({"error": "Prep time and servings must be positive"}), 400

        recipes = pd.read_json(RECIPES_PATH) if os.path.exists(RECIPES_PATH) and pd.io.json.read_json(RECIPES_PATH).shape[0] > 0 else pd.DataFrame(columns=['recipe_name', 'ingredient_list', 'instructions', 'prep_time', 'dietary', 'complexity', 'servings', 'image', 'thumbnails'])
        new_recipe = pd.DataFrame([{
            'recipe_name': recipe_name,
            'ingredient_list': ingredient_list,
            'instructions': instructions,
            'prep_time': prep_time,
            'dietary': dietary,
            'complexity': complexity,
            'servings': servings,
            'image': image,
            'thumbnails': thumbnails
        }])
        recipes = pd.concat([recipes, new_recipe], ignore_index=True)
        recipes.to_json(RECIPES_PATH, orient='records', indent=2)
        return jsonify({"message": f"Added recipe {recipe_name}"})
    except Exception as e:
        logger.error(f"Error in add_recipe: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/delete_recipe', methods=['POST'])
def delete_recipe():
    try:
        data = request.get_json()
        logger.debug(f"Received in /delete_recipe: {data}")
        recipe_name = data.get('recipe_name')
        if not recipe_name:
            return jsonify({"error": "Recipe name is required"}), 400
        recipes = pd.read_json(RECIPES_PATH)
        if recipe_name not in recipes['recipe_name'].values:
            return jsonify({"error": f"Recipe {recipe_name} not found"}), 404
        recipes = recipes[recipes['recipe_name'] != recipe_name]
        recipes.to_json(RECIPES_PATH, orient='records', indent=2)
        return jsonify({"message": f"Deleted recipe {recipe_name}"})
    except Exception as e:
        logger.error(f"Error in delete_recipe: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/update_recipe', methods=['POST'])
def update_recipe():
    try:
        data = request.get_json()
        logger.debug(f"Received in /update_recipe: {data}")
        recipe_name = data.get('recipe_name')
        ingredient_list = data.get('ingredient_list', [])
        instructions = data.get('instructions', '')
        prep_time = data.get('prep_time')
        dietary = data.get('dietary', '')
        complexity = data.get('complexity', '')
        servings = data.get('servings', 1)  # New field, default to 1
        image = data.get('image', '')  # Optional image
        thumbnails = data.get('thumbnails', [])  # Optional thumbnails

        if not recipe_name or not ingredient_list:
            return jsonify({"error": "Recipe name and ingredients are required"}), 400
        try:
            prep_time = int(prep_time)
            servings = int(servings)
        except (ValueError, TypeError):
            return jsonify({"error": "Prep time and servings must be numbers"}), 400
        if prep_time <= 0 or servings <= 0:
            return jsonify({"error": "Prep time and servings must be positive"}), 400

        conn = get_db_connection()
        df = pd.read_sql_query("SELECT ingredient_name FROM ingredients", conn)
        conn.close()
        for ing in ingredient_list:
            if ing['ingredient'] not in df['ingredient_name'].values:
                return jsonify({"error": f"Ingredient {ing['ingredient']} not found"}), 404

        recipes = pd.read_json(RECIPES_PATH) if os.path.exists(RECIPES_PATH) and pd.io.json.read_json(RECIPES_PATH).shape[0] > 0 else pd.DataFrame(columns=['recipe_name', 'ingredient_list', 'instructions', 'prep_time', 'dietary', 'complexity', 'servings', 'image', 'thumbnails'])
        if recipe_name not in recipes['recipe_name'].values:
            return jsonify({"error": f"Recipe {recipe_name} not found"}), 404
        recipes = recipes[recipes['recipe_name'] != recipe_name]
        updated_recipe = pd.DataFrame([{
            'recipe_name': recipe_name,
            'ingredient_list': ingredient_list,
            'instructions': instructions,
            'prep_time': prep_time,
            'dietary': dietary,
            'complexity': complexity,
            'servings': servings,
            'image': image,
            'thumbnails': thumbnails
        }])
        recipes = pd.concat([recipes, updated_recipe], ignore_index=True)
        recipes.to_json(RECIPES_PATH, orient='records', indent=2)
        return jsonify({"message": f"Updated recipe {recipe_name}"})
    except Exception as e:
        logger.error(f"Error in update_recipe: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/generate_meal_plan', methods=['POST'])
def generate_meal_plan():
    try:
        data = request.get_json()
        logger.debug(f"Received in /generate_meal_plan: {data}")

        dietary = data.get('dietary', '')
        max_calories = data.get('max_calories', 2000)
        min_protein = data.get('min_protein', 0)

        # Fetch recipes using /get_recipes logic
        with open(RECIPES_PATH, 'r') as f:
            recipes = json.load(f)

        conn = get_db_connection()
        df = pd.read_sql_query("SELECT * FROM ingredients", conn)
        conn.close()

        filtered_recipes = []
        for recipe in recipes:
            ingredients = recipe['ingredient_list']
            total_calories = 0
            total_protein = 0
            for ing in ingredients:
                ingredient = df[df['ingredient_name'] == ing['ingredient'].strip()]
                if not ingredient.empty:
                    total_calories += float(ingredient['Calories'].iloc[0]) * ing['quantity'] / 100
                    total_protein += float(ingredient['Proteins'].iloc[0]) * ing['quantity'] / 100
                else:
                    logger.warning(f"Ingredient {ing['ingredient']} not found")
            if (not dietary or recipe.get('dietary', '').lower() == dietary.lower()) and \
               total_calories <= max_calories / 4 and \
               total_protein >= min_protein:
                recipe_copy = recipe.copy()
                recipe_copy['total_calories'] = round(total_calories, 2)
                recipe_copy['total_protein'] = round(total_protein, 2)
                filtered_recipes.append(recipe_copy)

        import random
        meal_plan = random.sample(filtered_recipes, min(5, len(filtered_recipes)))

        total_nutrition = {
            'calories': sum(recipe.get('total_calories', 0) for recipe in meal_plan),
            'protein': sum(recipe.get('total_protein', 0) for recipe in meal_plan)
        }

        return jsonify({
            'meal_plan': meal_plan,
            'total_nutrition': total_nutrition
        })
    except Exception as e:
        logger.error(f"Error in generate_meal_plan: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route('/order_meal', methods=['POST'])
def order_meal():
    try:
        data = request.get_json()
        logger.debug(f"Received in /order_meal: {data}")

        required_fields = ['user_name', 'selected_day', 'meal_plan']
        for field in required_fields:
            if field not in data or data[field] is None or (field == 'user_name' and not data[field].strip()):
                return jsonify({"error": f"Missing or empty required field: {field}"}), 400

        order_id = str(uuid.uuid4())
        order_data = {
            'order_id': order_id,
            'user_name': data['user_name'].strip(),
            'selected_day': data['selected_day'],
            'meal_plan': data['meal_plan'],
            'timestamp': datetime.now().isoformat()
        }

        orders_path = os.path.join(BASE_DIR, '..', 'data', 'orders.json')  # Use consistent path
        orders = []
        if os.path.exists(orders_path):
            with open(orders_path, 'r') as f:
                try:
                    orders = json.load(f)
                    if not isinstance(orders, list):
                        orders = []
                except json.JSONDecodeError:
                    orders = []
        orders.append(order_data)
        with open(orders_path, 'w') as f:
            json.dump(orders, f, indent=2, ensure_ascii=False)  # Support Persian text

        return jsonify({'order_id': order_id, 'message': 'Order placed successfully'})
    except Exception as e:
        logger.error(f"Error in order_meal: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route('/get_ingredient_translations', methods=['GET'])
def get_ingredient_translations():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT ingredient_name, persian_name FROM ingredients")
        results = cursor.fetchall()
        translations = {row[0]: row[1] or 'N/A' for row in results}
        conn.close()
        logger.debug(f"Returning ingredient translations: {translations}")
        return jsonify(translations)
    except Exception as e:
        logger.error(f"Error in get_ingredient_translations: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)