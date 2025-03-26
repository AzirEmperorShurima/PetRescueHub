import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  KeyboardArrowRight as ArrowIcon
} from '@mui/icons-material';

// Import logo
import logo from '../../assets/images/logo.svg';

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col lg={4} md={6} sm={12} className="mb-5">
            <div className="footer-logo">
              <img src={logo} alt="Pet Rescue Hub" />
            </div>
            <p className="footer-description">
              Chúng tôi là tổ chức phi lợi nhuận hoạt động vì quyền lợi và phúc lợi của thú cưng, 
              giúp đỡ những thú cưng bị bỏ rơi tìm được mái ấm mới.
            </p>
            <div className="footer-social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FacebookIcon />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <TwitterIcon />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <InstagramIcon />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <YouTubeIcon />
              </a>
            </div>
          </Col>
          
          <Col lg={2} md={6} sm={6} className="mb-5">
            <h4 className="footer-title">Liên kết</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">
                  <ArrowIcon fontSize="small" /> Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/adopt">
                  <ArrowIcon fontSize="small" /> Nhận nuôi
                </Link>
              </li>
              <li>
                <Link to="/donate">
                  <ArrowIcon fontSize="small" /> Quyên góp
                </Link>
              </li>
              <li>
                <Link to="/event">
                  <ArrowIcon fontSize="small" /> Sự kiện
                </Link>
              </li>
              <li>
                <Link to="/forum">
                  <ArrowIcon fontSize="small" /> Diễn đàn
                </Link>
              </li>
            </ul>
          </Col>
          
          <Col lg={2} md={6} sm={6} className="mb-5">
            <h4 className="footer-title">Hỗ trợ</h4>
            <ul className="footer-links">
              <li>
                <Link to="/about">
                  <ArrowIcon fontSize="small" /> Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to="/faq">
                  <ArrowIcon fontSize="small" /> FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy">
                  <ArrowIcon fontSize="small" /> Chính sách
                </Link>
              </li>
              <li>
                <Link to="/terms">
                  <ArrowIcon fontSize="small" /> Điều khoản
                </Link>
              </li>
              <li>
                <Link to="/contact">
                  <ArrowIcon fontSize="small" /> Liên hệ
                </Link>
              </li>
            </ul>
          </Col>
          
          <Col lg={4} md={6} sm={12} className="mb-5">
            <h4 className="footer-title">Liên hệ</h4>
            <div className="footer-contact-item">
              <div className="contact-icon">
                <LocationIcon />
              </div>
              <div className="contact-text">
                123 Nguyễn Văn Linh, Quận 7, TP.HCM
              </div>
            </div>
            <div className="footer-contact-item">
              <div className="contact-icon">
                <PhoneIcon />
              </div>
              <div className="contact-text">
                Hotline: 0984268233
              </div>
            </div>
            <div className="footer-contact-item">
              <div className="contact-icon">
                <EmailIcon />
              </div>
              <div className="contact-text">
                Email: petrescuehubsupport@gmail.com
              </div>
            </div>
          </Col>
        </Row>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Pet Rescue Hub. Tất cả quyền được bảo lưu.</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;