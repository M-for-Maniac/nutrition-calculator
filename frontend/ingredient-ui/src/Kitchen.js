import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2'; // Changed to Pie
import { Link } from 'react-router-dom';
import 'chart.js/auto';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Kitchen({ setErrorMessage }) {
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

  const styles = {
    container: { 
      backgroundColor: '#f8f9fa', 
      padding: '20px', 
      borderRadius: '8px',
      minHeight: '100vh'
    },
    button: { 
      marginRight: '10px', 
      padding: '12px 24px', 
      fontSize: '1.1rem', 
      backgroundColor: '#28a745',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      transition: 'background-color 0.2s ease'
    },
    accordionButton: {
      fontSize: '1.1rem',
      padding: '15px',
      backgroundColor: '#e9ecef',
      color: '#333',
      transition: 'background-color 0.2s ease',
      display: 'flex',
      alignItems: 'center'
    },
    accordionButtonCollapsed: {
      backgroundColor: '#dee2e6'
    },
    input: {
      fontSize: '1rem',
      padding: '14px', // Increased for visibility
      minHeight: '48px' // Ensure placeholders are visible
    },
    icon: {
      fontSize: '1rem',
      marginRight: '10px',
      color: '#28a745'
    }
  };

  const categories = [
  'Vegetables',
  'Fruits',
  'Grains and Cereals',
  'Legumes and Beans',
  'Meat and Poultry',
  'Dairy and Alternatives',
  'Nuts and Seeds',
  'Spices and Herbs',
  'Beverages',
  'Condiments and Sauces',
  'Sweets and Snacks',
  'Baking Ingredients', // New
  'Eggs', // New
  'Other'
]

  const getCategoryIcon = (category) => {
    const iconMap = {
      'Vegetables': 'leaf',
      'Fruits': 'apple-alt',
      'Grains and Cereals': 'wheat-awn',
      'Legumes and Beans': 'seedling',
      'Meat and Poultry': 'drumstick-bite',
      'Dairy and Alternatives': 'cheese',
      'Nuts and Seeds': 'seedling', // Changed from 'nut' to 'seedling'
      'Spices and Herbs': 'mortar-pestle',
      'Beverages': 'mug-hot',
      'Condiments and Sauces': 'bottle-droplet',
      'Sweets and Snacks': 'cookie',
      'Baking Ingredients': 'cookie-bite',
      'Eggs': 'egg',
      'Other': 'utensils'
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
    let url = 'http://localhost:5000/ingredients';
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
        setErrorMessage('Failed to load ingredients. Please try again.');
      });
  }, [maxCalories, minProtein, maxFat, dietaryFilter, setErrorMessage]);

  useEffect(() => {
    const filtered = ingredients.filter(ing =>
      (ing.ingredient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       ing.persian_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredIngredients(filtered);
  }, [searchTerm, ingredients]);

  const handleCalculate = () => {
    const numericSelected = {};
    for (const [key, value] of Object.entries(selected)) {
      numericSelected[key] = parseFloat(value) || 0;
    }
    setErrorMessage('');
    axios.post('http://localhost:5000/calculate', numericSelected)
      .then(res => {
        setResults(res.data);
      })
      .catch(err => {
        console.error('Error calculating:', err);
        setErrorMessage(err.response?.data?.error || 'Error calculating nutrition. Please try again.');
      });

    const selectedIngredients = Object.keys(numericSelected).filter(key => numericSelected[key] > 0);
    axios.post('http://localhost:5000/recipes', { 
      ingredients: selectedIngredients,
      dietary: dietaryFilter,
      complexity: complexityFilter
    })
      .then(res => {
        setRecipes(res.data);
      })
      .catch(err => {
        console.error('Error fetching recipes:', err);
        setErrorMessage(err.response?.data?.error || 'Error fetching recipes. Please try again.');
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
    setMaxFat('');
    setOpenAccordions([]);
  };

  const handleUpdatePrice = () => {
    if (!updateIngredient || !purchaseCost || !purchaseAmount) {
      setUpdateMessage('Please fill all price update fields');
      return;
    }
    setErrorMessage('');
    axios.post('http://localhost:5000/update_price', {
      ingredient_name: updateIngredient,
      purchase_cost: parseFloat(purchaseCost),
      purchase_amount: parseFloat(purchaseAmount)
    })
      .then(res => {
        setUpdateMessage(res.data.message);
        axios.get('http://localhost:5000/ingredients')
          .then(res => {
            setIngredients(res.data);
            setFilteredIngredients(res.data);
          })
          .catch(err => {
            console.error('Error refreshing ingredients:', err);
            setErrorMessage('Failed to refresh ingredients after price update.');
          });
      })
      .catch(err => {
        console.error('Error updating price:', err);
        setUpdateMessage(err.response?.data?.error || 'Error updating price. Please try again.');
      });
  };

  const handleExport = () => {
    if (!results) return;
    const csvRows = ['Nutrient,Value'];
    Object.entries(results).forEach(([nutrient, value]) => {
      csvRows.push(`${nutrient.replace(/([A-Z])/g, ' $1').trim()},${Math.floor(value)}`);
    });
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
      <h1 className="mb-4 text-center" style={{ fontSize: '1.8rem' }}>Kitchen</h1>
      <h2 className="mb-3" style={{ fontSize: '1.5rem' }}>Ingredients</h2>
      <div className="row mb-3 g-2">
        <div className="col-12 col-md-3">
          <label className="form-label">Max Calories:</label>
          <input
            type="number"
            min="0"
            className="form-control"
            placeholder="Enter max calories"
            value={maxCalories}
            onChange={e => setMaxCalories(e.target.value)}
            style={styles.input}
          />
        </div>
        <div className="col-12 col-md-3">
          <label className="form-label">Min Protein (g):</label>
          <input
            type="number"
            min="0"
            className="form-control"
            placeholder="Enter min protein"
            value={minProtein}
            onChange={e => setMinProtein(e.target.value)}
            style={styles.input}
          />
        </div>
        <div className="col-12 col-md-3">
          <label className="form-label">Max Fat (g):</label>
          <input
            type="number"
            min="0"
            className="form-control"
            placeholder="Enter max fat"
            value={maxFat}
            onChange={e => setMaxFat(e.target.value)}
            style={styles.input}
          />
        </div>
        <div className="col-12 col-md-3">
          <label className="form-label">Dietary:</label>
          <select
            className="form-select"
            value={dietaryFilter}
            onChange={e => setDietaryFilter(e.target.value)}
            style={styles.input}
          >
            <option value="">All</option>
            <option value="omnivore">Omnivore</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
          </select>
        </div>
      </div>
      <div className="row mb-3 g-2">
        <div className="col-12">
          <label className="form-label">Search Ingredient:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter ingredient name"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={styles.input}
          />
        </div>
      </div>
      <div className="row mb-3 g-2">
        <div className="col-12">
          <h3 className="mb-2" style={{ fontSize: '1.3rem' }}>Update Ingredient Price</h3>
          <div className="d-flex flex-column flex-sm-row gap-2">
            <select
              className="form-select"
              value={updateIngredient}
              onChange={e => setUpdateIngredient(e.target.value)}
              style={styles.input}
            >
              <option value="">Select ingredient</option>
              {ingredients.map(ing => (
                <option key={ing.ingredient_name} value={ing.ingredient_name}>
                  {ing.ingredient_name.replace(/\./g, ' ')} ({ing.persian_name})
                </option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              className="form-control"
              placeholder="Purchase cost (T)"
              value={purchaseCost}
              onChange={e => setPurchaseCost(e.target.value)}
              style={styles.input}
            />
            <input
              type="number"
              min="0"
              className="form-control"
              placeholder="Purchase amount (grams)"
              value={purchaseAmount}
              onChange={e => setPurchaseAmount(e.target.value)}
              style={styles.input}
            />
            <button className="btn btn-outline-primary" onClick={handleUpdatePrice} style={styles.button}>
              Update Price
            </button>
          </div>
          {updateMessage && (
            <div className={`alert ${updateMessage.includes('Error') ? 'alert-danger' : 'alert-success'} mt-2`}>
              {updateMessage}
            </div>
          )}
        </div>
      </div>
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
                            <label className="form-label">{ing.ingredient_name.replace(/\./g, ' ')} ({ing.persian_name})</label>
                            <input
                              type="number"
                              min="0"
                              className="form-control"
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
        <button className="btn btn-primary" style={styles.button} onClick={handleCalculate}>Calculate</button>
        <button className="btn btn-outline-success" style={styles.button} onClick={handleExport}>Export to CSV</button>
        <button className="btn btn-secondary" style={styles.button} onClick={handleReset}>Reset</button>
      </div>
      {results && (
        <div className="mt-4">
          <h2 className="text-center" style={{ fontSize: '1.5rem' }}>Results</h2>
          {results.Cost !== undefined && (
            <div className="alert alert-info mb-3">
              <strong>Total Cost:</strong> {Math.floor(results.Cost)} T
            </div>
          )}
          <ul className="list-group mb-4">
            {Object.entries(results)
              .filter(([nutrient]) => nutrient !== 'Cost' && nutrient !== 'PurchaseCost' && nutrient !== 'PurchaseAmt')
              .map(([nutrient, value]) => (
                <li key={nutrient} className="list-group-item">
                  {nutrient.replace(/([A-Z])/g, ' $1').trim()}: {Math.floor(value)}
                </li>
              ))}
          </ul>
          <div className="card">
            {/* <div className="card-body">
              <h3 className="card-title" style={{ fontSize: '1.3rem' }}>Nutrition Chart</h3>
              <Pie
                data={{
                  labels: Object.keys(results)
                    .filter(n => n !== 'Cost' && n !== 'PurchaseCost' && n !== 'PurchaseAmt')
                    .map(n => n.replace(/([A-Z])/g, ' $1').trim()),
                  datasets: [
                    {
                      label: 'Nutrition (per 100g)',
                      data: Object.values(results).filter((_, i) => 
                        Object.keys(results)[i] !== 'Cost' && 
                        Object.keys(results)[i] !== 'PurchaseCost' && 
                        Object.keys(results)[i] !== 'PurchaseAmt'
                      ),
                      backgroundColor: [
                        'rgba(40, 167, 69, 0.6)', // Green
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)'
                      ],
                      borderColor: [
                        'rgba(40, 167, 69, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)'
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { 
                    legend: { 
                      position: 'right', // Move legend to right for mobile
                      labels: { font: { size: 12 } } // Smaller font for mobile
                    }
                  }
                }}
                height={250} // Fixed height for compactness
              />
            </div> */}
          </div>
        </div>
      )}
      {recipes.length > 0 && (
        <div className="mt-4">
          <h2 className="text-center" style={{ fontSize: '1.5rem' }}>Suggested Recipes</h2>
          {recipes.map(recipe => (
            <div key={recipe.recipe_name} className="card mb-2">
              <div className="card-body">
                <h5 className="card-title">{recipe.recipe_name}</h5>
                <p className="card-text"><strong>Ingredients:</strong> {recipe.ingredient_list.map(ing => `${ing.ingredient} (${ing.quantity}g)`).join(', ')}</p>
                <p className="card-text"><strong>Instructions:</strong> {recipe.instructions}</p>
                <p className="card-text"><strong>Prep Time:</strong> {recipe.prep_time} minutes</p>
                <p className="card-text"><strong>Dietary:</strong> {recipe.dietary}</p>
                <p className="card-text"><strong>Complexity:</strong> {recipe.complexity}</p>
                <Link to="/cookbook" className="btn btn-outline-info" style={styles.button}>View in Cookbook</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Kitchen;