import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      app: {
        title: 'Nutrino',
        home: 'Home',
        kitchen: 'Kitchen',
        cookbook: 'Cookbook',
        gallery: 'Gallery', // Added
        language: 'Language',
        english: 'English',
        persian: 'Persian'
      },
      home: {
        hero: {
          title: 'Welcome to Nutrino, Your Nutritious Journey!',
          subtitle: 'Easily plan meals, track nutrition, and create delicious recipes with us.',
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
          gallery: { // Added
            title: 'Meal Planning',
            description: 'Browse recipes, create a daily meal plan, and order your favorite dishes.',
            button: 'Try Gallery Now'
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
          gallery: { // Added
            title: 'Gallery: Your Meal Planner',
            description: 'Explore a variety of recipes in the Gallery, filter by dietary needs, and build a daily meal plan. Add up to 5 recipes, calculate total nutrition, and place an order for your selected meals!',
            button: 'Go to Gallery'
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
        addIngredient: "Add New Ingredient",
        addIngredientButton: "Add Ingredient",
        ingredientName: "Ingredient Name (English)",
        persianName: "Persian Name",
        calories: "Calories",
        totalFat: "Total Fat",
        cholesterol: "Cholesterol",
        sodium: "Sodium",
        potassium: "Potassium",
        totalCarbohydrate: "Total Carbohydrate",
        protein: "Protein",
        showOptionalFields: "Show Optional Nutritional Fields",
        hideOptionalFields: "Hide Optional Nutritional Fields",
        selectCategory: "Category",
        category: "Category",
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
          addIngredientFields: "Please fill all required fields for the new ingredient.",
          addIngredient: "Failed to add ingredient. Please try again."
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
          actions: 'Actions'
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
      gallery: {
        title: 'Plan Your Perfect Meals',
        subtitle: 'Explore our recipes and create a daily meal plan tailored to your diet!',
        allDiets: 'All Diets',
        minProtein: 'Min Protein (g)', // Added
        dietaryOptions: {
          select: 'Choose a Dietary Preference',
          omnivore: 'Omnivore',
          vegetarian: 'Vegetarian',
          vegan: 'Vegan',
          gluten_free: 'Gluten-Free'
        },
        maxCalories: 'Max Calories',
        applyFilters: 'Apply Filters',
        dietary: 'Dietary',
        calories: 'Calories',
        prepTime: 'Prep Time',
        addToPlan: 'Add to Meal Plan',
        remove: 'Remove', // Added
        mealPlan: 'Your Daily Meal Plan',
        noPlan: 'No meals selected. Add recipes to your plan!',
        totalNutrition: 'Total Nutrition',
        emailPlaceholder: 'Enter your email to order',
        enterEmail: 'Please enter your email to place an order.',
        orderPlan: 'Order Meal Plan',
        orderSuccess: 'Order placed successfully! Your order ID is {orderId}.',
        mealPlanFull: 'Meal plan is full (max 5 recipes).'
      }
    }
  },
  fa: {
    translation: {
      app: {
        title: 'نوترینو',
        home: 'خانه',
        kitchen: 'آشپزخانه',
        cookbook: 'کتاب آشپزی',
        gallery: 'گالری', // Added
        language: 'زبان',
        english: 'انگلیسی',
        persian: 'فارسی'
      },
      home: {
        hero: {
          title: 'به نوترینو خوش اومدی!',
          subtitle: 'با ما به‌راحتی وعده‌های غذایی خود را برنامه‌ریزی کنید، تغذیه را ردیابی کنید و دستورهای پخت خوشمزه بسازید.',
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
          gallery: { // Added
            title: 'برنامه‌ریزی غذایی',
            description: 'دستورهای پخت را مرور کنید، یک برنامه غذایی روزانه بسازید و غذاهای مورد علاقه خود را سفارش دهید.',
            button: 'گالری را امتحان کنید'
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
          gallery: { // Added
            title: 'گالری: برنامه‌ریز غذایی شما',
            description: 'در گالری انواع دستورهای پخت را کاوش کنید، بر اساس نیازهای غذایی فیلتر کنید و یک برنامه غذایی روزانه بسازید. تا ۵ دستور پخت را اضافه کنید، تغذیه کل را محاسبه کنید و برای وعده‌های انتخاب‌شده سفارش دهید!',
            button: 'برو به گالری'
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
        exportPrompt: 'برای دانلود لیبل روی تأیید کلیک کنید .',
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
          actions: 'عملیات'
        },
        notes: {
          title: 'چگونه از کتاب آشپزی استفاده کنید',
          purposeTitle: 'چرا از کتاب آشپزی استفاده کنید؟',
          purpose: 'کتاب آشپزی به شما امکان می‌دهد دستورهای پخت متناسب با رژیم غذایی و بودجه خود را بسازید، مدیریت کنید و تحلیل کنید. این ابزار برای ذخیره دستورهای پخت مورد علاقه، برنامه‌ریزی وعده‌های غذایی و اطمینان از تعادل تغذیه‌ای ایده‌آل است.',
          nutritionTitle: 'درک تغذیه دستورهای پخت',
          nutritionInfo: 'دستورهای پخت تصویری از محتوای تغذیه‌ای بر اساس مواد اولیه ارائه می‌دهند. کالری‌ها، درشت‌مغذی‌ها (کربوهیدرات‌ها، پروتئین‌ها، چربی‌ها) و ریزمغذی‌ها (ویتامین‌ها، مواد معدنی) را برای رسیدن به اهداف سلامتی خود بررسی کنید. از ضریب مقیاس برای تنظیم اندازه وعده‌ها و به‌روزرسانی تغذیه و هزینه استفاده کنید.',
          usageTitle: 'چگونه شروع کنید',
          usage: 'یک دستور پخت جدید با وارد کردن نام، مواد اولیه، دستورالعمل‌ها و جزئیاتی مانند زمان آماده‌سازی و رژیم غذایی اضافه کنید. از جدول برای مشاهده، ویرایش یا حذف دستورهای پخت استفاده کنید. تغذیه هر دستور پخت را محاسبه کنید، ضریب مقیاس را برای کنترل اندازه وعده اعمال کنید و نتایج را برای ذخیره یا اشتراک صادر کنید.'
        },
        error: {
          exportImage: 'خطا در صادر کردن تصویر برچسب تغذیه',
          addRecipeFields: 'لطفاً نام دستور پخت، مواد اولیه و زمان آماده‌سازی رو پر کنید.',
          fetchIngredients: 'نمی‌تونیم مواد اولیه رو بارگیری کنیم. دوباره امتحان کنید؟',
          fetchRecipes: 'خطا در بارگیری دستورهای پخت. لطفاً دوباره امتحان کنید.',
          addRecipe: 'مشکلی در افزودن دستور پخت پیش اومد.',
          calculateNutrition: 'خطا در محاسبه تغذیه.',
          deleteRecipe: 'نمی‌تونیم دستور پخت رو حذف کنیم.',
          fetchRecipesAfterDelete: 'خطا در بارگیری دستورهای پخت پس از حذف.',
          updateRecipeFields: 'لطفاً همه فیلدها رو برای به‌روزرسانی دستور پخت پر کنید.',
          updateRecipe: 'خطا در به‌روزرسانی دستور پخت.',
          fetchRecipesAfterUpdate: 'خطا در بارگیری دستورهای پخت پس از به‌روزرسانی.',
          invalidIngredientList: 'لیست مواد اولیه نامعتبر به نظر می‌رسه.',
          exportPDF: 'صدور فایل دستور غذا ناموفق بود. لطفاً دوباره امتحان کنید.'
        },
        editModal: {
          title: 'ویرایش دستور پخت شما',
          cancel: 'لغو',
          update: 'به‌روزرسانی دستور پخت',
          updating: 'در حال به‌روزرسانی...'
        }
      },
      gallery: {
        title: 'وعده‌های غذایی خود را برنامه‌ریزی کنید',
        subtitle: 'دستورهای غذایی ما را کاوش کنید و برنامه غذایی روزانه متناسب با رژیم خود بسازید!',
        allDiets: 'همه رژیم‌ها',
        minProtein: 'حداقل پروتئین (گرم)', // Added
        dietaryOptions: {
          select: 'یک رژیم غذایی انتخاب کنید',
          omnivore: 'همه‌چیزخوار',
          vegetarian: 'گیاه‌خوار',
          vegan: 'وگان',
          gluten_free: 'بدون گلوتن'
        },
        maxCalories: 'حداکثر کالری',
        applyFilters: 'اعمال فیلترها',
        dietary: 'رژیم غذایی',
        calories: 'کالری',
        prepTime: 'زمان آماده‌سازی',
        addToPlan: 'افزودن به برنامه غذایی',
        remove: 'حذف', // Added
        mealPlan: 'برنامه غذایی روزانه شما',
        noPlan: 'هیچ وعده‌ای انتخاب نشده است. دستورهای غذایی را به برنامه خود اضافه کنید!',
        totalNutrition: 'تغذیه کل',
        emailPlaceholder: 'ایمیل خود را برای سفارش وارد کنید',
        enterEmail: 'لطفاً ایمیل خود را برای ثبت سفارش وارد کنید.',
        orderPlan: 'سفارش برنامه غذایی',
        orderSuccess: 'سفارش با موفقیت ثبت شد! شناسه سفارش شما {orderId} است.',
        mealPlanFull: 'برنامه غذایی پر است (حداکثر ۵ دستور غذایی).'
      }
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
    },
    debug: true
  });

export default i18n;