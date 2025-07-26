import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';

function RecipeNotebook({ setErrorMessage }) {
  const [ingredients, setIngredients] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);
  const [recipeMaxCalories, setRecipeMaxCalories] = useState('');
  const [recipeMaxCost, setRecipeMaxCost] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState('');
  const [complexityFilter, setComplexityFilter] = useState('');
  const [newRecipeName, setNewRecipeName] = useState('');
  const [newRecipeIngredients, setNewRecipeIngredients] = useState([]);
  const [newRecipeInstructions, setNewRecipeInstructions] = useState('');
  const [newRecipePrepTime, setNewRecipePrepTime] = useState('');
  const [newRecipeDietary, setNewRecipeDietary] = useState('');
  const [newRecipeComplexity, setNewRecipeComplexity] = useState('');
  const [recipeMessage, setRecipeMessage] = useState('');
  const [recipeNutrition, setRecipeNutrition] = useState({});
  const [ingredientQuantities, setIngredientQuantities] = useState({});
  const [editRecipe, setEditRecipe] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [scaleFactor, setScaleFactor] = useState(1.0);

  const BASE_URL = 'https://maniac.pythonanywhere.com';

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
    input: {
      fontSize: '1rem',
      padding: '14px',
      minHeight: '48px'
    },
    modal: {
      maxWidth: '90vw',
      margin: 'auto'
    }
  };

  useEffect(() => {
    axios.get(`${BASE_URL}/ingredients`)
      .then(res => {
        setIngredients(res.data);
        setErrorMessage('');
      })
      .catch(err => {
        console.error('Error fetching ingredients:', err);
        setErrorMessage('Failed to load ingredients. Please try again.');
      });
  }, [setErrorMessage]);

  useEffect(() => {
    if (ingredients.length === 0) return;
    let url = `${BASE_URL}/get_recipes`;
    const params = [];
    if (recipeMaxCalories) params.push(`max_calories=${recipeMaxCalories}`);
    if (recipeMaxCost) params.push(`max_cost=${recipeMaxCost}`);
    if (dietaryFilter) params.push(`dietary=${dietaryFilter}`);
    if (complexityFilter) params.push(`complexity=${complexityFilter}`);
    if (params.length) url += `?${params.join('&')}`;
    axios.get(url)
      .then(res => {
        setAllRecipes(res.data);
        setErrorMessage('');
      })
      .catch(err => {
        console.error('Error fetching recipes:', err);
        setErrorMessage('Failed to load recipes. Please try again.');
      });
  }, [recipeMaxCalories, recipeMaxCost, dietaryFilter, complexityFilter, ingredients, setErrorMessage]);

  const handleAddRecipe = () => {
    if (!newRecipeName || !newRecipeIngredients.length || !newRecipePrepTime) {
      setRecipeMessage('Please fill recipe name, ingredients, and prep time');
      return;
    }
    const ingredientList = newRecipeIngredients.map(opt => ({
      ingredient: opt.value,
      quantity: parseFloat(ingredientQuantities[opt.value]) || 100
    }));
    setErrorMessage('');
    axios.post(`${BASE_URL}/add_recipe`, {
      recipe_name: newRecipeName,
      ingredient_list: ingredientList,
      instructions: newRecipeInstructions,
      prep_time: parseInt(newRecipePrepTime),
      dietary: newRecipeDietary,
      complexity: newRecipeComplexity
    })
      .then(res => {
        setRecipeMessage(res.data.message);
        axios.get(`${BASE_URL}/get_recipes`)
          .then(res => setAllRecipes(res.data))
          .catch(err => setErrorMessage(err.response?.data?.error || 'Error fetching recipes'));
        setNewRecipeName('');
        setNewRecipeIngredients([]);
        setNewRecipeInstructions('');
        setNewRecipePrepTime('');
        setNewRecipeDietary('');
        setNewRecipeComplexity('');
        setIngredientQuantities({});
      })
      .catch(err => {
        console.error('Error adding recipe:', err);
        setRecipeMessage(err.response?.data?.error || 'Error adding recipe. Please try again.');
      });
  };

  const handleCalculateRecipeNutrition = (ingredient_list, recipe_name) => {
    if (!ingredient_list || !Array.isArray(ingredient_list)) {
      setErrorMessage('Invalid ingredient list for recipe');
      return;
    }
    axios.post(`${BASE_URL}/recipe_nutrition`, { 
      ingredient_list, 
      scale_factor: parseFloat(scaleFactor) || 1.0 
    })
      .then(res => {
        setRecipeNutrition(prev => ({ ...prev, [recipe_name]: res.data }));
      })
      .catch(err => {
        console.error('Error calculating recipe nutrition:', err);
        setErrorMessage(err.response?.data?.error || 'Error calculating recipe nutrition.');
      });
  };

  const handleDeleteRecipe = (recipe_name) => {
    if (!window.confirm(`Are you sure you want to delete ${recipe_name}?`)) return;
    setErrorMessage('');
    axios.post(`${BASE_URL}/delete_recipe`, { recipe_name })
      .then(res => {
        setRecipeMessage(res.data.message);
        axios.get(`${BASE_URL}/get_recipes`)
          .then(res => {
            setAllRecipes(res.data);
            setRecipeNutrition(prev => {
              const updated = { ...prev };
              delete updated[recipe_name];
              return updated;
            });
          })
          .catch(err => setErrorMessage(err.response?.data?.error || 'Error fetching recipes'));
      })
      .catch(err => {
        console.error('Error deleting recipe:', err);
        setRecipeMessage(err.response?.data?.error || 'Error deleting recipe. Please try again.');
      });
  };

  const handleEditRecipe = (recipe) => {
    setEditRecipe({
      recipe_name: recipe.recipe_name,
      ingredient_list: recipe.ingredient_list,
      instructions: recipe.instructions,
      prep_time: recipe.prep_time,
      dietary: recipe.dietary,
      complexity: recipe.complexity
    });
    setNewRecipeName(recipe.recipe_name);
    setNewRecipeIngredients(recipe.ingredient_list.map(ing => ({
      value: ing.ingredient,
      label: `${ing.ingredient.replace(/\./g, ' ')} (${ingredients.find(i => i.ingredient_name === ing.ingredient)?.persian_name || ''})`
    })));
    setNewRecipeInstructions(recipe.instructions);
    setNewRecipePrepTime(recipe.prep_time);
    setNewRecipeDietary(recipe.dietary);
    setNewRecipeComplexity(recipe.complexity);
    setIngredientQuantities(
      recipe.ingredient_list.reduce((acc, ing) => ({
        ...acc,
        [ing.ingredient]: ing.quantity
      }), {})
    );
    setEditModalOpen(true);
  };

  const handleUpdateRecipe = () => {
    if (!newRecipeName || !newRecipeIngredients.length || !newRecipePrepTime) {
      setRecipeMessage('Please fill recipe name, ingredients, and prep time');
      return;
    }
    const ingredientList = newRecipeIngredients.map(opt => ({
      ingredient: opt.value,
      quantity: parseFloat(ingredientQuantities[opt.value]) || 100
    }));
    setErrorMessage('');
    axios.post(`${BASE_URL}/update_recipe`, {
      recipe_name: newRecipeName,
      ingredient_list: ingredientList,
      instructions: newRecipeInstructions,
      prep_time: parseInt(newRecipePrepTime),
      dietary: newRecipeDietary,
      complexity: newRecipeComplexity
    })
      .then(res => {
        setRecipeMessage(res.data.message);
        axios.get(`${BASE_URL}/get_recipes`)
          .then(res => {
            setAllRecipes(res.data);
            setEditModalOpen(false);
            setNewRecipeName('');
            setNewRecipeIngredients([]);
            setNewRecipeInstructions('');
            setNewRecipePrepTime('');
            setNewRecipeDietary('');
            setNewRecipeComplexity('');
            setIngredientQuantities({});
            setEditRecipe(null);
          })
          .catch(err => setErrorMessage(err.response?.data?.error || 'Error fetching recipes'));
      })
      .catch(err => {
        console.error('Error updating recipe:', err);
        setRecipeMessage(err.response?.data?.error || 'Error updating recipe. Please try again.');
      });
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
    setNewRecipeName('');
    setNewRecipeIngredients([]);
    setNewRecipeInstructions('');
    setNewRecipePrepTime('');
    setNewRecipeDietary('');
    setNewRecipeComplexity('');
    setIngredientQuantities({});
    setEditRecipe(null);
    setRecipeMessage('');
  };

  const ingredientOptions = ingredients.map(ing => ({
    value: ing.ingredient_name,
    label: `${ing.ingredient_name.replace(/\./g, ' ')} (${ing.persian_name})`
  }));

  return (
    <div className="container mt-4" style={styles.container}>
      <h1 className="mb-4 text-center" style={{ fontSize: '1.8rem' }}>Cookbook</h1>
      <div className="row mb-3 g-2">
        <div className="col-12 col-md-3">
          <label className="form-label">Max Calories:</label>
          <input
            type="number"
            min="0"
            className="form-control"
            placeholder="Enter max calories"
            value={recipeMaxCalories}
            onChange={e => setRecipeMaxCalories(e.target.value)}
            style={styles.input}
          />
        </div>
        <div className="col-12 col-md-3">
          <label className="form-label">Max Cost:</label>
          <input
            type="number"
            min="0"
            className="form-control"
            placeholder="Enter max cost"
            value={recipeMaxCost}
            onChange={e => setRecipeMaxCost(e.target.value)}
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
        <div className="col-12 col-md-3">
          <label className="form-label">Complexity:</label>
          <select
            className="form-select"
            value={complexityFilter}
            onChange={e => setComplexityFilter(e.target.value)}
            style={styles.input}
          >
            <option value="">All</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>
      <div className="row mb-3 g-2">
        <div className="col-12">
          <h3 className="mb-2" style={{ fontSize: '1.3rem' }}>Add New Recipe</h3>
          <div className="input-group mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Recipe name"
              value={newRecipeName}
              onChange={e => setNewRecipeName(e.target.value)}
              style={styles.input}
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Select Ingredients:</label>
            <Select
              isMulti
              options={ingredientOptions}
              value={newRecipeIngredients}
              onChange={setNewRecipeIngredients}
              placeholder="Search and select ingredients..."
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </div>
          {newRecipeIngredients.map(ing => (
            <div key={ing.value} className="input-group mb-2">
              <label className="form-label">{ing.label} Quantity (g):</label>
              <input
                type="number"
                min="0"
                className="form-control"
                placeholder="Quantity in grams"
                value={ingredientQuantities[ing.value] || ''}
                onChange={e => setIngredientQuantities({
                  ...ingredientQuantities,
                  [ing.value]: e.target.value
                })}
                style={styles.input}
              />
            </div>
          ))}
          <div className="input-group mb-2">
            <textarea
              className="form-control"
              placeholder="Instructions"
              value={newRecipeInstructions}
              onChange={e => setNewRecipeInstructions(e.target.value)}
              style={styles.input}
            />
          </div>
          <div className="input-group mb-2">
            <input
              type="number"
              min="0"
              className="form-control"
              placeholder="Prep time (minutes)"
              value={newRecipePrepTime}
              onChange={e => setNewRecipePrepTime(e.target.value)}
              style={styles.input}
            />
          </div>
          <div className="input-group mb-2">
            <select
              className="form-select"
              value={newRecipeDietary}
              onChange={e => setNewRecipeDietary(e.target.value)}
              style={styles.input}
            >
              <option value="">Select dietary</option>
              <option value="omnivore">Omnivore</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
            </select>
            <select
              className="form-select"
              value={newRecipeComplexity}
              onChange={e => setNewRecipeComplexity(e.target.value)}
              style={styles.input}
            >
              <option value="">Select complexity</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <button className="btn btn-outline-primary" onClick={handleAddRecipe} style={styles.button}>
            Add Recipe
          </button>
          {recipeMessage && !editModalOpen && (
            <div className={`alert ${recipeMessage.includes('Error') ? 'alert-danger' : 'alert-success'} mt-2`}>
              {recipeMessage}
            </div>
          )}
        </div>
      </div>
      <h3 className="mb-2" style={{ fontSize: '1.3rem' }}>All Recipes</h3>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Ingredients</th>
              <th>Instructions</th>
              <th>Prep Time (min)</th>
              <th>Dietary</th>
              <th>Complexity</th>
              <th>Calories</th>
              <th>Cost (T)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allRecipes.map(recipe => (
              <tr key={recipe.recipe_name}>
                <td>{recipe.recipe_name}</td>
                <td>{recipe.ingredient_list.map(ing => `${ing.ingredient} (${ing.quantity}g)`).join(', ')}</td>
                <td>{recipe.instructions}</td>
                <td>{recipe.prep_time}</td>
                <td>{recipe.dietary}</td>
                <td>{recipe.complexity}</td>
                <td>{Math.floor(recipe.total_calories)}</td>
                <td>{Math.floor(recipe.total_cost)}</td>
                <td>
                  <div className="d-flex flex-column flex-sm-row gap-2 align-items-sm-center">
                    <input
                      type="number Bose number"
                      min="0.1"
                      step="0.1"
                      className="form-control"
                      placeholder="Scale (e.g., 2)"
                      value={scaleFactor}
                      onChange={e => setScaleFactor(e.target.value)}
                      style={{ ...styles.input, width: '100px' }}
                    />
                    <button
                      className="btn btn-outline-info"
                      onClick={() => handleCalculateRecipeNutrition(recipe.ingredient_list, recipe.recipe_name)}
                      style={styles.button}
                    >
                      Calculate
                    </button>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => handleEditRecipe(recipe)}
                      style={styles.button}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => handleDeleteRecipe(recipe.recipe_name)}
                      style={styles.button}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {Object.keys(recipeNutrition).map(recipeName => (
        recipeNutrition[recipeName] && (
          <div key={recipeName} className="mt-3">
            <h4 style={{ fontSize: '1.2rem' }}>{recipeName} Nutrition (Scale: {scaleFactor}x)</h4>
            {recipeNutrition[recipeName].Cost !== undefined && (
              <div className="alert alert-info mb-2">
                <strong>Total Cost:</strong> {Math.floor(recipeNutrition[recipeName].Cost)} T
              </div>
            )}
            <ul className="list-group">
              {Object.entries(recipeNutrition[recipeName])
                .filter(([nutrient]) => nutrient !== 'Cost' && nutrient !== 'PurchaseCost' && nutrient !== 'PurchaseAmt')
                .map(([nutrient, value]) => (
                  <li key={nutrient} className="list-group-item">
                    {nutrient.replace(/([A-Z])/g, ' $1').trim()}: {Math.floor(value)}
                  </li>
                ))}
            </ul>
          </div>
        )
      ))}
      <div className={`modal fade ${editModalOpen ? 'show d-block' : ''}`} tabIndex="-1" style={{ display: editModalOpen ? 'block' : 'none' }}>
        <div className="modal-dialog" style={styles.modal}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Recipe: {editRecipe?.recipe_name}</h5>
              <button type="button" className="btn-close" onClick={handleCloseModal}></button>
            </div>
            <div className="modal-body">
              <div className="mb-2">
                <label className="form-label">Recipe Name:</label>
                <input
                  type="text"
                  className="form-control"
                  value={newRecipeName}
                  onChange={e => setNewRecipeName(e.target.value)}
                  style={styles.input}
                  disabled
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Select Ingredients:</label>
                <Select
                  isMulti
                  options={ingredientOptions}
                  value={newRecipeIngredients}
                  onChange={setNewRecipeIngredients}
                  placeholder="Search and select ingredients..."
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              </div>
              {newRecipeIngredients.map(ing => (
                <div key={ing.value} className="input-group mb-2">
                  <label className="form-label">{ing.label} Quantity (g):</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    placeholder="Quantity in grams"
                    value={ingredientQuantities[ing.value] || ''}
                    onChange={e => setIngredientQuantities({
                      ...ingredientQuantities,
                      [ing.value]: e.target.value
                    })}
                    style={styles.input}
                  />
                </div>
              ))}
              <div className="mb-2">
                <label className="form-label">Instructions:</label>
                <textarea
                  className="form-control"
                  value={newRecipeInstructions}
                  onChange={e => setNewRecipeInstructions(e.target.value)}
                  style={styles.input}
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Prep Time (minutes):</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={newRecipePrepTime}
                  onChange={e => setNewRecipePrepTime(e.target.value)}
                  style={styles.input}
                />
              </div>
              <div className="row g-2">
                <div className="col-12 col-md-6">
                  <label className="form-label">Dietary:</label>
                  <select
                    className="form-select"
                    value={newRecipeDietary}
                    onChange={e => setNewRecipeDietary(e.target.value)}
                    style={styles.input}
                  >
                    <option value="">Select dietary</option>
                    <option value="omnivore">Omnivore</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Complexity:</label>
                  <select
                    className="form-select"
                    value={newRecipeComplexity}
                    onChange={e => setNewRecipeComplexity(e.target.value)}
                    style={styles.input}
                  >
                    <option value="">Select complexity</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
              {recipeMessage && (
                <div className={`alert ${recipeMessage.includes('Error') ? 'alert-danger' : 'alert-success'} mt-2`}>
                  {recipeMessage}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCloseModal} style={styles.button}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={handleUpdateRecipe} style={styles.button}>
                Update Recipe
              </button>
            </div>
          </div>
        </div>
      </div>
      {editModalOpen && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default RecipeNotebook;