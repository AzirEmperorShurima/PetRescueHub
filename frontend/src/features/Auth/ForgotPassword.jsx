import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import '../../assets/styles/components/auth/Auth.css';
import petLogo from '../../assets/images/logo.svg';
import { useAuth } from '../../components/contexts/AuthContext';
import { useNotification } from '../../components/contexts/NotificationContext';
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

  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (user && user.id) {
      console.log("User already logged in:", user);
      setShowAlreadyLoggedIn(true);
    }
  }, [user]);

  useEffect(() => {
    console.log("useEffect triggered:", { showOTPVerification, resetToken });
    if (!showOTPVerification && resetToken) {
      console.log("Setting showResetPassword to true");
      setShowResetPassword(true);
    }
  }, [showOTPVerification, resetToken]);

  // Xóa useEffect trùng lặp này
  
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

  const handleShowNewPass = () => {
    setShowNewPass((prev) => !prev);
  };
  
  const handleShowConfirmPass = () => {
    setShowConfirmPass((prev) => !prev);
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
      // Thay đổi từ apiService sang authService
      await authService.forgotPassword(email);
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

  const handleForgotPasswordOTP = async (otpInput) => {
    try {
      setOtpCode(otpInput);
      // Gọi API xác thực OTP
      const response = await authService.otpForgotPassword(otpInput);
      console.log("OTP verification response:", response);

      if (response.message === 'OTP verified successfully' || (response.success && response.resetToken)) {
        // Nếu không có resetToken, tạo một token tạm thời
        const token = response.resetToken || 'temp_token_' + new Date().getTime();
        setResetToken(token);
        setShowOTPVerification(false);
        setShowResetPassword(true);
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
      // Sửa lại: truyền đúng tham số newPassword và confirmPassword
      await authService.resetPassword(newPassword, confirmPassword);
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
        
        {/* Hiển thị tiêu đề tùy theo trạng thái */}
        {showResetPassword ? (
          <div className="auth-subtitle">Vui lòng nhập mật khẩu mới của bạn</div>
        ) : (
          <div className="auth-subtitle">Nhập email của bạn để đặt lại mật khẩu</div>
        )}

        {error && <div className="error-message">{error}</div>}

        {showResetPassword ? (
          <div className="reset-password-form">
            <form className="form" onSubmit={handleResetPassword}>
              <div className="form-group password-group">
                <label htmlFor="newPassword">Mật khẩu mới</label>
                <div className="password-input-wrapper">
                  <input
                    required
                    className="input"
                    value={newPassword}
                    onChange={handleChangePassword}
                    type={showNewPass ? 'text' : 'password'}
                    name="newPassword"
                    id="newPassword"
                    placeholder="Nhập mật khẩu mới"
                    autoComplete="new-password"
                  />
                  <button 
                    type="button"
                    onClick={handleShowNewPass}
                    className="toggle-password-btn"
                    aria-label={showNewPass ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                  >
                    {showNewPass ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </button>
                </div>
              </div>

              <div className="form-group password-group">
                <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                <div className="password-input-wrapper">
                  <input
                    required
                    className="input"
                    value={confirmPassword}
                    onChange={handleChangeConfirmPassword}
                    type={showConfirmPass ? 'text' : 'password'}
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="Nhập lại mật khẩu mới"
                    autoComplete="new-password"
                  />
                  <button 
                    type="button"
                    onClick={handleShowConfirmPass}
                    className="toggle-password-btn"
                    aria-label={showConfirmPass ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                  >
                    {showConfirmPass ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </button>
                </div>
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

      {/* Thêm component OTPVerification với các props đúng */}
      <OTPVerification
        open={showOTPVerification}
        onClose={handleCloseOTPDialog}
        email={email}
        onVerify={handleForgotPasswordOTP}
        type="forgot-password"
      />
    </div>
  );
}

export default ForgotPassword;
