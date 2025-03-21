// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1>Chào mừng đến với Pet Rescue Hub</h1>
              <p className="lead">Nơi kết nối những trái tim yêu thương động vật</p>
              <Link to="/rescue" className="btn btn-primary btn-lg">
                Cứu hộ ngay
              </Link>
            </div>
            <div className="col-md-6">
              <img 
                src="/images/hero-image.jpg" 
                alt="Pet Rescue" 
                className="img-fluid rounded hero-image"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <h2 className="text-center mb-5">Dịch vụ của chúng tôi</h2>
          <div className="row">
            <div className="col-md-4">
              <div className="service-card">
                <i className="fas fa-hands-helping"></i>
                <h3>Cứu hộ khẩn cấp</h3>
                <p>Đội ngũ cứu hộ 24/7 sẵn sàng hỗ trợ</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="service-card">
                <i className="fas fa-hospital"></i>
                <h3>Chăm sóc y tế</h3>
                <p>Đội ngũ bác sĩ thú y chuyên nghiệp</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="service-card">
                <i className="fas fa-home"></i>
                <h3>Tìm nhà mới</h3>
                <p>Kết nối với người nhận nuôi phù hợp</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Rescues Section */}
      <section className="recent-rescues">
        <div className="container">
          <h2 className="text-center mb-5">Những ca cứu hộ gần đây</h2>
          <div className="row">
            {[1, 2, 3].map((item) => (
              <div key={item} className="col-md-4">
                <div className="rescue-card">
                  <img 
                    src={`/images/rescue-${item}.jpg`}
                    alt={`Rescue ${item}`}
                    className="img-fluid"
                  />
                  <div className="rescue-content">
                    <h3>Ca cứu hộ #{item}</h3>
                    <p>Mô tả ngắn về ca cứu hộ...</p>
                    <Link to={`/rescue/${item}`} className="btn btn-outline-primary">
                      Xem thêm
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;