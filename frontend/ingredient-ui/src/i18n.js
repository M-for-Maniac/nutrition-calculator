import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      app: {
        title: 'Nutrition Calculator',
        home: 'Home',
        kitchen: 'Kitchen',
        cookbook: 'Cookbook',
        language: 'Language',
        english: 'English',
        persian: 'Persian'
      },
      home: {
        hero: {
          title: 'Welcome to Your Nutrition Journey!',
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
        export: 'Export to CSV',
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
          vegan: 'Vegan'
        },
        error: {
          fetchIngredients: 'Oops! Couldn’t fetch ingredients. Try again?',
          calculate: 'Something went wrong calculating nutrition.',
          fetchRecipes: 'Couldn’t load recipes. Please try again.',
          updatePrice: 'Error updating price. Check your inputs.',
          updatePriceFields: 'Please fill in all fields to update the price.',
          refreshIngredients: 'Error refreshing ingredients.'
        }
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
        export: 'Export Nutrition',
        adding: 'Adding...',
        addButton: 'Add Recipe',
        confirmDelete: 'Are you sure you want to delete {recipe_name}?',
        dietaryOptions: {
          select: 'Choose a Dietary Preference',
          all: 'All',
          omnivore: 'Omnivore',
          vegetarian: 'Vegetarian',
          vegan: 'Vegan'
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
          cost: 'Cost ({currency})',
          actions: 'Actions'
        },
        error: {
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
          invalidIngredientList: 'The ingredient list seems invalid.'
        },
        editModal: {
          title: 'Edit Your Recipe',
          cancel: 'Cancel',
          update: 'Update Recipe',
          updating: 'Updating...'
        }
      }
    }
  },
  fa: {
    translation: {
      app: {
        title: 'ماشین حساب تغذیه',
        home: 'خانه',
        kitchen: 'آشپزخانه',
        cookbook: 'کتاب آشپزی',
        language: 'زبان',
        english: 'انگلیسی',
        persian: 'فارسی'
      },
      home: {
        hero: {
          title: 'به سفر تغذیه‌ای خود خوش آمدید!',
          subtitle: 'با ما به‌راحتی وعده‌های غذایی خود را برنامه‌ریزی کنید، تغذیه را ردیابی کنید و دستورهای پخت خوشمزه بسازید.',
          kitchenCTA: 'کاوش در آشپزخانه',
          cookbookCTA: 'کشف کتاب آشپزی'
        },
        features: {
          title: 'چرا اپلیکیشن ما را دوست خواهید داشت',
          kitchen: {
            title: 'ردیابی تغذیه',
            description: 'ارزش تغذیه‌ای مواد اولیه و وعده‌های غذایی خود را به‌سرعت محاسبه کنید.',
            button: 'حالا آشپزخانه را امتحان کنید'
          },
          cookbook: {
            title: 'مدیریت دستور پخت',
            description: 'دستورهای پخت خود را با فیلترهای رژیم غذایی و پیچیدگی بسازید، ویرایش کنید و سازمان‌دهی کنید.',
            button: 'حالا کتاب آشپزی را امتحان کنید'
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
          title: 'یک تور سریع بگیرید!',
          intro: 'با اپلیکیشن ما تازه‌کار هستید؟ بیایید باهم ببینیم چطور می‌توانید از آن بهترین استفاده را ببرید!',
          kitchen: {
            title: 'آشپزخانه: مرکز تغذیه شما',
            description: 'در آشپزخانه می‌توانید مواد اولیه را انتخاب کنید، مقدارشان را تعیین کنید و ارزش‌های تغذیه‌ای مثل کالری، پروتئین و چربی را محاسبه کنید. با فیلترهای رژیم غذایی یا جستجوی مواد اولیه، غذای ایده‌آل خود را برنامه‌ریزی کنید. حتی می‌توانید قیمت مواد اولیه را به‌روزرسانی کنید و نتایج را صادر کنید!',
            button: 'برو به آشپزخانه'
          },
          cookbook: {
            title: 'کتاب آشپزی: زمین بازی دستورهای پخت شما',
            description: 'کتاب آشپزی به شما امکان می‌دهد دستورهای پخت را بسازید، ویرایش کنید و مدیریت کنید. مواد اولیه را اضافه کنید، دستورالعمل‌ها را بنویسید و فیلترهای رژیم غذایی یا پیچیدگی را تنظیم کنید. تغذیه هر دستور پخت را محاسبه کنید و آن را به دلخواه افزایش یا کاهش دهید. دستورهای مورد علاقه‌تان را ذخیره کنید و به اشتراک بگذارید!',
            button: 'برو به کتاب آشپزی'
          }
        },
        sampleRecipe: {
          title: 'یک دستور پخت نمونه را امتحان کنید!',
          description: 'به کتاب آشپزی ما سر بزنید تا دستورهای پخت سالم و خوشمزه را کشف کنید.',
          button: 'کاوش در کتاب آشپزی'
        },
        footer: {
          text: 'با ❤️ توسط m-for-maniac ساخته شده است',
          github: 'ما را در گیت‌هاب ببینید'
        }
      },
      kitchen: {
        title: 'آشپزخانه',
        selectIngredients: 'مواد اولیه خود را انتخاب کنید',
        quantity: 'مقدار (گرم)',
        calculate: 'محاسبه تغذیه',
        calculating: 'در حال محاسبه...',
        export: 'صادر کردن به CSV',
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
          vegan: 'وگان'
        },
        error: {
          fetchIngredients: 'اوه! نمی‌تونیم مواد اولیه رو بارگیری کنیم. دوباره امتحان کنید؟',
          calculate: 'مشکلی در محاسبه تغذیه پیش اومد.',
          fetchRecipes: 'نمی‌تونیم دستورهای پخت رو بارگیری کنیم. لطفاً دوباره امتحان کنید.',
          updatePrice: 'خطا در به‌روزرسانی قیمت. ورودی‌ها رو بررسی کنید.',
          updatePriceFields: 'لطفاً همه فیلدها رو برای به‌روزرسانی قیمت پر کنید.',
          refreshIngredients: 'خطا در تازه‌سازی مواد اولیه.'
        }
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
        export: 'صادر کردن اطلاعات تغذیه',
        adding: 'در حال افزودن...',
        addButton: 'افزودن دستور پخت',
        confirmDelete: 'مطمئن هستید که می‌خواهید {recipe_name} را حذف کنید؟',
        dietaryOptions: {
          select: 'یک رژیم غذایی انتخاب کنید',
          all: 'همه',
          omnivore: 'همه‌چیزخوار',
          vegetarian: 'گیاه‌خوار',
          vegan: 'وگان'
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
          cost: 'هزینه ({currency})',
          actions: 'عملیات'
        },
        error: {
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
          invalidIngredientList: 'لیست مواد اولیه نامعتبر به نظر می‌رسه.'
        },
        editModal: {
          title: 'ویرایش دستور پخت شما',
          cancel: 'لغو',
          update: 'به‌روزرسانی دستور پخت',
          updating: 'در حال به‌روزرسانی...'
        }
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