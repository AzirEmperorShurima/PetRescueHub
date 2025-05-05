import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../assets/styles/components/auth/Auth.css';
import petLogo from '../../assets/images/logo.svg';
import { useAuth } from '../../components/contexts/AuthContext';
import { useNotification } from '../../components/contexts/NotificationContext';
import apiService from '../../services/api.service';
import authService from '../../services/auth.service';
import OTPVerification from './OTPVerification';

function ForgotPassword() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showAlreadyLoggedIn, setShowAlreadyLoggedIn] = useState(false);
  
  // Thêm các state mới
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [resetToken, setResetToken] = useState("");

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
  };

  const handleChangePassword = (e) => {
    setNewPassword(e.target.value);
    setError("");
  };

  const handleChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
    setError("");
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
      setShowOTPVerification(true);
      showNotification('Mã OTP đã được gửi đến email của bạn!', 'success');
    } catch (error) {
      setError("Không thể gửi email đặt lại mật khẩu. Vui lòng kiểm tra lại email của bạn.");
      console.error("Forgot password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (otpInput) => {
    try {
      setOtpCode(otpInput);
      // Sử dụng hàm otpResetPassword thay vì verifyOTP
      const response = await apiService.auth.otpResetPassword(otpInput);
      console.log("OTP verification response:", response);
      
      if (response.success) {
        setShowOTPVerification(false);
        setShowResetPassword(true);
        setResetToken(response.token || "");
        showNotification('Xác thực OTP thành công!', 'success');
        return true;
      } else {
        throw new Error(response.message || 'Mã OTP không hợp lệ');
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      throw new Error(error.message || 'Xác thực OTP thất bại');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!newPassword) {
      setError("Vui lòng nhập mật khẩu mới.");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    
    if (newPassword.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      // Gọi API để đặt lại mật khẩu
      await authService.resetPassword(resetToken, newPassword);
      showNotification('Đặt lại mật khẩu thành công!', 'success');
      navigate('/auth/login');
    } catch (error) {
      setError("Không thể đặt lại mật khẩu. Vui lòng thử lại.");
      console.error("Reset password error:", error);
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

  const handleCloseOTPDialog = () => {
    setShowOTPVerification(false);
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

        {showResetPassword ? (
          <div className="reset-password-form">
            <p>Vui lòng nhập mật khẩu mới của bạn.</p>
            <form className="form" onSubmit={handleResetPassword}>
              <div className="form-group">
                <label htmlFor="newPassword">Mật khẩu mới</label>
                <input
                  required
                  className="input"
                  value={newPassword}
                  onChange={handleChangePassword}
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  placeholder="Nhập mật khẩu mới"
                  autoComplete="new-password"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                <input
                  required
                  className="input"
                  value={confirmPassword}
                  onChange={handleChangeConfirmPassword}
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="Nhập lại mật khẩu mới"
                  autoComplete="new-password"
                />
              </div>

              <button type="submit" className="login-button" disabled={isLoading}>
                {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
              </button>
            </form>
          </div>
        ) : success ? (
          <div className="success-message">
            <p>Chúng tôi đã gửi mã OTP đến email của bạn.</p>
            <p>Vui lòng kiểm tra hộp thư đến và nhập mã OTP để tiếp tục.</p>
            <button 
              className="login-button" 
              onClick={() => setShowOTPVerification(true)}
              style={{ marginTop: '20px' }}
            >
              Nhập mã OTP
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

      {/* OTP Verification Dialog */}
      <OTPVerification
        open={showOTPVerification}
        onClose={handleCloseOTPDialog}
        email={email}
        onVerify={handleVerifyOTP}
      />
    </div>
  );
}

export default ForgotPassword;