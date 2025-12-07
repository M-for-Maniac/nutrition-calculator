import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import './GalleryPage.css';

const BASE_URL = 'https://maniac.pythonanywhere.com';
const WHATSAPP_NUMBER = '989233479443';

const GalleryPage = ({ setErrorMessage }) => {
  const { t, i18n } = useTranslation();
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [dietaryFilter, setDietaryFilter] = useState('');
  const [mealPlan, setMealPlan] = useState({
    breakfast: [],
    morningSnack: [],
    lunch: [],
    afternoonSnack: [],
    dinner: [],
  });
  const [totalNutrition, setTotalNutrition] = useState(null);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [selectCategory, setSelectCategory] = useState('');
  const [ingredientTranslations, setIngredientTranslations] = useState({});
  const [recipeTranslations, setRecipeTranslations] = useState({});
  const [userName, setUserName] = useState('');
  const [orderSuccess, setOrderSuccess] = useState('');
  const [errorMessage, setLocalErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userPhone, setUserPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [tagFilter, setTagFilter] = useState(''); // 'high-protein' | 'low-calorie' | 'special' | ''

  // HELPER: Always use correct per-serving cost with 20% benefit
  const getPerServingCost = (recipe) => {
    if (recipe.per_serving_cost !== undefined && recipe.per_serving_cost > 0) {
      return recipe.per_serving_cost;
    }
    const totalCost = recipe.total_cost || 0;
    const servings = recipe.servings || 1;
    return Math.ceil((totalCost / servings) * 1.2 / 1000) * 1000;
  };

  // HELPER: Format price (round to nearest 1000)
  const formatPrice = (cost) => Math.ceil((cost || 0) / 1000) * 1000;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const recipeResponse = await axios.get(`${BASE_URL}/get_recipes`, {
          params: {
            dietary: dietaryFilter,
            complexity: '',
            max_cost: undefined,
            currency: 'Toman',
          },
        });
        const enrichedRecipes = recipeResponse.data.map((recipe) => ({
          ...recipe,
          image: recipe.image || '/nutrition-calculator/images/placeholder.jpg',
          thumbnails: recipe.thumbnails || [
            '/nutrition-calculator/images/thumbnails/placeholder-1.jpg',
            '/nutrition-calculator/images/thumbnails/placeholder-2.jpg',
            '/nutrition-calculator/images/thumbnails/placeholder-3.jpg',
          ],
          total_calories: recipe.total_calories || 0,
          total_protein: recipe.total_protein || 0,
          total_cost: recipe.total_cost || 0,
          per_serving_calories: recipe.per_serving_calories || (recipe.total_calories && recipe.servings ? recipe.total_calories / recipe.servings : 0),
          per_serving_protein: recipe.per_serving_protein || (recipe.total_protein && recipe.servings ? recipe.total_protein / recipe.servings : 0),
          per_serving_cost: recipe.per_serving_cost || (recipe.total_cost && recipe.servings ? (recipe.total_cost / recipe.servings) * 1.2 : 0),
          servings: recipe.servings || 1,
        }));
        setRecipes(enrichedRecipes);
        setFilteredRecipes(enrichedRecipes);

        const translationResponse = await axios.get(`${BASE_URL}/get_ingredient_translations`);
        setIngredientTranslations(translationResponse.data);

        try {
          const recipeTransRes = await axios.get(`${BASE_URL}/get_recipe_translations`);
          setRecipeTranslations(recipeTransRes.data);
        } catch (err) {
          console.warn('Recipe translations endpoint not available. Using English.');
          setRecipeTranslations({});
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setLocalErrorMessage(t('centralPerk.error.fetchRecipes'));
        setErrorMessage(t('centralPerk.error.fetchRecipes'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [dietaryFilter, setErrorMessage, t, i18n.language]);

  const handleFilter = () => {
    let filtered = [...recipes];

    // Dietary filter
    if (dietaryFilter) {
      filtered = filtered.filter(r => r.dietary.toLowerCase() === dietaryFilter.toLowerCase());
    }

    // Tag filter (client-side only
    if (tagFilter) {
      if (tagFilter === 'high-protein') {
        filtered = filtered.filter(r => (r.per_serving_protein || 0) > 20);
      } else if (tagFilter === 'low-calorie') {
        filtered = filtered.filter(r => (r.per_serving_calories || 0) < 300);
      } else if (tagFilter === 'special') {
        filtered = filtered.filter(r => r.is_special === true); // we'll add this field
      }
    }

    setFilteredRecipes(filtered);
  };

  const updateTotalNutrition = (updatedMealPlan) => {
    const allRecipes = Object.values(updatedMealPlan).flat();
    if (allRecipes.length > 0) {
      const newTotal = allRecipes.reduce(
        (acc, r) => ({
          calories: acc.calories + (r.per_serving_calories || 0),
          protein: acc.protein + (r.per_serving_protein || 0),
          cost: acc.cost + formatPrice(getPerServingCost(r)),
        }),
        { calories: 0, protein: 0, cost: 0 }
      );
      setTotalNutrition(newTotal);
    } else {
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
        setLocalErrorMessage(t('centralPerk.mealPlanFull'));
        setErrorMessage(t('centralPerk.mealPlanFull'));
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
    updateTotalNutrition(updatedMealPlan);
  };

  const handleSelectForMealPlan = (recipe) => {
    if (!selectCategory) {
      setLocalErrorMessage(t('centralPerk.selectCategory'));
      setErrorMessage(t('centralPerk.selectCategory'));
      return;
    }
    if (Object.values(mealPlan).flat().length >= 5) {
      setLocalErrorMessage(t('centralPerk.mealPlanFull'));
      setErrorMessage(t('centralPerk.mealPlanFull'));
      return;
    }
    const updatedMealPlan = { ...mealPlan };
    updatedMealPlan[selectCategory] = [...updatedMealPlan[selectCategory], recipe];
    setMealPlan(updatedMealPlan);
    updateTotalNutrition(updatedMealPlan);
    setSelectCategory('');
  };

  const removeFromMealPlan = (category, index) => {
    const updatedMealPlan = { ...mealPlan };
    updatedMealPlan[category].splice(index, 1);
    setMealPlan(updatedMealPlan);
    updateTotalNutrition(updatedMealPlan);
  };

  // Translation helpers
  const getPersianText = (englishText, recipeName) => {
    if (i18n.language !== 'fa') return englishText;
    const key = recipeName || englishText;
    return recipeTranslations[key]?.fa || englishText;
  };

  const getPersianInstructions = (englishInstructions, recipeName) => {
    if (i18n.language !== 'fa') return englishInstructions;
    return recipeTranslations[recipeName]?.instructions_fa || englishInstructions || t('centralPerk.noInstructions');
  };

  const handleOrder = async () => {
    if (!userName.trim()) {
      setLocalErrorMessage(t('centralPerk.enterName'));
      setErrorMessage(t('centralPerk.enterName'));
      return;
    }
    if (!selectedDay) {
      setLocalErrorMessage(t('centralPerk.selectDay'));
      setErrorMessage(t('centralPerk.selectDay'));
      return;
    }
    const allRecipes = Object.values(mealPlan).flat();
    if (allRecipes.length === 0) {
      setLocalErrorMessage(t('centralPerk.noPlan'));
      setErrorMessage(t('centralPerk.noPlan'));
      return;
    }
    const orderDetails = {
      user_name: userName.trim(),
      selected_day: selectedDay,
      meal_plan: Object.keys(mealPlan).reduce((acc, key) => {
        acc[key] = mealPlan[key].map((recipe) => ({
          recipe_name: getPersianText(recipe.recipe_name, recipe.recipe_name),
          total_calories: recipe.total_calories || 0,
          total_protein: recipe.total_protein || 0,
          total_cost: recipe.total_cost || 0,
          per_serving_calories: recipe.per_serving_calories || 0,
          per_serving_protein: recipe.per_serving_protein || 0,
          per_serving_cost: getPerServingCost(recipe),
          dietary: recipe.dietary,
          prep_time: recipe.prep_time,
          servings: recipe.servings || 1,
          ingredient_list: recipe.ingredient_list,
          instructions: recipe.instructions,
          image: recipe.image,
          thumbnails: recipe.thumbnails,
        }));
        return acc;
      }, {}),
    };
    try {
      const response = await axios.post(`${BASE_URL}/order_meal`, orderDetails, {
        headers: { 'Content-Type': 'application/json' },
      });
      setLocalErrorMessage('');
      setErrorMessage('');
      const orderId = response.data.order_id;
      let message = `سفارش جدید از نوترینو!\n\n` +
      `نام: ${userName.trim()}\n` +
      `شماره تماس: ${userPhone || 'وارد نشده'}\n` +
      `آدرس تحویل: ${deliveryAddress.trim() || 'وارد نشده'}\n` +
      `روز تحویل: ${t(`centralPerk.days.${selectedDay}`)}\n\n` +
      `برنامه غذایی:\n`;
      Object.entries(mealPlan).forEach(([category, recipes]) => {
        if (recipes.length > 0) {
          message += `${t(`centralPerk.mealCategories.${category}`)}:\n`;
          recipes.forEach((recipe) => {
            const persianName = getPersianText(recipe.recipe_name, recipe.recipe_name);
            message += `- ${persianName} (${t('centralPerk.units.kcalPerServing')} ${(recipe.per_serving_calories || 0).toFixed(2)}, ${t('centralPerk.units.proteinPerServing')} ${(recipe.per_serving_protein || 0).toFixed(2)}${t('kitchen.grams')}, ${t('centralPerk.units.tomanPerServing')} ${formatPrice(getPerServingCost(recipe))})\n`;
          });
        }
      });
      if (totalNutrition) {
        message += `\n${t('centralPerk.totalNutrition')}: ${t('centralPerk.units.kcalPerServing')} ${totalNutrition.calories.toFixed(2)}, ${t('centralPerk.units.proteinPerServing')} ${totalNutrition.protein.toFixed(2)}${t('kitchen.grams')}, ${t('centralPerk.units.tomanPerServing')} ${formatPrice(totalNutrition.cost)}`;
      }
      const encodedMessage = encodeURIComponent(message);
      // Use user's phone if valid, otherwise fall back to your number
      // Always send to YOUR number — user info is in the message
      const phoneToUse = WHATSAPP_NUMBER;
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneToUse}&text=${encodedMessage}`;
      const newWindow = window.open(whatsappUrl, '_blank');
      if (!newWindow) {
        setLocalErrorMessage(t('centralPerk.error.popupBlocked').replace('{url}', whatsappUrl));
        setErrorMessage(t('centralPerk.error.popupBlocked').replace('{url}', whatsappUrl));
        alert(t('centralPerk.error.popupBlocked') + '\n' + t('centralPerk.openManually', { url: whatsappUrl }));
      } else {
        setOrderSuccess(t('centralPerk.orderSuccess').replace('{orderId}', orderId));
        setMealPlan({
          breakfast: [],
          morningSnack: [],
          lunch: [],
          afternoonSnack: [],
          dinner: [],
        });
        setTotalNutrition(null);
        setSelectedDay('');
        setUserName('');
      }
    } catch (error) {
      console.error('Error placing order:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.error
        ? t('centralPerk.orderError') + `: ${error.response.data.error}`
        : t('centralPerk.orderError') + `: ${error.message}`;
      setLocalErrorMessage(errorMsg);
      setErrorMessage(errorMsg);
    }
  };

  const openModal = (recipe) => {
    console.log('Opening recipe modal for:', recipe.recipe_name);
    setSelectedRecipe(recipe);
    setMainImage(recipe.image || '/nutrition-calculator/images/placeholder.jpg');
  };

  const closeModal = () => {
    setSelectedRecipe(null);
    setMainImage('');
    setSelectCategory('');
  };

  const mealCategories = [
    { id: 'breakfast', label: t('centralPerk.mealCategories.breakfast') },
    { id: 'morningSnack', label: t('centralPerk.mealCategories.morningSnack') },
    { id: 'lunch', label: t('centralPerk.mealCategories.lunch') },
    { id: 'afternoonSnack', label: t('centralPerk.mealCategories.afternoonSnack') },
    { id: 'dinner', label: t('centralPerk.mealCategories.dinner') },
  ];

  const daysOfWeek = [
    { id: 'monday', label: t('centralPerk.days.monday') },
    { id: 'tuesday', label: t('centralPerk.days.tuesday') },
    { id: 'wednesday', label: t('centralPerk.days.wednesday') },
    { id: 'thursday', label: t('centralPerk.days.thursday') },
    { id: 'friday', label: t('centralPerk.days.friday') },
    { id: 'saturday', label: t('centralPerk.days.saturday') },
    { id: 'sunday', label: t('centralPerk.days.sunday') },
  ];

  return (
    <div className="central-perk-page" dir={i18n.language === 'fa' ? 'rtl' : 'ltr'}>
      <div className="intro-section-final text-center py-5 px-4">
        <h1 className="display-5 fw-bold mb-3">{t('centralPerk.intro.title')}</h1>
        <p className="lead mb-5">{t('centralPerk.intro.subtitle')}</p>

        {/* How It Works */}
        <div className="how-it-works-card bg-white rounded-4 shadow-sm p-4 mb-5 mx-auto" style={{ maxWidth: '500px' }}>
          <h5 className="fw-bold mb-3">{t('centralPerk.howItWorks.title')}</h5>
          <ol className={`text-${i18n.language === 'fa' ? 'end' : 'start'} mb-0`} style={{ lineHeight: '2' }}>
            {t('centralPerk.howItWorks.steps', { returnObjects: true }).map((step, i) => (
              <li key={i} className="mb-2">{step}</li>
            ))}
          </ol>
        </div>

        {/* Delivery Times */}
        <div className="delivery-schedule bg-gradient rounded-4 p-4 text-white mb-5" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h5 className="fw-bold mb-3">{t('centralPerk.delivery.title')}</h5>
          <div className={`text-${i18n.language === 'fa' ? 'end' : 'start'}`}>
            {t('centralPerk.delivery.times', { returnObjects: true }).map((time, i) => (
              <div key={i} className="d-flex justify-content-between mb-1">
                <span>{time.meal}</span>
                <strong>{time.time}</strong>
              </div>
            ))}
          </div>
        </div>

        <button
          className="btn btn-success btn-lg px-5 py-3 rounded-pill shadow"
          onClick={() => window.scrollTo({ top: document.querySelector('.filters-modern').offsetTop - 100, behavior: 'smooth' })}
        >
          {t('centralPerk.intro.cta')}
        </button>
      </div>
      {/* ------------------------- Filters ------------------------- */}
      <div className="filters-modern container my-5">
        <div className="bg-white rounded-4 shadow p-4">
          <h5 className="text-center fw-bold text-success mb-4">
            {t('centralPerk.filter.title')}
          </h5>

          {/* Dietary Filter - Icon Buttons */}
          <div className="dietary-filters mb-4">
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <button
                className={`diet-btn ${dietaryFilter === '' ? 'active' : ''}`}
                onClick={() => setDietaryFilter('')}
              >
                <i className="fas fa-utensils"></i> {t('centralPerk.allDiets')}
              </button>
              <button
                className={`diet-btn vegan ${dietaryFilter === 'vegan' ? 'active' : ''}`}
                onClick={() => setDietaryFilter('vegan')}
              >
                <i className="fas fa-leaf"></i> {t('centralPerk.dietaryOptions.vegan')}
              </button>
              <button
                className={`diet-btn vegetarian ${dietaryFilter === 'vegetarian' ? 'active' : ''}`}
                onClick={() => setDietaryFilter('vegetarian')}
              >
                <i className="fas fa-seedling"></i> {t('centralPerk.dietaryOptions.vegetarian')}
              </button>
              <button
                className={`diet-btn omnivore ${dietaryFilter === 'omnivore' ? 'active' : ''}`}
                onClick={() => setDietaryFilter('omnivore')}
              >
                <i className="fas fa-drumstick-bite"></i> {t('centralPerk.dietaryOptions.omnivore')}
              </button>
              <button
                className={`diet-btn gluten-free ${dietaryFilter === 'gluten-free' ? 'active' : ''}`}
                onClick={() => setDietaryFilter('gluten-free')}
              >
                <i className="fas fa-ban"></i> {t('centralPerk.dietaryOptions.glutenFree')}
              </button>
            </div>
          </div>

          {/* Tag Filter - Fully Translated */}
          <div className="tag-filters mt-4">
            <div className="d-flex flex-wrap justify-content-center gap-3">
              {/* <button
                className={`tag-btn ${tagFilter === '' ? 'active' : ''}`}
                onClick={() => { setTagFilter(''); handleFilter(); }}
              >
                {t('centralPerk.filter.allTags')}
              </button> */}
              <button
                className={`tag-btn high-protein ${tagFilter === 'high-protein' ? 'active' : ''}`}
                onClick={() => { setTagFilter('high-protein'); handleFilter(); }}
              >
                {t('centralPerk.tags.high-protein')}
              </button>
              <button
                className={`tag-btn low-calorie ${tagFilter === 'low-calorie' ? 'active' : ''}`}
                onClick={() => { setTagFilter('low-calorie'); handleFilter(); }}
              >
                {t('centralPerk.tags.low-calorie')}
              </button>
              <button
                className={`tag-btn special ${tagFilter === 'special' ? 'active' : ''}`}
                onClick={() => { setTagFilter('special'); handleFilter(); }}
              >
                {t('centralPerk.tags.special')}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* ------------------------- Meal Planner ------------------------- */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="recipe-gallery">
          <h2>{t('centralPerk.availableRecipes')}</h2>
          {isLoading ? (
            <p>{t('centralPerk.loading')}</p>
          ) : filteredRecipes.length === 0 ? (
            <p>{t('centralPerk.noRecipesFound')}</p>
          ) : (
            <Droppable droppableId="recipes">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="recipe-grid">
                  {filteredRecipes.map((recipe, index) => {
                    const tags = [];
                    if ((recipe.per_serving_protein || 0) > 20) tags.push('high-protein');
                    if ((recipe.per_serving_calories || 0) < 300) tags.push('low-calorie');
                    if (recipe.is_special) tags.push('special'); // ← NEW
                    return (
                      <Draggable key={recipe.recipe_name} draggableId={recipe.recipe_name} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`recipe-card dietary-${recipe.dietary.toLowerCase()} ${snapshot.isDragging ? 'dragging' : ''}`}
                          >
                            <div className="recipe-tags">
                              {tags.map((tag) => (
                                <span
                                  key={tag}
                                  className={`tag tag-${tag}`}
                                  title={t(`centralPerk.tags.${tag}`)}
                                >
                                  <i className={`fas ${
                                    tag === 'high-protein' ? 'fa-dumbbell' :
                                    tag === 'low-calorie' ? 'fa-fire' :
                                    'fa-crown text-warning'
                                  }`}></i>
                                </span>
                              ))}
                            </div>
                            <img
                              src={recipe.image}
                              alt={recipe.recipe_name}
                              className="recipe-image"
                              onClick={() => openModal(recipe)}
                            />
                            <h3>{getPersianText(recipe.recipe_name, recipe.recipe_name)}</h3>
                            <p>{t('centralPerk.dietary')}: {t(`centralPerk.dietaryOptions.${recipe.dietary}`)}</p>
                            <p>
                              {t('centralPerk.units.kcalPerServing')} {(recipe.per_serving_calories || 0).toFixed(2)}
                            </p>
                            <p>
                              {t('centralPerk.units.proteinPerServing')} {(recipe.per_serving_protein || 0).toFixed(2)}{t('kitchen.grams')}
                            </p>
                            <p>
                              {t('centralPerk.units.tomanPerServing')} {formatPrice(getPerServingCost(recipe))}
                            </p>
                            <p>{t('centralPerk.prepTime')}: {recipe.prep_time} {t('kitchen.minutes')}</p>
                            <p>{t('centralPerk.servings')}: {recipe.servings || 1}</p>
                            <div className="recipe-actions">
                              <button className="btn btn-info-custom" onClick={() => openModal(recipe)}>
                                {t('centralPerk.viewDetails')}
                              </button>
                              <div className="select-meal-plan">
                                <select
                                  value={selectCategory}
                                  onChange={(e) => setSelectCategory(e.target.value)}
                                  className="form-control"
                                >
                                  <option value="">{t('centralPerk.selectCategory')}</option>
                                  {mealCategories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                      {cat.label}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  className="btn btn-primary-custom"
                                  onClick={() => handleSelectForMealPlan(recipe)}
                                  disabled={!selectCategory}
                                >
                                  {t('centralPerk.addToPlan')}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          )}
        </div>
        <div className="meal-planner">
          <h2>{t('centralPerk.mealPlan')}</h2>
          <div className="meal-categories">
            {mealCategories.map((category) => (
              <Droppable key={category.id} droppableId={category.id}>
                {(provided, snapshot) => (
                  <div className="meal-category">
                    <h3>{category.label}</h3>
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`meal-drop-area ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                    >
                      {mealPlan[category.id].length === 0 ? (
                        <div className="drop-placeholder">
                          <i className="fas fa-utensils"></i>
                          <p>{t('centralPerk.dropHere', { category: category.label })}</p>
                        </div>
                      ) : (
                        mealPlan[category.id].map((recipe, index) => (
                          <Draggable
                            key={`${category.id}-${recipe.recipe_name}`}
                            draggableId={`${category.id}-${recipe.recipe_name}`}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="meal-item"
                              >
                                {getPersianText(recipe.recipe_name, recipe.recipe_name)} (
                                {t('centralPerk.units.kcalPerServing')} {(recipe.per_serving_calories || 0).toFixed(0)},{' '}
                                {t('centralPerk.units.proteinPerServing')} {(recipe.per_serving_protein || 0).toFixed(1)}{t('kitchen.grams')},{' '}
                                {t('centralPerk.units.tomanPerServing')} {formatPrice(getPerServingCost(recipe))})
                                <button
                                  className="btn btn-danger"
                                  onClick={() => removeFromMealPlan(category.id, index)}
                                >
                                  {t('centralPerk.remove')}
                                </button>
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
          {totalNutrition && (
            <p className="total-nutrition">
              <strong>
                {t('centralPerk.totalNutrition')}:{' '}
                {totalNutrition.calories.toFixed(0)} {t('centralPerk.units.kcal')} |{' '}
                {totalNutrition.protein.toFixed(1)} {t('kitchen.grams')} {t('centralPerk.units.protein')} |{' '}
                {formatPrice(totalNutrition.cost)} {t('centralPerk.units.toman')}
              </strong>
            </p>
          )}
        </div>
        {/* ------------------------- Order Section ------------------------- */}
        <div className="order-section-final container my-5 p-4 bg-white rounded-4 shadow-lg border border-success">
          <h2 className="h4 fw-bold text-center mb-4 text-success">{t('centralPerk.order.title')}</h2>

          <div className="row g-3">
            <div className="col-12">
              <input
                type="text"
                className="form-control form-control-lg text-center"
                placeholder={t('centralPerk.order.namePlaceholder')}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="col-12">
              <input
                type="tel"
                className="form-control form-control-lg text-center"
                placeholder={t('centralPerk.order.phonePlaceholder')}
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value.replace(/[^0-9]/g, ''))}
                maxLength="11"
                dir="ltr"
              />
            </div>
            <div className="col-12">
              <textarea
                className="form-control form-control-lg text-center"
                rows="2"
                placeholder={t('centralPerk.order.addressPlaceholder', 'آدرس دقیق تحویل')}
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
              />
            </div>
            <div className="col-12">
              <select className="form-select form-select-lg text-center" value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
                <option value="">{t('centralPerk.order.selectDay')}</option>
                {daysOfWeek.map(day => (
                  <option key={day.id} value={day.id}>{day.label}</option>
                ))}
              </select>
            </div>
          </div>

          {totalNutrition && (
            <div className="alert alert-success text-center mt-4 py-3 fs-5 fw-bold">
              {t('centralPerk.order.total')}: {formatPrice(totalNutrition.cost)} {t('centralPerk.units.toman')}
            </div>
          )}

          <button 
            className="btn btn-success btn-lg w-100 mt-4 py-3 rounded-pill shadow-lg"
            onClick={handleOrder}
          >
            {t('centralPerk.order.button')}
          </button>

          {orderSuccess && <div className="alert alert-success mt-4 text-center">{orderSuccess}</div>}
          {errorMessage && <div className="alert alert-danger mt-4 text-center">{errorMessage}</div>}
        </div>
      </DragDropContext>

      {selectedRecipe && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content recipe-book-modal">
              <div className="modal-header">
                <h5 className="modal-title">
                  {getPersianText(selectedRecipe.recipe_name, selectedRecipe.recipe_name)}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <div className="recipe-image-gallery">
                  <img src={mainImage} alt={selectedRecipe.recipe_name} className="recipe-main-image" />
                  <div className="thumbnail-gallery">
                    {(selectedRecipe.thumbnails || [mainImage]).map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className={`thumbnail ${mainImage === img ? 'active' : ''}`}
                        onClick={() => setMainImage(img)}
                      />
                    ))}
                  </div>
                </div>
                <p><strong>{t('centralPerk.dietary')}:</strong> {t(`centralPerk.dietaryOptions.${selectedRecipe.dietary}`)}</p>
                <p>
                  <strong>{t('centralPerk.calories')}:</strong> {t('centralPerk.units.kcalPerServing')} {(selectedRecipe.per_serving_calories || 0).toFixed(2)}
                </p>
                <p>
                  <strong>{t('centralPerk.protein')}:</strong> {t('centralPerk.units.proteinPerServing')} {(selectedRecipe.per_serving_protein || 0).toFixed(2)}{t('kitchen.grams')}
                </p>
                <p>
                  <strong>{t('centralPerk.cost')}:</strong> {t('centralPerk.units.tomanPerServing')} {formatPrice(getPerServingCost(selectedRecipe))}
                </p>
                <p><strong>{t('centralPerk.prepTime')}:</strong> {selectedRecipe.prep_time} {t('kitchen.minutes')}</p>
                <p><strong>{t('centralPerk.servings')}:</strong> {selectedRecipe.servings || 1}</p>
                <h6>{t('centralPerk.ingredients')}</h6>
                <ul>
                  {selectedRecipe.ingredient_list?.map((ing, idx) => (
                    <li key={idx}>
                      {i18n.language === 'fa'
                        ? (ingredientTranslations[ing.ingredient] || ing.ingredient)
                        : ing.ingredient
                      }: {ing.quantity}g
                    </li>
                  ))}
                </ul>
                <h6>{t('centralPerk.instructions')}</h6>
                <p>{getPersianInstructions(selectedRecipe.instructions, selectedRecipe.recipe_name)}</p>
                <div className="select-meal-plan">
                  <select
                    value={selectCategory}
                    onChange={(e) => setSelectCategory(e.target.value)}
                    className="form-control"
                  >
                    <option value="">{t('centralPerk.selectCategory')}</option>
                    {mealCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  <button
                    className="btn btn-primary-custom"
                    onClick={() => handleSelectForMealPlan(selectedRecipe)}
                    disabled={!selectCategory}
                  >
                    {t('centralPerk.addToPlan')}
                  </button>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  {t('centralPerk.close')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;