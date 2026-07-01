# Nutrition Calculator

A modern web application for calculating nutritional values, costs, and recipes with full transparency. Built with a focus on high-protein, balanced meals for our cloud kitchen operations. Supports Persian ingredient names and live calculations.

## Live Demo
- **Frontend**: [https://m-for-maniac.github.io/nutrition-calculator](https://m-for-maniac.github.io/nutrition-calculator)
- **Backend/API**: [https://maniac.pythonanywhere.com](https://maniac.pythonanywhere.com)

## Project Structure
This **public repository contains only the frontend** for transparency and security.  
Sensitive backend logic, database, and data files (`Data/` and `Backend/`) are **untracked** and excluded via `.gitignore` (kept private on our production server).

## Features
- Real-time nutrition and cost calculations for ingredients and recipes.
- **Kitchen Module**: Ingredient management, price updates, and CSV export.
- **Cookbook Module**: Add, edit, delete, and calculate nutrition for recipes with dietary tags, complexity filters, and Persian support.
- Modular design for easy customization and scalability.

## Setup Instructions (Frontend Only)

### Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/m-for-maniac/nutrition-calculator.git
   cd nutrition-calculator

2. Navigate to frontend:
   ```bash
   cd frontend/ingredient-ui

3. Install dependencies:
   ```bash
   npm install

4. Run locally:
   ```bash
   npm start

5. Build & Deploy to GitHub Pages:
   ```bash
   npm run build
   npm run deploy

## Backend (Private / Production)
Hosted separately on PythonAnywhere.  
Contact us for collaboration, self-hosting details, or access to the backend (Flask + required dependencies).

## Tech Stack
- **Frontend**: React, Axios, Chart.js (react-chartjs-2), React Router, Bootstrap, Font Awesome, gh-pages.
- **Backend**: Flask (Python), Pandas, NumPy (private deployment).

## Contributing
We welcome contributions to the public frontend!  
Fork the repo, create a feature branch, and submit a Pull Request. For backend-related ideas or collaboration, please reach out first.

## License
Frontend is open source under the **MIT License**.  
Backend and sensitive components remain proprietary for operational security and confidentiality.

---

**Made with ❤️ for transparent, healthy nutrition.**  
Part of our cloud kitchen initiative delivering verified, high-protein meals with real calculations.