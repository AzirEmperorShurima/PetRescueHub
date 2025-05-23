import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Heading,
  Image,
  Text,
  Icon,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import buffaloImg from '../../../assets/images/buffalo.svg';
import './NotFound.css'; // Giữ nguyên CSS gốc

const NotFound = () => {
  useEffect(() => {
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
    <Box className="not-found404-container">
      {/* Cờ Việt Nam */}
      <Box className="flag-background">
        <Box className="flag-star">★</Box>
      </Box>

      {/* Cảnh đồng quê */}
      <Box className="rice-field-scene">
        <Box className="cloud" data-speed="0.05" data-start="10" style={{ top: '10%', left: '10%' }} />
        <Box className="cloud" data-speed="0.03" data-start="30" style={{ top: '15%', left: '30%' }} />
        <Box className="cloud" data-speed="0.07" data-start="70" style={{ top: '8%', left: '70%' }} />
        <Box className="mountains" />
        <Box className="rice-field" />
        <Box className="farmer-buffalo-scene" />
        <Box className="foreground-grass" />
      </Box>

      {/* Card 404 */}
      <Box className="not-found-card">
        <Heading className="code" as="h1" size="4xl">
          404
        </Heading>
        <Heading className="notfound-title" as="h2" size="lg">
          Trang không tìm thấy
        </Heading>

        <Box className="animal-message">
          <Image src={buffaloImg} alt="Buffalo" className="buffalo-svg" />
          <Text className="message">
            <span className="highlight">Ôi!</span> Con trâu đã lạc mất trang này trên cánh đồng!
            <br />
            Hãy quay về trang chủ để tiếp tục hành trình.
          </Text>
        </Box>

        <Box className="animal-footprints">
          <Box className="footprint fp1" />
          <Box className="footprint fp2" />
          <Box className="footprint fp3" />
          <Box className="footprint fp4" />
          <Box className="footprint fp5" />
        </Box>

        <Button
          className="btn-home"
          leftIcon={<ArrowBackIcon />}
          colorScheme="green"
          onClick={() => (window.location.href = '/')}
          mt={4}
        >
          Về Trang Chủ
        </Button>

        <Text className="footer-note" mt={4}>
          PetRescueHub
        </Text>
      </Box>
    </Box>
  );
};

export default NotFound;
