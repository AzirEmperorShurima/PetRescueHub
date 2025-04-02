import React, { useState, useEffect } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import '../../assets/styles/components/auth/Auth.css';
import petLogo from '../../assets/images/logo.svg';
import authService from '../../services/auth.service';

function Login(props) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        // Cuộn lên đầu trang khi component được mount
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Kiểm tra nếu người dùng đã đăng nhập
        const user = authService.getUserSession();
        if (user) {
            navigate('/');
        }
    }, [navigate]);

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
        authService.loginWithGoogle();
    };

    const handleLoginApple = () => {
        authService.loginWithApple();
    };

    const handleLoginTwitter = () => {
        authService.loginWithTwitter();
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        
        try {
            const response = await authService.login(email, password);
            
            // Lưu thông tin người dùng nếu chọn "Ghi nhớ đăng nhập"
            if (rememberMe) {
                authService.setUserSession(response.user, response.token);
            }
            
            // Chuyển hướng đến trang chủ
            navigate('/');
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-form-container">
            <div className="auth-logo">
                <img src={petLogo} alt="PetRescueHub Logo" />
                <h2>PetRescueHub</h2>
            </div>
            
            <div className="auth-form-section">
                <div className="heading">Đăng nhập</div>
                <div className="auth-subtitle">Chào mừng bạn quay trở lại với PetRescueHub</div>
                
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

                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <div className="password-container">
                            <input
                                required
                                className="input"
                                value={password}
                                onChange={handleChangePassword}
                                type={showPass ? "text" : "password"}
                                name="password"
                                id="password"
                                placeholder="Nhập mật khẩu của bạn"
                                autoComplete="current-password"
                            />
                            {showPass ? (
                                <AiFillEyeInvisible
                                    onClick={handleShowPass}
                                    className="showpass-icon icon"
                                />
                            ) : (
                                <AiFillEye
                                    onClick={handleShowPass}
                                    className="showpass-icon icon"
                                />
                            )}
                        </div>
                    </div>

                    <div className="form-options">
                        <div className="remember-me">
                            <input 
                                type="checkbox" 
                                id="remember" 
                                checked={rememberMe}
                                onChange={handleRememberMe}
                            />
                            <label htmlFor="remember">Ghi nhớ đăng nhập</label>
                        </div>
                        <div className="forgot-password">
                            <Link to="/forgot-password">Quên mật khẩu?</Link>
                        </div>
                    </div>
                    
                    <input
                        className="login-button"
                        type="submit"
                        value={isLoading ? "Đang xử lý..." : "Đăng nhập"}
                        disabled={isLoading}
                    />
                </form>
                
                <div className="social-account-container">
                    <span className="title">Hoặc đăng nhập với</span>
                    <div className="social-accounts">
                        <button className="social-button google" onClick={handleLoginGoogle}>
                            <svg className="svg" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 488 512">
                                <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                            </svg>
                        </button>
                        <button className="social-button apple" onClick={handleLoginApple}>
                            <svg className="svg" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
                                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path>
                            </svg>
                        </button>
                        <button className="social-button twitter" onClick={handleLoginTwitter}>
                            <svg className="svg" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                                <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div className="register-link">
                    Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
                </div>
            </div>
            
            <div className="auth-image-container">
                <img src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1586&q=80" alt="Happy dog" className="auth-image" />
                <div className="auth-quote">
                    <p>Mỗi ngày, hàng nghìn thú cưng cũng như chủ nhân đã tìm thấy nhau qua ứng dụng của chúng tôi. Những ánh mắt hạnh phúc đó chính là động lực để chúng tôi tiếp tục phát triển.</p>
                    <div className="auth-quote-author">Tìm hiểu thêm tại thế giới thú cưng của chúng tôi</div>
                </div>
            </div>
        </div>
    );
}

export default Login;