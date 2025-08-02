import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Home({ setErrorMessage }) {
  const { t } = useTranslation();

  const styles = {
    hero: {
      background: 'linear-gradient(120deg, #295241, #1f3e31)', // Updated to new green palette
      color: '#f1f1f1', // Text on green
      padding: '60px 20px',
      borderRadius: '12px',
      textAlign: 'center',
      marginBottom: '40px'
    },
    card: {
      transition: 'transform 0.2s, box-shadow 0.2s',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '12px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
      backgroundColor: '#e9e2d6', // Text on red (beige) for cards
      border: '1px solid #295241' // Main green border
    },
    cardHover: {
      transform: 'scale(1.03)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.25)'
    },
    carousel: {
      maxWidth: '800px',
      margin: '0 auto',
      marginBottom: '40px'
    },
    tour: {
      background: 'linear-gradient(135deg, #f8f9fa, #e9e2d6)', // Updated to beige
      padding: '40px 20px',
      borderRadius: '12px',
      marginBottom: '40px',
      border: '1px solid #295241' // Main green border
    },
    tourCard: {
      transition: 'transform 0.2s, box-shadow 0.2s',
      borderRadius: '12px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
      backgroundColor: '#fff',
      border: '1px solid #1f3e31' // Darker green border
    },
    tourCardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.25)'
    },
    footer: {
      backgroundColor: '#295241', // Main green
      color: '#f1f1f1', // Text on green
      padding: '20px 0',
      textAlign: 'center'
    }
  };

  return (
    <>
      <div className="container">
        {/* Hero Section */}
        <div style={styles.hero} className="hero">
          <h1 className="display-4 mb-3">{t('home.hero.title')}</h1>
          <p className="lead mb-4">{t('home.hero.subtitle')}</p>
          {/* <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
            <Link to="/kitchen" className="btn btn-primary-custom btn-lg w-100 w-sm-auto" onClick={() => setErrorMessage('')}>
              {t('home.hero.kitchenCTA')}
            </Link>
            <Link to="/cookbook" className="btn btn-secondary-custom btn-lg w-100 w-sm-auto" onClick={() => setErrorMessage('')}>
              {t('home.hero.cookbookCTA')}
            </Link>
          </div> */}
        </div>

        {/* Feature Cards */}
        <div className="row mb-5 features">
          <div className="col-md-6 mb-4">
            <div
              className="card shadow-sm h-100"
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = styles.cardHover.transform;
                e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = styles.card.boxShadow;
              }}
            >
              <div className="card-body d-flex flex-column">
                <i className="fas fa-utensils fa-3x mb-3 icon-primary"></i>
                <h3 className="card-title">{t('home.features.kitchen.title')}</h3>
                <p className="card-text flex-grow-1">{t('home.features.kitchen.description')}</p>
                <Link to="/kitchen" className="btn btn-primary-custom mt-auto">
                  {t('home.features.kitchen.button')}
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div
              className="card shadow-sm h-100"
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = styles.cardHover.transform;
                e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = styles.card.boxShadow;
              }}
            >
              <div className="card-body d-flex flex-column">
                <i className="fas fa-book-open fa-3x mb-3 icon-secondary"></i>
                <h3 className="card-title">{t('home.features.cookbook.title')}</h3>
                <p className="card-text flex-grow-1">{t('home.features.cookbook.description')}</p>
                <Link to="/cookbook" className="btn btn-secondary-custom mt-auto">
                  {t('home.features.cookbook.button')}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tips Carousel */}
        <div style={styles.carousel} className="tips">
          <h2 className="text-center mb-4">{t('home.tips.title')}</h2>
          <div id="tipsCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              <div className="carousel-item active">
                <div className="card text-center" style={{ backgroundColor: '#e9e2d6', border: '1px solid #295241' }}>
                  <div className="card-body">
                    <p className="card-text">{t('home.tips.tip1')}</p>
                  </div>
                </div>
              </div>
              <div className="carousel-item">
                <div className="card text-center" style={{ backgroundColor: '#e9e2d6', border: '1px solid #295241' }}>
                  <div className="card-body">
                    <p className="card-text">{t('home.tips.tip2')}</p>
                  </div>
                </div>
              </div>
              <div className="carousel-item">
                <div className="card text-center" style={{ backgroundColor: '#e9e2d6', border: '1px solid #295241' }}>
                  <div className="card-body">
                    <p className="card-text">{t('home.tips.tip3')}</p>
                  </div>
                </div>
              </div>
              <div className="carousel-item">
                <div className="card text-center" style={{ backgroundColor: '#e9e2d6', border: '1px solid #295241' }}>
                  <div className="card-body">
                    <p className="card-text">{t('home.tips.tip4')}</p>
                  </div>
                </div>
              </div>
              <div className="carousel-item">
                <div className="card text-center" style={{ backgroundColor: '#e9e2d6', border: '1px solid #295241' }}>
                  <div className="card-body">
                    <p className="card-text">{t('home.tips.tip5')}</p>
                  </div>
                </div>
              </div>
            </div>
            <button className="carousel-control-prev carousel-control-accent" type="button" data-bs-target="#tipsCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next carousel-control-accent" type="button" data-bs-target="#tipsCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>

        {/* App Tour Section */}
        <div style={styles.tour} className="tour">
          <h2 className="text-center mb-4">{t('home.tour.title')}</h2>
          <p className="text-center lead mb-5">{t('home.tour.intro')}</p>
          <div className="row">
            <div className="col-md-6 mb-4">
              <div
                className="card h-100"
                style={styles.tourCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = styles.tourCardHover.transform;
                  e.currentTarget.style.boxShadow = styles.tourCardHover.boxShadow;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = styles.tourCard.boxShadow;
                }}
              >
                <div className="card-body">
                  <i className="fas fa-utensils fa-3x mb-3 icon-primary"></i>
                  <h3 className="card-title">{t('home.tour.kitchen.title')}</h3>
                  <p className="card-text">{t('home.tour.kitchen.description')}</p>
                  <Link to="/kitchen" className="btn btn-primary-custom mt-3">
                    {t('home.tour.kitchen.button')}
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div
                className="card h-100"
                style={styles.tourCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = styles.tourCardHover.transform;
                  e.currentTarget.style.boxShadow = styles.tourCardHover.boxShadow;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = styles.tourCard.boxShadow;
                }}
              >
                <div className="card-body">
                  <i className="fas fa-book-open fa-3x mb-3 icon-secondary"></i>
                  <h3 className="card-title">{t('home.tour.cookbook.title')}</h3>
                  <p className="card-text">{t('home.tour.cookbook.description')}</p>
                  <Link to="/cookbook" className="btn btn-secondary-custom mt-3">
                    {t('home.tour.cookbook.button')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sample Recipe CTA */}
        <div className="text-center mb-5 cta">
          <h2 className="text-accent">{t('home.sampleRecipe.title')}</h2>
          <p>{t('home.sampleRecipe.description')}</p>
          <Link to="/cookbook" className="btn btn-accent-custom btn-lg" onClick={() => setErrorMessage('')}>
            {t('home.sampleRecipe.button')}
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer} className="w-100">
        <div className="container-fluid py-3">
          <p>{t('home.footer.text')}</p>
          <a href="https://github.com/m-for-maniac" className="text-footer" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-github fa-lg me-2 icon-accent"></i>
            {t('home.footer.github')}
          </a>
        </div>
      </footer>
    </>
  );
}

export default Home;