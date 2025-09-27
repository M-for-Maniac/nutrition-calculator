import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import './GalleryPage.css';

const BASE_URL = 'https://maniac.pythonanywhere.com';

const GalleryPage = ({ setErrorMessage }) => {
  const { t, i18n } = useTranslation();
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [dietaryFilter, setDietaryFilter] = useState('');
  const [maxCalories, setMaxCalories] = useState('');
  const [minProtein, setMinProtein] = useState('');
  const [mealPlan, setMealPlan] = useState([]);
  const [totalNutrition, setTotalNutrition] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    axios.get(`${BASE_URL}/get_recipes`)
      .then((response) => {
        setRecipes(response.data);
        setFilteredRecipes(response.data);
      })
      .catch((error) => {
        console.error('Error loading recipes:', error);
        setErrorMessage(t('cookbook.error.fetchRecipes'));
      });
  }, [setErrorMessage, t]);

  const handleFilter = () => {
    if (dietaryFilter || maxCalories || minProtein) {
      axios.post(`${BASE_URL}/generate_meal_plan`, {
        dietary: dietaryFilter,
        max_calories: parseInt(maxCalories) || 2000,
        min_protein: parseInt(minProtein) || 0,
      })
        .then((response) => {
          setMealPlan(response.data.meal_plan);
          setTotalNutrition(response.data.total_nutrition);
          setFilteredRecipes(response.data.meal_plan);
        })
        .catch((error) => {
          console.error('Error generating meal plan:', error);
          setErrorMessage(t('cookbook.error.fetchRecipes'));
        });
    } else {
      setFilteredRecipes(recipes);
      setMealPlan([]);
      setTotalNutrition(null);
    }
  };

  const handleOrder = () => {
    if (!userEmail) {
      setErrorMessage(t('gallery.enterEmail'));
      return;
    }
    if (mealPlan.length === 0) {
      setErrorMessage(t('gallery.noPlan'));
      return;
    }
    axios.post(`${BASE_URL}/order_meal`, {
      recipes: mealPlan,
      user_email: userEmail,
    })
      .then((response) => {
        setErrorMessage('');
        alert(t('gallery.orderSuccess', { orderId: response.data.order_id }));
        setMealPlan([]);
        setTotalNutrition(null);
        setUserEmail('');
      })
      .catch((error) => {
        console.error('Error placing order:', error);
        setErrorMessage(t('gallery.enterEmail'));
      });
  };

  const addToMealPlan = (recipe) => {
    if (mealPlan.length < 5) {
      setMealPlan([...mealPlan, recipe]);
      const newTotal = mealPlan.reduce(
        (acc, r) => ({
          calories: acc.calories + (r.total_calories || 0),
          protein: acc.protein + (r.total_protein || 0),
        }),
        { calories: recipe.total_calories || 0, protein: recipe.total_protein || 0 }
      );
      setTotalNutrition(newTotal);
    } else {
      setErrorMessage(t('gallery.mealPlanFull'));
    }
  };

  const removeFromMealPlan = (index) => {
    const newMealPlan = mealPlan.filter((_, i) => i !== index);
    setMealPlan(newMealPlan);
    if (newMealPlan.length === 0) {
      setTotalNutrition(null);
    } else {
      const newTotal = newMealPlan.reduce(
        (acc, r) => ({
          calories: acc.calories + (r.total_calories || 0),
          protein: acc.protein + (r.total_protein || 0),
        }),
        { calories: 0, protein: 0 }
      );
      setTotalNutrition(newTotal);
    }
  };

  return (
    <div className="gallery-page" dir={i18n.language === 'fa' ? 'rtl' : 'ltr'}>
      <div className="hero-section">
        <h1>{t('gallery.title')}</h1>
        <p>{t('gallery.subtitle')}</p>
      </div>
      <div className="filters">
        <select onChange={(e) => setDietaryFilter(e.target.value)} value={dietaryFilter} className="form-control">
          <option value="">{t('gallery.allDiets')}</option>
          <option value="vegan">{t('gallery.dietaryOptions.vegan')}</option>
          <option value="vegetarian">{t('gallery.dietaryOptions.vegetarian')}</option>
          <option value="omnivore">{t('gallery.dietaryOptions.omnivore')}</option>
          <option value="gluten_free">{t('gallery.dietaryOptions.gluten_free')}</option>
        </select>
        <input
          type="number"
          placeholder={t('gallery.maxCalories')}
          value={maxCalories}
          onChange={(e) => setMaxCalories(e.target.value)}
          className="form-control"
        />
        <input
          type="number"
          placeholder={t('gallery.minProtein')}
          value={minProtein}
          onChange={(e) => setMinProtein(e.target.value)}
          className="form-control"
        />
        <button className="btn btn-primary-custom" onClick={handleFilter}>{t('gallery.applyFilters')}</button>
      </div>
      <div className="recipe-gallery">
        {filteredRecipes.map((recipe) => (
          <div key={recipe.recipe_name} className="recipe-card">
            <img
              src={recipe.image || '/images/placeholder.jpg'}
              alt={recipe.recipe_name}
              className="recipe-image"
            />
            <h3>{recipe.recipe_name}</h3>
            <p>{t('gallery.dietary')}: {t(`gallery.dietaryOptions.${recipe.dietary}`)}</p>
            <p>{t('gallery.calories')}: {recipe.total_calories} kcal</p>
            <p>{t('gallery.prepTime')}: {recipe.prep_time} {t('kitchen.minutes')}</p>
            <button className="btn btn-primary-custom" onClick={() => addToMealPlan(recipe)}>{t('gallery.addToPlan')}</button>
          </div>
        ))}
      </div>
      <div className="meal-planner">
        <h2>{t('gallery.mealPlan')}</h2>
        {mealPlan.length > 0 ? (
          <>
            <ul>
              {mealPlan.map((recipe, index) => (
                <li key={index}>
                  {recipe.recipe_name}
                  <button className="btn btn-danger" onClick={() => removeFromMealPlan(index)}>{t('gallery.remove')}</button>
                </li>
              ))}
            </ul>
            {totalNutrition && (
              <p>
                {t('gallery.totalNutrition')}: {totalNutrition.calories} kcal, {totalNutrition.protein}g {t('kitchen.protein')}
              </p>
            )}
            <input
              type="email"
              placeholder={t('gallery.emailPlaceholder')}
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="form-control"
            />
            <button className="btn btn-primary-custom order-button" onClick={handleOrder}>{t('gallery.orderPlan')}</button>
          </>
        ) : (
          <p>{t('gallery.noPlan')}</p>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;