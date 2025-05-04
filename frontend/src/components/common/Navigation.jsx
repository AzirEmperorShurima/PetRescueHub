import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import '../../assets/styles/components/Navigation.css';
import logo from '../../assets/images/logo.svg';
import { useAuth } from '../contexts/AuthContext';
import UserMenu from './UserMenu/UserMenu';
import { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import translations from '../../utils/translations';

const Navigation = () => {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  const [isSticky, setIsSticky] = useState(false);
  const [isLogoVisible, setIsLogoVisible] = useState(true);
  const navRef = useRef(null);
  const { user, loading } = useAuth();

  // Hiệu ứng hiển thị logo
  useEffect(() => {
    setIsLogoVisible(true);
  }, []);

  const handleLogin = () => {
    navigate('/auth/login');
  };

  const handleRegister = () => {
    navigate('/auth/register');
  };

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

          {loading ? (
            <div className="nav-buttons">
              <div className="loading-indicator">Đang tải...</div>
            </div>
          ) : user && user.id ? (
            <UserMenu user={user} />
          ) : (
            <div className="nav-buttons">
              <button 
                className="btn btn-outline-primary me-2" 
                onClick={handleLogin}
              >
                {t?.login || 'Đăng nhập'}
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleRegister}
              >
                {t?.register || 'Đăng ký'}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;