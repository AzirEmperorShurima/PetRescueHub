import React from 'react';
import { 
  Typography, 
  Card, 
  CardContent, 
  Box,
  Button
} from '@mui/material';
import { motion } from 'framer-motion';

const AnimalShowcase = ({ rescueImages, currentImageIndex, setCurrentImageIndex }) => {
  return (
    <Card elevation={0} className="animal-showcase-card">
      <CardContent sx={{ p: 0 }}>
        <Box className="animal-image-container">
          {rescueImages.map((img, index) => (
            <Box 
              key={index}
              className={`animal-image ${index === currentImageIndex ? 'active' : ''}`}
              style={{ backgroundImage: `url(${img})` }}
            >
              <Box className="animal-image-overlay">
                <Typography variant="h5" className="animal-image-caption">
                  {index === 0 ? "Mỗi sinh mạng đều đáng quý" : 
                   index === 1 ? "We need your help and support" : 
                   "Hãy chung tay vì những người bạn bé nhỏ"}
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  className="donate-now-btn"
                  onClick={() => document.getElementById('payment-methods').scrollIntoView({ behavior: 'smooth' })}
                >
                  Donation Now !!!
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
        
        
      </CardContent>
      <Box className="donation-quote-wrapper">
          <Typography 
            variant="h6" 
            component="p" 
            className="donation-quote"
          >
            <span className="highlight-text">Mỗi đóng góp</span> của bạn là một <span className="highlight-text">cơ hội sống mới</span> cho những người bạn bốn chân
          </Typography>
        </Box>
    </Card>
  );
};

export default AnimalShowcase;