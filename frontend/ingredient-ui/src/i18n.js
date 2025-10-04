import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      app: {
        title: 'Central Perk',
        home: 'Home',
        kitchen: 'Kitchen',
        cookbook: 'Cookbook',
        gallery: 'Central Perk',
        language: 'Language',
        english: 'English',
        persian: 'Persian'
      },
      home: {
        hero: {
          title: 'Welcome to Central Perk, Your Nutritious Journey!',
          subtitle: 'Easily plan meals, track nutrition, and order delicious, healthy dishes with us.',
          kitchenCTA: 'Explore Kitchen',
          cookbookCTA: 'Discover Cookbook'
        },
        features: {
          title: 'Why You’ll Love Our App',
          kitchen: {
            title: 'Nutrition Tracking',
            description: 'Calculate the nutritional value of your ingredients and meals in a snap.',
            button: 'Try Kitchen Now'
          },
          cookbook: {
            title: 'Recipe Management',
            description: 'Build, edit, and organize your recipes with dietary and complexity filters.',
            button: 'Try Cookbook Now'
          },
          gallery: {
            title: 'Meal Planning & Ordering',
            description: 'Browse our curated menu, create a daily meal plan, and order high-quality, diet-specific meals.',
            button: 'Order Now'
          }
        },
        tips: {
          title: 'Healthy Eating Tips',
          tip1: 'Add a rainbow of veggies to your plate for a nutrient boost!',
          tip2: 'Choose whole grains like quinoa or brown rice for sustained energy.',
          tip3: 'Stay hydrated with water or herbal teas throughout the day.',
          tip4: 'Plan your meals weekly to save time and eat healthier.',
          tip5: 'Experiment with spices to add flavor without extra calories.'
        },
        tour: {
          title: 'Take a Quick Tour!',
          intro: 'New to our app? Let’s walk you through how to make the most of it!',
          kitchen: {
            title: 'Kitchen: Your Nutrition Hub',
            description: 'In the Kitchen, you can pick ingredients, set quantities, and calculate nutritional values like calories, protein, and fat. Filter by dietary preferences or search for ingredients to plan your perfect meal. You can even update ingredient prices and export your results!',
            button: 'Go to Kitchen'
          },
          cookbook: {
            title: 'Cookbook: Your Recipe Playground',
            description: 'The Cookbook lets you create, edit, and manage recipes. Add ingredients, write instructions, and set dietary or complexity filters. Calculate the nutrition for any recipe and scale it up or down to fit your needs. Save your favorites and share them!',
            button: 'Go to Cookbook'
          },
          gallery: {
            title: 'Central Perk: Your Meal Planner & Restaurant',
            description: 'Explore a variety of high-quality recipes, filter by dietary needs, build a daily meal plan, and order your meals for delivery via WhatsApp!',
            button: 'Go to Central Perk'
          }
        },
        sampleRecipe: {
          title: 'Try a Sample Recipe!',
          description: 'Jump into our Cookbook to create and explore healthy, tasty recipes.',
          button: 'Explore Cookbook'
        },
        footer: {
          text: 'Crafted with ❤️ by m-for-maniac',
          github: 'Check us out on GitHub'
        }
      },
      kitchen: {
        title: 'Kitchen',
        selectIngredients: 'Pick Your Ingredients',
        quantity: 'Quantity (g)',
        calculate: 'Calculate Nutrition',
        calculating: 'Calculating...',
        export: 'Export Label',
        reset: 'Start Over',
        currency: 'Currency',
        maxCalories: 'Max Calories',
        minProtein: 'Min Protein (g)',
        maxFat: 'Max Fat (g)',
        dietary: 'Dietary Preference',
        search: 'Search Ingredients',
        updatePrice: 'Update Ingredient Price',
        selectIngredient: 'Choose an Ingredient',
        purchaseCost: 'Purchase Cost',
        purchaseAmount: 'Purchase Amount (g)',
        updateButton: 'Update Price',
        selectedIngredients: 'Your Selected Ingredients',
        remove: 'Remove',
        nutritionResults: 'Nutrition Breakdown',
        totalCost: 'Total Cost',
        nutritionChart: 'Nutrition Chart',
        suggestedRecipes: 'Recipes You Might Like',
        addIngredient: 'Add New Ingredient',
        addIngredientButton: 'Add Ingredient',
        ingredientName: 'Ingredient Name (English)',
        persianName: 'Persian Name',
        calories: 'Calories',
        totalFat: 'Total Fat',
        cholesterol: 'Cholesterol',
        sodium: 'Sodium',
        potassium: 'Potassium',
        totalCarbohydrate: 'Total Carbohydrate',
        protein: 'Protein',
        showOptionalFields: 'Show Optional Nutritional Fields',
        hideOptionalFields: 'Hide Optional Nutritional Fields',
        selectCategory: 'Category',
        category: 'Category',
        recipeDetails: {
          ingredients: 'Ingredients',
          instructions: 'Instructions',
          prepTime: 'Prep Time',
          dietary: 'Dietary',
          complexity: 'Complexity',
          totalCalories: 'Total Calories',
          totalCost: 'Total Cost'
        },
        viewInCookbook: 'View in Cookbook',
        minutes: 'minutes',
        currencyOptions: {
          toman: 'Toman',
          irr: 'IRR'
        },
        dietaryOptions: {
          all: 'All',
          omnivore: 'Omnivore',
          vegetarian: 'Vegetarian',
          vegan: 'Vegan',
          gluten_free: 'Gluten-Free',
          select: 'Choose a Dietary Preference',
        },
        notes: {
          title: 'How to Use the Kitchen',
          purposeTitle: 'Why Use the Kitchen?',
          purpose: 'The Kitchen helps you plan meals by calculating the nutritional content and cost of your selected ingredients. It’s perfect for health-conscious individuals, those managing budgets, or anyone with dietary restrictions like vegan or vegetarian diets.',
          nutritionTitle: 'Understanding Nutrition',
          nutritionInfo: 'Understanding nutrition is key to a balanced diet. Macronutrients (carbs, proteins, fats) provide energy, while micronutrients (vitamins, minerals) support bodily functions. Use the filters to find ingredients that meet your calorie, protein, or fat goals, and check the % Daily Value (DV) to stay within recommended limits.',
          usageTitle: 'How to Get Started',
          usage: 'Select ingredients, set quantities, and click "Calculate Nutrition" to see a detailed breakdown. Use filters to narrow down options by dietary needs or nutritional goals. Update prices to keep your budget in check, and export results to track your meal plans.'
        },
        error: {
          fetchIngredients: 'Oops! Couldn’t fetch ingredients. Try again?',
          calculate: 'Something went wrong calculating nutrition.',
          fetchRecipes: 'Couldn’t load recipes. Please try again.',
          updatePrice: 'Error updating price. Check your inputs.',
          updatePriceFields: 'Please fill in all fields to update the price.',
          refreshIngredients: 'Error refreshing ingredients.',
          addIngredientFields: 'Please fill all required fields for the new ingredient.',
          addIngredient: 'Failed to add ingredient. Please try again.'
        },
        exportPrompt: 'Export? Click OK for Image.',
        nutritionLabelTitle: 'Nutrition Facts: Selected Ingredients'
      },
      cookbook: {
        title: 'Cookbook',
        addRecipe: 'Add a New Recipe',
        recipeName: 'Recipe Name',
        selectIngredients: 'Select Ingredients',
        quantity: 'Quantity (g)',
        instructions: 'Instructions',
        prepTime: 'Prep Time (minutes)',
        dietary: 'Dietary Preference',
        complexity: 'Complexity',
        search: 'Search Recipes',
        currency: 'Currency',
        maxCalories: 'Max Calories',
        maxCost: 'Max Cost',
        allRecipes: 'All Your Recipes',
        nutrition: 'Nutrition Info',
        totalCost: 'Total Cost',
        scale: 'Scale Factor',
        calculate: 'Calculate Nutrition',
        calculating: 'Calculating...',
        edit: 'Edit',
        delete: 'Delete',
        export: 'Export Nutrition Label',
        adding: 'Adding...',
        addButton: 'Add Recipe',
        confirmDelete: 'Are you sure you want to delete {recipe_name}?',
        downloadPDF: 'Download PDF',
        dietaryOptions: {
          select: 'Choose a Dietary Preference',
          all: 'All',
          omnivore: 'Omnivore',
          vegetarian: 'Vegetarian',
          vegan: 'Vegan',
          gluten_free: 'Gluten-Free'
        },
        complexityOptions: {
          select: 'Choose Complexity',
          all: 'All',
          easy: 'Easy',
          medium: 'Medium',
          hard: 'Hard'
        },
        currencyOptions: {
          toman: 'Toman',
          irr: 'IRR'
        },
        table: {
          name: 'Name',
          ingredients: 'Ingredients',
          instructions: 'Instructions',
          prepTime: 'Prep Time',
          dietary: 'Dietary',
          complexity: 'Complexity',
          calories: 'Calories',
          cost: 'Cost',
          actions: 'Actions',
          viewInstructions: 'View Instructions',
          noRecipes: 'No recipes found',
          close: 'Close'
        },
        notes: {
          title: 'How to Use the Cookbook',
          purposeTitle: 'Why Use the Cookbook?',
          purpose: 'The Cookbook allows you to create, manage, and analyze recipes tailored to your dietary preferences and budget. It’s ideal for saving favorite recipes, planning meals, and ensuring nutritional balance.',
          nutritionTitle: 'Understanding Recipe Nutrition',
          nutritionInfo: 'Recipes provide a snapshot of nutritional content based on their ingredients. Monitor calories, macronutrients (carbs, proteins, fats), and micronutrients (vitamins, minerals) to meet your health goals. Use the scale factor to adjust portion sizes and update nutrition and cost accordingly.',
          usageTitle: 'How to Get Started',
          usage: 'Add a new recipe by entering its name, ingredients, instructions, and details like prep time and dietary preferences. Use the table to view, edit, or delete recipes. Calculate nutrition for any recipe, apply a scale factor for portion control, and export results to save or share.'
        },
        error: {
          exportImage: 'Failed to export nutrition label image',
          addRecipeFields: 'Please fill in the recipe name, ingredients, and prep time.',
          fetchIngredients: 'Couldn’t load ingredients. Try again?',
          fetchRecipes: 'Error loading recipes. Please try again.',
          addRecipe: 'Something went wrong adding your recipe.',
          calculateNutrition: 'Error calculating nutrition.',
          deleteRecipe: 'Couldn’t delete the recipe.',
          fetchRecipesAfterDelete: 'Error loading recipes after deletion.',
          updateRecipeFields: 'Please fill in all fields to update the recipe.',
          updateRecipe: 'Error updating the recipe.',
          fetchRecipesAfterUpdate: 'Error loading recipes after update.',
          invalidIngredientList: 'The ingredient list seems invalid.',
          exportPDF: 'Failed to export recipe PDF. Please try again.'
        },
        editModal: {
          title: 'Edit Your Recipe',
          cancel: 'Cancel',
          update: 'Update Recipe',
          updating: 'Updating...'
        }
      },
      "centralPerk": {
        "title": "Central Perk: Your Healthy Meal Solution",
        "subtitle": "Discover delicious, high-quality meals tailored to your diet, delivered to your door!",
        "intro": {
          "title": "Welcome to Central Perk",
          "subtitle": "Your one-stop online restaurant for nutritious, chef-crafted meals designed for your lifestyle. Choose from our curated recipes, build your daily meal plan, and order with ease!",
          "benefit1": {
            "title": "Diet-Specific Meals",
            "description": "Vegan, gluten-free, or high-protein? Our recipes are crafted to meet your dietary needs with precise nutrition tracking."
          },
          "benefit2": {
            "title": "High-Quality Ingredients",
            "description": "We use fresh, premium ingredients to ensure every meal is both healthy and delicious."
          },
          "benefit3": {
            "title": "Hassle-Free Ordering",
            "description": "Build your meal plan in minutes and order via WhatsApp for quick delivery."
          },
          "cta": "Start Building Your Meal Plan"
        },
        "dietaryOptions": {
          "select": "Choose a Dietary Preference",
          "all": "All",
          "omnivore": "Omnivore",
          "vegetarian": "Vegetarian",
          "vegan": "Vegan",
          "gluten_free": "Gluten-Free"
        },
        "days": {
          "monday": "Monday",
          "tuesday": "Tuesday",
          "wednesday": "Wednesday",
          "thursday": "Thursday",
          "friday": "Friday",
          "saturday": "Saturday",
          "sunday": "Sunday"
        },
        "allDiets": "All Diets",
        "maxCalories": "Max Calories",
        "minProtein": "Min Protein (g)",
        "applyFilters": "Apply Filters",
        "dietary": "Dietary",
        "calories": "Calories",
        "protein": "Protein",
        "prepTime": "Prep Time",
        "addToPlan": "Add to Meal Plan",
        "selectCategory": "Select Meal Category",
        "selectDay": "Select Day of the Week",
        "day": "Day",
        "customPlan": "Custom Plan",
        "remove": "Remove",
        "dropHere": "Drag and drop your chosen meals here to plan your day",
        "mealPlan": "Your Daily Meal Plan",
        "noPlan": "No meals selected. Add dishes to your plan!",
        "totalNutrition": "Total Nutrition",
        "savePlan": "Save Meal Plan",
        "planSaved": "Meal plan saved successfully!",
        "orderPlan": "Order Your Meal Plan",
        "orderSuccess": "Order placed successfully! Your order ID is {orderId}.",
        "orderError": "Failed to place order. Please try again.",
        "mealPlanFull": "Meal plan is full (max 5 dishes).",
        "availableRecipes": "Our Menu",
        "mealCategories": {
          "breakfast": "Breakfast",
          "morningSnack": "Morning Snack",
          "lunch": "Lunch",
          "afternoonSnack": "Afternoon Snack",
          "dinner": "Dinner"
        },
        "predefinedPlans": {
          "title": "Curated Meal Plans",
          "veganDelight": "Vegan Delight",
          "highProtein": "High-Protein Day",
          "omnivoreBalanced": "Omnivore Balanced",
          "glutenFreeBreakfast": "Gluten-Free Breakfast"
        },
        "selectPlan": "Choose This Plan",
        "totalCalories": "Total Calories",
        "totalProtein": "Total Protein",
        "tags": {
          "highProtein": "High-Protein",
          "lowCalorie": "Low-Calorie"
        },
        "viewDetails": "View Details",
        "ingredients": "Ingredients",
        "instructions": "Instructions",
        "noInstructions": "No instructions provided",
        "close": "Close",
        "submitOrder": "Submit Your Order",
        "namePlaceholder": "Enter Your Name",
        "enterName": "Please enter your name.",
        "error": {
          "fetchRecipes": "Couldn’t load our menu. Please try again.",
          "popupBlocked": "Unable to open WhatsApp. Please allow popups or open the link manually: {url}"
        }
      },
    }
  },
  fa: {
    translation: {
      app: {
        title: 'سنترال پرک',
        home: 'خانه',
        kitchen: 'آشپزخانه',
        cookbook: 'کتاب آشپزی',
        gallery: 'سنترال پرک',
        language: 'زبان',
        english: 'انگلیسی',
        persian: 'فارسی'
      },
      home: {
        hero: {
          title: 'به سنترال پرک خوش اومدی!',
          subtitle: 'با ما به‌راحتی وعده‌های غذایی خود را برنامه‌ریزی کنید، تغذیه را ردیابی کنید و غذاهای سالم و خوشمزه سفارش دهید.',
          kitchenCTA: 'بریم تو آشپزخانه',
          cookbookCTA: 'مشاهده کتاب آشپزی'
        },
        features: {
          title: 'چرا اپلیکیشن ما را دوست خواهید داشت',
          kitchen: {
            title: 'ردیابی تغذیه',
            description: 'ارزش غذایی مواد اولیه و وعده‌های غذایی خود را به‌سرعت محاسبه کنید.',
            button: 'به آشپزخانه برید'
          },
          cookbook: {
            title: 'مدیریت دستور پخت',
            description: 'دستورهای پخت خود را با فیلترهای رژیم غذایی و پیچیدگی بسازید، ویرایش کنید و سازمان‌دهی کنید.',
            button: 'کتاب آشپزی را مشاهده کنید'
          },
          gallery: {
            title: 'برنامه‌ریزی و سفارش غذا',
            description: 'منوی منتخب ما را مرور کنید، برنامه غذایی روزانه بسازید و غذاهای باکیفیت متناسب با رژیم غذایی خود سفارش دهید.',
            button: 'الان سفارش بدید'
          }
        },
        tips: {
          title: 'نکات تغذیه سالم',
          tip1: 'سبزیجات رنگارنگ را به بشقاب خود اضافه کنید تا مواد مغذی بیشتری دریافت کنید!',
          tip2: 'غلات کامل مثل کینوا یا برنج قهوه‌ای را برای انرژی پایدار انتخاب کنید.',
          tip3: 'با نوشیدن آب یا چای گیاهی در طول روز هیدراته بمانید.',
          tip4: 'وعده‌های غذایی خود را هفتگی برنامه‌ریزی کنید تا در زمان صرفه‌جویی کنید و سالم‌تر غذا بخورید.',
          tip5: 'با ادویه‌ها آزمایش کنید تا بدون کالری اضافی طعم غذا را بهتر کنید.'
        },
        tour: {
          title: 'یک تور سریع!',
          intro: 'با اپلیکیشن ما تازه‌کار هستید؟ بیایید باهم ببینیم چطور می‌توانید از آن بهترین استفاده را ببرید!',
          kitchen: {
            title: 'آشپزخانه: مرکز تغذیه شما',
            description: 'در آشپزخانه می‌توانید مواد اولیه را انتخاب کنید، مقدارشان را تعیین کنید و ارزش‌های تغذیه‌ای مثل کالری، پروتئین و چربی را محاسبه کنید. با فیلترهای رژیم غذایی یا جستجوی مواد اولیه، غذای ایده‌آل خود را برنامه‌ریزی کنید. حتی می‌توانید قیمت مواد اولیه را به‌روزرسانی کنید و لیبل ارزش غذایی را دانلود کنید!',
            button: 'برو به آشپزخانه'
          },
          cookbook: {
            title: 'کتاب آشپزی: زمین بازی دستورهای پخت شما',
            description: 'کتاب آشپزی به شما امکان می‌دهد دستورهای پخت را ذخیره، ویرایش کنید و مدیریت کنید. مواد اولیه را اضافه کنید، دستورالعمل‌ها را بنویسید و فیلترهای رژیم غذایی یا پیچیدگی را تنظیم کنید. ارزش غذایی هر دستور پخت را محاسبه کنید و آن را به دلخواه افزایش یا کاهش دهید. دستورهای مورد علاقه‌تان را ذخیره کنید و به اشتراک بگذارید!',
            button: 'برو به کتاب آشپزی'
          },
          gallery: {
            title: 'سنترال پرک: برنامه‌ریز غذایی و رستوران شما',
            description: 'انواع غذاهای باکیفیت را کاوش کنید، بر اساس نیازهای غذایی فیلتر کنید، برنامه غذایی روزانه بسازید و غذاهای خود را از طریق واتس‌اپ برای تحویل سفارش دهید!',
            button: 'برو به سنترال پرک'
          }
        },
        sampleRecipe: {
          title: 'یک دستور پخت نمونه را امتحان کنید!',
          description: 'به کتاب آشپزی ما سر بزنید تا دستورهای پخت سالم و خوشمزه را کشف کنید.',
          button: 'کاوش در کتاب آشپزی'
        },
        footer: {
          text: 'نوشته شده توسط m-for-maniac',
          github: 'من را در گیت‌هاب ببینید'
        }
      },
      kitchen: {
        title: 'آشپزخانه',
        selectIngredients: 'مواد اولیه خود را انتخاب کنید',
        quantity: 'مقدار (گرم)',
        calculate: 'محاسبه تغذیه',
        calculating: 'در حال محاسبه...',
        export: 'دانلود لیبل',
        reset: 'از نو شروع کنید',
        currency: 'ارز',
        maxCalories: 'حداکثر کالری',
        minProtein: 'حداقل پروتئین (گرم)',
        maxFat: 'حداکثر چربی (گرم)',
        dietary: 'رژیم غذایی',
        search: 'جستجوی مواد اولیه',
        updatePrice: 'به‌روزرسانی قیمت ماده اولیه',
        selectIngredient: 'یک ماده اولیه انتخاب کنید',
        purchaseCost: 'هزینه خرید',
        purchaseAmount: 'مقدار خرید (گرم)',
        updateButton: 'به‌روزرسانی قیمت',
        selectedIngredients: 'مواد اولیه انتخاب‌شده شما',
        remove: 'حذف',
        nutritionResults: 'تجزیه و تحلیل تغذیه',
        totalCost: 'هزینه کل',
        nutritionChart: 'نمودار تغذیه',
        suggestedRecipes: 'دستورهای پخت پیشنهادی',
        addIngredient: 'افزودن ماده غذایی جدید',
        addIngredientButton: 'افزودن ماده غذایی',
        ingredientName: 'نام ماده غذایی (انگلیسی)',
        persianName: 'نام پارسی',
        calories: 'کالری',
        totalFat: 'چربی کل',
        cholesterol: 'کلسترول',
        sodium: 'سدیم',
        potassium: 'پتاسیم',
        totalCarbohydrate: 'کربوهیدرات کل',
        protein: 'پروتئین',
        showOptionalFields: 'نمایش فیلدهای تغذیه‌ای اختیاری',
        hideOptionalFields: 'مخفی کردن فیلدهای تغذیه‌ای اختیاری',
        selectCategory: 'دسته‌بندی',
        category: 'دسته‌بندی',
        recipeDetails: {
          ingredients: 'مواد اولیه',
          instructions: 'دستورالعمل‌ها',
          prepTime: 'زمان آماده‌سازی',
          dietary: 'رژیم غذایی',
          complexity: 'پیچیدگی',
          totalCalories: 'کل کالری',
          totalCost: 'هزینه کل'
        },
        viewInCookbook: 'مشاهده در کتاب آشپزی',
        minutes: 'دقیقه',
        currencyOptions: {
          toman: 'تومان',
          irr: 'ریال'
        },
        dietaryOptions: {
          all: 'همه',
          omnivore: 'همه‌چیزخوار',
          vegetarian: 'گیاه‌خوار',
          vegan: 'وگان',
          gluten_free: 'بدون گلوتن',
          select: 'یک رژیم غذایی انتخاب کنید',
        },
        notes: {
          title: 'چگونه از آشپزخانه استفاده کنید',
          purposeTitle: 'چرا از آشپزخانه استفاده کنید؟',
          purpose: 'آشپزخانه به شما کمک می‌کند تا با محاسبه محتوای تغذیه‌ای و هزینه مواد اولیه انتخاب‌شده، وعده‌های غذایی خود را برنامه‌ریزی کنید. این ابزار برای افرادی که به سلامت خود اهمیت می‌دهند، بودجه خود را مدیریت می‌کنند یا محدودیت‌های غذایی مانند رژیم گیاه‌خواری یا وگان دارند، ایده‌آل است.',
          nutritionTitle: 'درک تغذیه',
          nutritionInfo: 'درک تغذیه برای یک رژیم غذایی متعادل ضروری است. درشت‌مغذی‌ها (کربوهیدرات‌ها، پروتئین‌ها، چربی‌ها) انرژی را تأمین می‌کنند، در حالی که ریزمغذی‌ها (ویتامین‌ها، مواد معدنی) از عملکردهای بدن پشتیبانی می‌کنند. از فیلترها برای یافتن مواد اولیه‌ای که با اهداف کالری، پروتئین یا چربی شما مطابقت دارند استفاده کنید و درصد ارزش روزانه (DV) را بررسی کنید تا در محدوده توصیه‌شده بمانید.',
          usageTitle: 'چگونه شروع کنید',
          usage: 'مواد اولیه را انتخاب کنید، مقادیر را تنظیم کنید و روی "محاسبه تغذیه" کلیک کنید تا تجزیه و تحلیل دقیقی ببینید. از فیلترها برای محدود کردن گزینه‌ها بر اساس نیازهای غذایی یا اهداف تغذیه‌ای استفاده کنید. قیمت‌ها را به‌روزرسانی کنید تا بودجه خود را کنترل کنید و نتایج را صادر کنید تا برنامه‌های غذایی خود را ردیابی کنید.'
        },
        error: {
          fetchIngredients: 'اوه! نمی‌تونیم مواد اولیه رو بارگیری کنیم. دوباره امتحان کنید؟',
          calculate: 'مشکلی در محاسبه تغذیه پیش اومد.',
          fetchRecipes: 'نمی‌تونیم دستورهای پخت رو بارگیری کنیم. لطفاً دوباره امتحان کنید.',
          updatePrice: 'خطا در به‌روزرسانی قیمت. ورودی‌ها رو بررسی کنید.',
          updatePriceFields: 'لطفاً همه فیلدها رو برای به‌روزرسانی قیمت پر کنید.',
          refreshIngredients: 'خطا در تازه‌سازی مواد اولیه.',
          addIngredientFields: 'لطفاً تمام فیلدهای مورد نیاز برای ماده غذایی جدید را پر کنید.',
          addIngredient: 'افزودن ماده غذایی ناموفق بود. لطفاً دوباره امتحان کنید.'
        },
        exportPrompt: 'برای دانلود لیبل روی تأیید کلیک کنید.',
        nutritionLabelTitle: 'حقایق تغذیه‌ای: مواد غذایی انتخاب‌شده'
      },
      cookbook: {
        title: 'کتاب آشپزی',
        addRecipe: 'افزودن یک دستور پخت جدید',
        recipeName: 'نام دستور پخت',
        selectIngredients: 'انتخاب مواد اولیه',
        quantity: 'مقدار (گرم)',
        instructions: 'دستورالعمل‌ها',
        prepTime: 'زمان آماده‌سازی (دقیقه)',
        dietary: 'رژیم غذایی',
        complexity: 'پیچیدگی',
        search: 'جستجوی دستورهای پخت',
        currency: 'ارز',
        maxCalories: 'حداکثر کالری',
        maxCost: 'حداکثر هزینه',
        allRecipes: 'همه دستورهای پخت شما',
        nutrition: 'اطلاعات تغذیه',
        totalCost: 'هزینه کل',
        scale: 'ضریب مقیاس',
        calculate: 'محاسبه تغذیه',
        calculating: 'در حال محاسبه...',
        edit: 'ویرایش',
        delete: 'حذف',
        export: 'دانلود لیبل تغذیه',
        adding: 'در حال افزودن...',
        addButton: 'افزودن دستور پخت',
        confirmDelete: 'مطمئن هستید که می‌خواهید {recipe_name} را حذف کنید؟',
        downloadPDF: 'دانلود فایل',
        dietaryOptions: {
          select: 'یک رژیم غذایی انتخاب کنید',
          all: 'همه',
          omnivore: 'همه‌چیزخوار',
          vegetarian: 'گیاه‌خوار',
          vegan: 'وگان',
          gluten_free: 'بدون گلوتن'
        },
        complexityOptions: {
          select: 'یک پیچیدگی انتخاب کنید',
          all: 'همه',
          easy: 'آسان',
          medium: 'متوسط',
          hard: 'سخت'
        },
        currencyOptions: {
          toman: 'تومان',
          irr: 'ریال'
        },
        table: {
          name: 'نام',
          ingredients: 'مواد اولیه',
          instructions: 'دستورالعمل‌ها',
          prepTime: 'زمان آماده‌سازی',
          dietary: 'رژیم غذایی',
          complexity: 'پیچیدگی',
          calories: 'کالری',
          cost: 'هزینه',
          actions: 'عملیات',
          viewInstructions: 'مشاهده دستورالعمل‌ها',
          noRecipes: 'هیچ دستور پختی یافت نشد',
          close: 'بستن'
        },
        notes: {
          title: 'چگونه از کتاب آشپزی استفاده کنید',
          purposeTitle: 'چرا از کتاب آشپزی استفاده کنید؟',
          purpose: 'کتاب آشپزی به شما امکان می‌دهد دستورهای پخت متناسب با رژیم غذایی و بودجه خود را بسازید، مدیریت کنید و تحلیل کنید. این ابزار برای ذخیره دستورهای پخت مورد علاقه، برنامه‌ریزی وعده‌های غذایی و اطمینان از تعادل تغذیه‌ای ایده‌آل است.',
          nutritionTitle: 'درک تغذیه دستورهای پخت',
          nutritionInfo: 'دستورهای پخت تصویری از محتوای تغذیه‌ای بر اساس مواد اولیه ارائه می‌دهند. کالری‌ها، درشت‌مغذی‌ها (کربوهیدرات‌ها، پروتئین‌ها، چربی‌ها) و ریزمغذی‌ها (ویتامین‌ها، مواد معدنی) را برای رسیدن به اهداف سلامتی خود رصد کنید. از ضریب مقیاس برای تنظیم اندازه پرس‌ها و به‌روزرسانی تغذیه و هزینه استفاده کنید.',
          usageTitle: 'چگونه شروع کنید',
          usage: 'یک دستور پخت جدید با وارد کردن نام، مواد اولیه، دستورالعمل‌ها و جزئیاتی مثل زمان آماده‌سازی و رژیم غذایی اضافه کنید. از جدول برای مشاهده، ویرایش یا حذف دستورهای پخت استفاده کنید. تغذیه هر دستور پخت را محاسبه کنید، ضریب مقیاس را برای کنترل اندازه پرس اعمال کنید و نتایج را صادر کنید تا ذخیره یا به اشتراک بگذارید.'
        },
        error: {
          exportImage: 'خطا در دانلود لیبل تغذیه.',
          addRecipeFields: 'لطفاً نام دستور پخت، مواد اولیه و زمان آماده‌سازی را پر کنید.',
          fetchIngredients: 'نمی‌تونیم مواد اولیه رو بارگیری کنیم. دوباره امتحان کنید؟',
          fetchRecipes: 'خطا در بارگیری دستورهای پخت. لطفاً دوباره امتحان کنید.',
          addRecipe: 'مشکلی در افزودن دستور پخت شما پیش اومد.',
          calculateNutrition: 'خطا در محاسبه تغذیه.',
          deleteRecipe: 'نمی‌تونیم دستور پخت رو حذف کنیم.',
          fetchRecipesAfterDelete: 'خطا در بارگیری دستورهای پخت پس از حذف.',
          updateRecipeFields: 'لطفاً همه فیلدها رو برای به‌روزرسانی دستور پخت پر کنید.',
          updateRecipe: 'خطا در به‌روزرسانی دستور پخت.',
          fetchRecipesAfterUpdate: 'خطا در بارگیری دستورهای پخت پس از به‌روزرسانی.',
          invalidIngredientList: 'لیست مواد اولیه نامعتبر به نظر می‌رسد.',
          exportPDF: 'خطا در دانلود PDF دستور پخت. لطفاً دوباره امتحان کنید.'
        },
        editModal: {
          title: 'ویرایش دستور پخت شما',
          cancel: 'لغو',
          update: 'به‌روزرسانی دستور پخت',
          updating: 'در حال به‌روزرسانی...'
        }
      },
      "centralPerk": {
        "title": "سنترال پرک: راه‌حل غذای سالم شما",
        "subtitle": "غذاهای خوشمزه و باکیفیت متناسب با رژیم غذایی شما، تحویل درب منزل!",
        "intro": {
          "title": "به سنترال پرک خوش آمدید",
          "subtitle": "رستوران آنلاین شما برای غذاهای مغذی و حرفه‌ای که برای سبک زندگی شما طراحی شده‌اند. از بین دستور پخت‌های انتخاب‌شده ما انتخاب کنید، برنامه غذایی روزانه خود را بسازید و به راحتی سفارش دهید!",
          "benefit1": {
            "title": "غذاهای متناسب با رژیم غذایی",
            "description": "وگان، بدون گلوتن یا پر پروتئین؟ دستور پخت‌های ما با ردیابی دقیق تغذیه برای نیازهای رژیم غذایی شما طراحی شده‌اند."
          },
          "benefit2": {
            "title": "مواد اولیه باکیفیت",
            "description": "ما از مواد اولیه تازه و درجه یک استفاده می‌کنیم تا هر وعده غذایی هم سالم و هم خوشمزه باشد."
          },
          "benefit3": {
            "title": "سفارش بدون دردسر",
            "description": "برنامه غذایی خود را در چند دقیقه بسازید و از طریق واتساپ برای تحویل سریع سفارش دهید."
          },
          "cta": "شروع به ساخت برنامه غذایی خود کنید"
        },
        "dietaryOptions": {
          "select": "انتخاب رژیم غذایی",
          "all": "همه",
          "omnivore": "همه‌چیزخوار",
          "vegetarian": "گیاهخوار",
          "vegan": "وگان",
          "gluten_free": "بدون گلوتن"
        },
        "days": {
          "monday": "دوشنبه",
          "tuesday": "سه‌شنبه",
          "wednesday": "چهارشنبه",
          "thursday": "پنج‌شنبه",
          "friday": "جمعه",
          "saturday": "شنبه",
          "sunday": "یکشنبه"
        },
        "allDiets": "همه رژیم‌ها",
        "maxCalories": "حداکثر کالری",
        "minProtein": "حداقل پروتئین (گرم)",
        "applyFilters": "اعمال فیلترها",
        "dietary": "رژیم غذایی",
        "calories": "کالری",
        "protein": "پروتئین",
        "prepTime": "زمان آماده‌سازی",
        "addToPlan": "افزودن به برنامه غذایی",
        "selectCategory": "انتخاب دسته‌بندی وعده",
        "selectDay": "انتخاب روز هفته",
        "day": "روز",
        "customPlan": "برنامه سفارشی",
        "remove": "حذف",
        "dropHere": "غذاهای انتخابی خود را اینجا بکشید و رها کنید تا برنامه روزانه خود را بسازید",
        "mealPlan": "برنامه غذایی روزانه شما",
        "noPlan": "هیچ غذایی انتخاب نشده است. غذاها را به برنامه خود اضافه کنید!",
        "totalNutrition": "مجموع تغذیه",
        "savePlan": "ذخیره برنامه غذایی",
        "planSaved": "برنامه غذایی با موفقیت ذخیره شد!",
        "orderPlan": "سفارش برنامه غذایی",
        "orderSuccess": "سفارش با موفقیت ثبت شد! شماره سفارش شما {orderId} است.",
        "orderError": "ثبت سفارش ناموفق بود. لطفاً دوباره تلاش کنید.",
        "mealPlanFull": "برنامه غذایی پر است (حداکثر ۵ غذا).",
        "availableRecipes": "منوی ما",
        "mealCategories": {
          "breakfast": "صبحانه",
          "morningSnack": "میان‌وعده صبح",
          "lunch": "ناهار",
          "afternoonSnack": "میان‌وعده بعدازظهر",
          "dinner": "شام"
        },
        "predefinedPlans": {
          "title": "برنامه‌های غذایی منتخب",
          "veganDelight": "لذت وگان",
          "highProtein": "روز پر پروتئین",
          "omnivoreBalanced": "همه‌چیزخوار متعادل",
          "glutenFreeBreakfast": "صبحانه بدون گلوتن"
        },
        "selectPlan": "انتخاب این برنامه",
        "totalCalories": "مجموع کالری",
        "totalProtein": "مجموع پروتئین",
        "tags": {
          "highProtein": "پر پروتئین",
          "lowCalorie": "کم کالری"
        },
        "viewDetails": "مشاهده جزئیات",
        "ingredients": "مواد اولیه",
        "instructions": "دستورالعمل‌ها",
        "noInstructions": "دستورالعملی ارائه نشده است",
        "close": "بستن",
        "submitOrder": "ثبت سفارش",
        "namePlaceholder": "نام خود را وارد کنید",
        "enterName": "لطفاً نام خود را وارد کنید.",
        "error": {
          "fetchRecipes": "نمی‌توان منو را بارگیری کرد. لطفاً دوباره تلاش کنید.",
          "popupBlocked": "نمی‌توان واتساپ را باز کرد. لطفاً پاپ‌آپ‌ها را مجاز کنید یا لینک را به صورت دستی باز کنید: {url}"
        }
      },
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;