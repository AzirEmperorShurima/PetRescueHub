import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import './AboutSection.css';
import { images } from '../../../config/LinkImage.config';

const AboutSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Hàm cuộn đến phần Impact Counter
  const scrollToImpact = (e) => {
    e.preventDefault();
    const impactSection = document.getElementById('impact-counter');
    if (impactSection) {
      impactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Container maxWidth="lg">
      <Box className="about-section animate-fadeIn">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box className="about-image-container">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.alt}
                  className={`about-image ${index === currentImageIndex ? 'active' : ''}`}
                />
              ))}
              <div className="image-indicators">
                {images.map((_, index) => (
                  <span
                    key={index}
                    className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box className="about-content">
              <Typography variant="h3" className="about-title">
                Về Pet Rescue Hub
              </Typography>

              <Typography variant="body1" className="about-description">
                Pet Rescue Hub là nền tảng kết nối cộng đồng yêu thương động vật, nơi mọi người có thể cùng nhau giúp đỡ, cứu hộ và chăm sóc những thú cưng gặp khó khăn.
              </Typography>

              <Typography variant="body1" className="about-description">
                Chúng tôi tin rằng mỗi thú cưng đều xứng đáng có một mái ấm hạnh phúc và được yêu thương. Với sứ mệnh đó, chúng tôi xây dựng một cộng đồng kết nối những người yêu động vật, tình nguyện viên và các tổ chức cứu hộ.
              </Typography>

              <Button
                onClick={scrollToImpact}
                variant="outlined"
                color="primary"
                className="learn-more-btn"
              >
                Xem Tác Động Của Chúng Tôi
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AboutSection;
