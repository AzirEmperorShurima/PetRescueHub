import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { 
  Pets as PetsIcon, 
  Favorite as FavoriteIcon, 
  Event as EventIcon, 
  Home as HomeIcon,
  People as PeopleIcon,
  LocalHospital as EmergencyIcon,
  Handshake as VolunteerIcon
} from '@mui/icons-material';
import { heroSlides, services, recentRescues, testimonials, stats } from '../../mocks';
import vetIcon from '../../assets/images/vet.svg';
import './Home.css'; // Sử dụng file CSS được tối ưu
import '../../assets/styles/animations.css';

import AboutSection from './components/AboutSection';
import FeatureSection from './components/FeatureSection';
import ImpactCounter from './components/ImpactCounter';
import VolunteerForm from '../../components/common/volunteer/VolunteerForm';
import VolunteerBannerSlider from '../../components/hooks/VolunteerBannerSlider';
import VolunteerRegistrationButton from '../../components/button/VolunteerRegistrationButton';
import SuccessStories from './components/SuccessStories';
import TestimonialsSection from './components/TestimonialsSection';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const navigate = useNavigate();
  const slideInterval = useRef(null);
  const rescueBtnRef = useRef(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  // Slide navigation
  const changeSlide = useCallback((direction) => {
    setCurrentSlide((prev) => {
      const newSlide = direction === 'next' 
        ? (prev + 1) % heroSlides.length 
        : (prev === 0 ? heroSlides.length - 1 : prev - 1);
      clearInterval(slideInterval.current);
      slideInterval.current = setInterval(() => setCurrentSlide((p) => (p + 1) % heroSlides.length), 5000);
      return newSlide;
    });
  }, []);

  // Auto slide
  useEffect(() => {
    slideInterval.current = setInterval(() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length), 5000);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => clearInterval(slideInterval.current);
  }, []);

  // Rescue button drag handlers - Tối ưu với throttle để cải thiện hiệu suất
  const handleMouseDown = useCallback((e) => {
    if (rescueBtnRef.current) {
      isDragging.current = true;
      const rect = rescueBtnRef.current.getBoundingClientRect();
      offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (isDragging.current && rescueBtnRef.current) {
      // Thêm request animation frame để tối ưu hiệu suất
      requestAnimationFrame(() => {
        if (!isDragging.current) return;
        const x = Math.max(0, Math.min(e.clientX - offset.current.x, window.innerWidth - rescueBtnRef.current.offsetWidth));
        const y = Math.max(0, Math.min(window.innerHeight - e.clientY - offset.current.y, window.innerHeight - rescueBtnRef.current.offsetHeight));
        rescueBtnRef.current.style.left = `${x}px`;
        rescueBtnRef.current.style.bottom = `${y}px`;
        rescueBtnRef.current.style.right = 'auto';
      });
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    const btn = rescueBtnRef.current;
    if (btn) {
      btn.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      if (btn) btn.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp]);

  // Volunteer form handler
  const handleVolunteerSubmit = (formData) => {
    console.log('Volunteer form submitted:', formData);
    alert('Cảm ơn bạn đã đăng ký làm tình nguyện viên! Chúng tôi sẽ liên hệ với bạn sớm.');
    setShowVolunteerModal(false);
  };

  return (
    <div className="home-page">
      {/* Hero Section - Cập nhật class names */}
      <section className="home-hero-section animate-fadeIn">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className="home-hero-slide"
            style={{ backgroundImage: `url(${slide.image})`, display: index === currentSlide ? 'block' : 'none' }}
          >
            <div className="home-hero-overlay">
              <div className="home-hero-content">
                <h1 className="home-hero-title">{slide.title}</h1>
                <p className="home-hero-description">{slide.description}</p>
              </div>
            </div>
          </div>
        ))}
        <div className="home-hero-nav-buttons">
          <button className="home-hero-nav-button hero-nav-prev" onClick={() => changeSlide('prev')} aria-label="Previous slide">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button className="home-hero-nav-button hero-nav-next" onClick={() => changeSlide('next')} aria-label="Next slide">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </section>

      {/* About Section */}
      <AboutSection />

      {/* Floating Rescue Button */}
      <div className="floating-rescue-btn" ref={rescueBtnRef} onClick={() => navigate('/rescue')}>
        <span className="floating-rescue-text">Báo cáo cứu hộ</span>
        <img src={vetIcon} alt="Báo cáo cứu hộ" />
        <div className="icon-container">
          <div className="icon icon1"><PetsIcon /></div>
          <div className="icon icon2"><FavoriteIcon /></div>
          <div className="icon icon3"><EventIcon /></div>
          <div className="icon icon4"><HomeIcon /></div>
        </div>
      </div>

      {/* Feature Section */}
      <FeatureSection />

      {/* Impact Counter */}
      <ImpactCounter />

      {/* Success Stories */}
      <SuccessStories />

      {/* Stats Section - Cập nhật class names */}
      <section className="home-stats-section">
        <Container>
          <Row>
            {stats.map((stat) => (
              <Col md={3} sm={6} key={stat.id}>
                <div className="home-stat-item">
                  <div className="home-stat-icon">
                    {stat.icon === 'pets' && <PetsIcon sx={{ fontSize: 40 }} />}
                    {stat.icon === 'home' && <HomeIcon sx={{ fontSize: 40 }} />}
                    {stat.icon === 'people' && <PeopleIcon sx={{ fontSize: 40 }} />}
                    {stat.icon === 'event' && <EventIcon sx={{ fontSize: 40 }} />}
                  </div>
                  <div className="home-stat-value">{stat.value}+</div>
                  <div className="home-stat-label">{stat.label}</div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection testimonials={testimonials} />

      {/* Volunteer Banner Slider */}
      <VolunteerBannerSlider />

      {/* Volunteer Banner - Cập nhật class names */}
      <section className="home-volunteer-banner">
        <div className="overlay"></div>
        <div className="home-volunteer-content">
          <h2 className="home-volunteer-title">Trở thành tình nguyện viên</h2>
          <p className="home-volunteer-description">
            Tham gia cùng chúng tôi trong hành trình cứu trợ và bảo vệ thú cưng. Mỗi sự giúp đỡ đều ý nghĩa.
          </p>
          <VolunteerRegistrationButton onClick={() => setShowVolunteerModal(true)} className="home-button" />
        </div>
      </section>

      <VolunteerForm isOpen={showVolunteerModal} onClose={() => setShowVolunteerModal(false)} onSubmit={handleVolunteerSubmit} />
    </div>
  );
};

export default Home;