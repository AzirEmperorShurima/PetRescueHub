import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import '../../assets/styles/components/Navigation.css';
import logo from '../../assets/images/logo.svg';
import { useAuth } from '../contexts/AuthContext';
import UserMenu from './UserMenu/UserMenu';
import { LanguageContext } from '../contexts/LanguageContext';
import translations from '../../utils/translations';

const Navigation = () => {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  const [isSticky, setIsSticky] = useState(false);
  const [isLogoVisible, setIsLogoVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  const { user, loading } = useAuth();
  const [showAdoptDropdown, setShowAdoptDropdown] = useState(false);

  useEffect(() => {
    setIsLogoVisible(true);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

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

        <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                to="/"
              >
                {t.home}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                to="/forum"
              >
                {t.forum}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                to="/event"
              >
                {t.event}
              </NavLink>
            </li>
            <li className="nav-item dropdown"
                onMouseEnter={() => setShowAdoptDropdown(true)}
                onMouseLeave={() => setShowAdoptDropdown(false)}>
              <NavLink 
                className={({ isActive }) => `nav-link dropdown-toggle ${isActive ? 'active' : ''}`}
                to="/adopt"
              >
                {t.adopt}
              </NavLink>
              <ul className={`dropdown-menu ${showAdoptDropdown ? 'show' : ''}`}>
                <li>
                  <Link className="dropdown-item" to="/findhome">
                    Tìm nhà mới
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/adopt">
                    Nhận nuôi thú cưng
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                to="/donate"
              >
                {t.donate}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                to="/PetGuide"
              >
                {t.petGuide}
              </NavLink>
            </li>
          </ul>
        </div>

        <div>
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
