import React, { useState, useEffect, useRef, useCallback } from 'react';
import homeMock from '../../mocks/homeMock';
import styles from './Home.module.css';

import FeatureSection from './components/FeatureSection/FeatureSection';
import TestimonialsSection from './components/TestimonialsSection/TestimonialsSection';
import Action from './components/Action/Action';
import Inspiration from './components/inspiration/Inspiration';
import AboutUs from './components/aboutus/AboutUs';

import VolunteerForm from '../../components/common/volunteer/VolunteerForm';
import VolunteerBannerSlider from '../../components/hooks/VolunteerBannerSlider';
import VolunteerRegistrationButton from '../../components/button/VolunteerRegistrationButton';
import ScrollToTopButton from '../../components/button/ScrollToTopButton';

const { heroSlides, testimonials } = homeMock;

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const slideInterval = useRef(null);

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

  // Volunteer form handler
  const handleVolunteerSubmit = (formData) => {
    console.log('Volunteer form submitted:', formData);
    alert('Cảm ơn bạn đã đăng ký làm tình nguyện viên! Chúng tôi sẽ liên hệ với bạn sớm.');
    setShowVolunteerModal(false);
  };

  return (
    <div className={styles.home}>
      {/* Banner Slide Section */}
      <section
        className={styles.hero}
        style={{
          background: heroSlides[currentSlide].bgColor || '#fff',
          minHeight: '400px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0',
          transition: 'background 0.5s',
        }}
      >
        <div className={styles.hero__slide} style={{ background: 'none', boxShadow: 'none', width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 1vw', gap: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className={styles.hero__left} style={{ flex: 1, maxWidth: 1000, textAlign: 'left' }}>
            <h1 className={styles.hero__title} style={{ color: '#111', fontWeight: 900, fontSize: '4rem', marginBottom: '1.5rem', lineHeight: 1.1 }}>{heroSlides[currentSlide].title}</h1>
            <p className={styles.hero__description} style={{ color: '#555', fontWeight: 400, fontSize: '1.2rem', marginBottom: 0 }}>{heroSlides[currentSlide].description}</p>
          </div>
          <div className={styles.hero__right} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img
              src={heroSlides[currentSlide].image}
              alt={heroSlides[currentSlide].title}
              style={{ maxWidth: 400, width: '100%', height: 'auto', borderRadius: 0, boxShadow: 'none', background: 'transparent' }}
            />
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 40, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 16 }}>
          <button onClick={() => changeSlide('prev')} className={styles.bannerNavBtn}>&lt;</button>
          <button onClick={() => changeSlide('next')} className={styles.bannerNavBtn}>&gt;</button>
        </div>
      </section>

      {/* Feature Section */}
      <FeatureSection />

      <Action></Action>
      <Inspiration></Inspiration>
      <AboutUs></AboutUs>

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
      />

      {/* Testimonials Section */}
      <TestimonialsSection testimonials={testimonials} />

      <ScrollToTopButton />
    </div>
  );
};

export default Home;
