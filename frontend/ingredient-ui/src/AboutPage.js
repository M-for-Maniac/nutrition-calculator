// src/AboutPage.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import './AboutPage.css';

const AboutPage = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="about-page container my-5" dir={i18n.language === 'fa' ? 'rtl' : 'ltr'}>
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold text-success">{t('about.title')}</h1>
        <p className="lead text-muted">{t('about.subtitle')}</p>
      </div>

      <div className="story-section bg-white rounded-4 shadow p-5 mb-5">
        <div className="row align-items-center mb-5">
          <div className="col-lg-6">
            <img src="/nutrition-calculator/images/about/cafe-exterior.jpg" alt="Central Perk Cafe" className="img-fluid rounded-3 shadow" />
          </div>
          <div className="col-lg-6">
            <h3>{t('about.section1.title')}</h3>
            <p>{t('about.section1.text1')}</p>
            <p>{t('about.section1.text2')}</p>
          </div>
        </div>

        <div className="row flex-row-reverse align-items-center mb-5">
          <div className="col-lg-6">
            <img src="/nutrition-calculator/images/about/friends-table.jpg" alt="Friends gathering" className="img-fluid rounded-3 shadow" />
          </div>
          <div className="col-lg-6">
            <h3>{t('about.section2.title')}</h3>
            <p>{t('about.section2.text')}</p>
          </div>
        </div>

        <div className="row align-items-center mb-5">
          <div className="col-lg-6">
            <img src="/nutrition-calculator/images/about/chandlers-toast.jpg" alt="Chandler's Thanksgiving Toast" className="img-fluid rounded-3 shadow" />
          </div>
          <div className="col-lg-6">
            <h3>{t('about.section3.title')}</h3>
            <p>{t('about.section3.text1')}</p>
            <p>{t('about.section3.text2')}</p>
          </div>
        </div>

        <div className="text-center py-5">
          <h3 className="text-success">{t('about.dedication.title')}</h3>
          <p className="lead">{t('about.dedication.text')}</p>
          <p className="fw-bold">{t('about.dedication.team')}</p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;