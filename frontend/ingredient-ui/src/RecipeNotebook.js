import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function RecipeNotebook({ setErrorMessage }) {
  const { t, i18n } = useTranslation();
  const [ingredients, setIngredients] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);
  const [recipeMaxCalories, setRecipeMaxCalories] = useState('');
  const [recipeMaxCost, setRecipeMaxCost] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState('');
  const [complexityFilter, setComplexityFilter] = useState('');
  const [formData, setFormData] = useState({
    recipeName: '',
    ingredients: [],
    instructions: '',
    prepTime: '',
    dietary: '',
    complexity: '',
    servings: 1,
  });
  const [recipeMessage, setRecipeMessage] = useState('');
  const [recipeNutrition, setRecipeNutrition] = useState({});
  const [ingredientQuantities, setIngredientQuantities] = useState({});
  const [editRecipe, setEditRecipe] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [scaleFactor, setScaleFactor] = useState(1.0);
  const [searchQuery, setSearchQuery] = useState('');
  const [currency, setCurrency] = useState('Toman');
  const [isLoading, setIsLoading] = useState(false);
  const [openNotes, setOpenNotes] = useState({
    purpose: false,
    nutrition: false,
    usage: false,
  });
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);

  const BASE_URL = 'https://maniac.pythonanywhere.com';

  const styles = {
    container: { backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', minHeight: '100vh' },
    button: { marginRight: '10px', padding: '12px 24px', fontSize: '1.1rem', backgroundColor: '#295241', color: '#fff', border: 'none', borderRadius: '6px', transition: 'background-color 0.2s ease' },
    buttonRemove: { marginRight: '10px', padding: '12px 24px', fontSize: '1.1rem', backgroundColor: '#bb0d14', color: '#fff', border: 'none', borderRadius: '6px', transition: 'background-color 0.2s ease' },
    input: { fontSize: '1rem', padding: '14px', minHeight: '48px', borderColor: '#295241' },
    select: { fontSize: '1rem', padding: '10px', borderColor: '#295241' },
    modal: { maxWidth: '90vw', margin: 'auto' },
    currencySelect: { fontSize: '1rem', padding: '10px', width: '120px', borderColor: '#295241' },
    heading: { color: '#295241', fontSize: '1.8rem' },
    subheading: { color: '#295241', fontSize: '1.3rem' },
    label: { color: '#295241', fontWeight: '500' },
    icon: { color: '#295241', marginRight: '5px' },
    iconRemove: { color: '#bb0d14', marginRight: '5px' },
    accordionButton: {
      backgroundColor: '#fff',
      color: '#295241',
      fontWeight: '500',
      fontSize: '1rem',
      padding: '10px 15px',
    },
    accordionButtonCollapsed: {
      backgroundColor: '#f8f9fa',
      color: '#295241',
    },
    noteCard: {
      backgroundColor: '#fff',
      border: '1px solid #295241',
      borderRadius: '4px',
      padding: '10px',
    },
  };

  const toggleNote = (note) => {
    setOpenNotes((prev) => ({
      ...prev,
      [note]: !prev[note],
    }));
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text || text.length <= maxLength) return text || '';
    return text.substring(0, maxLength) + '...';
  };

  const handleShowInstructions = (recipe) => {
    setSelectedRecipe(recipe);
    setShowInstructionsModal(true);
  };

  const handleCloseInstructionsModal = () => {
    setShowInstructionsModal(false);
    setSelectedRecipe(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${BASE_URL}/ingredients`)
      .then((res) => {
        setIngredients(res.data);
        setErrorMessage('');
      })
      .catch((err) => {
        console.error('Error fetching ingredients:', err);
        setErrorMessage(err.response?.data?.error || t('cookbook.error.fetchIngredients'));
      })
      .finally(() => setIsLoading(false));
  }, [setErrorMessage, t]);

  useEffect(() => {
    if (ingredients.length === 0) return;
    setIsLoading(true);
    let url = `${BASE_URL}/get_recipes`;
    const params = [];
    if (recipeMaxCalories) params.push(`max_calories=${recipeMaxCalories}`);
    if (recipeMaxCost) params.push(`max_cost=${recipeMaxCost}`);
    if (dietaryFilter) params.push(`dietary=${dietaryFilter}`);
    if (complexityFilter) params.push(`complexity=${complexityFilter}`);
    if (currency) params.push(`currency=${currency}`);
    if (params.length) url += `?${params.join('&')}`;
    axios
      .get(url)
      .then((res) => {
        setAllRecipes(res.data);
        setErrorMessage('');
      })
      .catch((err) => {
        console.error('Error fetching recipes:', err);
        setErrorMessage(err.response?.data?.error || t('cookbook.error.fetchRecipes'));
      })
      .finally(() => setIsLoading(false));
  }, [recipeMaxCalories, recipeMaxCost, dietaryFilter, complexityFilter, currency, ingredients, setErrorMessage, t]);

  const handleAddRecipe = () => {
    if (!formData.recipeName || !formData.ingredients.length || !formData.prepTime) {
      setRecipeMessage(t('cookbook.error.addRecipeFields'));
      return;
    }
    setIsLoading(true);
    const ingredientList = formData.ingredients.map((opt) => ({
      ingredient: opt.value,
      quantity: parseFloat(ingredientQuantities[opt.value]) || 100,
    }));
    axios
      .post(`${BASE_URL}/add_recipe`, {
        recipe_name: formData.recipeName,
        ingredient_list: ingredientList,
        instructions: formData.instructions,
        prep_time: parseInt(formData.prepTime),
        dietary: formData.dietary,
        complexity: formData.complexity,
        servings: parseInt(formData.servings) || 1,
        currency,
      })
      .then((res) => {
        setRecipeMessage(res.data.message);
        axios
          .get(`${BASE_URL}/get_recipes?currency=${currency}`)
          .then((res) => setAllRecipes(res.data))
          .catch((err) => setErrorMessage(err.response?.data?.error || t('cookbook.error.fetchRecipes')));
        setFormData({
          recipeName: '',
          ingredients: [],
          instructions: '',
          prepTime: '',
          dietary: '',
          complexity: '',
          servings: 1,
        });
        setIngredientQuantities({});
      })
      .catch((err) => {
        console.error('Error adding recipe:', err);
        setRecipeMessage(err.response?.data?.error || t('cookbook.error.addRecipe'));
      })
      .finally(() => setIsLoading(false));
  };

  const handleCalculateRecipeNutrition = (ingredient_list, recipe_name) => {
    if (!ingredient_list || !Array.isArray(ingredient_list)) {
      setErrorMessage(t('cookbook.error.invalidIngredientList'));
      return;
    }
    setIsLoading(true);
    axios
      .post(`${BASE_URL}/recipe_nutrition`, {
        ingredient_list,
        scale_factor: parseFloat(scaleFactor) || 1.0,
        currency,
      })
      .then((res) => {
        setRecipeNutrition((prev) => ({ ...prev, [recipe_name]: res.data }));
      })
      .catch((err) => {
        console.error('Error calculating recipe nutrition:', err);
        setErrorMessage(err.response?.data?.error || t('cookbook.error.calculateNutrition'));
      })
      .finally(() => setIsLoading(false));
  };

  const handleDeleteRecipe = (recipe_name) => {
    if (!window.confirm(t('cookbook.confirmDelete', { recipe_name }))) return;
    setIsLoading(true);
    axios
      .post(`${BASE_URL}/delete_recipe`, { recipe_name })
      .then((res) => {
        setRecipeMessage(res.data.message);
        axios
          .get(`${BASE_URL}/get_recipes?currency=${currency}`)
          .then((res) => {
            setAllRecipes(res.data);
            setRecipeNutrition((prev) => {
              const updated = { ...prev };
              delete updated[recipe_name];
              return updated;
            });
          })
          .catch((err) => {
            console.error('Error fetching recipes:', err);
            setErrorMessage(err.response?.data?.error || t('cookbook.error.fetchRecipesAfterDelete'));
          });
      })
      .catch((err) => {
        console.error('Error deleting recipe:', err);
        setRecipeMessage(err.response?.data?.error || t('cookbook.error.deleteRecipe'));
      })
      .finally(() => setIsLoading(false));
  };

  const handleEditRecipe = (recipe) => {
    setEditRecipe({
      recipe_name: recipe.recipe_name,
      ingredient_list: recipe.ingredient_list,
      instructions: recipe.instructions,
      prep_time: recipe.prep_time,
      dietary: recipe.dietary,
      complexity: recipe.complexity,
      servings: recipe.servings || 1,
    });
    setFormData({
      recipeName: recipe.recipe_name,
      ingredients: recipe.ingredient_list.map((ing) => ({
        value: ing.ingredient,
        label: `${ing.ingredient.replace(/\./g, ' ')} (${ingredients.find((i) => i.ingredient_name === ing.ingredient)?.persian_name || ''})`,
      })),
      instructions: recipe.instructions,
      prepTime: recipe.prep_time,
      dietary: recipe.dietary,
      complexity: recipe.complexity,
      servings: recipe.servings || 1,
    });
    setIngredientQuantities(
      recipe.ingredient_list.reduce((acc, ing) => ({
        ...acc,
        [ing.ingredient]: ing.quantity,
      }), {})
    );
    setEditModalOpen(true);
  };

  const handleUpdateRecipe = () => {
    if (!formData.recipeName || !formData.ingredients.length || !formData.prepTime) {
      setRecipeMessage(t('cookbook.error.updateRecipeFields'));
      return;
    }
    setIsLoading(true);
    const ingredientList = formData.ingredients.map((opt) => ({
      ingredient: opt.value,
      quantity: parseFloat(ingredientQuantities[opt.value]) || 100,
    }));
    axios
      .post(`${BASE_URL}/update_recipe`, {
        recipe_name: formData.recipeName,
        ingredient_list: ingredientList,
        instructions: formData.instructions,
        prep_time: parseInt(formData.prepTime),
        dietary: formData.dietary,
        complexity: formData.complexity,
        servings: parseInt(formData.servings) || 1,
        currency,
      })
      .then((res) => {
        setRecipeMessage(res.data.message);
        axios
          .get(`${BASE_URL}/get_recipes?currency=${currency}`)
          .then((res) => {
            setAllRecipes(res.data);
            setEditModalOpen(false);
            setFormData({
              recipeName: '',
              ingredients: [],
              instructions: '',
              prepTime: '',
              dietary: '',
              complexity: '',
              servings: 1,
            });
            setIngredientQuantities({});
            setEditRecipe(null);
          })
          .catch((err) => {
            console.error('Error fetching recipes:', err);
            setErrorMessage(err.response?.data?.error || t('cookbook.error.fetchRecipesAfterUpdate'));
          });
      })
      .catch((err) => {
        console.error('Error updating recipe:', err);
        setRecipeMessage(err.response?.data?.error || t('cookbook.error.updateRecipe'));
      })
      .finally(() => setIsLoading(false));
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
    setFormData({
      recipeName: '',
      ingredients: [],
      instructions: '',
      prepTime: '',
      dietary: '',
      complexity: '',
      servings: 1,
    });
    setIngredientQuantities({});
    setEditRecipe(null);
    setRecipeMessage('');
  };

  const handleExportRecipeNutrition = async (recipeName) => {
    if (!recipeNutrition[recipeName]) return;

    const ingredientList = allRecipes.find((r) => r.recipe_name === recipeName)?.ingredient_list || [];

    try {
      setIsLoading(true);
      const response = await axios.post(`${BASE_URL}/export_nutrition_image`, {
        ingredient_list: ingredientList,
        scale_factor: parseFloat(scaleFactor) || 1.0,
        currency,
        title: `Nutrition Facts: ${recipeName}`,
      });
      const { image } = response.data;
      const link = document.createElement('a');
      link.href = image;
      link.download = `${recipeName}_nutrition_label.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setErrorMessage('');
    } catch (err) {
      console.error('Error exporting nutrition image:', err);
      setErrorMessage(err.response?.data?.error || t('cookbook.error.exportImage'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportRecipePDF = async (recipe) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${BASE_URL}/export_recipe_pdf`, {
        recipe_name: recipe.recipe_name,
        ingredient_list: recipe.ingredient_list,
        instructions: recipe.instructions,
        prep_time: recipe.prep_time,
        dietary: recipe.dietary,
        complexity: recipe.complexity,
        total_calories: recipe.total_calories,
        total_cost: recipe.total_cost,
        servings: recipe.servings || 1,
        currency,
      });
      const { pdf } = response.data;
      const link = document.createElement('a');
      link.href = pdf;
      link.download = `${recipe.recipe_name}_recipe.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setErrorMessage('');
    } catch (err) {
      console.error('Error exporting recipe PDF:', err);
      setErrorMessage(err.response?.data?.error || t('cookbook.error.exportPDF'));
    } finally {
      setIsLoading(false);
    }
  };

  const ingredientOptions = ingredients.map((ing) => ({
    value: ing.ingredient_name,
    label: `${ing.ingredient_name.replace(/\./g, ' ')} (${ing.persian_name || ''})`,
  }));

  const filteredRecipes = allRecipes.filter(
    (recipe) =>
      recipe.recipe_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.ingredient_list.some(
        (ing) =>
          ing.ingredient.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ingredients.find((i) => i.ingredient_name === ing.ingredient)?.persian_name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="container mt-4" style={styles.container} dir={i18n.language === 'fa' ? 'rtl' : 'ltr'}>
      <h1 className="mb-4 text-center" style={styles.heading}>
        <i className="bi bi-book" style={styles.icon}></i> {t('cookbook.title')}
      </h1>
      <div className="mb-4">
        <h3 style={styles.subheading}>{t('cookbook.notes.title', { defaultValue: 'How to Use the Cookbook' })}</h3>
        <div className="accordion" id="cookbookNotesAccordion">
          <div className="accordion-item">
            <h2 className="accordion-header" id="cookbookNotePurpose">
              <button
                className="accordion-button"
                type="button"
                onClick={() => toggleNote('purpose')}
                aria-expanded={openNotes.purpose}
                aria-controls="collapseCookbookPurpose"
                style={{
                  ...styles.accordionButton,
                  ...(openNotes.purpose ? {} : styles.accordionButtonCollapsed),
                }}
              >
                <i className="fas fa-info-circle" style={styles.icon}></i>
                {t('cookbook.notes.purposeTitle', { defaultValue: 'Why Use the Cookbook?' })}
              </button>
            </h2>
            <div
              id="collapseCookbookPurpose"
              className={`accordion-collapse collapse ${openNotes.purpose ? 'show' : ''}`}
              aria-labelledby="cookbookNotePurpose"
            >
              <div className="accordion-body" style={styles.noteCard}>
                <p>
                  {t('cookbook.notes.purpose', {
                    defaultValue:
                      'The Cookbook allows you to create, manage, and analyze recipes tailored to your dietary preferences and budget. It’s ideal for saving favorite recipes, planning meals, and ensuring nutritional balance.',
                  })}
                </p>
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header" id="cookbookNoteNutrition">
              <button
                className="accordion-button"
                type="button"
                onClick={() => toggleNote('nutrition')}
                aria-expanded={openNotes.nutrition}
                aria-controls="collapseCookbookNutrition"
                style={{
                  ...styles.accordionButton,
                  ...(openNotes.nutrition ? {} : styles.accordionButtonCollapsed),
                }}
              >
                <i className="fas fa-heart" style={styles.icon}></i>
                {t('cookbook.notes.nutritionTitle', { defaultValue: 'Understanding Recipe Nutrition' })}
              </button>
            </h2>
            <div
              id="collapseCookbookNutrition"
              className={`accordion-collapse collapse ${openNotes.nutrition ? 'show' : ''}`}
              aria-labelledby="cookbookNoteNutrition"
            >
              <div className="accordion-body" style={styles.noteCard}>
                <p>
                  {t('cookbook.notes.nutritionInfo', {
                    defaultValue:
                      'Recipes provide a snapshot of nutritional content based on their ingredients. Monitor calories, macronutrients (carbs, proteins, fats), and micronutrients (vitamins, minerals) to meet your health goals. Use the scale factor to adjust portion sizes and update nutrition and cost accordingly.',
                  })}
                </p>
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header" id="cookbookNoteUsage">
              <button
                className="accordion-button"
                type="button"
                onClick={() => toggleNote('usage')}
                aria-expanded={openNotes.usage}
                aria-controls="collapseCookbookUsage"
                style={{
                  ...styles.accordionButton,
                  ...(openNotes.usage ? {} : styles.accordionButtonCollapsed),
                }}
              >
                <i className="fas fa-utensils" style={styles.icon}></i>
                {t('cookbook.notes.usageTitle', { defaultValue: 'How to Get Started' })}
              </button>
            </h2>
            <div
              id="collapseCookbookUsage"
              className={`accordion-collapse collapse ${openNotes.usage ? 'show' : ''}`}
              aria-labelledby="cookbookNoteUsage"
            >
              <div className="accordion-body" style={styles.noteCard}>
                <p>
                  {t('cookbook.notes.usage', {
                    defaultValue:
                      'Add a new recipe by entering its name, ingredients, instructions, and details like prep time and dietary preferences. Use the table to view, edit, or delete recipes. Calculate nutrition for any recipe, apply a scale factor for portion control, and export results to save or share.',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isLoading && (
        <div className="text-center mb-3">
          <div className="spinner-border text-success" role="status" style={styles.icon}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      <div className="mb-3">
        <label className="form-label me-2" style={styles.label}>
          <i className="bi bi-currency-exchange" style={styles.icon}></i> {t('cookbook.currency')}:
        </label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          style={styles.currencySelect}
          className="form-select d-inline-block"
        >
          <option value="Toman">{t('cookbook.currencyOptions.toman')}</option>
          <option value="IRR">{t('cookbook.currencyOptions.irr')}</option>
        </select>
      </div>
      <div className="row mb-3 g-2">
        <div className="col-12 col-md-3">
          <label className="form-label" style={styles.label}>
            <i className="bi bi-fire" style={styles.icon}></i> {t('cookbook.maxCalories')}:
          </label>
          <input
            type="number"
            min="0"
            className="form-control"
            placeholder={t('cookbook.maxCalories')}
            value={recipeMaxCalories}
            onChange={(e) => setRecipeMaxCalories(e.target.value)}
            style={styles.input}
          />
        </div>
        <div className="col-12 col-md-3">
          <label className="form-label" style={styles.label}>
            <i className="bi bi-wallet" style={styles.icon}></i> {t('cookbook.maxCost')}:
          </label>
          <input
            type="number"
            min="0"
            className="form-control"
            placeholder={`(${currency})`}
            value={recipeMaxCost}
            onChange={(e) => setRecipeMaxCost(e.target.value)}
            style={styles.input}
          />
        </div>
        <div className="col-12 col-md-3">
          <label className="form-label" style={styles.label}>
            <i className="bi bi-egg" style={styles.icon}></i> {t('cookbook.dietary')}:
          </label>
          <select
            className="form-select"
            value={dietaryFilter}
            onChange={(e) => setDietaryFilter(e.target.value)}
            style={styles.select}
          >
            <option value="">{t('cookbook.dietaryOptions.all')}</option>
            <option value="omnivore">{t('cookbook.dietaryOptions.omnivore')}</option>
            <option value="vegetarian">{t('cookbook.dietaryOptions.vegetarian')}</option>
            <option value="vegan">{t('cookbook.dietaryOptions.vegan')}</option>
            <option value="gluten-free">{t('cookbook.dietaryOptions.gluten_free')}</option>
          </select>
        </div>
        <div className="col-12 col-md-3">
          <label className="form-label" style={styles.label}>
            <i className="bi bi-gear" style={styles.icon}></i> {t('cookbook.complexity')}:
          </label>
          <select
            className="form-select"
            value={complexityFilter}
            onChange={(e) => setComplexityFilter(e.target.value)}
            style={styles.select}
          >
            <option value="">{t('cookbook.complexityOptions.all')}</option>
            <option value="easy">{t('cookbook.complexityOptions.easy')}</option>
            <option value="medium">{t('cookbook.complexityOptions.medium')}</option>
            <option value="hard">{t('cookbook.complexityOptions.hard')}</option>
          </select>
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label" style={styles.label}>
          <i className="bi bi-search" style={styles.icon}></i> {t('cookbook.search')}:
        </label>
        <input
          type="text"
          className="form-control"
          placeholder={t('cookbook.search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.input}
        />
      </div>
      <div className="row mb-3 g-2">
        <div className="col-12">
          <h3 className="mb-2" style={styles.subheading}>
            <i className="bi bi-plus-circle" style={styles.icon}></i> {t('cookbook.addRecipe')}
          </h3>
          <div className="input-group mb-2">
            <input
              type="text"
              className="form-control"
              placeholder={t('cookbook.recipeName')}
              name="recipeName"
              value={formData.recipeName}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div className="mb-2">
            <label className="form-label" style={styles.label}>
              <i className="bi bi-list-ul" style={styles.icon}></i> {t('cookbook.selectIngredients')}:
            </label>
            <Select
              isMulti
              options={ingredientOptions}
              value={formData.ingredients}
              onChange={(selected) => setFormData((prev) => ({ ...prev, ingredients: selected }))}
              placeholder={t('cookbook.selectIngredients')}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </div>
          {formData.ingredients.map((ing) => (
            <div key={ing.value} className="input-group mb-2">
              <label className="form-label" style={styles.label}>
                <i className="bi bi-egg-fried" style={styles.icon}></i> {ing.label} {t('cookbook.quantity')}:
              </label>
              <input
                type="number"
                min="0"
                className="form-control"
                placeholder={t('cookbook.quantity')}
                value={ingredientQuantities[ing.value] || ''}
                onChange={(e) =>
                  setIngredientQuantities({
                    ...ingredientQuantities,
                    [ing.value]: e.target.value,
                  })
                }
                style={styles.input}
              />
            </div>
          ))}
          <div className="input-group mb-2">
            <textarea
              className="form-control"
              placeholder={t('cookbook.instructions')}
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div className="input-group mb-2">
            <input
              type="number"
              min="0"
              className="form-control"
              placeholder={t('cookbook.prepTime')}
              name="prepTime"
              value={formData.prepTime}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div className="input-group mb-2">
            <input
              type="number"
              name="servings"
              value={formData.servings || 1}
              onChange={handleChange}
              placeholder={t('cookbook.servings') || 'Number of Servings'}
              min="1"
              className="form-control"
              style={styles.input}
            />
          </div>
          <div className="input-group mb-2">
            <select
              className="form-select"
              name="dietary"
              value={formData.dietary}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="">{t('cookbook.dietaryOptions.select')}</option>
              <option value="omnivore">{t('cookbook.dietaryOptions.omnivore')}</option>
              <option value="vegetarian">{t('cookbook.dietaryOptions.vegetarian')}</option>
              <option value="vegan">{t('cookbook.dietaryOptions.vegan')}</option>
              <option value="gluten-free">{t('cookbook.dietaryOptions.gluten_free')}</option>
            </select>
            <select
              className="form-select"
              name="complexity"
              value={formData.complexity}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="">{t('cookbook.complexityOptions.select')}</option>
              <option value="easy">{t('cookbook.complexityOptions.easy')}</option>
              <option value="medium">{t('cookbook.complexityOptions.medium')}</option>
              <option value="hard">{t('cookbook.complexityOptions.hard')}</option>
            </select>
          </div>
          <button className="btn" onClick={handleAddRecipe} style={styles.button} disabled={isLoading}>
            <i className="bi bi-plus-circle" style={styles.icon}></i>
            {isLoading ? t('cookbook.adding') : t('cookbook.addButton')}
          </button>
          {recipeMessage && !editModalOpen && (
            <div className={`alert ${recipeMessage.includes('Error') ? 'alert-danger' : 'alert-success'} mt-2`}>
              {recipeMessage}
            </div>
          )}
        </div>
      </div>
      <h3 className="mb-2" style={styles.subheading}>
        <i className="bi bi-journal-text" style={styles.icon}></i> {t('cookbook.allRecipes')}
      </h3>
      <div className="table-responsive">
        <table className="table table-hover table-bordered align-middle">
          <thead style={{ backgroundColor: '#295241', color: '#fff' }}>
            <tr>
              <th scope="col">{t('cookbook.table.name')}</th>
              <th scope="col">{t('cookbook.table.ingredients')}</th>
              <th scope="col">{t('cookbook.table.instructions')}</th>
              <th scope="col">{t('cookbook.table.prepTime')}</th>
              <th scope="col">{t('cookbook.table.dietary')}</th>
              <th scope="col">{t('cookbook.table.complexity')}</th>
              <th scope="col">{t('cookbook.table.calories')}</th>
              <th scope="col">{t('cookbook.table.cost')}</th>
              <th scope="col">{t('cookbook.table.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecipes.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center">
                  {t('cookbook.table.noRecipes')}
                </td>
              </tr>
            ) : (
              filteredRecipes.map((recipe) => (
                <tr key={recipe.recipe_name}>
                  <td>{recipe.recipe_name}</td>
                  <td>
                    {recipe.ingredient_list
                      .map((ing) => {
                        const ingredientData = ingredients.find((i) => i.ingredient_name === ing.ingredient);
                        const persianName = ingredientData?.persian_name || 'N/A';
                        return `${ing.ingredient} (${persianName}) (${ing.quantity}g)`;
                      })
                      .join(', ')}
                  </td>
                  <td>
                    {truncateText(recipe.instructions)}
                    <button
                      className="btn btn-link p-0 ms-2"
                      onClick={() => handleShowInstructions(recipe)}
                      title={t('cookbook.table.viewInstructions')}
                      disabled={isLoading}
                    >
                      <i className="fas fa-eye" style={styles.icon}></i>
                    </button>
                  </td>
                  <td>{recipe.prep_time}</td>
                  <td>{recipe.dietary}</td>
                  <td>{recipe.complexity}</td>
                  <td>{recipe.total_calories}</td>
                  <td>{recipe.total_cost}</td>
                  <td>
                    <div className="d-flex flex-column flex-sm-row gap-2 align-items-sm-center">
                      <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        className="form-control"
                        placeholder={t('cookbook.scale')}
                        value={scaleFactor}
                        onChange={(e) => setScaleFactor(e.target.value)}
                        style={{ ...styles.input, width: '100px' }}
                      />
                      <button
                        className="btn"
                        onClick={() => handleCalculateRecipeNutrition(recipe.ingredient_list, recipe.recipe_name)}
                        style={styles.button}
                        disabled={isLoading}
                      >
                        <i className="bi bi-calculator" style={styles.icon}></i>
                        {isLoading ? t('cookbook.calculating') : t('cookbook.calculate')}
                      </button>
                      <button
                        className="btn"
                        onClick={() => handleEditRecipe(recipe)}
                        style={styles.button}
                        disabled={isLoading}
                      >
                        <i className="bi bi-pencil" style={styles.icon}></i>
                        {t('cookbook.edit')}
                      </button>
                      <button
                        className="btn"
                        onClick={() => handleDeleteRecipe(recipe.recipe_name)}
                        style={styles.buttonRemove}
                        disabled={isLoading}
                      >
                        <i className="bi bi-trash" style={styles.iconRemove}></i>
                        {t('cookbook.delete')}
                      </button>
                      <button
                        className="btn"
                        onClick={() => handleExportRecipeNutrition(recipe.recipe_name)}
                        style={styles.button}
                        disabled={!recipeNutrition[recipe.recipe_name] || isLoading}
                      >
                        <i className="bi bi-download" style={styles.icon}></i>
                        {t('cookbook.export')}
                      </button>
                      <button
                        className="btn"
                        onClick={() => handleExportRecipePDF(recipe)}
                        style={styles.button}
                        disabled={isLoading}
                      >
                        <i className="bi bi-file-earmark-pdf" style={styles.icon}></i>
                        {t('cookbook.downloadPDF')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Instructions Modal */}
      {selectedRecipe && (
        <div
          className={`modal fade ${showInstructionsModal ? 'show d-block' : ''}`}
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', display: showInstructionsModal ? 'block' : 'none' }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg" style={styles.modal}>
            <div className="modal-content">
              <div className="modal-header" style={{ backgroundColor: '#295241', color: '#fff' }}>
                <h5 className="modal-title">
                  <i className="bi bi-list-check" style={styles.icon}></i> {t('cookbook.table.instructions')} -{' '}
                  {selectedRecipe.recipe_name}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseInstructionsModal}
                  aria-label={t('cookbook.table.close')}
                ></button>
              </div>
              <div className="modal-body">
                <p style={{ whiteSpace: 'pre-wrap' }}>{selectedRecipe.instructions}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn" onClick={handleCloseInstructionsModal} style={styles.buttonRemove}>
                  <i className="bi bi-x-circle" style={styles.iconRemove}></i> {t('cookbook.table.close')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {Object.keys(recipeNutrition).map((recipeName) =>
        recipeNutrition[recipeName] ? (
          <div key={recipeName} className="mt-3">
            <h4 style={styles.subheading}>
              <i className="bi bi-bar-chart" style={styles.icon}></i>
              {recipeName} {t('cookbook.nutrition')} (Scale: {scaleFactor}x)
            </h4>
            {recipeNutrition[recipeName].Cost && (
              <div className="alert alert-success mb-2">
                <strong>{t('cookbook.totalCost')}:</strong> {recipeNutrition[recipeName].Cost.value}{' '}
                {recipeNutrition[recipeName].Cost.unit}
              </div>
            )}
            <div className="row">
              {Object.entries(recipeNutrition[recipeName])
                .filter(([nutrient]) => nutrient !== 'Cost')
                .map(([nutrient, data]) => (
                  <div key={nutrient} className="col-12 col-md-4 mb-2">
                    <div className="card">
                      <div className="card-body">
                        <strong>{nutrient}:</strong> {data.value} {data.unit}
                        {data.percent_dv !== null && ` (${data.percent_dv}% DV)`}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : null
      )}
      <div className={`modal fade ${editModalOpen ? 'show d-block' : ''}`} tabIndex="-1" style={{ display: editModalOpen ? 'block' : 'none' }}>
        <div className="modal-dialog" style={styles.modal}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" style={styles.heading}>
                <i className="bi bi-pencil-square" style={styles.icon}></i> {t('cookbook.editModal.title')}:{' '}
                {editRecipe?.recipe_name}
              </h5>
              <button type="button" className="btn-close" onClick={handleCloseModal}></button>
            </div>
            <div className="modal-body">
              <div className="mb-2">
                <label className="form-label" style={styles.label}>
                  <i className="bi bi-type" style={styles.icon}></i> {t('cookbook.recipeName')}:
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="recipeName"
                  value={formData.recipeName}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              <div className="mb-2">
                <label className="form-label" style={styles.label}>
                  <i className="bi bi-list-ul" style={styles.icon}></i> {t('cookbook.selectIngredients')}:
                </label>
                <Select
                  isMulti
                  options={ingredientOptions}
                  value={formData.ingredients}
                  onChange={(selected) => setFormData((prev) => ({ ...prev, ingredients: selected }))}
                  placeholder={t('cookbook.selectIngredients')}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              </div>
              {formData.ingredients.map((ing) => (
                <div key={ing.value} className="input-group mb-2">
                  <label className="form-label" style={styles.label}>
                    <i className="bi bi-egg-fried" style={styles.icon}></i> {ing.label} {t('cookbook.quantity')}:
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    placeholder={t('cookbook.quantity')}
                    value={ingredientQuantities[ing.value] || ''}
                    onChange={(e) =>
                      setIngredientQuantities({
                        ...ingredientQuantities,
                        [ing.value]: e.target.value,
                      })
                    }
                    style={styles.input}
                  />
                </div>
              ))}
              <div className="mb-2">
                <label className="form-label" style={styles.label}>
                  <i className="bi bi-list-check" style={styles.icon}></i> {t('cookbook.instructions')}:
                </label>
                <textarea
                  className="form-control"
                  placeholder={t('cookbook.instructions')}
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              <div className="mb-2">
                <label className="form-label" style={styles.label}>
                  <i className="bi bi-clock" style={styles.icon}></i> {t('cookbook.prepTime')}:
                </label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder={t('cookbook.prepTime')}
                  name="prepTime"
                  value={formData.prepTime}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              <div className="mb-2">
                <label className="form-label" style={styles.label}>
                  <i className="bi bi-egg" style={styles.icon}></i> {t('cookbook.servings')}:
                </label>
                <input
                  type="number"
                  name="servings"
                  value={formData.servings || 1}
                  onChange={handleChange}
                  placeholder={t('cookbook.servings') || 'Number of Servings'}
                  min="1"
                  className="form-control"
                  style={styles.input}
                />
              </div>
              <div className="mb-2">
                <label className="form-label" style={styles.label}>
                  <i className="bi bi-egg" style={styles.icon}></i> {t('cookbook.dietary')}:
                </label>
                <select
                  className="form-select"
                  name="dietary"
                  value={formData.dietary}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="">{t('cookbook.dietaryOptions.select')}</option>
                  <option value="omnivore">{t('cookbook.dietaryOptions.omnivore')}</option>
                  <option value="vegetarian">{t('cookbook.dietaryOptions.vegetarian')}</option>
                  <option value="vegan">{t('cookbook.dietaryOptions.vegan')}</option>
                  <option value="gluten-free">{t('cookbook.dietaryOptions.gluten_free')}</option>
                </select>
              </div>
              <div className="mb-2">
                <label className="form-label" style={styles.label}>
                  <i className="bi bi-gear" style={styles.icon}></i> {t('cookbook.complexity')}:
                </label>
                <select
                  className="form-select"
                  name="complexity"
                  value={formData.complexity}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="">{t('cookbook.complexityOptions.select')}</option>
                  <option value="easy">{t('cookbook.complexityOptions.easy')}</option>
                  <option value="medium">{t('cookbook.complexityOptions.medium')}</option>
                  <option value="hard">{t('cookbook.complexityOptions.hard')}</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn" onClick={handleCloseModal} style={styles.buttonRemove}>
                <i className="bi bi-x-circle" style={styles.iconRemove}></i> {t('cookbook.editModal.cancel')}
              </button>
              <button
                type="button"
                className="btn"
                onClick={handleUpdateRecipe}
                style={styles.button}
                disabled={isLoading}
              >
                <i className="bi bi-check-circle" style={styles.icon}></i>
                {isLoading ? t('cookbook.editModal.updating') : t('cookbook.editModal.update')}
              </button>
            </div>
            {recipeMessage && editModalOpen && (
              <div className={`alert ${recipeMessage.includes('Error') ? 'alert-danger' : 'alert-success'} mt-2`}>
                {recipeMessage}
              </div>
            )}
          </div>
        </div>
      </div>
      {editModalOpen && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default RecipeNotebook;