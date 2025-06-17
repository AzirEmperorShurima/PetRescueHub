import React, { useState, useEffect } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { FaGoogle, FaApple, FaXTwitter } from 'react-icons/fa6';
import { Link, useNavigate } from 'react-router-dom';
import '../../assets/styles/components/auth/Auth.css';
import petLogo from '../../assets/images/logo.svg';
import { useAuth } from '../../components/contexts/AuthContext.jsx';
import { useNotification } from '../../components/contexts/NotificationContext';

function Login() {
  const navigate = useNavigate();
  const { login, logout, user } = useAuth();
  const { showNotification } = useNotification();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAlreadyLoggedIn, setShowAlreadyLoggedIn] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (user && user.id) {
      console.log("User already logged in:", user);
      setShowAlreadyLoggedIn(true);
    }
  }, [user]);

  const handleChangEmail = (e) => {
    setEmail(e.target.value);
    setError("");
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
    setError("");
  };

  const handleShowPass = () => {
    setShowPass((prev) => !prev);
  };

  const handleRememberMe = () => {
    setRememberMe((prev) => !prev);
  };

  const handleLoginGoogle = () => {
    // Implement Google login
  };

  const handleLoginApple = () => {
    // Implement Apple login
  };

  const handleLoginTwitter = () => {
    // Implement Twitter login
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login(email, password, rememberMe);
      showNotification('Đăng nhập thành công!', 'success');
      navigate('/');
    } catch (error) {
      setError("Email hoặc mật khẩu không đúng. Vui lòng thử lại.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueWithCurrentUser = () => {
    navigate('/');
  };

  const handleLogoutAndContinue = () => {
    logout();
    setShowAlreadyLoggedIn(false);
  };

  if (showAlreadyLoggedIn) {
    return (
      <div className="auth-form-container logged-in-container">
        <div className="auth-logo">
          <img src={petLogo} alt="PetRescueHub Logo" />
          <h2>PetRescueHub</h2>
        </div>
        <div className="auth-form-section logged-in-section">
          <div className="auth-heading">Bạn đã đăng nhập</div>
          <div className="auth-subtitle">
            Bạn đã đăng nhập với tài khoản <strong>{user.email}</strong>
          </div>
          <div className="auth-action-buttons">
            <button className="auth-button auth-button--primary" onClick={handleContinueWithCurrentUser}>
              Tiếp tục với tài khoản hiện tại
            </button>
            <button className="auth-button auth-button--outline" onClick={handleLogoutAndContinue}>
              Đăng xuất và đăng nhập với tài khoản khác
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-form-container">
      <div className="auth-logo">
        <img src={petLogo} alt="PetRescueHub Logo" />
        <h2>PetRescueHub</h2>
      </div>
      <div className="login-form-section">
        <div className="heading">Đăng nhập</div>
        <div className="auth-subtitle">Chào mừng trở lại với PetRescueHub</div>
        {error && <div className="error-message">{error}</div>}
        <form className="form" onSubmit={handleSubmitForm}>
          <div className="form-group">
            <label htmlFor="email">Email / Username</label>
            <input
              required
              className="input"
              value={email}
              onChange={handleChangEmail}
              type="text"
              name="email"
              id="email"
              placeholder="Nhập địa chỉ email hoặc tên đăng nhập của bạn"
              autoComplete="username"
            />
          </div>

          <div className="form-group password-group">
            <label htmlFor="password">Mật khẩu</label>
            <div className="password-input-wrapper">
              <input
                required
                className="input"
                value={password}
                onChange={handleChangePassword}
                type={showPass ? 'text' : 'password'}
                name="password"
                id="password"
                placeholder="Mật khẩu"
                autoComplete="current-password"
              />
              <button 
                type="button"
                onClick={handleShowPass}
                className="toggle-password-btn"
                aria-label={showPass ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
              >
                {showPass ? <AiFillEyeInvisible /> : <AiFillEye />}
              </button>
            </div>
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={handleRememberMe}
              />
              <label htmlFor="rememberMe">Ghi nhớ đăng nhập</label>
            </div>
            <div className="forgot-password">
              <Link to="/auth/forgot-password">Quên mật khẩu?</Link>
            </div>
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        <div className="social-account-container">
          <span className="title">Hoặc đăng nhập với</span>
          <div className="social-accounts">
            <button className="social-button google" onClick={handleLoginGoogle}>
              <FaGoogle className="svg" />
            </button>
            <button className="social-button apple" onClick={handleLoginApple}>
              <FaApple className="svg" />
            </button>
            <button className="social-button twitter" onClick={handleLoginTwitter}>
              <FaXTwitter className="svg" />
            </button>
          </div>
        </div>

        <div className="register-link">
          Bạn chưa có tài khoản? <Link to="/auth/register">Đăng ký ngay</Link>
        </div>
      </div>
      <div className="login-image-container">
        <img
          src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
          alt="Pet Rescue"
          className="login-image"
        />
        <div className="auth-quote">
          <p>
            Mỗi ngày, hàng nghìn thú cưng cũng như chủ nhân đã tìm thấy nhau qua ứng dụng của chúng tôi.
            Những ánh mắt hạnh phúc đó chính là động lực để chúng tôi tiếp tục phát triển.
          </p>
          <div className="auth-quote-author">
            Tìm hiểu thêm tại thế giới thú cưng của chúng tôi
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
