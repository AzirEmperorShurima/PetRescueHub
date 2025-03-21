import React from 'react';
import { Link } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Carousel Section */}
      <Carousel className="hero-section" interval={5000}>
        <Carousel.Item>
          <img
            className="d-block w-100 hero-image"
            src="https://images.pexels.com/photos/825949/pexels-photo-825949.jpeg"
            alt="Chào mừng"
          />
          <Carousel.Caption>
            <h1>Chào mừng đến với Pet Rescue Hub</h1>
            <p className="lead">Nơi kết nối những trái tim yêu thương động vật</p>
            <Link to="/rescue" className="btn btn-primary btn-lg">
              Cứu hộ ngay
            </Link>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100 hero-image"
            src="https://images.pexels.com/photos/4587993/pexels-photo-4587993.jpeg"
            alt="Sự kiện nhận nuôi"
          />
          <Carousel.Caption>
            <h1>Sự kiện nhận nuôi</h1>
            <p className="lead">Tham gia sự kiện nhận nuôi vào cuối tuần này.</p>
            <Link to="/events/1" className="btn btn-primary btn-lg">
              Tham gia ngay
            </Link>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100 hero-image"
            src="https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb"
            alt="Quyên góp"
          />
          <Carousel.Caption>
            <h1>Hỗ trợ chúng tôi</h1>
            <p className="lead">Quyên góp để mang lại hy vọng cho thú cưng.</p>
            <Link to="/donate" className="btn btn-primary btn-lg">
              Quyên góp
            </Link>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <h2 className="text-center mb-4">Về Pet Rescue Hub</h2>
          <p className="lead text-center">
            Pet Rescue Hub là tổ chức phi lợi nhuận tận tâm cứu hộ, chăm sóc và tìm nhà mới cho các động vật bị bỏ rơi hoặc ngược đãi. Với đội ngũ tình nguyện viên và chuyên gia thú y, chúng tôi mang đến cuộc sống tốt đẹp hơn cho những người bạn bốn chân.
          </p>
          <div className="text-center">
            <Link to="/about" className="btn btn-outline-primary">
              Tìm hiểu thêm
            </Link>
          </div>
        </div>
      </section>

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
                    src={`https://images.pexels.com/photos/458797${item}/pexels-photo-458797${item}.jpeg`}
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

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="text-center mb-5">Câu chuyện thành công</h2>
          <div className="row">
            {[1, 2, 3].map((item) => (
              <div key={item} className="col-md-4">
                <div className="testimonial-card">
                  <p>"Nhờ Pet Rescue Hub, tôi đã tìm được người bạn đồng hành tuyệt vời."</p>
                  <p className="text-muted">- Người nhận nuôi</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section text-center">
        <div className="container">
          <h2>Tham gia cùng chúng tôi</h2>
          <p className="lead">Hãy chung tay để mang lại hy vọng cho những chú thú cưng bị bỏ rơi.</p>
          <Link to="/volunteer" className="btn btn-primary btn-lg mx-2">
            Đăng ký tình nguyện
          </Link>
          <Link to="/donate" className="btn btn-outline-primary btn-lg mx-2">
            Quyên góp
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;