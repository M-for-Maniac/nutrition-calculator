import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import './GalleryPage.css';

const BASE_URL = 'https://maniac.pythonanywhere.com';
const WHATSAPP_NUMBER = '+989233479443';

const GalleryPage = ({ setErrorMessage }) => {
  const { t, i18n } = useTranslation();
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [dietaryFilter, setDietaryFilter] = useState('');
  const [maxCalories, setMaxCalories] = useState('');
  const [minProtein, setMinProtein] = useState('');
  const [mealPlan, setMealPlan] = useState({
    breakfast: [],
    morningSnack: [],
    lunch: [],
    afternoonSnack: [],
    dinner: [],
  });
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
          setFilteredRecipes(response.data.meal_plan);
          setMealPlan({
            breakfast: [],
            morningSnack: [],
            lunch: [],
            afternoonSnack: [],
            dinner: [],
          });
          setTotalNutrition(null);
        })
        .catch((error) => {
          console.error('Error generating meal plan:', error);
          setErrorMessage(t('cookbook.error.fetchRecipes'));
        });
    } else {
      setFilteredRecipes(recipes);
      setMealPlan({
        breakfast: [],
        morningSnack: [],
        lunch: [],
        afternoonSnack: [],
        dinner: [],
      });
      setTotalNutrition(null);
    }
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceId = source.droppableId;
    const destId = destination.droppableId;

    if (sourceId === destId && source.index === destination.index) return;

    let updatedMealPlan = { ...mealPlan };

    if (sourceId === 'recipes') {
      const recipe = filteredRecipes[source.index];
      if (Object.values(updatedMealPlan).flat().length >= 5) {
        setErrorMessage(t('gallery.mealPlanFull'));
        return;
      }
      updatedMealPlan[destId] = [...updatedMealPlan[destId], recipe];
    } else {
      const sourceRecipes = [...updatedMealPlan[sourceId]];
      const [movedRecipe] = sourceRecipes.splice(source.index, 1);
      updatedMealPlan[sourceId] = sourceRecipes;

      if (destId !== 'recipes') {
        updatedMealPlan[destId] = [...updatedMealPlan[destId], movedRecipe];
      }
    }

    setMealPlan(updatedMealPlan);

    const allRecipes = Object.values(updatedMealPlan).flat();
    if (allRecipes.length > 0) {
      const newTotal = allRecipes.reduce(
        (acc, r) => ({
          calories: acc.calories + (r.total_calories || 0),
          protein: acc.protein + (r.total_protein || 0),
        }),
        { calories: 0, protein: 0 }
      );
      setTotalNutrition(newTotal);
    } else {
      setTotalNutrition(null);
    }
  };

  const removeFromMealPlan = (category, index) => {
    const updatedMealPlan = { ...mealPlan };
    updatedMealPlan[category].splice(index, 1);
    setMealPlan(updatedMealPlan);

    const allRecipes = Object.values(updatedMealPlan).flat();
    if (allRecipes.length === 0) {
      setTotalNutrition(null);
    } else {
      const newTotal = allRecipes.reduce(
        (acc, r) => ({
          calories: acc.calories + (r.total_calories || 0),
          protein: acc.protein + (r.total_protein || 0),
        }),
        { calories: 0, protein: 0 }
      );
      setTotalNutrition(newTotal);
    }
  };

  const handleOrder = () => {
    if (!userEmail) {
      setErrorMessage(t('gallery.enterEmail'));
      return;
    }
    const allRecipes = Object.values(mealPlan).flat();
    if (allRecipes.length === 0) {
      setErrorMessage(t('gallery.noPlan'));
      return;
    }
    const orderDetails = {
      user_email: userEmail,
      meal_plan: mealPlan,
    };
    axios.post(`${BASE_URL}/order_meal`, orderDetails)
      .then((response) => {
        setErrorMessage('');
        // Format WhatsApp message
        let message = `New Order: ${response.data.order_id}\nEmail: ${userEmail}\n\nMeal Plan:\n`;
        Object.entries(mealPlan).forEach(([category, recipes]) => {
          if (recipes.length > 0) {
            message += `${t(`gallery.mealCategories.${category}`)}:\n`;
            recipes.forEach((recipe) => {
              message += `- ${recipe.recipe_name} (${recipe.total_calories} kcal, ${recipe.total_protein}g protein)\n`;
            });
          }
        });
        if (totalNutrition) {
          message += `\nTotal Nutrition: ${totalNutrition.calories} kcal, ${totalNutrition.protein}g protein`;
        }
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');

        // Reset form
        setMealPlan({
          breakfast: [],
          morningSnack: [],
          lunch: [],
          afternoonSnack: [],
          dinner: [],
        });
        setTotalNutrition(null);
        setUserEmail('');
        alert(t('gallery.orderSuccess', { orderId: response.data.order_id }));
      })
      .catch((error) => {
        console.error('Error placing order:', error);
        setErrorMessage(t('gallery.orderError'));
      });
  };

  const mealCategories = [
    { id: 'breakfast', label: t('gallery.mealCategories.breakfast') },
    { id: 'morningSnack', label: t('gallery.mealCategories.morningSnack') },
    { id: 'lunch', label: t('gallery.mealCategories.lunch') },
    { id: 'afternoonSnack', label: t('gallery.mealCategories.afternoonSnack') },
    { id: 'dinner', label: t('gallery.mealCategories.dinner') },
  ];

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
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="recipe-gallery">
          <h2>{t('gallery.availableRecipes')}</h2>
          <Droppable droppableId="recipes">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="recipe-grid">
                {filteredRecipes.map((recipe, index) => (
                  <Draggable key={recipe.recipe_name} draggableId={recipe.recipe_name} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="recipe-card"
                      >
                        <img
                          src={recipe.image || '/images/placeholder.jpg'}
                          alt={recipe.recipe_name}
                          className="recipe-image"
                        />
                        <h3>{recipe.recipe_name}</h3>
                        <p>{t('gallery.dietary')}: {t(`gallery.dietaryOptions.${recipe.dietary}`)}</p>
                        <p>{t('gallery.calories')}: {recipe.total_calories} kcal</p>
                        <p>{t('gallery.protein')}: {recipe.total_protein}g</p> {/* Added */}
                        <p>{t('gallery.prepTime')}: {recipe.prep_time} {t('kitchen.minutes')}</p>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
        <div className="meal-planner">
          <h2>{t('gallery.mealPlan')}</h2>
          {Object.values(mealPlan).flat().length === 0 ? (
            <p>{t('gallery.noPlan')}</p>
          ) : (
            <>
              {mealCategories.map((category) => (
                <Droppable key={category.id} droppableId={category.id}>
                  {(provided) => (
                    <div className="meal-category">
                      <h3>{category.label}</h3>
                      <div {...provided.droppableProps} ref={provided.innerRef} className="meal-drop-area">
                        {mealPlan[category.id].map((recipe, index) => (
                          <Draggable key={`${category.id}-${recipe.recipe_name}`} draggableId={`${category.id}-${recipe.recipe_name}`} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="meal-item"
                              >
                                {recipe.recipe_name} ({recipe.total_protein}g protein) {/* Added protein */}
                                <button
                                  className="btn btn-danger"
                                  onClick={() => removeFromMealPlan(category.id, index)}
                                >
                                  {t('gallery.remove')}
                                </button>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
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
              <button className="btn btn-primary-custom order-button" onClick={handleOrder}>
                {t('gallery.orderPlan')}
              </button>
            </>
          )}
        </div>
      </DragDropContext>
    </div>
  );
};

export default GalleryPage;