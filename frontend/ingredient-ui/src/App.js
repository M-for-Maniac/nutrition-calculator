// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Home from './Home';
import Kitchen from './Kitchen';
import RecipeNotebook from './RecipeNotebook';
import GalleryPage from './GalleryPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import AboutPage from './AboutPage';
// import { FaBookOpen } from 'react-icons/fa'; // npm install react-icons

function App() {
  const { t, i18n } = useTranslation();
  const [errorMessage, setErrorMessage] = useState('');

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Router basename="/nutrition-calculator">
      <div className="App" dir={i18n.language === 'fa' ? 'rtl' : 'ltr'}>
        {/* CLEAN NAVBAR — ONLY LOGO + LANGUAGE */}
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
          <div className="container-fluid">
            {/* Logo */}
            <Link className="navbar-brand fw-bold text-success" to="/">
              Nutrino
            </Link>
            

            {/* Mobile: Replace burger with language dropdown */}
            <div className="d-lg-none">
              <div className="dropdown">
                <button
                  className="btn btn-outline-success dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  {i18n.language === 'fa' ? 'فارسی' : 'English'}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><button className="dropdown-item" onClick={() => changeLanguage('en')}>English</button></li>
                  <li><button className="border-top dropdown-item" onClick={() => changeLanguage('fa')}>فارسی</button></li>
                  <li className="nav-item"><Link className="nav-link" to="/kitchen">{t('app.kitchen')}</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/cookbook">{t('app.cookbook')}</Link></li>
                </ul>
              </div>
            </div>
            {/* <Link to="/about" className="btn btn-outline-success d-flex align-items-center gap-2 mx-2">
              <FaBookOpen /> {t('app.about')}
            </Link> */}

            {/* Desktop: Normal collapse with only language */}
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                {/* HIDDEN PREMIUM LINKS — UNCOMMENT WHEN READY */}
                
                <li className="nav-item"><Link className="nav-link" to="/nutrition-calculator">{t('app.home')}</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/kitchen">{t('app.kitchen')}</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/cookbook">{t('app.cookbook')}</Link></li>
               
              </ul>

              {/* Desktop Language Dropdown */}
              <div className="dropdown d-none d-lg-block">
                <button
                  className="btn btn-outline-success dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  {t('app.language')}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><button className="dropdown-item" onClick={() => changeLanguage('en')}>English</button></li>
                  <li><button className="dropdown-item" onClick={() => changeLanguage('fa')}>فارسی</button></li>
                </ul>
              </div>
            </div>
          </div>
        </nav>

        {/* Global Error Alert */}
        {errorMessage && (
          <div className="alert alert-danger text-center mx-3 mt-3" role="alert">
            {errorMessage}
            <button type="button" className="btn-close float-end" onClick={() => setErrorMessage('')}></button>
          </div>
        )}

        {/* ROUTES */}
        <Routes>
          {/* PUBLIC: Nutrino Shop — First page everyone sees */}
          <Route path="/" element={<GalleryPage setErrorMessage={setErrorMessage} />} />
          <Route path="/nutrition-calculator" element={<GalleryPage setErrorMessage={setErrorMessage} />} />
          <Route path="/order" element={<GalleryPage setErrorMessage={setErrorMessage} />} />
          <Route path="/about" element={<AboutPage />} />

          {/* PRIVATE ADMIN TOOLS — Only you know these URLs */}
          <Route path="/kitchen" element={<Kitchen setErrorMessage={setErrorMessage} />} />
          <Route path="/cookbook" element={<RecipeNotebook setErrorMessage={setErrorMessage} />} />
          <Route path="/home" element={<Home setErrorMessage={setErrorMessage} />} />

          {/* Fallback */}
          <Route path="*" element={<GalleryPage setErrorMessage={setErrorMessage} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;