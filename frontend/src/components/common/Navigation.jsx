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
  const [menuOpen, setMenuOpen] = useState(false);              // ← Thêm dòng này
  const navRef = useRef(null);
  const { user, loading } = useAuth();

  // Hiệu ứng hiển thị logo
  useEffect(() => {
    setIsLogoVisible(true);
  }, []);

  const toggleMenu = () => {                                     // ← Thêm hàm này
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

        {/* ↓ Nút hamburger toggle chỉ hiện ở mobile */}
        <button 
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}                                  // ← Gọi toggleMenu
          aria-controls="navbarNav"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* ↓ Thay đổi class collapse để dùng state menuOpen */}
        <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="navbarNav">
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
