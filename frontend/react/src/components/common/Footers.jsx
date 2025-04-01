import React from 'react';
import '../../assets/styles/components/Footer.css';
import { FaFacebook, FaInstagram, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt, FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import PropTypes from 'prop-types';
import logo from '../../assets/images/logo.svg'; // Đảm bảo đường dẫn đến logo của bạn

const Footer = ({ darkLight }) => {
    return (
        <footer className={`new_footer_area bg_color ${darkLight ? 'dark-mode' : 'light-mode'}`}>
            <div className="new_footer_top">
                <div className="footer-container">
                    <div className="row footer-content">
                        {/* --- Cột Logo & Social Media --- */}
                        <div className="col-lg-4 col-md-6">
                            <div 
                                className="f_widget company_widget wow fadeInLeft"
                                data-wow-delay="0.2s"
                                style={{ visibility: 'visible', animationDelay: '0.2s', animationName: 'fadeInLeft' }}
                            >
                                <div className="footer-logo">
                                    <img 
                                        src={logo} 
                                        alt="Pet Rescue Hub Logo" 
                                        className="footer-logo-img" 
                                    />
                                    <h3 className="footer-logo-text">
                                        <span className="pet">Pet</span>
                                        <span className="rescuehub">RescueHub</span>
                                    </h3>
                                </div>
                                <p className="footer-description">
                                    Nhóm sinh viên Đại học Duy Tân, hoạt động vì tình yêu thương động vật.
                                </p>
                                <div className="f_social_icon social-icons">
                                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                        <FaFacebook />
                                    </a>
                                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                        <FaXTwitter />
                                    </a>
                                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                        <FaInstagram />
                                    </a>
                                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                                        <FaYoutube />
                                    </a>
                                    <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
                                        <FaTiktok />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* --- Cột "Về chúng tôi" --- */}
                        <div className="col-lg-4 col-md-6">
                            <div 
                                className="f_widget about-widget pl_70 wow fadeInLeft"
                                data-wow-delay="0.4s"
                                style={{ visibility: 'visible', animationDelay: '0.4s', animationName: 'fadeInLeft' }}
                            >
                                <h3 className="f-title f_600 t_color f_size_18">Về chúng tôi</h3>
                                <ul className="list-unstyled f_list">
                                    <li><a href="/about">Giới thiệu</a></li>
                                    <li><a href="/mission">Sứ mệnh</a></li>
                                    <li><a href="/team">Đội ngũ</a></li>
                                    <li><a href="/volunteer">Tình nguyện viên</a></li>
                                    <li><a href="/donate">Quyên góp</a></li>
                                </ul>
                            </div>
                        </div>

                        {/* --- Cột "Thông tin liên hệ" --- */}
                        <div className="col-lg-4 col-md-6">
                            <div 
                                className="f_widget about-widget pl_70 wow fadeInLeft"
                                data-wow-delay="0.6s"
                                style={{ visibility: 'visible', animationDelay: '0.6s', animationName: 'fadeInLeft' }}
                            >
                                <h3 className="f-title f_600 t_color f_size_18">Thông tin liên hệ</h3>
                                <ul className="list-unstyled f_list contact-list">
                                    <li>
                                        <a href="tel:+84984268233">
                                            <FaPhone className="contact-icon" /> 
                                            <span>(+84) 984268233</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="mailto:petrescuehubsupport@gmail.com">
                                            <FaEnvelope className="contact-icon" /> 
                                            <span>petrescuehubsupport@gmail.com</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a 
                                            href="https://maps.google.com" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                        >
                                            <FaMapMarkerAlt className="contact-icon" /> 
                                            <span>Đà Nẵng - Việt Nam</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                {/* --- Background Animation --- */}
                <div className="footer_bg">
                    <div className="footer_bg_one"></div>
                    <div className="footer_bg_two"></div>
                </div>
            </div>
            
            {/* --- Footer Bottom --- */}
            <div className="footer_bottom">
                <div className="footer-bottom-container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-sm-7">
                            <p className="mb-0 f_400">
                                © <span className="copyright-text">Pet Rescue Hub Inc. 2025</span> All rights reserved.
                            </p>
                        </div>
                        <div className="col-lg-6 col-sm-5 text-right">
                            <p>
                                Made with <span className="heart">❤</span> by <span className="team-credit">Team C1SE.03</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

Footer.propTypes = {
    darkLight: PropTypes.bool,
};

export default Footer;
