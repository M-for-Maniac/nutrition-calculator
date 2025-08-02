import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Home from './Home';
import Kitchen from './Kitchen';
import RecipeNotebook from './RecipeNotebook';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  const { t, i18n } = useTranslation();
  const [errorMessage, setErrorMessage] = useState('');

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Router>
      <div className="App" dir={i18n.language === 'fa' ? 'rtl' : 'ltr'}>
        <nav className="navbar navbar-expand-lg navbar-light bg-white">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/nutrition-calculator">{t('app.title')}</Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/nutrition-calculator">{t('app.home')}</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/kitchen">{t('app.kitchen')}</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/cookbook">{t('app.cookbook')}</Link>
                </li>
              </ul>
              <div className="dropdown">
                <button
                  className="btn btn-primary-custom dropdown-toggle"
                  type="button"
                  id="languageDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {t('app.language')}
                </button>
                <ul className="dropdown-menu" aria-labelledby="languageDropdown">
                  <li>
                    <button className="dropdown-item" onClick={() => changeLanguage('en')}>
                      {t('app.english')}
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => changeLanguage('fa')}>
                      {t('app.persian')}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
        {errorMessage && (
          <div className="alert alert-danger text-center" role="alert">
            {errorMessage}
          </div>
        )}
        <Routes>
          <Route path="/nutrition-calculator" element={<Home setErrorMessage={setErrorMessage} />} />
          <Route path="/kitchen" element={<Kitchen setErrorMessage={setErrorMessage} />} />
          <Route path="/cookbook" element={<RecipeNotebook setErrorMessage={setErrorMessage} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;