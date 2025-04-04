import React, { useState, useEffect } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { FaGoogle, FaApple, FaXTwitter } from 'react-icons/fa6';
import { Link, useNavigate } from 'react-router-dom';
import '../../assets/styles/components/auth/Auth.css';
import petLogo from '../../assets/images/logo.svg';
import { useAuth } from '../../components/contexts/AuthContext';
import { useNotification } from '../../components/contexts/NotificationContext';

function Register() {
  const navigate = useNavigate();
  const { register, logout, user } = useAuth();
  const { showNotification } = useNotification();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
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

  const handleAgreeTerms = () => {
    setAgreeTerms((prev) => !prev);
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

    if (!agreeTerms) {
      setError("Bạn cần đồng ý với điều khoản dịch vụ để tiếp tục.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await register(email, password);
      showNotification('Đăng ký thành công!', 'success');
      navigate('/');
    } catch (error) {
      setError("Đăng ký thất bại. Vui lòng thử lại sau.");
      console.error("Register error:", error);
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
      <div className="login-form-container">
        <div className="auth-logo">
          <img src={petLogo} alt="PetRescueHub Logo" />
          <h2>PetRescueHub</h2>
        </div>

        <div className="auth-form-section">
          <div className="heading">Bạn đã đăng nhập</div>
          <div className="auth-subtitle">
            Bạn đã đăng nhập với tài khoản <strong>{user.email}</strong>
          </div>

          <div className="already-logged-in-options">
            <button className="btn btn-primary" onClick={handleContinueWithCurrentUser}>
              Tiếp tục với tài khoản hiện tại
            </button>
            <button className="btn btn-outline-danger" onClick={handleLogoutAndContinue}>
              Đăng xuất và đăng ký tài khoản mới
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

      <div className="auth-form-section">
        <div className="heading">Đăng ký</div>
        <div className="auth-subtitle">Chào mừng bạn đến với PetRescueHub</div>

        {error && <div className="error-message">{error}</div>}

        <form className="form" onSubmit={handleSubmitForm}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              required
              className="input"
              value={email}
              onChange={handleChangEmail}
              type="email"
              name="email"
              id="email"
              placeholder="Nhập địa chỉ email của bạn"
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
                type={showPass ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Nhập mật khẩu của bạn"
                autoComplete="new-password"
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
                id="agreeTerms"
                checked={agreeTerms}
                onChange={handleAgreeTerms}
              />
              <label htmlFor="agreeTerms">
                Tôi đồng ý với <Link to="/terms" className="terms-link">Điều khoản dịch vụ</Link>
              </label>
            </div>
          </div>

          <button type="submit" className="login-button" disabled={isLoading || !agreeTerms}>
            {isLoading ? "Đang đăng ký..." : "Đăng ký"}
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

        <div className="login-link">
          Bạn đã có tài khoản? <Link to="/auth/login">Đăng nhập</Link>
        </div>
      </div>

      <div className="auth-image-container">
        <img
          src="https://images.unsplash.com/photo-1592664858934-40ca080ab56b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="animal protection"
          className="auth-image"
        />
        <div className="auth-quote">
          <p>
            Mỗi ngày, hàng nghìn thú cưng như chú chó này đang cần sự giúp đỡ. Đăng ký để cùng chúng tôi mang lại hy vọng cho những sinh mạng nhỏ bé.
          </p>
          <div className="auth-quote-author">
            Tìm hiểu thêm tại thế giới thú cưng của chúng tôi
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
