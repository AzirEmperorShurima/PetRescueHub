import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Box, Typography, Rating } from '@mui/material';
import { 
  Pets as PetsIcon, 
  Favorite as FavoriteIcon, 
  Event as EventIcon, 
  Home as HomeIcon,
  People as PeopleIcon,
  LocalHospital as EmergencyIcon,
  // Thay thế Volunteer bằng VolunteerActivism hoặc Handshake
  Handshake as VolunteerIcon
} from '@mui/icons-material';

// Import mock data
import { heroSlides, services, recentRescues, testimonials, stats } from '../../mocks';

// Import CSS
import './Home.css';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    skills: [],
    availability: '',
    message: ''
  });
  
  const navigate = useNavigate();
  const slideInterval = useRef(null);
  
  // Auto slide for hero section
  useEffect(() => {
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    
    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
    };
  }, []);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle checkbox changes for skills
  const handleSkillChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        skills: [...formData.skills, value]
      });
    } else {
      setFormData({
        ...formData,
        skills: formData.skills.filter(skill => skill !== value)
      });
    }
  };
  
  // Handle volunteer form submission
  const handleVolunteerSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    console.log('Volunteer form submitted:', formData);
    alert('Cảm ơn bạn đã đăng ký làm tình nguyện viên! Chúng tôi sẽ liên hệ với bạn sớm.');
    setShowVolunteerModal(false);
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      skills: [],
      availability: '',
      message: ''
    });
  };
  
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        {heroSlides.map((slide, index) => (
          <div 
            key={slide.id}
            className="hero-slide"
            style={{ 
              backgroundImage: `url(${slide.image})`,
              display: index === currentSlide ? 'block' : 'none'
            }}
          >
            <div className="hero-overlay">
              <div className="hero-content">
                <h1 className="hero-title">{slide.title}</h1>
                <p className="hero-description">{slide.description}</p>
                {/* Đã loại bỏ phần hero-buttons */}
              </div>
            </div>
          </div>
        ))}
      </section>
      
      {/* Floating Rescue Button */}
      <div 
        className="floating-rescue-btn animate-float"
        onClick={() => navigate('/rescue')}
      >
        <EmergencyIcon sx={{ fontSize: 32 }} />
        <span className="floating-rescue-text">Báo cáo cứu hộ</span>
      </div>
      
      {/* Services Section */}
      <section className="services-section">
        <Container>
          <h2 className="section-title">Dịch vụ của chúng tôi</h2>
          <p className="section-subtitle">
            Chúng tôi cung cấp nhiều dịch vụ khác nhau để giúp đỡ thú cưng và kết nối chúng với những gia đình yêu thương
          </p>
          
          <Row>
            {services.map(service => (
              <Col lg={3} md={6} sm={12} key={service.id} className="mb-4">
                <div className="service-card">
                  <div className="service-content">
                    // Trong phần services section
                    <div className="service-icon">
                      {service.icon === 'pets' && <PetsIcon sx={{ fontSize: 36 }} />}
                      {service.icon === 'handshake' && <VolunteerIcon sx={{ fontSize: 36 }} />}
                      {service.icon === 'emergency' && <EmergencyIcon sx={{ fontSize: 36 }} />}
                      {service.icon === 'event' && <EventIcon sx={{ fontSize: 36 }} />}
                    </div>
                    <h3 className="service-title">{service.title}</h3>
                    <p className="service-description">{service.description}</p>
                    <Link to={service.link} className="service-link">
                      Tìm hiểu thêm
                    </Link>
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
          <p className="section-subtitle">
            Những câu chuyện cứu hộ thành công gần đây của chúng tôi
          </p>
          
          <Row>
            {recentRescues.map(rescue => (
              <Col lg={4} md={6} sm={12} key={rescue.id} className="mb-4">
                <div className="rescue-card">
                  <div className="rescue-image">
                    <img src={rescue.image} alt={rescue.title} />
                  </div>
                  <div className="rescue-content">
                    <div className="rescue-date">{rescue.date}</div>
                    <h3 className="rescue-title">{rescue.title}</h3>
                    <p className="rescue-description">{rescue.description}</p>
                    <Link to="/rescue" className="rescue-link">
                      Xem chi tiết
                    </Link>
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
            {stats.map(stat => (
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
          <p className="section-subtitle">
            Những chia sẻ từ người nhận nuôi và tình nguyện viên
          </p>
          
          <Row>
            {testimonials.map(testimonial => (
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
      
      {/* Volunteer Banner */}
      // Trong phần hero-section hoặc volunteer-banner, tìm và loại bỏ các nút
      <section className="volunteer-banner">
        <Container>
          <h2 className="volunteer-title">Trở thành tình nguyện viên</h2>
          <p className="volunteer-description">
            Tham gia cùng chúng tôi trong hành trình cứu trợ và bảo vệ thú cưng. 
            Mỗi sự giúp đỡ của bạn đều có ý nghĩa to lớn.
          </p>
          <Button 
            className="volunteer-btn"
            onClick={() => setShowVolunteerModal(true)}
          >
            Đăng ký ngay
          </Button>
        </Container>
      </section>
      
      {/* Volunteer Modal */}
      <div className={`volunteer-modal ${showVolunteerModal ? 'active' : ''}`}>
        <div className="volunteer-modal-content">
          <div 
            className="volunteer-modal-close"
            onClick={() => setShowVolunteerModal(false)}
          >
            &times;
          </div>
          <h3 className="volunteer-form-title">Đăng ký làm tình nguyện viên</h3>
          <form onSubmit={handleVolunteerSubmit}>
            <div className="form-group">
              <label className="form-label">Họ và tên</label>
              <input 
                type="text" 
                className="form-control" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className="form-control" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Số điện thoại</label>
              <input 
                type="tel" 
                className="form-control" 
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Kỹ năng</label>
              <div>
                <div className="form-check">
                  <input 
                    type="checkbox" 
                    className="form-check-input" 
                    id="skill1"
                    value="chăm sóc thú cưng"
                    onChange={handleSkillChange}
                    checked={formData.skills.includes('chăm sóc thú cưng')}
                  />
                  <label className="form-check-label" htmlFor="skill1">Chăm sóc thú cưng</label>
                </div>
                <div className="form-check">
                  <input 
                    type="checkbox" 
                    className="form-check-input" 
                    id="skill2"
                    value="y tế"
                    onChange={handleSkillChange}
                    checked={formData.skills.includes('y tế')}
                  />
                  <label className="form-check-label" htmlFor="skill2">Y tế</label>
                </div>
                <div className="form-check">
                  <input 
                    type="checkbox" 
                    className="form-check-input" 
                    id="skill3"
                    value="lái xe"
                    onChange={handleSkillChange}
                    checked={formData.skills.includes('lái xe')}
                  />
                  <label className="form-check-label" htmlFor="skill3">Lái xe</label>
                </div>
                <div className="form-check">
                  <input 
                    type="checkbox" 
                    className="form-check-input" 
                    id="skill4"
                    value="truyền thông"
                    onChange={handleSkillChange}
                    checked={formData.skills.includes('truyền thông')}
                  />
                  <label className="form-check-label" htmlFor="skill4">Truyền thông</label>
                </div>
                <div className="form-check">
                  <input 
                    type="checkbox" 
                    className="form-check-input" 
                    id="skill5"
                    value="tổ chức sự kiện"
                    onChange={handleSkillChange}
                    checked={formData.skills.includes('tổ chức sự kiện')}
                  />
                  <label className="form-check-label" htmlFor="skill5">Tổ chức sự kiện</label>
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Thời gian có thể tham gia</label>
              <select 
                className="form-select" 
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                required
              >
                <option value="">Chọn thời gian</option>
                <option value="Cuối tuần">Cuối tuần</option>
                <option value="Buổi tối các ngày trong tuần">Buổi tối các ngày trong tuần</option>
                <option value="Linh hoạt">Linh hoạt</option>
                <option value="Toàn thời gian">Toàn thời gian</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Lời nhắn</label>
              <textarea 
                className="form-control" 
                rows="4"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
              ></textarea>
            </div>
            
            <button type="submit" className="form-submit">Đăng ký</button>
          </form>
        </div>
      </div>
      
      {/* Footer is in the Layout component */}
    </div>
  );
};

export default Home;