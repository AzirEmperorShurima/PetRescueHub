import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Rating } from '@mui/material';
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
import './Home.css';
import '../../assets/styles/animations.css';
import VolunteerForm from '../../components/common/volunteer/VolunteerForm';
import vetIcon from '../../assets/images/vet.svg';
import VolunteerBannerSlider from '../../components/hooks/VolunteerBannerSlider';

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

  // Rescue button drag handlers
  const handleMouseDown = useCallback((e) => {
    if (rescueBtnRef.current) {
      isDragging.current = true;
      const rect = rescueBtnRef.current.getBoundingClientRect();
      offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (isDragging.current && rescueBtnRef.current) {
      const x = Math.max(0, Math.min(e.clientX - offset.current.x, window.innerWidth - rescueBtnRef.current.offsetWidth));
      const y = Math.max(0, Math.min(window.innerHeight - e.clientY - offset.current.y, window.innerHeight - rescueBtnRef.current.offsetHeight));
      rescueBtnRef.current.style.left = `${x}px`;
      rescueBtnRef.current.style.bottom = `${y}px`;
      rescueBtnRef.current.style.right = 'auto';
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
      {/* Hero Section */}
      <section className="hero-section animate-fadeIn">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className="hero-slide"
            style={{ backgroundImage: `url(${slide.image})`, display: index === currentSlide ? 'block' : 'none' }}
          >
            <div className="hero-overlay">
              <div className="hero-content">
                <h1 className="hero-title">{slide.title}</h1>
                <p className="hero-description">{slide.description}</p>
              </div>
            </div>
          </div>
        ))}
        <div className="hero-nav-buttons">
          <button className="hero-nav-button hero-nav-prev" onClick={() => changeSlide('prev')} aria-label="Previous slide">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button className="hero-nav-button hero-nav-next" onClick={() => changeSlide('next')} aria-label="Next slide">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </section>

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

      {/* Services Section */}
      <section className="services-section">
        <Container>
          <h2 className="section-title">Dịch vụ của chúng tôi</h2>
          <p className="section-subtitle">Chúng tôi cung cấp nhiều dịch vụ để giúp đỡ thú cưng và kết nối với gia đình yêu thương</p>
          <Row>
            {services.map((service) => (
              <Col lg={3} md={6} sm={12} key={service.id} className="mb-4">
                <div className="service-card">
                  <div className="service-content">
                    <div className="service-icon">
                      {service.icon === 'pets' && <PetsIcon sx={{ fontSize: 36 }} />}
                      {service.icon === 'handshake' && <VolunteerIcon sx={{ fontSize: 36 }} />}
                      {service.icon === 'emergency' && <EmergencyIcon sx={{ fontSize: 36 }} />}
                      {service.icon === 'event' && <EventIcon sx={{ fontSize: 36 }} />}
                    </div>
                    <h3 className="service-title">{service.title}</h3>
                    <p className="service-description">{service.description}</p>
                    <Link to={service.link} className="service-link">Tìm hiểu thêm</Link>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Recent Rescues Section */}
      <section className="recent-rescues">
        <Container>
          <h2 className="section-title">Cứu hộ gần đây</h2>
          <p className="section-subtitle">Những câu chuyện cứu hộ thành công gần đây của chúng tôi</p>
          <Row>
            {recentRescues.map((rescue) => (
              <Col lg={4} md={6} sm={12} key={rescue.id} className="mb-4">
                <div className="rescue-card">
                  <div className="rescue-image">
                    <img src={rescue.image} alt={rescue.title} />
                  </div>
                  <div className="rescue-content">
                    <div className="rescue-date">{rescue.date}</div>
                    <h3 className="rescue-title">{rescue.title}</h3>
                    <p className="rescue-description">{rescue.description}</p>
                    <Link to="/rescue" className="rescue-link">Xem chi tiết</Link>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <Container>
          <Row>
            {stats.map((stat) => (
              <Col md={3} sm={6} key={stat.id}>
                <div className="stat-item">
                  <div className="stat-icon">
                    {stat.icon === 'pets' && <PetsIcon sx={{ fontSize: 40 }} />}
                    {stat.icon === 'home' && <HomeIcon sx={{ fontSize: 40 }} />}
                    {stat.icon === 'people' && <PeopleIcon sx={{ fontSize: 40 }} />}
                    {stat.icon === 'event' && <EventIcon sx={{ fontSize: 40 }} />}
                  </div>
                  <div className="stat-value">{stat.value}+</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <Container>
          <h2 className="section-title">Đánh giá từ cộng đồng</h2>
          <p className="section-subtitle">Những chia sẻ từ người nhận nuôi và tình nguyện viên</p>
          <Row>
            {testimonials.map((testimonial) => (
              <Col lg={4} md={6} sm={12} key={testimonial.id} className="mb-4">
                <div className="testimonial-card">
                  <p className="testimonial-content">{testimonial.content}</p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">
                      <img src={testimonial.avatar} alt={testimonial.name} />
                    </div>
                    <div className="testimonial-info">
                      <div className="testimonial-name">{testimonial.name}</div>
                      <div className="testimonial-rating">
                        <Rating value={testimonial.rating} readOnly size="small" />
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Render VolunteerBannerSlider component */}
      <VolunteerBannerSlider />

      {/* Volunteer Banner */}
      <section className="volunteer-banner">
        <div className="overlay"></div>
        <div className="volunteer-content">
          <h2 className="volunteer-title">Trở thành tình nguyện viên</h2>
          <p className="volunteer-description">
            Tham gia cùng chúng tôi trong hành trình cứu trợ và bảo vệ thú cưng. Mỗi sự giúp đỡ đều ý nghĩa.
          </p>
          <Button className="volunteer-btn" onClick={() => setShowVolunteerModal(true)}>
            Đăng ký ngay
          </Button>
        </div>
      </section>

      <VolunteerForm isOpen={showVolunteerModal} onClose={() => setShowVolunteerModal(false)} onSubmit={handleVolunteerSubmit} />
    </div>
  );
};

export default Home;