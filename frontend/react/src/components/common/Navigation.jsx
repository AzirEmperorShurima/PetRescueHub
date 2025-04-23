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

  // Kiểm tra scroll để thay đổi style của navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
                className={({isActive}) => isActive ? "nav-link active" : "nav-link"}
                to="/"
                end
              >
                {t.home}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({isActive}) => isActive ? "nav-link active" : "nav-link"}
                to="/forum"
              >
                {t.forum}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({isActive}) => isActive ? "nav-link active" : "nav-link"}
                to="/event"
              >
                {t.event}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({isActive}) => isActive ? "nav-link active" : "nav-link"}
                to="/adopt"
              >
                {t.adopt}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({isActive}) => isActive ? "nav-link active" : "nav-link"}
                to="/donate"
              >
                {t.donate}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({isActive}) => isActive ? "nav-link active" : "nav-link"}
                to="/petguide"
              >
                {t.petGuide || "Cẩm nang"}
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