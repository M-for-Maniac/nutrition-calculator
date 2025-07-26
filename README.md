# Nutrition Calculator

A web application to calculate nutritional values and costs of ingredients and recipes, with support for Persian ingredient names.

## Live Demo
- Frontend: [https://m-for-maniac.github.io/nutrition-calculator](https://m-for-maniac.github.io/nutrition-calculator)
- Backend: [https://maniac.pythonanywhere.com](https://maniac.pythonanywhere.com)

## Features
- **Kitchen**: Select ingredients, calculate nutrition and cost, update prices, and export results to CSV.
- **Cookbook**: Add, edit, delete, and calculate nutrition for recipes with dietary and complexity filters.
- Supports Persian ingredient names (e.g., "لوبیا آدوکی").

## Setup Instructions
### Backend
1. Clone the repository: `git clone https://github.com/your-github-username/nutrition-calculator.git`
2. Navigate to backend: `cd nutrition-calculator/backend`
3. Create a virtual environment: `python3.9 -m venv venv`
4. Activate: `source venv/bin/activate`
5. Install dependencies: `pip install -r requirements.txt`
6. Run: `python app.py`
7. Deploy to PythonAnywhere with the provided `requirements.txt`.

### Frontend
1. Navigate to frontend: `cd nutrition-calculator/frontend/ingredient-ui`
2. Install dependencies: `npm install`
3. Build: `npm run build`
4. Deploy to GitHub Pages: `npm run deploy`

## Requirements
### Backend (`requirements.txt`)
