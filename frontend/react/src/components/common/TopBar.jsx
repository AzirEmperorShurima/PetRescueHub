import React, { useContext } from 'react';
import { GB, VN } from 'country-flag-icons/react/3x2';
import { LanguageContext } from '../../contexts/LanguageContext';
import translations from '../../utils/translations';
import '../../assets/styles/components/TopBar.css';


const TopBar = () => {
  const { language, toggleLanguage } = useContext(LanguageContext);
  const t = translations[language];

  return (
    <div className="top-bar">
      <div className="container">
        <div className="top-bar-content">
          <div className="contact-info">
            <span><i className="fas fa-phone"></i> {t.hotline}</span>
            <span><i className="fas fa-envelope"></i> {t.email}</span>
          </div>
          
          <div className="top-bar-right">
            <div className="search-container">
              <input type="text" className="search-input" placeholder={t.search} />
              <button className="btn-icon">
                <i className="fas fa-search"></i>
              </button>
            </div>

            <button 
              className="btn-icon lang-switch" 
              onClick={toggleLanguage}
            >
              {language === 'vi' ? 
                <GB className="flag-icon" title="Switch to English" /> : 
                <VN className="flag-icon" title="Chuyển sang Tiếng Việt" />
              }
            </button>

            <div className="social-links">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;