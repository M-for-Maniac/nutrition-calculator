import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Kitchen from './Kitchen';
import RecipeNotebook from './RecipeNotebook';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [errorMessage, setErrorMessage] = useState('');

  return (
    <Router>
      <div className="container-fluid" style={{ minHeight: '100vh' }}>
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
          <div className="container">
            <Link className="navbar-brand" to="/kitchen" style={{ fontSize: '1.5rem' }}>Nutrition Calculator</Link>
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
              <div className="navbar-nav">
                <Link className="nav-link" to="/kitchen" style={{ fontSize: '1.1rem', padding: '10px' }}>Kitchen</Link>
                <Link className="nav-link" to="/cookbook" style={{ fontSize: '1.1rem', padding: '10px' }}>Cookbook</Link>
              </div>
            </div>
          </div>
        </nav>
        {errorMessage && (
          <div className="container">
            <div className="alert alert-danger mb-3">{errorMessage}</div>
          </div>
        )}
        <Routes>
          <Route path="/kitchen" element={<Kitchen setErrorMessage={setErrorMessage} />} />
          <Route path="/cookbook" element={<RecipeNotebook setErrorMessage={setErrorMessage} />} />
          <Route path="/" element={<Kitchen setErrorMessage={setErrorMessage} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;