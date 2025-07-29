import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Home({ setErrorMessage }) {
  const { t } = useTranslation();

  const styles = {
    hero: {
      background: 'linear-gradient(120deg, #3a846a, #2b604b)', // Updated to palette colors
      color: '#d6c5ac',
      padding: '60px 20px',
      borderRadius: '10px',
      textAlign: 'center',
      marginBottom: '40px',
    },
    card: {
      transition: 'transform 0.2s, box-shadow 0.2s',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#d6c5ac' // Neutral background
    },
    cardHover: {
      transform: 'scale(1.05)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
    },
    carousel: {
      maxWidth: '800px',
      margin: '0 auto',
      marginBottom: '40px'
    },
    tour: {
      background: 'linear-gradient(135deg, #f8f9fa, #d6c5ac)', // Updated with palette
      padding: '40px 20px',
      borderRadius: '12px',
      marginBottom: '40px'
    },
    tourCard: {
      transition: 'transform 0.2s, box-shadow 0.2s',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#fff'
    },
    tourCardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
    },
    footer: {
      backgroundColor: '#2b604b', // Dark green for footer
      color: '#d6c5ac',
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
          <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
            <Link to="/kitchen" className="btn btn-primary-custom btn-lg w-100 w-sm-auto" onClick={() => setErrorMessage('')}>
              {t('home.hero.kitchenCTA')}
            </Link>
            <Link to="/cookbook" className="btn btn-secondary-custom btn-lg w-100 w-sm-auto" onClick={() => setErrorMessage('')}>
              {t('home.hero.cookbookCTA')}
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="row mb-5">
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
        <div style={styles.carousel}>
          <h2 className="text-center mb-4">{t('home.tips.title')}</h2>
          <div id="tipsCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              <div className="carousel-item active">
                <div className="card text-center">
                  <div className="card-body">
                    <p className="card-text">{t('home.tips.tip1')}</p>
                  </div>
                </div>
              </div>
              <div className="carousel-item">
                <div className="card text-center">
                  <div className="card-body">
                    <p className="card-text">{t('home.tips.tip2')}</p>
                  </div>
                </div>
              </div>
              <div className="carousel-item">
                <div className="card text-center">
                  <div className="card-body">
                    <p className="card-text">{t('home.tips.tip3')}</p>
                  </div>
                </div>
              </div>
              <div className="carousel-item">
                <div className="card text-center">
                  <div className="card-body">
                    <p className="card-text">{t('home.tips.tip4')}</p>
                  </div>
                </div>
              </div>
              <div className="carousel-item">
                <div className="card text-center">
                  <div className="card-body">
                    <p className="card-text">{t('home.tips.tip5')}</p>
                  </div>
                </div>
              </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#tipsCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#tipsCarousel" data-bs-slide="next">
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
        <div className="text-center mb-5">
          <h2>{t('home.sampleRecipe.title')}</h2>
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
          <a href="https://github.com/m-for-maniac" className="text-white" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-github fa-lg me-2"></i>
            {t('home.footer.github')}
          </a>
        </div>
      </footer>
    </>
  );
}

export default Home;