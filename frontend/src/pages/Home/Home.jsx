import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
import styles from './Home.module.css';

import AboutSection from './components/AboutSection/AboutSection';
import FeatureSection from './components/FeatureSection/FeatureSection';
import ImpactCounter from './components/ImpactCounter/ImpactCounter';
import TestimonialsSection from './components/TestimonialsSection/TestimonialsSection';
import SuccessStories from './components/SuccessStories/SuccessStories';
import VolunteerForm from '../../components/common/volunteer/VolunteerForm';
import VolunteerBannerSlider from '../../components/hooks/VolunteerBannerSlider';
import VolunteerRegistrationButton from '../../components/button/VolunteerRegistrationButton';
import ChatbotWidget from './components/Chatbot/ChatbotWidget';

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

  // Rescue button drag handlers with optimized throttling
  const handleMouseDown = useCallback((e) => {
    if (rescueBtnRef.current) {
      isDragging.current = true;
      const rect = rescueBtnRef.current.getBoundingClientRect();
      offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (isDragging.current && rescueBtnRef.current) {
      // Using requestAnimationFrame for performance optimization
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
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={styles.hero__slide}
            style={{ 
              backgroundImage: `url(${slide.image})`, 
              display: index === currentSlide ? 'block' : 'none' 
            }}
          >
            <div className={styles.hero__overlay}>
              <div className={styles.hero__content}>
                <h1 className={styles.hero__title}>{slide.title}</h1>
                <p className={styles.hero__description}>{slide.description}</p>
              </div>
            </div>
          </div>
        ))}
        <div className={styles.hero__navButtons}>
          <button 
            className={`${styles.hero__navButton} ${styles['hero__navButton--prev']}`} 
            onClick={() => changeSlide('prev')} 
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button 
            className={`${styles.hero__navButton} ${styles['hero__navButton--next']}`} 
            onClick={() => changeSlide('next')} 
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </section>

      {/* About Section */}
      <AboutSection />

      {/* Floating Rescue Button */}
      <div className={styles.rescueBtn} ref={rescueBtnRef} onClick={() => navigate('/rescue')}>
        <span className={styles.rescueBtn__text}>Báo cáo cứu hộ</span>
        <img src={vetIcon} alt="Báo cáo cứu hộ" />
        <div className={styles.rescueBtn__iconContainer}>
          <div className={`${styles.rescueBtn__icon} ${styles['rescueBtn__icon--1']}`}><PetsIcon /></div>
          <div className={`${styles.rescueBtn__icon} ${styles['rescueBtn__icon--2']}`}><FavoriteIcon /></div>
          <div className={`${styles.rescueBtn__icon} ${styles['rescueBtn__icon--3']}`}><EventIcon /></div>
          <div className={`${styles.rescueBtn__icon} ${styles['rescueBtn__icon--4']}`}><HomeIcon /></div>
        </div>
      </div>

      <ChatbotWidget />
      {/* Feature Section */}
      <FeatureSection />

      {/* Impact Counter */}
      <ImpactCounter />

      {/* Success Stories */}
      <SuccessStories />

      {/* Testimonials Section */}
      <TestimonialsSection testimonials={testimonials} />

      {/* Volunteer Banner Slider */}
      <VolunteerBannerSlider />

      {/* Volunteer Banner */}
      <section className={styles.volunteerBanner}>
        <div className={styles.volunteerBanner__overlay}></div>
        <div className={styles.volunteerBanner__content}>
          <h2 className={styles.volunteerBanner__title}>Trở thành tình nguyện viên</h2>
          <p className={styles.volunteerBanner__description}>
            Tham gia cùng chúng tôi trong hành trình cứu trợ và bảo vệ thú cưng. Mỗi sự giúp đỡ đều ý nghĩa.
          </p>
          <VolunteerRegistrationButton 
            onClick={() => setShowVolunteerModal(true)} 
            className={styles.button}
          />
        </div>
      </section>


      <VolunteerForm 
        isOpen={showVolunteerModal} 
        onClose={() => setShowVolunteerModal(false)} 
        onSubmit={handleVolunteerSubmit} 
      />
    </div>
  );
};

export default Home;
