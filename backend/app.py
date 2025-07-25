from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import sqlite3
import json

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

@app.route('/ingredients', methods=['GET'])
def get_ingredients():
    max_calories = request.args.get('max_calories', type=float)
    min_protein = request.args.get('min_protein', type=float)
    max_fat = request.args.get('max_fat', type=float)
    dietary = request.args.get('dietary', '')
    category = request.args.get('category', '')
    conn = sqlite3.connect('../data/ingredients.db')
    query = "SELECT * FROM ingredients"
    conditions = []
    if max_calories:
        conditions.append(f"calories <= {max_calories}")
    if min_protein:
        conditions.append(f"proteins >= {min_protein}")
    if max_fat:
        conditions.append(f"fats <= {max_fat}")
    if dietary:
        conditions.append(f"dietary = '{dietary}'")
    if category:
        conditions.append(f"category = '{category}'")
    if conditions:
        query += " WHERE " + " AND ".join(conditions)
    df = pd.read_sql(query, conn)
    conn.close()
    return jsonify(df.to_dict(orient='records'))

@app.route('/calculate', methods=['POST'])
def calculate_nutrition():
    try:
        data = request.json
        print("Received:", data)
        conn = sqlite3.connect('../data/ingredients.db')
        df = pd.read_sql("SELECT * FROM ingredients", conn)
        total_nutrition = {'Cost': 0}
        for name, qty in data.items():
            ingredient = df[df['ingredient_name'] == name]
            if not ingredient.empty:
                for nutrient in ingredient.columns[1:-4]:
                    value = ingredient[nutrient].iloc[0]
                    total_nutrition[nutrient] = total_nutrition.get(nutrient, 0) + float(value) * qty / 100
                price_per_unit = float(ingredient['Price/Unit'].iloc[0] or 0)
                total_nutrition['Cost'] += price_per_unit * qty
            else:
                return jsonify({"error": f"Ingredient {name} not found"}), 404
        conn.close()
        total_nutrition = {k: float(v) if isinstance(v, (int, float)) else v for k, v in total_nutrition.items()}
        return jsonify(total_nutrition)
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/recipes', methods=['POST'])
def suggest_recipes():
    try:
        data = request.json
        selected_ingredients = data.get('ingredients', [])
        dietary = data.get('dietary', '')
        complexity = data.get('complexity', '')
        print("Received ingredients:", selected_ingredients, "Dietary:", dietary, "Complexity:", complexity)
        recipes = pd.read_json('recipes.json')
        matches = []
        for _, recipe in recipes.iterrows():
            required = set(ing['ingredient'] for ing in recipe['ingredient_list'])
            if required.issubset(set(selected_ingredients)):
                if dietary and recipe['dietary'] != dietary:
                    continue
                if complexity and recipe['complexity'] != complexity:
                    continue
                matches.append({
                    'recipe_name': recipe['recipe_name'],
                    'ingredient_list': recipe['ingredient_list'],
                    'instructions': recipe['instructions'],
                    'prep_time': int(recipe['prep_time']),
                    'dietary': recipe['dietary'],
                    'complexity': recipe['complexity']
                })
        return jsonify(matches)
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/get_recipes', methods=['GET'])
def get_recipes():
    try:
        dietary = request.args.get('dietary', '')
        complexity = request.args.get('complexity', '')
        max_calories = request.args.get('max_calories', type=float)
        max_cost = request.args.get('max_cost', type=float)
        recipes = pd.read_json('recipes.json')
        conn = sqlite3.connect('../data/ingredients.db')
        df = pd.read_sql("SELECT * FROM ingredients", conn)
        matches = []
        for _, recipe in recipes.iterrows():
            if dietary and recipe['dietary'] != dietary:
                continue
            if complexity and recipe['complexity'] != complexity:
                continue
            ingredients = recipe['ingredient_list']
            total_calories = 0
            total_cost = 0
            for ing in ingredients:
                ingredient = df[df['ingredient_name'] == ing['ingredient'].strip()]
                if not ingredient.empty:
                    calorie_col = 'calories' if 'calories' in ingredient.columns else 'Calories'
                    if calorie_col not in ingredient.columns:
                        print(f"Warning: 'calories' column not found for {ing['ingredient']}")
                        continue
                    total_calories += float(ingredient[calorie_col].iloc[0]) * ing['quantity'] / 100
                    total_cost += float(ingredient['Price/Unit'].iloc[0] or 0) * ing['quantity']
                else:
                    print(f"Warning: Ingredient {ing['ingredient']} not found")
            if max_calories and total_calories > max_calories:
                continue
            if max_cost and total_cost > max_cost:
                continue
            matches.append({
                'recipe_name': recipe['recipe_name'],
                'ingredient_list': recipe['ingredient_list'],
                'instructions': recipe['instructions'],
                'prep_time': int(recipe['prep_time']),
                'dietary': recipe['dietary'],
                'complexity': recipe['complexity'],
                'total_calories': total_calories,
                'total_cost': total_cost
            })
        conn.close()
        return jsonify(matches)
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/recipe_nutrition', methods=['POST'])
def recipe_nutrition():
    try:
        data = request.json
        ingredient_list = data.get('ingredient_list', [])
        scale_factor = data.get('scale_factor', 1.0)
        print("Received recipe ingredients:", ingredient_list, "Scale factor:", scale_factor)
        conn = sqlite3.connect('../data/ingredients.db')
        df = pd.read_sql("SELECT * FROM ingredients", conn)
        total_nutrition = {'Cost': 0}
        for item in ingredient_list:
            ingredient = df[df['ingredient_name'] == item['ingredient'].strip()]
            if not ingredient.empty:
                qty = float(item.get('quantity', 100)) * float(scale_factor)
                for nutrient in ingredient.columns[1:-4]:
                    value = ingredient[nutrient].iloc[0]
                    total_nutrition[nutrient] = total_nutrition.get(nutrient, 0) + float(value) * qty / 100
                price_per_unit = float(ingredient['Price/Unit'].iloc[0] or 0)
                total_nutrition['Cost'] += price_per_unit * qty
            else:
                return jsonify({"error": f"Ingredient {item['ingredient']} not found"}), 404
        conn.close()
        total_nutrition = {k: float(v) if isinstance(v, (int, float)) else v for k, v in total_nutrition.items()}
        return jsonify(total_nutrition)
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/update_price', methods=['POST'])
def update_price():
    try:
        data = request.json
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
        conn = sqlite3.connect('../data/ingredients.db')
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
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/add_recipe', methods=['POST'])
def add_recipe():
    try:
        data = request.json
        recipe_name = data.get('recipe_name')
        ingredient_list = data.get('ingredient_list', [])
        instructions = data.get('instructions', '')
        prep_time = data.get('prep_time')
        dietary = data.get('dietary', '')
        complexity = data.get('complexity', '')
        if not recipe_name or not ingredient_list:
            return jsonify({"error": "Recipe name and ingredients are required"}), 400
        try:
            prep_time = int(prep_time)
        except (ValueError, TypeError):
            return jsonify({"error": "Prep time must be a number"}), 400
        recipes = pd.read_json('recipes.json') if pd.io.json.read_json('recipes.json').shape[0] > 0 else pd.DataFrame(columns=['recipe_name', 'ingredient_list', 'instructions', 'prep_time', 'dietary', 'complexity'])
        new_recipe = pd.DataFrame([{
            'recipe_name': recipe_name,
            'ingredient_list': ingredient_list,
            'instructions': instructions,
            'prep_time': prep_time,
            'dietary': dietary,
            'complexity': complexity
        }])
        recipes = pd.concat([recipes, new_recipe], ignore_index=True)
        recipes.to_json('recipes.json', orient='records', indent=2)
        return jsonify({"message": f"Added recipe {recipe_name}"})
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/delete_recipe', methods=['POST'])
def delete_recipe():
    try:
        data = request.json
        recipe_name = data.get('recipe_name')
        if not recipe_name:
            return jsonify({"error": "Recipe name is required"}), 400
        recipes = pd.read_json('recipes.json')
        if recipe_name not in recipes['recipe_name'].values:
            return jsonify({"error": f"Recipe {recipe_name} not found"}), 404
        recipes = recipes[recipes['recipe_name'] != recipe_name]
        recipes.to_json('recipes.json', orient='records', indent=2)
        return jsonify({"message": f"Deleted recipe {recipe_name}"})
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/update_recipe', methods=['POST'])
def update_recipe():
    try:
        data = request.json
        recipe_name = data.get('recipe_name')
        ingredient_list = data.get('ingredient_list', [])
        instructions = data.get('instructions', '')
        prep_time = data.get('prep_time')
        dietary = data.get('dietary', '')
        complexity = data.get('complexity', '')
        if not recipe_name or not ingredient_list:
            return jsonify({"error": "Recipe name and ingredients are required"}), 400
        try:
            prep_time = int(prep_time)
        except (ValueError, TypeError):
            return jsonify({"error": "Prep time must be a number"}), 400
        # Validate ingredients exist in database
        conn = sqlite3.connect('../data/ingredients.db')
        df = pd.read_sql("SELECT ingredient_name FROM ingredients", conn)
        conn.close()
        for ing in ingredient_list:
            if ing['ingredient'] not in df['ingredient_name'].values:
                return jsonify({"error": f"Ingredient {ing['ingredient']} not found"}), 404
        # Load existing recipes
        recipes = pd.read_json('recipes.json') if pd.io.json.read_json('recipes.json').shape[0] > 0 else pd.DataFrame(columns=['recipe_name', 'ingredient_list', 'instructions', 'prep_time', 'dietary', 'complexity'])
        if recipe_name not in recipes['recipe_name'].values:
            return jsonify({"error": f"Recipe {recipe_name} not found"}), 404
        # Update recipe
        recipes = recipes[recipes['recipe_name'] != recipe_name]
        updated_recipe = pd.DataFrame([{
            'recipe_name': recipe_name,
            'ingredient_list': ingredient_list,
            'instructions': instructions,
            'prep_time': prep_time,
            'dietary': dietary,
            'complexity': complexity
        }])
        recipes = pd.concat([recipes, updated_recipe], ignore_index=True)
        recipes.to_json('recipes.json', orient='records', indent=2)
        return jsonify({"message": f"Updated recipe {recipe_name}"})
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)