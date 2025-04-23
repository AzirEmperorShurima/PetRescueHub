import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { heroSlides } from '../../../mocks';
import './HeroSlider.css';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState('next');

  // Slide navigation
  const changeSlide = useCallback((direction) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setSlideDirection(direction);
    
    setTimeout(() => {
      setCurrentSlide((prev) => {
        return direction === 'next' 
          ? (prev + 1) % heroSlides.length 
          : (prev === 0 ? heroSlides.length - 1 : prev - 1);
      });
      
      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    }, 300);
  }, [isAnimating]);

  // Auto slide
  useEffect(() => {
    const slideInterval = setInterval(() => {
      changeSlide('next');
    }, 6000);
    
    return () => clearInterval(slideInterval);
  }, [changeSlide]);

  return (
    <section className="hero-slider-section">
      <div className="hero-slider-container">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slide ${
              index === currentSlide ? 'active' : ''
            } ${
              isAnimating ? `animating-${slideDirection}` : ''
            }`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="hero-overlay">
              <div className="hero-content">
                <Typography 
                  variant="h1" 
                  className="hero-title animate-slideInLeft"
                  sx={{ animationDelay: '0.3s' }}
                >
                  {slide.title}
                </Typography>
                <Typography 
                  variant="h5" 
                  className="hero-description animate-slideInLeft"
                  sx={{ animationDelay: '0.5s' }}
                >
                  {slide.description}
                </Typography>
                <Box className="hero-buttons animate-slideInLeft" sx={{ animationDelay: '0.7s' }}>
                  <Button 
                    component={Link} 
                    to="/adopt" 
                    variant="contained" 
                    color="primary" 
                    className="hero-button primary-button"
                  >
                    Nhận nuôi ngay
                  </Button>
                  <Button 
                    component={Link} 
                    to="/donate" 
                    variant="outlined" 
                    color="primary" 
                    className="hero-button secondary-button"
                  >
                    Quyên góp
                  </Button>
                </Box>
              </div>
            </div>
          </div>
        ))}
        
        <div className="hero-nav-buttons">
          <button 
            className="hero-nav-button hero-nav-prev" 
            onClick={() => changeSlide('prev')} 
            aria-label="Previous slide"
            disabled={isAnimating}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button 
            className="hero-nav-button hero-nav-next" 
            onClick={() => changeSlide('next')} 
            aria-label="Next slide"
            disabled={isAnimating}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
        
        <div className="hero-dots">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => {
                if (index > currentSlide) changeSlide('next');
                else if (index < currentSlide) changeSlide('prev');
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;