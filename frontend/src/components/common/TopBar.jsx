import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import translations from '../../utils/translations';
import { FaPhone, FaEnvelope, FaSearch, FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import '../../assets/styles/components/TopBar.css';

const TopBar = () => {
  const { language, toggleLanguage } = useContext(LanguageContext);
  const t = translations[language];

  const flagSrc = language === 'vi'
    ? 'https://flagcdn.com/gb.svg'
    : 'https://flagcdn.com/vn.svg';
  const flagAlt = language === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt';

  return (
    <div className="top-bar">
      <div className="top-bar-content">
        <div className="contact-info">
          <div className="contact-item">
            <FaPhone />
            <span>{t.hotline}</span>
          </div>
          <div className="contact-item">
            <FaEnvelope />
            <span>{t.email}</span>
          </div>
        </div>

        <div className="top-bar-right">
          <div className="search-container">
            <input 
              type="text" 
              className="search-input" 
              placeholder={t.search} 
            />
            <button className="search-button" aria-label="Search">
              <FaSearch />
            </button>
          </div>

          <button 
            className="lang-switch" 
            onClick={toggleLanguage} 
            title={flagAlt}
          >
            <img src={flagSrc} alt={flagAlt} />
          </button>

          <div className="social-links">
            <a href="https://www.facebook.com/people/Pet-RescueHub/61574718733547/" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://www.instagram.com/pet_rescuehub/" aria-label="Instagram">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
