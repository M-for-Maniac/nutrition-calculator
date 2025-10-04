import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import './GalleryPage.css';

const BASE_URL = 'https://maniac.pythonanywhere.com';
const WHATSAPP_NUMBER = '989233479443'; // WhatsApp API format without '+'

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
  const [userName, setUserName] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [selectCategory, setSelectCategory] = useState('');
  const [ingredientTranslations, setIngredientTranslations] = useState({});

  const [predefinedPlans] = useState([
    {
      id: 'vegan-delight',
      name: t('centralPerk.predefinedPlans.veganDelight'),
      dietary: 'vegan',
      image: '/nutrition-calculator/images/vegan-delight-plan.jpg',
      meal_plan: {
        breakfast: [
          {
            recipe_name: 'Bean Soup',
            total_calories: 250,
            total_protein: 10,
            dietary: 'vegan',
            prep_time: 60,
            ingredient_list: [
              { ingredient: 'Adzuki Beans', quantity: 150 },
            ],
            instructions: 'Boil Adzuki Beans with spices and vegetables. Simmer for 1 hour.',
            image: '/nutrition-calculator/images/bean-soup.jpg',
            thumbnails: [
              '/nutrition-calculator/images/thumbnails/bean-soup-1.jpg',
              '/nutrition-calculator/images/thumbnails/bean-soup-2.jpg',
              '/nutrition-calculator/images/thumbnails/bean-soup-3.jpg',
            ],
          },
        ],
        lunch: [
          {
            recipe_name: 'Bomb',
            total_calories: 300,
            total_protein: 0,
            dietary: 'vegan',
            prep_time: 5,
            ingredient_list: [
              { ingredient: 'Alcoholic.Whiskey.Proof 86', quantity: 60 },
              { ingredient: 'Alcoholic.Beer.Strong', quantity: 500 },
            ],
            instructions: 'Serve whiskey in a double shot, pour the cold beer on ice, drop the shot in your glass, and drink all at once.',
            image: '/nutrition-calculator/images/bomb.jpg',
            thumbnails: [
              '/nutrition-calculator/images/thumbnails/bomb-1.jpg',
              '/nutrition-calculator/images/thumbnails/bomb-2.jpg',
              '/nutrition-calculator/images/thumbnails/bomb-3.jpg',
            ],
          },
        ],
        dinner: [],
        morningSnack: [],
        afternoonSnack: [],
      },
    },
    {
      id: 'omnivore-balanced',
      name: t('centralPerk.predefinedPlans.omnivoreBalanced'),
      dietary: 'omnivore',
      image: '/nutrition-calculator/images/omnivore-balanced-plan.jpg',
      meal_plan: {
        breakfast: [
          {
            recipe_name: 'Morning Trio',
            total_calories: 200,
            total_protein: 8,
            dietary: 'vegetarian',
            prep_time: 10,
            ingredient_list: [
              { ingredient: 'Iranian Cheese', quantity: 30 },
              { ingredient: 'Butter', quantity: 10 },
              { ingredient: 'Milk Chocolate', quantity: 50 },
            ],
            instructions: 'Enjoy along with bread and coffee',
            image: '/nutrition-calculator/images/morning-trio.jpg',
            thumbnails: [
              '/nutrition-calculator/images/thumbnails/morning-trio-1.jpg',
              '/nutrition-calculator/images/thumbnails/morning-trio-2.jpg',
              '/nutrition-calculator/images/thumbnails/morning-trio-3.jpg',
            ],
          },
        ],
        lunch: [
          {
            recipe_name: 'Adzuki Bean Salad',
            total_calories: 450,
            total_protein: 35,
            dietary: 'omnivore',
            prep_time: 30,
            ingredient_list: [
              { ingredient: 'Adzuki Beans', quantity: 100 },
              { ingredient: 'Chicken Breast(Grilled)', quantity: 200 },
            ],
            instructions: 'Cook Adzuki Beans until tender. Grill Chicken Breast. Mix with greens and dressing.',
            image: '/nutrition-calculator/images/adzuki-bean-salad.jpg',
            thumbnails: [
              '/nutrition-calculator/images/thumbnails/adzuki-bean-salad-1.jpg',
              '/nutrition-calculator/images/thumbnails/adzuki-bean-salad-2.jpg',
              '/nutrition-calculator/images/thumbnails/adzuki-bean-salad-3.jpg',
            ],
          },
        ],
        dinner: [
          {
            recipe_name: 'MeatManiac',
            total_calories: 600,
            total_protein: 40,
            dietary: 'omnivore',
            prep_time: 40,
            ingredient_list: [
              { ingredient: 'Beef.Flank(Raw)', quantity: 250 },
            ],
            instructions: 'سرخ کنید در کنار سبزیجات میل کنید',
            image: '/nutrition-calculator/images/meat-maniac.jpg',
            thumbnails: [
              '/nutrition-calculator/images/thumbnails/meat-maniac-1.jpg',
              '/nutrition-calculator/images/thumbnails/meat-maniac-2.jpg',
              '/nutrition-calculator/images/thumbnails/meat-maniac-3.jpg',
            ],
          },
        ],
        morningSnack: [],
        afternoonSnack: [],
      },
    },
    {
      id: 'gluten-free-breakfast',
      name: t('centralPerk.predefinedPlans.glutenFreeBreakfast'),
      dietary: 'vegetarian',
      image: '/nutrition-calculator/images/gluten-free-breakfast.jpg',
      meal_plan: {
        breakfast: [
          {
            recipe_name: 'Gluten-Free Pancakes',
            total_calories: 400,
            total_protein: 12,
            dietary: 'vegetarian',
            prep_time: 45,
            ingredient_list: [
              { ingredient: 'Potato flour', quantity: 120 },
              { ingredient: 'Sugar.Granulated', quantity: 50 },
              { ingredient: 'Baking Powder', quantity: 6 },
              { ingredient: 'Baking Soda', quantity: 2.5 },
              { ingredient: 'Salt(table)', quantity: 1.5 },
              { ingredient: 'Vanilla(Extract)', quantity: 5 },
              { ingredient: 'Egg(Raw)', quantity: 100 },
              { ingredient: 'Oil.Vegetable', quantity: 50 },
              { ingredient: 'Vinegar.Cider', quantity: 15 },
              { ingredient: 'Water', quantity: 100 },
              { ingredient: 'Honey', quantity: 30 },
            ],
            instructions: 'Mix Dry Ingredients: In a large bowl, whisk potato flour, sugar, baking powder, baking soda, and salt until well combined.\r\nMix Wet Ingredients: In a separate bowl, whisk eggs, vegetable oil, warm water, apple cider vinegar, honey, and vanilla extract until smooth.\r\nCombine: Gradually add the wet ingredients to the dry, whisking gently until just combined.\r\nRest Batter: Let the batter sit for 5-10 minutes.\r\nHeat Pan: Preheat a non-stick skillet over medium heat. Lightly grease.\r\nCook Pancakes: Pour about 60-70 g (1/4 cup) of batter per pancake. Cook for 2-3 minutes until bubbles form, then flip and cook for 1-2 minutes more.\r\nServe: Serve warm with gluten marmalade, maple syrup, or fresh fruit.',
            image: '/nutrition-calculator/images/gluten-free-pancakes.jpg',
            thumbnails: [
              '/nutrition-calculator/images/thumbnails/gluten-free-pancakes-1.jpg',
              '/nutrition-calculator/images/thumbnails/gluten-free-pancakes-2.jpg',
              '/nutrition-calculator/images/thumbnails/gluten-free-pancakes-3.jpg',
            ],
          },
        ],
        lunch: [],
        dinner: [],
        morningSnack: [],
        afternoonSnack: [],
      },
    },
  ]);

  // Fetch recipes and ingredient translations
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch recipes
        const recipeResponse = await axios.get(`${BASE_URL}/get_recipes`, {
          params: {
            dietary: dietaryFilter,
            complexity: '',
            max_calories: maxCalories || undefined,
            max_cost: undefined,
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
        }));
        setRecipes(enrichedRecipes);
        setFilteredRecipes(enrichedRecipes);

        // Fetch ingredient translations
        const translationResponse = await axios.get(`${BASE_URL}/get_ingredient_translations`);
        setIngredientTranslations(translationResponse.data);
      } catch (error) {
        console.error('Error loading data:', error);
        setErrorMessage(t('centralPerk.error.fetchRecipes'));
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
      filtered = filtered.filter((recipe) => recipe.total_calories <= parseInt(maxCalories));
    }

    if (minProtein) {
      filtered = filtered.filter((recipe) => recipe.total_protein >= parseInt(minProtein));
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

  const handleSelectForMealPlan = (recipe) => {
    if (!selectCategory) {
      setErrorMessage(t('centralPerk.selectCategory'));
      return;
    }
    if (Object.values(mealPlan).flat().length >= 5) {
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
          calories: acc.calories + (r.total_calories || 0),
          protein: acc.protein + (r.total_protein || 0),
        }),
        { calories: 0, protein: 0 }
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
          calories: acc.calories + (r.total_calories || 0),
          protein: acc.protein + (r.total_protein || 0),
        }),
        { calories: 0, protein: 0 }
      );
      setTotalNutrition(newTotal);
    }
  };

  const handleOrder = () => {
    if (!userName.trim()) {
      setErrorMessage(t('centralPerk.enterName'));
      return;
    }
    if (!selectedDay) {
      setErrorMessage(t('centralPerk.selectDay'));
      return;
    }
    const allRecipes = Object.values(mealPlan).flat();
    if (allRecipes.length === 0) {
      setErrorMessage(t('centralPerk.noPlan'));
      return;
    }
    const orderDetails = {
      user_name: userName.trim(),
      selected_day: selectedDay,
      meal_plan: mealPlan,
    };
    console.log('Sending order to backend:', orderDetails); // Debug log
    axios
      .post(`${BASE_URL}/order_meal`, orderDetails)
      .then((response) => {
        console.log('Order response:', response.data); // Debug log
        setErrorMessage('');
        let message = `New Order: ${response.data.order_id}\nName: ${userName.trim()}\nDay: ${t(`centralPerk.days.${selectedDay}`)}\n\nMeal Plan:\n`;
        Object.entries(mealPlan).forEach(([category, recipes]) => {
          if (recipes.length > 0) {
            message += `${t(`centralPerk.mealCategories.${category}`)}:\n`;
            recipes.forEach((recipe) => {
              message += `- ${recipe.recipe_name} (${recipe.total_calories} kcal, ${recipe.total_protein}g protein)\n`;
            });
          }
        });
        if (totalNutrition) {
          message += `\nTotal Nutrition: ${totalNutrition.calories} kcal, ${totalNutrition.protein}g protein`;
        }
        // Normalize newlines and remove non-ASCII for WhatsApp compatibility
        message = message.replace(/[\r\n]+/g, '\n').replace(/[^\x20-\x7E\n]/g, '');
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedMessage}`;
        console.log('WhatsApp URL:', whatsappUrl); // Debug log
        const newWindow = window.open(whatsappUrl, '_blank');
        if (!newWindow) {
          console.error('Failed to open WhatsApp window. Popup blocker may be enabled.');
          setErrorMessage(t('centralPerk.popupBlocked'));
          alert(t('centralPerk.popupBlocked') + '\n' + t('centralPerk.openManually', { url: whatsappUrl }));
        } else {
          setMealPlan({
            breakfast: [],
            morningSnack: [],
            lunch: [],
            afternoonSnack: [],
            dinner: [],
          });
          setTotalNutrition(null);
          setUserName('');
          setSelectedDay('');
          alert(t('centralPerk.orderSuccess', { orderId: response.data.order_id }));
        }
      })
      .catch((error) => {
        console.error('Error placing order:', error.response || error);
        setErrorMessage(t('centralPerk.orderError'));
      });
  };

  const selectPredefinedPlan = (plan) => {
    setMealPlan({
      breakfast: plan.meal_plan.breakfast || [],
      morningSnack: plan.meal_plan.morningSnack || [],
      lunch: plan.meal_plan.lunch || [],
      afternoonSnack: plan.meal_plan.afternoonSnack || [],
      dinner: plan.meal_plan.dinner || [],
    });
    const allRecipes = Object.values(plan.meal_plan).flat();
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

  const openRecipeModal = (recipe) => {
    setSelectedRecipe(recipe);
    setMainImage(recipe.image || '/nutrition-calculator/images/placeholder.jpg');
  };

  const openPlanModal = (plan) => {
    setSelectedPlan(plan);
    setMainImage(plan.image || '/nutrition-calculator/images/placeholder.jpg');
  };

  const closeModal = () => {
    setSelectedRecipe(null);
    setSelectedPlan(null);
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
        <div className="predefined-plans">
          <h2>{t('centralPerk.predefinedPlans.title')}</h2>
          <div className="plan-grid">
            {predefinedPlans.map((plan) => {
              const planRecipes = Object.values(plan.meal_plan).flat();
              const totalCalories = planRecipes.reduce((sum, r) => sum + (r.total_calories || 0), 0);
              const totalProtein = planRecipes.reduce((sum, r) => sum + (r.total_protein || 0), 0);
              return (
                <div key={plan.id} className="plan-card" onClick={() => openPlanModal(plan)}>
                  <img src={plan.image} alt={plan.name} className="plan-image" />
                  <h3>{plan.name}</h3>
                  <p>
                    {t('centralPerk.dietary')}: {t(`centralPerk.dietaryOptions.${plan.dietary}`)}
                  </p>
                  <p>
                    {t('centralPerk.totalCalories')}: {totalCalories} kcal
                  </p>
                  <p>
                    {t('centralPerk.totalProtein')}: {totalProtein}g
                  </p>
                  <button
                    className="btn btn-primary-custom"
                    onClick={(e) => {
                      e.stopPropagation();
                      selectPredefinedPlan(plan);
                    }}
                  >
                    {t('centralPerk.selectPlan')}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <div className="recipe-gallery">
          <h2>{t('centralPerk.availableRecipes')}</h2>
          <Droppable droppableId="recipes">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="recipe-grid">
                {filteredRecipes.map((recipe, index) => {
                  const tags = [];
                  if (recipe.total_protein > 20) tags.push('high-protein');
                  if (recipe.total_calories < 300) tags.push('low-calorie');
                  return (
                    <Draggable key={recipe.recipe_name} draggableId={recipe.recipe_name} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`recipe-card dietary-${recipe.dietary.toLowerCase()} ${
                            snapshot.isDragging ? 'dragging' : ''
                          }`}
                          style={{
                            ...provided.draggableProps.style,
                            left: 'auto !important',
                            top: 'auto !important',
                          }}
                        >
                          <div className="recipe-tags">
                            {tags.map((tag) => (
                              <span
                                key={tag}
                                className={`tag tag-${tag}`}
                                title={t(`centralPerk.tags.${tag}`)}
                              >
                                <i
                                  className={`fas ${
                                    tag === 'high-protein' ? 'fa-dumbbell' : 'fa-leaf'
                                  }`}
                                ></i>
                              </span>
                            ))}
                          </div>
                          <img
                            src={recipe.image}
                            alt={recipe.recipe_name}
                            className="recipe-image"
                            onClick={() => openRecipeModal(recipe)}
                          />
                          <h3>{recipe.recipe_name}</h3>
                          <p>
                            {t('centralPerk.dietary')}: {t(`centralPerk.dietaryOptions.${recipe.dietary}`)}
                          </p>
                          <p>
                            {t('centralPerk.calories')}: {recipe.total_calories} kcal
                          </p>
                          <p>
                            {t('centralPerk.protein')}: {recipe.total_protein}g
                          </p>
                          <p>
                            {t('centralPerk.prepTime')}: {recipe.prep_time} {t('kitchen.minutes')}
                          </p>
                          <div className="recipe-actions">
                            <button className="btn btn-info-custom" onClick={() => openRecipeModal(recipe)}>
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
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="meal-item"
                                style={{
                                  ...provided.draggableProps.style,
                                  left: 'auto !important',
                                  top: 'auto !important',
                                }}
                              >
                                {recipe.recipe_name} ({recipe.total_calories} kcal,{' '}
                                {recipe.total_protein}g {t('centralPerk.protein')})
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
              {t('centralPerk.totalNutrition')}: {totalNutrition.calories} kcal,{' '}
              {totalNutrition.protein}g {t('centralPerk.protein')}
            </p>
          )}
        </div>
        <div className="order-form">
          <h2>{t('centralPerk.submitOrder')}</h2>
          <input
            type="text"
            placeholder={t('centralPerk.namePlaceholder')}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="form-control"
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
          <button className="btn btn-primary-custom order-button" onClick={handleOrder}>
            {t('centralPerk.orderPlan')}
          </button>
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
                  <img
                    src={mainImage}
                    alt={selectedRecipe.recipe_name}
                    className="recipe-main-image"
                  />
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
                <p>
                  <strong>{t('centralPerk.dietary')}:</strong>{' '}
                  {t(`centralPerk.dietaryOptions.${selectedRecipe.dietary}`)}
                </p>
                <p>
                  <strong>{t('centralPerk.calories')}:</strong> {selectedRecipe.total_calories} kcal
                </p>
                <p>
                  <strong>{t('centralPerk.protein')}:</strong> {selectedRecipe.total_protein}g
                </p>
                <p>
                  <strong>{t('centralPerk.prepTime')}:</strong> {selectedRecipe.prep_time}{' '}
                  {t('kitchen.minutes')}
                </p>
                <h6>{t('centralPerk.ingredients')}</h6>
                <ul>
                  {selectedRecipe.ingredient_list?.map((ing, idx) => (
                    <li key={idx}>
                      {ing.ingredient}{' '}
                      {ingredientTranslations[ing.ingredient]
                        ? `(${ingredientTranslations[ing.ingredient]})`
                        : ''}: {ing.quantity}g
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
      {selectedPlan && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content recipe-book-modal">
              <div className="modal-header">
                <h5 className="modal-title">{selectedPlan.name}</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <div className="recipe-image-gallery">
                  <img
                    src={mainImage}
                    alt={selectedPlan.name}
                    className="recipe-main-image"
                  />
                </div>
                <p>
                  <strong>{t('centralPerk.dietary')}:</strong>{' '}
                  {t(`centralPerk.dietaryOptions.${selectedPlan.dietary}`)}
                </p>
                <p>
                  <strong>{t('centralPerk.totalCalories')}:</strong>{' '}
                  {Object.values(selectedPlan.meal_plan)
                    .flat()
                    .reduce((sum, r) => sum + (r.total_calories || 0), 0)} kcal
                </p>
                <p>
                  <strong>{t('centralPerk.totalProtein')}:</strong>{' '}
                  {Object.values(selectedPlan.meal_plan)
                    .flat()
                    .reduce((sum, r) => sum + (r.total_protein || 0), 0)}g
                </p>
                {mealCategories.map((category) => (
                  selectedPlan.meal_plan[category.id]?.length > 0 && (
                    <div key={category.id}>
                      <h6>{category.label}</h6>
                      {selectedPlan.meal_plan[category.id].map((recipe, idx) => (
                        <div key={idx} className="recipe-details">
                          <h6>{recipe.recipe_name}</h6>
                          <div className="recipe-image-gallery">
                            <img
                              src={recipe.image}
                              alt={recipe.recipe_name}
                              className="recipe-main-image"
                            />
                            <div className="thumbnail-gallery">
                              {(recipe.thumbnails || [recipe.image]).map((img, imgIdx) => (
                                <img
                                  key={imgIdx}
                                  src={img}
                                  alt={`Thumbnail ${imgIdx + 1}`}
                                  className={`thumbnail ${mainImage === img ? 'active' : ''}`}
                                  onClick={() => setMainImage(img)}
                                />
                              ))}
                            </div>
                          </div>
                          <p>
                            <strong>{t('centralPerk.dietary')}:</strong>{' '}
                            {t(`centralPerk.dietaryOptions.${recipe.dietary}`)}
                          </p>
                          <p>
                            <strong>{t('centralPerk.calories')}:</strong> {recipe.total_calories} kcal
                          </p>
                          <p>
                            <strong>{t('centralPerk.protein')}:</strong> {recipe.total_protein}g
                          </p>
                          <p>
                            <strong>{t('centralPerk.prepTime')}:</strong> {recipe.prep_time}{' '}
                            {t('kitchen.minutes')}
                          </p>
                          <h6>{t('centralPerk.ingredients')}</h6>
                          <ul>
                            {recipe.ingredient_list?.map((ing, ingIdx) => (
                              <li key={ingIdx}>
                                {ing.ingredient}{' '}
                                {ingredientTranslations[ing.ingredient]
                                  ? `(${ingredientTranslations[ing.ingredient]})`
                                  : ''}: {ing.quantity}g
                              </li>
                            ))}
                          </ul>
                          <h6>{t('centralPerk.instructions')}</h6>
                          <p>{recipe.instructions || t('centralPerk.noInstructions')}</p>
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
                      ))}
                    </div>
                  )
                ))}
                <button
                  className="btn btn-primary-custom"
                  onClick={() => {
                    selectPredefinedPlan(selectedPlan);
                    closeModal();
                  }}
                >
                  {t('centralPerk.selectPlan')}
                </button>
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