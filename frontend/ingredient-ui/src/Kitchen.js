import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Kitchen({ setErrorMessage }) {
  const { t } = useTranslation();
  const [ingredients, setIngredients] = useState([]);
  const [selected, setSelected] = useState({});
  const [results, setResults] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [maxCalories, setMaxCalories] = useState('');
  const [minProtein, setMinProtein] = useState('');
  const [maxFat, setMaxFat] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState('');
  const [complexityFilter, setComplexityFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [updateIngredient, setUpdateIngredient] = useState('');
  const [purchaseCost, setPurchaseCost] = useState('');
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [openAccordions, setOpenAccordions] = useState([]);
  const [currency, setCurrency] = useState('Toman');
  const [isLoading, setIsLoading] = useState(false);
  const [openNotes, setOpenNotes] = useState({ purpose: false, nutrition: false, usage: false });

  const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://mformaniac.pythonanywhere.com' : 'http://localhost:5000';

  const styles = {
    container: { backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', minHeight: '100vh' },
    button: { margin: '10px', padding: '12px 24px', fontSize: '1.1rem', backgroundColor: '#295241', color: '#fff', border: 'none', borderRadius: '6px', transition: 'background-color 0.2s ease' },
    buttonRemove: { margin: '10px', padding: '12px 24px', fontSize: '1.1rem', backgroundColor: '#bb0d14', color: '#fff', border: 'none', borderRadius: '6px', transition: 'background-color 0.2s ease' },
    input: { fontSize: '1rem', padding: '14px', minHeight: '48px', borderColor: '#295241' },
    select: { fontSize: '1rem', padding: '10px', borderColor: '#295241' },
    heading: { color: '#295241', fontSize: '1.8rem', marginBottom: '1rem' },
    subheading: { color: '#295241', fontSize: '1.3rem' },
    label: { color: '#295241', fontWeight: '500' },
    icon: { color: '#295241', marginRight: '5px' },
    iconRemove: { color: '#bb0d14', marginRight: '5px' },
    accordionButton: {
      backgroundColor: '#fff',
      color: '#295241',
      fontWeight: '500',
      fontSize: '1rem',
      padding: '10px 15px'
    },
    accordionButtonCollapsed: {
      backgroundColor: '#f8f9fa',
      color: '#295241'
    },
    noteCard: {
      backgroundColor: '#fff',
      border: '1px solid #295241',
      borderRadius: '4px',
      padding: '10px'
    }
  };

  const categories = [
    'Vegetables', 'Fruits', 'Grains and Cereals', 'Legumes and Beans', 'Meat and Poultry', 'Dairy and Alternatives',
    'Nuts and Seeds', 'Spices and Herbs', 'Beverages', 'Condiments and Sauces', 'Sweets and Snacks', 'Baking Ingredients', 'Eggs', 'Other'
  ];

  const getCategoryIcon = (category) => {
    const iconMap = {
      'Vegetables': 'leaf', 'Fruits': 'apple-alt', 'Grains and Cereals': 'wheat-awn', 'Legumes and Beans': 'seedling',
      'Meat and Poultry': 'drumstick-bite', 'Dairy and Alternatives': 'cheese', 'Nuts and Seeds': 'seedling',
      'Spices and Herbs': 'mortar-pestle', 'Beverages': 'mug-hot', 'Condiments and Sauces': 'bottle-droplet',
      'Sweets and Snacks': 'cookie', 'Baking Ingredients': 'cookie-bite', 'Eggs': 'egg', 'Other': 'utensils'
    };
    return iconMap[category] || 'utensils';
  };

  useEffect(() => {
    const saved = localStorage.getItem('selectedIngredients');
    if (saved) setSelected(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedIngredients', JSON.stringify(selected));
  }, [selected]);

  useEffect(() => {
    setIsLoading(true);
    let url = `${BASE_URL}/ingredients`;
    const params = [];
    if (maxCalories) params.push(`max_calories=${maxCalories}`);
    if (minProtein) params.push(`min_protein=${minProtein}`);
    if (maxFat) params.push(`max_fat=${maxFat}`);
    if (dietaryFilter) params.push(`dietary=${dietaryFilter}`);
    if (params.length) url += `?${params.join('&')}`;
    axios.get(url)
      .then(res => {
        setIngredients(res.data);
        setFilteredIngredients(res.data);
        setErrorMessage('');
      })
      .catch(err => {
        console.error('Error fetching ingredients:', err);
        setErrorMessage(err.response?.data?.error || t('kitchen.error.fetchIngredients'));
      })
      .finally(() => setIsLoading(false));
  }, [maxCalories, minProtein, maxFat, dietaryFilter, setErrorMessage, t]);

  useEffect(() => {
    const filtered = ingredients.filter(ing =>
      (ing.ingredient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       ing.persian_name?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredIngredients(filtered);
  }, [searchTerm, ingredients]);

  const handleCalculate = () => {
    setIsLoading(true);
    const numericSelected = { currency };
    for (const [key, value] of Object.entries(selected)) {
      numericSelected[key] = parseFloat(value) || 0;
    }
    setErrorMessage('');
    axios.post(`${BASE_URL}/calculate`, numericSelected)
      .then(res => {
        setResults(res.data);
      })
      .catch(err => {
        console.error('Error calculating:', err);
        setErrorMessage(err.response?.data?.error || t('kitchen.error.calculate'));
      })
      .finally(() => setIsLoading(false));
    const selectedIngredients = Object.keys(numericSelected).filter(key => key !== 'currency' && numericSelected[key] > 0);
    axios.post(`${BASE_URL}/recipes`, { 
      ingredients: selectedIngredients,
      dietary: dietaryFilter,
      complexity: complexityFilter,
      currency
    })
      .then(res => {
        setRecipes(res.data);
      })
      .catch(err => {
        console.error('Error fetching recipes:', err);
        setErrorMessage(err.response?.data?.error || t('kitchen.error.fetchRecipes'));
      });
  };

  const handleReset = () => {
    setSelected({});
    localStorage.removeItem('selectedIngredients');
    setResults(null);
    setRecipes([]);
    setSearchTerm('');
    setUpdateMessage('');
    setErrorMessage('');
    setDietaryFilter('');
    setComplexityFilter('');
    setMaxCalories('');
    setMinProtein('');
    setMaxFat('');
    setOpenAccordions([]);
    setCurrency('Toman');
    setOpenNotes({ purpose: false, nutrition: false, usage: false });
  };

  const handleUpdatePrice = () => {
    if (!updateIngredient || !purchaseCost || !purchaseAmount) {
      setUpdateMessage(t('kitchen.error.updatePriceFields'));
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    axios.post(`${BASE_URL}/update_price`, {
      ingredient_name: updateIngredient,
      purchase_cost: parseFloat(purchaseCost),
      purchase_amount: parseFloat(purchaseAmount)
    })
      .then(res => {
        setUpdateMessage(res.data.message);
        axios.get(`${BASE_URL}/ingredients`)
          .then(res => {
            setIngredients(res.data);
            setFilteredIngredients(res.data);
          })
          .catch(err => {
            console.error('Error refreshing ingredients:', err);
            setErrorMessage(t('kitchen.error.refreshIngredients'));
          });
      })
      .catch(err => {
        console.error('Error updating price:', err);
        setUpdateMessage(err.response?.data?.error || t('kitchen.error.updatePrice'));
      })
      .finally(() => setIsLoading(false));
  };

  const handleExport = async () => {
  if (!results) return;

  try {
    setIsLoading(true);
    const ingredientList = Object.entries(selected)
      .filter(([_, qty]) => parseFloat(qty) > 0)
      .map(([ingredient, quantity]) => ({
        ingredient,
        quantity: parseFloat(quantity) || 100
      }));
    if (!ingredientList.length) {
      setErrorMessage(t('kitchen.error.noIngredients'));
      return;
    }
    const response = await axios.post(`${BASE_URL}/export_nutrition_image`, {
      ingredient_list: ingredientList,
      scale_factor: 1.0, // No scaling in Kitchen.js
      currency,
      title: t('kitchen.nutritionLabelTitle', { defaultValue: 'Nutrition Facts: Selected Ingredients' })
    });
    const { image } = response.data;
    const link = document.createElement('a');
    link.href = image; // Base64 data URL
    link.download = 'kitchen_nutrition_label.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setErrorMessage('');
  } catch (err) {
    console.error('Error exporting nutrition image:', err);
    setErrorMessage(err.response?.data?.error || t('kitchen.error.exportImage'));
  } finally {
    setIsLoading(false);
  }
};

  const toggleAccordion = (category) => {
    setOpenAccordions(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleNote = (note) => {
    setOpenNotes(prev => ({
      ...prev,
      [note]: !prev[note]
    }));
  };

  const groupedIngredients = categories.reduce((acc, category) => {
    acc[category] = filteredIngredients.filter(ing => ing.category === category);
    return acc;
  }, {});

  return (
    <div className="container mt-4" style={styles.container}>
      <h1 className="mb-4 text-center" style={styles.heading}>
        <i className="fas fa-utensils" style={styles.icon}></i> {t('kitchen.title')}
      </h1>

      {/* Informational Notes */}
      <div className="mb-4">
        <h3 style={styles.subheading}>{t('kitchen.notes.title', { defaultValue: 'How to Use the Kitchen' })}</h3>
        <div className="accordion" id="notesAccordion">
          <div className="accordion-item">
            <h2 className="accordion-header" id="notePurpose">
              <button
                className="accordion-button"
                type="button"
                onClick={() => toggleNote('purpose')}
                aria-expanded={openNotes.purpose}
                aria-controls="collapsePurpose"
                style={{
                  ...styles.accordionButton,
                  ...(openNotes.purpose ? {} : styles.accordionButtonCollapsed)
                }}
              >
                <i className="fas fa-info-circle" style={styles.icon}></i>
                {t('kitchen.notes.purposeTitle', { defaultValue: 'Why Use the Kitchen?' })}
              </button>
            </h2>
            <div
              id="collapsePurpose"
              className={`accordion-collapse collapse ${openNotes.purpose ? 'show' : ''}`}
              aria-labelledby="notePurpose"
            >
              <div className="accordion-body" style={styles.noteCard}>
                <p>{t('kitchen.notes.purpose')}</p>
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header" id="noteNutrition">
              <button
                className="accordion-button"
                type="button"
                onClick={() => toggleNote('nutrition')}
                aria-expanded={openNotes.nutrition}
                aria-controls="collapseNutrition"
                style={{
                  ...styles.accordionButton,
                  ...(openNotes.nutrition ? {} : styles.accordionButtonCollapsed)
                }}
              >
                <i className="fas fa-heart" style={styles.icon}></i>
                {t('kitchen.notes.nutritionTitle', { defaultValue: 'Understanding Nutrition' })}
              </button>
            </h2>
            <div
              id="collapseNutrition"
              className={`accordion-collapse collapse ${openNotes.nutrition ? 'show' : ''}`}
              aria-labelledby="noteNutrition"
            >
              <div className="accordion-body" style={styles.noteCard}>
                <p>{t('kitchen.notes.nutritionInfo')}</p>
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header" id="noteUsage">
              <button
                className="accordion-button"
                type="button"
                onClick={() => toggleNote('usage')}
                aria-expanded={openNotes.usage}
                aria-controls="collapseUsage"
                style={{
                  ...styles.accordionButton,
                  ...(openNotes.usage ? {} : styles.accordionButtonCollapsed)
                }}
              >
                <i className="fas fa-utensils" style={styles.icon}></i>
                {t('kitchen.notes.usageTitle', { defaultValue: 'How to Get Started' })}
              </button>
            </h2>
            <div
              id="collapseUsage"
              className={`accordion-collapse collapse ${openNotes.usage ? 'show' : ''}`}
              aria-labelledby="noteUsage"
            >
              <div className="accordion-body" style={styles.noteCard}>
                <p>{t('kitchen.notes.usage')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="text-center mb-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      <div className="mb-3">
        <label className="form-label me-2" style={styles.label}>
          <i className="bi bi-currency-exchange" style={styles.icon}></i> {t('kitchen.currency')}:
        </label>
        <select
          value={currency}
          onChange={e => setCurrency(e.target.value)}
          style={styles.select}
          className="form-select d-inline-block"
        >
          <option value="Toman">{t('kitchen.currencyOptions.toman')}</option>
          <option value="IRR">{t('kitchen.currencyOptions.irr')}</option>
        </select>
      </div>
      <div className="row mb-3 g-2">
        <div className="col-12 col-md-3">
          <label className="form-label" style={styles.label}>
            <i className="bi bi-fire" style={styles.icon}></i> {t('kitchen.maxCalories')}:
          </label>
          <input
            type="number"
            min="0"
            className="form-control"
            placeholder={t('kitchen.maxCalories')}
            value={maxCalories}
            onChange={e => setMaxCalories(e.target.value)}
            style={styles.input}
          />
        </div>
        <div className="col-12 col-md-3">
          <label className="form-label" style={styles.label}>
            <i className="bi bi-egg-fried" style={styles.icon}></i> {t('kitchen.minProtein')}:
          </label>
          <input
            type="number"
            min="0"
            className="form-control"
            placeholder={t('kitchen.minProtein')}
            value={minProtein}
            onChange={e => setMinProtein(e.target.value)}
            style={styles.input}
          />
        </div>
        <div className="col-12 col-md-3">
          <label className="form-label" style={styles.label}>
            <i className="bi bi-droplet" style={styles.icon}></i> {t('kitchen.maxFat')}:
          </label>
          <input
            type="number"
            min="0"
            className="form-control"
            placeholder={t('kitchen.maxFat')}
            value={maxFat}
            onChange={e => setMaxFat(e.target.value)}
            style={styles.input}
          />
        </div>
        <div className="col-12 col-md-3">
          <label className="form-label" style={styles.label}>
            <i className="bi bi-egg" style={styles.icon}></i> {t('kitchen.dietary')}:
          </label>
          <select
            className="form-select"
            value={dietaryFilter}
            onChange={e => setDietaryFilter(e.target.value)}
            style={styles.select}
          >
            <option value="">{t('kitchen.dietaryOptions.all')}</option>
            <option value="omnivore">{t('kitchen.dietaryOptions.omnivore')}</option>
            <option value="vegetarian">{t('kitchen.dietaryOptions.vegetarian')}</option>
            <option value="vegan">{t('kitchen.dietaryOptions.vegan')}</option>
          </select>
        </div>
      </div>
      <div className="row mb-3 g-2">
        <div className="col-12">
          <label className="form-label" style={styles.label}>
            <i className="bi bi-search" style={styles.icon}></i> {t('kitchen.search')}:
          </label>
          <input
            type="text"
            className="form-control"
            placeholder={t('kitchen.search')}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={styles.input}
          />
        </div>
      </div>
      <div className="row mb-3 g-2">
        <div className="col-12">
          <h3 className="mb-2" style={styles.subheading}>
            <i className="bi bi-currency-exchange" style={styles.icon}></i> {t('kitchen.updatePrice')}
          </h3>
          <div className="d-flex flex-column flex-sm-row gap-2">
            <select
              className="form-select"
              value={updateIngredient}
              onChange={e => setUpdateIngredient(e.target.value)}
              style={styles.select}
            >
              <option value="">{t('kitchen.selectIngredient')}</option>
              {ingredients.map(ing => (
                <option key={ing.ingredient_name} value={ing.ingredient_name}>
                  {ing.ingredient_name.replace(/\./g, ' ')} ({ing.persian_name || ''})
                </option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              className="form-control"
              placeholder={`${t('kitchen.purchaseCost')} (${currency})`}
              value={purchaseCost}
              onChange={e => setPurchaseCost(e.target.value)}
              style={styles.input}
            />
            <input
              type="number"
              min="0"
              className="form-control"
              placeholder={t('kitchen.purchaseAmount')}
              value={purchaseAmount}
              onChange={e => setPurchaseAmount(e.target.value)}
              style={styles.input}
            />
            <button 
              className="btn" 
              onClick={handleUpdatePrice} 
              style={styles.button}
              disabled={isLoading}
            >
              <i className="bi bi-arrow-repeat" style={styles.icon}></i> {t('kitchen.updateButton')}
            </button>
          </div>
          {updateMessage && (
            <div className={`alert ${updateMessage.includes('Error') ? 'alert-danger' : 'alert-success'} mt-2`}>
              {updateMessage}
            </div>
          )}
        </div>
      </div>
      {Object.keys(selected).length > 0 && (
        <div className="mt-3">
          <h3 style={styles.subheading}>
            <i className="bi bi-list-check" style={styles.icon}></i> {t('kitchen.selectedIngredients')}
          </h3>
          <ul className="list-group mb-3">
            {Object.entries(selected).map(([name, qty]) => (
              qty > 0 && (
                <li key={name} className="list-group-item d-flex justify-content-between align-items-center">
                  {name.replace(/\./g, ' ')} ({ingredients.find(item => item.ingredient_name === name)?.persian_name || ''}): {qty} g
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => setSelected(prev => {
                      const updated = { ...prev };
                      delete updated[name];
                      localStorage.setItem('selectedIngredients', JSON.stringify(updated));
                      return updated;
                    })}
                    style={styles.buttonRemove}
                  >
                    <i className="bi bi-trash" style={styles.iconRemove}></i> {t('kitchen.remove')}
                  </button>
                </li>
              )
            ))}
          </ul>
        </div>
      )}
      <div className="accordion" id="ingredientAccordion">
        {categories.map(category => (
          groupedIngredients[category]?.length > 0 && (
            <div className="accordion-item" key={category}>
              <h2 className="accordion-header" id={`heading${category}`}>
                <button
                  className="accordion-button"
                  type="button"
                  onClick={() => toggleAccordion(category)}
                  aria-expanded={openAccordions.includes(category)}
                  aria-controls={`collapse${category}`}
                  style={{
                    ...styles.accordionButton,
                    ...(openAccordions.includes(category) ? {} : styles.accordionButtonCollapsed)
                  }}
                >
                  <i className={`fas fa-${getCategoryIcon(category)}`} style={styles.icon}></i>
                  {category} ({groupedIngredients[category].length})
                </button>
              </h2>
              <div
                id={`collapse${category}`}
                className={`accordion-collapse collapse ${openAccordions.includes(category) ? 'show' : ''}`}
                aria-labelledby={`heading${category}`}
              >
                <div className="accordion-body">
                  <div className="row g-2">
                    {groupedIngredients[category].map(ing => (
                      <div key={ing.ingredient_name} className="col-12 col-md-4">
                        <div className="card" style={{ backgroundColor: '#e9e2d6', border: '1px solid #295241' }}>
                          <div className="card-body">
                            <label className="form-label" style={styles.label}>
                              {ing.ingredient_name.replace(/\./g, ' ')} ({ing.persian_name || ''})
                            </label>
                            <input
                              type="number"
                              min="0"
                              className="form-control"
                              placeholder={t('kitchen.quantity')}
                              value={selected[ing.ingredient_name] || ''}
                              onChange={e => setSelected({ ...selected, [ing.ingredient_name]: e.target.value })}
                              style={styles.input}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        ))}
      </div>
      <div className="mx-3 my-3">
        <button 
          className="btn" 
          style={styles.button} 
          onClick={handleCalculate}
          disabled={isLoading}
        >
          <i className="bi bi-calculator" style={styles.icon}></i> {isLoading ? t('kitchen.calculating') : t('kitchen.calculate')}
        </button>
        <button 
          className="btn" 
          style={styles.button} 
          onClick={handleExport}
          disabled={!results || isLoading}
        >
          <i className="bi bi-download" style={styles.icon}></i> {t('kitchen.export')}
        </button>
        <button 
          className="btn" 
          style={{ ...styles.button, backgroundColor: '#e9e2d6', color: '#295241' }} 
          onClick={handleReset}
          disabled={isLoading}
        >
          <i className="bi bi-arrow-repeat" style={styles.icon}></i> {t('kitchen.reset')}
        </button>
      </div>
      {results && (
        <div className="mt-4">
          <h2 className="text-center" style={styles.subheading}>
            <i className="bi bi-bar-chart" style={styles.icon}></i> {t('kitchen.nutritionResults')}
          </h2>
          {results.Cost && (
            <div className="alert alert-info mb-3" style={{ backgroundColor: '#e9e2d6', borderColor: '#295241', color: '#295241' }}>
              <strong>{t('kitchen.totalCost')}:</strong> {results.Cost.value} {results.Cost.unit}
            </div>
          )}
          <div className="row">
            {Object.entries(results)
              .filter(([nutrient]) => nutrient !== 'Cost')
              .map(([nutrient, data]) => (
                <div key={nutrient} className="col-12 col-md-4 mb-2">
                  <div className="card" style={{ backgroundColor: '#e9e2d6', border: '1px solid #295241' }}>
                    <div className="card-body">
                      <strong>{nutrient}:</strong> {data.value} {data.unit}
                      {data.percent_dv !== null && ` (${data.percent_dv}% DV)`}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
      {recipes.length > 0 && (
        <div className="mt-4">
          <h2 className="text-center" style={styles.subheading}>
            <i className="bi bi-journal-text" style={styles.icon}></i> {t('kitchen.suggestedRecipes')}
          </h2>
          {recipes.map(recipe => (
            <div key={recipe.recipe_name} className="card mb-2" style={{ backgroundColor: '#e9e2d6', border: '1px solid #295241' }}>
              <div className="card-body">
                <h5 className="card-title">{recipe.recipe_name}</h5>
                <p className="card-text"><strong>{t('kitchen.recipeDetails.ingredients')}:</strong> {recipe.ingredient_list.map(ing => `${ing.ingredient} (${ing.quantity}g)`).join(', ')}</p>
                <p className="card-text"><strong>{t('kitchen.recipeDetails.instructions')}:</strong> {recipe.instructions}</p>
                <p className="card-text"><strong>{t('kitchen.recipeDetails.prepTime')}:</strong> {recipe.prep_time} {t('kitchen.minutes')}</p>
                <p className="card-text"><strong>{t('kitchen.recipeDetails.dietary')}:</strong> {recipe.dietary}</p>
                <p className="card-text"><strong>{t('kitchen.recipeDetails.complexity')}:</strong> {recipe.complexity}</p>
                <p className="card-text"><strong>{t('kitchen.recipeDetails.totalCalories')}:</strong> {recipe.total_calories} kcal</p>
                <p className="card-text"><strong>{t('kitchen.recipeDetails.totalCost')}:</strong> {recipe.total_cost} {currency}</p>
                <Link to="/cookbook" className="btn" style={{ ...styles.button, backgroundColor: 'transparent', borderColor: '#295241', color: '#295241' }}>
                  <i className="bi bi-book" style={styles.icon}></i> {t('kitchen.viewInCookbook')}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Kitchen;