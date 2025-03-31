import React, { useContext, useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import '../../assets/styles/components/Navigation.css';
import logo from '../../assets/images/logo.svg';
import { LanguageContext } from '../contexts/LanguageContext';
import translations from '../../utils/translations';

const Navigation = () => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  const [isLogoVisible, setLogoVisible] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLogoVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Thêm effect để xử lý sự kiện cuộn
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const navHeight = navRef.current?.offsetHeight || 0;
      
      // Khi cuộn xuống quá chiều cao của navbar, thêm class sticky
      if (scrollPosition > navHeight) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    // Đăng ký sự kiện cuộn
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup khi component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav 
      ref={navRef}
      className={`navbar navbar-expand-lg navbar-light ${isSticky ? 'sticky' : ''}`}
    >
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img
            src={logo}
            alt="Pet Rescue Hub Icon"
            className={`logo ${isLogoVisible ? 'visible' : ''}`}
          />
          <span className="logo-text">
            <span className="pet">Pet</span>
            <span className="rescuehub">RescueHub</span>
          </span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/"
                exact
                activeClassName="active"
              >
                {t.home}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/forum" activeClassName="active">
                {t.forum}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/event" activeClassName="active">
                {t.event}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/adopt" activeClassName="active">
                {t.adopt}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/donate" activeClassName="active">
                {t.donate}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/PetGuide"
                activeClassName="active"
              >
                {t.petGuide}
              </NavLink>
            </li>
          </ul>

          <div className="nav-buttons">
            <Link to="/auth/login" className="btn btn-outline-primary me-2">
              {t.login}
            </Link>
            <Link to="/auth/register" className="btn btn-primary">
              {t.register}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;