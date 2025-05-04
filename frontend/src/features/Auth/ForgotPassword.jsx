import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../assets/styles/components/auth/Auth.css';
import petLogo from '../../assets/images/logo.svg';
import { useAuth } from '../../components/contexts/AuthContext';
import { useNotification } from '../../components/contexts/NotificationContext';
import apiService from '../../services/api.service';

function ForgotPassword() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showAlreadyLoggedIn, setShowAlreadyLoggedIn] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (user && user.id) {
      console.log("User already logged in:", user);
      setShowAlreadyLoggedIn(true);
    }
  }, [user]);

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
    setError("");
    console.log("Email changed:", email);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError("Vui lòng nhập địa chỉ email của bạn.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await apiService.auth.forgotPassword(email);
      setSuccess(true);
      showNotification('Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn!', 'success');
    } catch (error) {
      setError("Không thể gửi email đặt lại mật khẩu. Vui lòng kiểm tra lại email của bạn.");
      console.error("Forgot password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueWithCurrentUser = () => {
    navigate('/');
  };

  const handleLogoutAndContinue = () => {
    // Assuming logout function is available in the context
    // logout();
    setShowAlreadyLoggedIn(false);
  };

  if (showAlreadyLoggedIn) {
    return (
      <div className="forgot-password-form-container">
        <div className="auth-logo">
          <img src={petLogo} alt="PetRescueHub Logo" />
          <h2>PetRescueHub</h2>
        </div>

        <div className="forgot-password-form-section">
          <div className="heading">Bạn đã đăng nhập</div>
          <div className="auth-subtitle">
            Bạn đã đăng nhập với tài khoản <strong>{user.email}</strong>
          </div>

          <div className="already-logged-in-options">
            <button className="btn btn-primary" onClick={handleContinueWithCurrentUser}>
              Tiếp tục với tài khoản hiện tại
            </button>
            <button className="btn btn-outline-danger" onClick={handleLogoutAndContinue}>
              Đăng xuất và tiếp tục
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-form-container">
      <div className="auth-logo">
        <img src={petLogo} alt="PetRescueHub Logo" />
        <h2>PetRescueHub</h2>
      </div>

      <div className="forgot-password-form-section">
        <div className="heading">Quên mật khẩu</div>
        <div className="auth-subtitle">Nhập email của bạn để đặt lại mật khẩu</div>

        {error && <div className="error-message">{error}</div>}

        {success ? (
          <div className="success-message">
            <p>Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn.</p>
            <p>Vui lòng kiểm tra hộp thư đến và làm theo hướng dẫn.</p>
            <button 
              className="login-button" 
              onClick={() => navigate('/auth/login')}
              style={{ marginTop: '20px' }}
            >
              Quay lại đăng nhập
            </button>
          </div>
        ) : (
          <form className="form" onSubmit={handleSubmitForm}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                required
                className="input"
                value={email}
                onChange={handleChangeEmail}
                type="email"
                name="email"
                id="email"
                placeholder="Nhập địa chỉ email của bạn"
                autoComplete="email"
              />
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Gửi yêu cầu đặt lại mật khẩu"}
            </button>
          </form>
        )}

        <div className="login-link">
          Nhớ mật khẩu? <Link to="/auth/login">Đăng nhập</Link>
        </div>
      </div>

      <div className="forgot-password-image-container">
        <img
          src="https://images.unsplash.com/photo-1560743641-3914f2c45636?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
          alt="Pet Rescue"
          className="forgot-password-image"
        />
        <div className="auth-quote">
          <p>"Mỗi thú cưng đều xứng đáng có một ngôi nhà yêu thương."</p>
          <div className="auth-quote-author">- PetRescueHub</div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;