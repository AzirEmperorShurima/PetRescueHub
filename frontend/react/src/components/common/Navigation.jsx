import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/components/Navigation.css';
import logo from '../../assets/images/logo.svg';
import { LanguageContext } from '../../context/LanguageContext';
import translations from '../../utils/translations';

const Navigation = () => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  const [isLogoVisible, setLogoVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLogoVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img 
            src={logo} 
            alt="Pet Rescue Hub" 
            className={`logo ${isLogoVisible ? 'visible' : ''}`}
          />
        </Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">{t.home}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/forum">{t.forum}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/event">{t.event}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/adopt">{t.adopt}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/donate">{t.donate}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/PetGuide">{t.petGuide}</Link>
            </li>
          </ul>
          
          <div className="nav-buttons">
            <Link to="/auth/login" className="btn btn-outline-primary me-2">Đăng nhập</Link>
            <Link to="/auth/register" className="btn btn-primary">Đăng ký</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;