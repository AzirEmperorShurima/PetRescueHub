import React, { useState, useEffect } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { FaGoogle, FaApple, FaXTwitter } from 'react-icons/fa6';
import { Link, useNavigate } from 'react-router-dom';
import '../../assets/styles/components/auth/Auth.css';
import petLogo from '../../assets/images/logo.svg';
import { useAuth } from '../../components/contexts/AuthContext';
import { useNotification } from '../../components/contexts/NotificationContext';
import OTPVerification from './OTPVerification';

function Register() {
  const navigate = useNavigate();
  const { register, logout, user, verifyOTP, login } = useAuth();
  const { showNotification } = useNotification();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [showAlreadyLoggedIn, setShowAlreadyLoggedIn] = useState(false);

  // Thêm state để quản lý hiển thị OTP dialog
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (user && user.id) {
      console.log("User already logged in:", user);
      setShowAlreadyLoggedIn(true);
    }
  }, [user]);

  const handleChangeUsername = (e) => {
    setUsername(e.target.value);
    setError("");
  };

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

  // Đoạn gọi API trong handleSubmitForm (đã chỉnh)
  const handleSubmitForm = async (e) => {
    e.preventDefault();

    if (!agreeTerms) {
      setError("Bạn cần đồng ý với điều khoản dịch vụ để tiếp tục.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await register(username, email, password);
      // Lưu tạm credentials để auto-login sau OTP (Web Storage API) :contentReference[oaicite:0]{index=0}&#8203;:contentReference[oaicite:1]{index=1}
      localStorage.setItem('tempEmail', email);
      localStorage.setItem('tempPassword', password);
      if (response?.message) showNotification(response.message);

      // Sửa đổi cách xác định thông tin người dùng đã đăng ký
      const registered = response?.user ||
        (response?.userId && { id: response.userId, email }) ||
        (response?.email && { id: username, email: response.email });

      if (!registered) throw new Error("Thông tin trả về không hợp lệ");

      setRegisteredUser(registered);
      setShowOTPDialog(true);
    } catch (error) {
      setError(error.message || "Đăng ký thất bại. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý xác thực OTP
  const handleVerifyOTP = async (otpCode) => {
    try {
      if (!registeredUser || !registeredUser.id) {
        throw new Error("Thông tin người dùng không hợp lệ");
      }

      // Gọi API xác thực OTP với đúng tham số
      const response = await verifyOTP(registeredUser.id, otpCode);
      
      if (response && response.success) {
        setShowOTPDialog(false);
        
        try {
          const savedEmail = localStorage.getItem('tempEmail');
          const savedPassword = localStorage.getItem('tempPassword');
          
          if (savedEmail && savedPassword) {
            await login(savedEmail, savedPassword, true);
            localStorage.removeItem('tempPassword');
            showNotification('Xác thực tài khoản và đăng nhập thành công!', 'success');
            navigate('/');
          } else {
            showNotification('Xác thực tài khoản thành công! Vui lòng đăng nhập.', 'success');
            navigate('/auth/login');
          }
        } catch (loginErr) {
          console.error("Auto login error:", loginErr);
          showNotification('Xác thực tài khoản thành công! Vui lòng đăng nhập.', 'success');
          navigate('/auth/login');
        }
        
        return true;
      } else {
        throw new Error(response?.message || "Xác thực OTP thất bại");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      return Promise.reject(err.response?.message || err.message || "Xác thực OTP thất bại");
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
      <div className="register-form-container">
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
    <div className="register-form-container">
      <div className="auth-logo">
        <img src={petLogo} alt="PetRescueHub Logo" />
        <h2>PetRescueHub</h2>
      </div>

      <div className="register-form-section">
        <div className="heading">Đăng ký</div>
        <div className="auth-subtitle">Chào mừng bạn đến với PetRescueHub</div>

        {error && <div className="error-message">{error}</div>}

        <form className="form" onSubmit={handleSubmitForm}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              required
              className="input"
              value={username}
              onChange={handleChangeUsername}
              type="text"
              name="username"
              id="username"
              placeholder="Nhập tên người dùng của bạn"
              autoComplete="username"
            />
          </div>

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
              autoComplete="email"
            />
          </div>

          <div className="form-group password-group">
            <label htmlFor="password">Password</label>
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
          Đã có tài khoản? <Link to="/auth/login">Đăng nhập</Link>
        </div>
      </div>

      <div className="register-image-container">
        <img
          src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
          alt="Pet Rescue"
          className="register-image"
        />
        <div className="auth-quote">
          <p>&quot;Cứu một sinh mạng là anh hùng, cứu hàng triệu sinh mạng là nhà cứu trợ.&quot;</p>
          <div className="auth-quote-author">- PetRescueHub</div>
        </div>
      </div>

      {/* OTP Dialog */}
      <OTPVerification
        open={showOTPDialog}
        onClose={() => setShowOTPDialog(false)}
        userId={registeredUser?.id}
        email={email}
        onVerify={handleVerifyOTP}
      />
    </div>
  );
}

export default Register;
