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
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [selectCategory, setSelectCategory] = useState('');
  const [ingredientTranslations, setIngredientTranslations] = useState({});
  const [userName, setUserName] = useState('');
  const [orderSuccess, setOrderSuccess] = useState('');
  const [errorMessage, setLocalErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const recipeResponse = await axios.get(`${BASE_URL}/get_recipes`, {
          params: {
            dietary: dietaryFilter,
            complexity: '',
            max_calories: maxCalories || undefined,
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
      } catch (error) {
        console.error('Error loading data:', error);
        setLocalErrorMessage(t('centralPerk.error.fetchRecipes'));
        setErrorMessage(t('centralPerk.error.fetchRecipes'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [dietaryFilter, maxCalories, minProtein, setErrorMessage, t]);

  const handleFilter = () => {
    let filtered = [...recipes];
    if (dietaryFilter) {
      filtered = filtered.filter((recipe) => recipe.dietary.toLowerCase() === dietaryFilter.toLowerCase());
    }
    if (maxCalories) {
      filtered = filtered.filter((recipe) => (recipe.per_serving_calories || 0) <= parseInt(maxCalories));
    }
    if (minProtein) {
      filtered = filtered.filter((recipe) => (recipe.per_serving_protein || 0) >= parseInt(minProtein));
    }
    setFilteredRecipes(filtered);
    setMealPlan({
      breakfast: [],
      morningSnack: [],
      lunch: [],
      afternoonSnack: [],
      dinner: [],
    });
    setTotalNutrition(null);
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
    const allRecipes = Object.values(updatedMealPlan).flat();
    if (allRecipes.length > 0) {
      const newTotal = allRecipes.reduce(
        (acc, r) => ({
          calories: acc.calories + (r.per_serving_calories || 0),
          protein: acc.protein + (r.per_serving_protein || 0),
          cost: acc.cost + (r.per_serving_cost || 0),
        }),
        { calories: 0, protein: 0, cost: 0 }
      );
      setTotalNutrition(newTotal);
    } else {
      setTotalNutrition(null);
    }
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
    const allRecipes = Object.values(updatedMealPlan).flat();
    if (allRecipes.length > 0) {
      const newTotal = allRecipes.reduce(
        (acc, r) => ({
          calories: acc.calories + (r.per_serving_calories || 0),
          protein: acc.protein + (r.per_serving_protein || 0),
          cost: acc.cost + (r.per_serving_cost || 0),
        }),
        { calories: 0, protein: 0, cost: 0 }
      );
      setTotalNutrition(newTotal);
    } else {
      setTotalNutrition(null);
    }
    setSelectCategory('');
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
          calories: acc.calories + (r.per_serving_calories || 0),
          protein: acc.protein + (r.per_serving_protein || 0),
          cost: acc.cost + (r.per_serving_cost || 0),
        }),
        { calories: 0, protein: 0, cost: 0 }
      );
      setTotalNutrition(newTotal);
    }
  };

  const formatPrice = (cost) => Math.ceil((cost || 0) / 1000) * 1000;

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
          recipe_name: recipe.recipe_name,
          total_calories: recipe.total_calories || 0,
          total_protein: recipe.total_protein || 0,
          total_cost: recipe.total_cost || 0,
          per_serving_calories: recipe.per_serving_calories || 0,
          per_serving_protein: recipe.per_serving_protein || 0,
          per_serving_cost: recipe.per_serving_cost || 0,
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
      let message = `${t('centralPerk.orderSuccess').replace('{orderId}', orderId)}\n${t('centralPerk.userName')}: ${userName.trim()}\n${t('centralPerk.day')}: ${t(`centralPerk.days.${selectedDay}`)}\n\n${t('centralPerk.mealPlan')}:\n`;
      Object.entries(mealPlan).forEach(([category, recipes]) => {
        if (recipes.length > 0) {
          message += `${t(`centralPerk.mealCategories.${category}`)}:\n`;
          recipes.forEach((recipe) => {
            message += `- ${recipe.recipe_name} (${t('centralPerk.units.kcalPerServing')} ${(recipe.per_serving_calories || 0).toFixed(2)}, ${t('centralPerk.units.proteinPerServing')} ${(recipe.per_serving_protein || 0).toFixed(2)}${t('kitchen.grams')}, ${t('centralPerk.units.tomanPerServing')} ${formatPrice(recipe.per_serving_cost)})\n`;
          });
        }
      });
      if (totalNutrition) {
        message += `\n${t('centralPerk.totalNutrition')}: ${t('centralPerk.units.kcalPerServing')} ${totalNutrition.calories.toFixed(2)}, ${t('centralPerk.units.proteinPerServing')} ${totalNutrition.protein.toFixed(2)}${t('kitchen.grams')}, ${t('centralPerk.units.tomanPerServing')} ${formatPrice(totalNutrition.cost)}`;
      }
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedMessage}`;
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
      <div className="intro-section">
        <h1>{t('centralPerk.intro.title')}</h1>
        <p>{t('centralPerk.intro.subtitle')}</p>
        <div className="intro-benefits">
          <div className="benefit">
            <i className="fas fa-carrot"></i>
            <h3>{t('centralPerk.intro.benefit1.title')}</h3>
            <p>{t('centralPerk.intro.benefit1.description')}</p>
          </div>
          <div className="benefit">
            <i className="fas fa-heart"></i>
            <h3>{t('centralPerk.intro.benefit2.title')}</h3>
            <p>{t('centralPerk.intro.benefit2.description')}</p>
          </div>
          <div className="benefit">
            <i className="fas fa-clock"></i>
            <h3>{t('centralPerk.intro.benefit3.title')}</h3>
            <p>{t('centralPerk.intro.benefit3.description')}</p>
          </div>
        </div>
        <button
          className="btn btn-primary-custom intro-cta"
          onClick={() => window.scrollTo({ top: document.querySelector('.filters').offsetTop, behavior: 'smooth' })}
        >
          {t('centralPerk.intro.cta')}
        </button>
      </div>
      <div className="filters">
        <select onChange={(e) => setDietaryFilter(e.target.value)} value={dietaryFilter} className="form-control">
          <option value="">{t('centralPerk.allDiets')}</option>
          <option value="vegan">{t('centralPerk.dietaryOptions.vegan')}</option>
          <option value="vegetarian">{t('centralPerk.dietaryOptions.vegetarian')}</option>
          <option value="omnivore">{t('centralPerk.dietaryOptions.omnivore')}</option>
          <option value="gluten-free">{t('centralPerk.dietaryOptions.glutenFree')}</option>
        </select>
        <input
          type="number"
          placeholder={t('centralPerk.maxCalories')}
          value={maxCalories}
          onChange={(e) => setMaxCalories(e.target.value)}
          className="form-control"
        />
        <input
          type="number"
          placeholder={t('centralPerk.minProtein')}
          value={minProtein}
          onChange={(e) => setMinProtein(e.target.value)}
          className="form-control"
        />
        <button className="btn btn-primary-custom" onClick={handleFilter}>
          {t('centralPerk.applyFilters')}
        </button>
      </div>
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
                                <span key={tag} className={`tag tag-${tag}`} title={t(`centralPerk.tags.${tag}`)}>
                                  <i className={`fas ${tag === 'high-protein' ? 'fa-dumbbell' : 'fa-leaf'}`}></i>
                                </span>
                              ))}
                            </div>
                            <img
                              src={recipe.image}
                              alt={recipe.recipe_name}
                              className="recipe-image"
                              onClick={() => openModal(recipe)}
                            />
                            <h3>{recipe.recipe_name}</h3>
                            <p>{t('centralPerk.dietary')}: {t(`centralPerk.dietaryOptions.${recipe.dietary}`)}</p>
                            <p>
                              {t('centralPerk.units.kcalPerServing')} {(recipe.per_serving_calories || 0).toFixed(2)}
                            </p>
                            <p>
                              {t('centralPerk.units.proteinPerServing')} {(recipe.per_serving_protein || 0).toFixed(2)}{t('kitchen.grams')}
                            </p>
                            <p>
                              {t('centralPerk.units.tomanPerServing')} {formatPrice(recipe.per_serving_cost)}
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
                                {recipe.recipe_name} ({t('centralPerk.units.kcalPerServing')} {(recipe.per_serving_calories || 0).toFixed(2)}, {t('centralPerk.units.proteinPerServing')} {(recipe.per_serving_protein || 0).toFixed(2)}{t('kitchen.grams')}, {t('centralPerk.units.tomanPerServing')} {formatPrice(recipe.per_serving_cost)})
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
            <p>
              {t('centralPerk.totalNutrition')}: {t('centralPerk.units.kcalPerServing')} {totalNutrition.calories.toFixed(2)}, {t('centralPerk.units.proteinPerServing')} {totalNutrition.protein.toFixed(2)}{t('kitchen.grams')}, {t('centralPerk.units.tomanPerServing')} {formatPrice(totalNutrition.cost)}
            </p>
          )}
        </div>
        <div className="order-section">
          <h2>{t('centralPerk.submitOrder')}</h2>
          <input
            type="text"
            className="form-control"
            placeholder={t('centralPerk.namePlaceholder')}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="form-control"
          >
            <option value="">{t('centralPerk.selectDay')}</option>
            {daysOfWeek.map((day) => (
              <option key={day.id} value={day.id}>
                {day.label}
              </option>
            ))}
          </select>
          <div className="order-buttons">
            <button className="btn btn-primary-custom order-button" onClick={handleOrder}>
              {t('centralPerk.orderPlan')}
            </button>
          </div>
          {orderSuccess && <p className="success-message">{orderSuccess}</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      </DragDropContext>
      {selectedRecipe && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content recipe-book-modal">
              <div className="modal-header">
                <h5 className="modal-title">{selectedRecipe.recipe_name}</h5>
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
                  <strong>{t('centralPerk.cost')}:</strong> {t('centralPerk.units.tomanPerServing')} {formatPrice(selectedRecipe.per_serving_cost)}
                </p>
                <p><strong>{t('centralPerk.prepTime')}:</strong> {selectedRecipe.prep_time} {t('kitchen.minutes')}</p>
                <p><strong>{t('centralPerk.servings')}:</strong> {selectedRecipe.servings || 1}</p>
                <h6>{t('centralPerk.ingredients')}</h6>
                <ul>
                  {selectedRecipe.ingredient_list?.map((ing, idx) => (
                    <li key={idx}>
                      {ingredientTranslations[ing.ingredient]?.persian_name || ing.ingredient}: {ing.quantity}g
                    </li>
                  ))}
                </ul>
                <h6>{t('centralPerk.instructions')}</h6>
                <p>{selectedRecipe.instructions || t('centralPerk.noInstructions')}</p>
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