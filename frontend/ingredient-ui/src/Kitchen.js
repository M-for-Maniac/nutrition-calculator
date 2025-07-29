import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { Pie } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import 'chart.js/auto';
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

  const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://mformaniac.pythonanywhere.com' : 'http://localhost:5000';

  const styles = {
    container: { backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', minHeight: '100vh' },
    button: { marginRight: '10px', padding: '12px 24px', fontSize: '1.1rem', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', transition: 'background-color 0.2s ease' },
    accordionButton: { fontSize: '1.1rem', padding: '15px', backgroundColor: '#e9ecef', color: '#333', transition: 'background-color 0.2s ease', display: 'flex', alignItems: 'center' },
    accordionButtonCollapsed: { backgroundColor: '#dee2e6' },
    input: { fontSize: '1rem', padding: '14px', minHeight: '48px' },
    icon: { fontSize: '1rem', marginRight: '10px', color: '#28a745' },
    currencySelect: { fontSize: '1rem', padding: '10px', width: '120px' }
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

  const handleExport = () => {
    if (!results) return;
    const csvRows = ['Nutrient,Value,Unit,DV Percentage'];
    Object.entries(results).forEach(([nutrient, data]) => {
      if (nutrient !== 'Cost') {
        const dv = data.percent_dv !== null ? `${data.percent_dv.toFixed(2)}%` : 'N/A';
        csvRows.push(`${nutrient},${data.value},${data.unit},${dv}`);
      }
    });
    csvRows.push(`Cost,${results.Cost.value},${results.Cost.unit},N/A`);
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'nutrition_results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleAccordion = (category) => {
    setOpenAccordions(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const groupedIngredients = categories.reduce((acc, category) => {
    acc[category] = filteredIngredients.filter(ing => ing.category === category);
    return acc;
  }, {});

  return (
    <div className="container mt-4" style={styles.container}>
      <h1 className="mb-4 text-center" style={{ fontSize: '1.8rem' }}>{t('kitchen.title')}</h1>
      {isLoading && (
        <div className="text-center mb-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      <div className="mb-3">
        <label className="form-label me-2">{t('kitchen.currency')}:</label>
        <select
          value={currency}
          onChange={e => setCurrency(e.target.value)}
          style={styles.currencySelect}
          className="form-select d-inline-block"
        >
          <option value="Toman">{t('kitchen.currencyOptions.toman')}</option>
          <option value="IRR">{t('kitchen.currencyOptions.irr')}</option>
        </select>
      </div>
      <div className="row mb-3 g-2">
        <div className="col-12 col-md-3">
          <label className="form-label">{t('kitchen.maxCalories')}:</label>
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
          <label className="form-label">{t('kitchen.minProtein')}:</label>
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
          <label className="form-label">{t('kitchen.maxFat')}:</label>
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
          <label className="form-label">{t('kitchen.dietary')}:</label>
          <select
            className="form-select"
            value={dietaryFilter}
            onChange={e => setDietaryFilter(e.target.value)}
            style={styles.input}
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
          <label className="form-label">{t('kitchen.search')}:</label>
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
          <h3 className="mb-2" style={{ fontSize: '1.3rem' }}>{t('kitchen.updatePrice')}</h3>
          <div className="d-flex flex-column flex-sm-row gap-2">
            <select
              className="form-select"
              value={updateIngredient}
              onChange={e => setUpdateIngredient(e.target.value)}
              style={styles.input}
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
              className="btn btn-outline-primary" 
              onClick={handleUpdatePrice} 
              style={styles.button}
              disabled={isLoading}
            >
              {t('kitchen.updateButton')}
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
          <h3 style={{ fontSize: '1.3rem' }}>{t('kitchen.selectedIngredients')}</h3>
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
                  >
                    {t('kitchen.remove')}
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
                        <div className="card">
                          <div className="card-body">
                            <label className="form-label">{ing.ingredient_name.replace(/\./g, ' ')} ({ing.persian_name || ''})</label>
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
      <div className="mt-3">
        <button 
          className="btn btn-primary" 
          style={styles.button} 
          onClick={handleCalculate}
          disabled={isLoading}
        >
          {isLoading ? t('kitchen.calculating') : t('kitchen.calculate')}
        </button>
        <button 
          className="btn btn-outline-success" 
          style={styles.button} 
          onClick={handleExport}
          disabled={!results || isLoading}
        >
          {t('kitchen.export')}
        </button>
        <button 
          className="btn btn-secondary" 
          style={styles.button} 
          onClick={handleReset}
          disabled={isLoading}
        >
          {t('kitchen.reset')}
        </button>
      </div>
      {results && (
        <div className="mt-4">
          <h2 className="text-center" style={{ fontSize: '1.5rem' }}>{t('kitchen.nutritionResults')}</h2>
          {results.Cost && (
            <div className="alert alert-info mb-3">
              <strong>{t('kitchen.totalCost')}:</strong> {results.Cost.value} {results.Cost.unit}
            </div>
          )}
          <div className="row">
            {Object.entries(results)
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
          <div className="card mt-3">
            {/* <div className="card-body">
              <h3 className="card-title" style={{ fontSize: '1.3rem' }}>{t('kitchen.nutritionChart')}</h3>
              <Pie
                data={{
                  labels: Object.keys(results).filter(n => n !== 'Cost'),
                  datasets: [
                    {
                      label: t('kitchen.nutrition'),
                      data: Object.values(results).filter((_, i) => Object.keys(results)[i] !== 'Cost').map(d => d.value),
                      backgroundColor: [
                        'rgba(40, 167, 69, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)', 'rgba(255, 99, 132, 0.4)', 'rgba(54, 162, 235, 0.4)',
                        'rgba(255, 206, 86, 0.4)', 'rgba(75, 192, 192, 0.4)', 'rgba(153, 102, 255, 0.4)',
                        'rgba(255, 159, 64, 0.4)', 'rgba(40, 167, 69, 0.4)', 'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)', 'rgba(255, 206, 86, 0.8)', 'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)', 'rgba(255, 159, 64, 0.8)'
                      ],
                      borderColor: [
                        'rgba(40, 167, 69, 1)', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)', 'rgba(40, 167, 69, 1)', 'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'
                      ],
                      borderWidth: 1
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'right', labels: { font: { size: 12 } } }
                  }
                }}
                height={250}
              />
            </div> */}
          </div>
        </div>
      )}
      {recipes.length > 0 && (
        <div className="mt-4">
          <h2 className="text-center" style={{ fontSize: '1.5rem' }}>{t('kitchen.suggestedRecipes')}</h2>
          {recipes.map(recipe => (
            <div key={recipe.recipe_name} className="card mb-2">
              <div className="card-body">
                <h5 className="card-title">{recipe.recipe_name}</h5>
                <p className="card-text"><strong>{t('kitchen.recipeDetails.ingredients')}:</strong> {recipe.ingredient_list.map(ing => `${ing.ingredient} (${ing.quantity}g)`).join(', ')}</p>
                <p className="card-text"><strong>{t('kitchen.recipeDetails.instructions')}:</strong> {recipe.instructions}</p>
                <p className="card-text"><strong>{t('kitchen.recipeDetails.prepTime')}:</strong> {recipe.prep_time} {t('kitchen.minutes')}</p>
                <p className="card-text"><strong>{t('kitchen.recipeDetails.dietary')}:</strong> {recipe.dietary}</p>
                <p className="card-text"><strong>{t('kitchen.recipeDetails.complexity')}:</strong> {recipe.complexity}</p>
                <p className="card-text"><strong>{t('kitchen.recipeDetails.totalCalories')}:</strong> {recipe.total_calories} kcal</p>
                <p className="card-text"><strong>{t('kitchen.recipeDetails.totalCost')}:</strong> {recipe.total_cost} {currency}</p>
                <Link to="/cookbook" className="btn btn-outline-info" style={styles.button}>{t('kitchen.viewInCookbook')}</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Kitchen;