import React, { useEffect } from 'react';
import { Home } from 'lucide-react';
import './NotFound.css';
import buffaloImg from '../../assets/images/buffalo.svg';

const NotFound = () => {
  useEffect(() => {
    // Hiệu ứng di chuyển mây
    const clouds = document.querySelectorAll('.cloud');
    clouds.forEach(cloud => {
      const speed = parseFloat(cloud.getAttribute('data-speed'));
      let position = parseFloat(cloud.getAttribute('data-start'));
      setInterval(() => {
        position -= speed;
        if (position < -150) position = 100;
        cloud.style.left = `${position}%`;
      }, 50);
    });
  }, []);

  return (
    <div className="not-found404-container">
      {/* Cờ Việt Nam */}
      <div className="flag-background">
        <div className="flag-star">★</div>
      </div>

      {/* Cảnh đồng quê */}
      <div className="rice-field-scene">
        <div className="cloud" data-speed="0.05" data-start="10" style={{ top: '10%', left: '10%' }} />
        <div className="cloud" data-speed="0.03" data-start="30" style={{ top: '15%', left: '30%' }} />
        <div className="cloud" data-speed="0.07" data-start="70" style={{ top: '8%', left: '70%' }} />
        <div className="mountains" />
        <div className="rice-field" />
        {/* Trâu + nông dân */}
        <div className="farmer-buffalo-scene">

    </div>
        <div className="foreground-grass" />
      </div>

      {/* Card 404 */}
      <div className="not-found-card">
        <h1 className="code">404</h1>
        <h2 className="notfound-title">Trang không tìm thấy</h2>

        <div className="animal-message">
          {/* Hiển thị inline SVG trong message */}
          <img src={buffaloImg} alt="Buffalo" className="buffalo-svg" />
          <p className="message">
            <span className="highlight">Ôi!</span> Con trâu đã lạc mất trang này trên cánh đồng!<br/>
            Hãy quay về trang chủ để tiếp tục hành trình.
          </p>
        </div>

        <div className="animal-footprints">
          <div className="footprint fp1" />
          <div className="footprint fp2" />
          <div className="footprint fp3" />
          <div className="footprint fp4" />
          <div className="footprint fp5" />
        </div>

        <button className="btn-home" onClick={() => window.location.href = '/'}>
          <Home /> Về Trang Chủ
        </button>

        <div className="footer-note">
          Hồn quê Việt Nam vẹn nguyên trên từng bước cày
        </div>
      </div>
    </div>
  );
};

export default NotFound;