import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import '../../assets/styles/components/auth/Auth.css';
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FaGoogle, FaApple } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
// Xóa các import phông Roboto không tồn tại
// import '@fontsource/roboto/300.css';
// import '@fontsource/roboto/400.css';
// import '@fontsource/roboto/500.css';
// import '@fontsource/roboto/700.css';

// Xóa import framer-motion
// import { motion } from "framer-motion";

// Thay thế import logo bằng text logo
// import logo from '../../assets/images/logo.png';

LOGIN.propTypes = {};

function LOGIN(props) {
    useEffect(() => {
        // Có thể thêm logic nếu cần
        document.title = "Đăng nhập | PetRescueHub";
        
        // Thêm logic chuyển đổi hình ảnh
        const interval = setInterval(() => {
            const images = document.querySelectorAll('.pet-image');
            const activeImage = document.querySelector('.pet-image.active');
            
            if (images.length > 0 && activeImage) {
                activeImage.classList.remove('active');
                const nextIndex = Array.from(images).indexOf(activeImage) + 1;
                const nextImage = images[nextIndex % images.length];
                nextImage.classList.add('active');
            }
        }, 5000);
        
        return () => clearInterval(interval);
    }, []);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleChangEmail = (e) => {
        setEmail(e.target.value);
    };

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    };

    const handleShowPass = () => {
        setShowPass((prev) => !prev);
    };

    const handleLoginGoogle = () => {
        window.open("http://localhost:3000/auth/google", "_self");
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const credentials = { userName: email, password: password };
            console.table(credentials);
            // Giả lập API call
            await new Promise((resolve) => setTimeout(resolve, 2000));
        } catch (error) {
            console.error("Lỗi:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-wrapper">
                {/* Thay thế motion.div bằng div thông thường */}
                <div className="auth-card">
                    <div className="auth-header">
                        {/* Thay thế hình ảnh logo bằng text logo */}
                        <h2 className="text-logo">PetRescueHub</h2>
                        <h1 className="auth-title">Đăng nhập</h1>
                        <p className="auth-subtitle">Chào mừng bạn quay trở lại với PetRescueHub</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmitForm}>
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email</label>
                            <div className="input-container">
                                <input
                                    required
                                    className="form-input"
                                    value={email}
                                    onChange={handleChangEmail}
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="Nhập địa chỉ email của bạn"
                                    autoComplete="username"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Mật khẩu</label>
                            <div className="input-container password-container">
                                <input
                                    required
                                    className="form-input"
                                    value={password}
                                    onChange={handleChangePassword}
                                    type={showPass ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    placeholder="Nhập mật khẩu của bạn"
                                    autoComplete="current-password"
                                />
                                <button 
                                    type="button" 
                                    className="password-toggle" 
                                    onClick={handleShowPass}
                                    aria-label={showPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                >
                                    {showPass ? (
                                        <AiFillEyeInvisible className="icon" />
                                    ) : (
                                        <AiFillEye className="icon" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="form-options">
                            <div className="remember-me">
                                <input 
                                    type="checkbox" 
                                    id="rememberMe" 
                                    checked={rememberMe}
                                    onChange={() => setRememberMe(!rememberMe)}
                                />
                                <label htmlFor="rememberMe">Ghi nhớ đăng nhập</label>
                            </div>
                            <a href="#" className="forgot-password">Quên mật khẩu?</a>
                        </div>

                        <button
                            className={`auth-button ${isLoading ? 'loading' : ''}`}
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner"></span>
                                    <span>Đang xử lý...</span>
                                </>
                            ) : (
                                "Đăng nhập"
                            )}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>Hoặc đăng nhập với</span>
                    </div>

                    <div className="social-login">
                        <button className="social-button google" onClick={handleLoginGoogle}>
                            <FaGoogle />
                            <span>Google</span>
                        </button>
                        <button className="social-button apple">
                            <FaApple />
                            <span>Apple</span>
                        </button>
                        <button className="social-button twitter">
                            <FaXTwitter />
                            <span>Twitter</span>
                        </button>
                    </div>

                    <div className="auth-footer">
                        <p>Chưa có tài khoản? <a href="/register" className="register-link">Đăng ký ngay</a></p>
                        <p className="terms">
                            Bằng cách đăng nhập, bạn đồng ý với <a href="#">Điều khoản sử dụng</a> và <a href="#">Chính sách bảo mật</a> của chúng tôi
                        </p>
                    </div>
                    
                    {/* Thêm phần hình ảnh động vật cần giúp đỡ */}
                    <div className="pet-rescue-appeal">
                        <div className="pet-images-carousel">
                            <img 
                              src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                              alt="Chú chó cần được giúp đỡ" 
                              className="pet-image" 
                            />
                        </div>
                        <p className="pet-rescue-message">
                            Mỗi ngày, hàng nghìn thú cưng như chú chó này đang cần sự giúp đỡ. 
                            Đăng nhập để cùng chúng tôi mang lại hy vọng cho những sinh mạng bé nhỏ.
                        </p>
                        <a href="/rescue" className="rescue-cta">Tìm hiểu cách bạn có thể giúp đỡ</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LOGIN;