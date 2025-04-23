import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Card, CardMedia, CardContent, Avatar, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { testimonials, recentRescues } from '../../../mocks';
import './SuccessStories.css';

const SuccessStories = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  // Auto rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <section className="success-stories-section">
      <Container maxWidth="lg">
        <Box className="section-header">
          <Typography variant="h2" className="section-title animate-fadeIn">
            Câu Chuyện Thành Công
          </Typography>
          <Typography variant="subtitle1" className="section-subtitle animate-fadeIn">
            Những câu chuyện cảm động về hành trình cứu hộ và tìm mái ấm mới cho thú cưng
          </Typography>
        </Box>
        
        <Grid container spacing={6}>
          {/* Recent Rescues */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" className="subsection-title animate-slideInLeft">
              Cứu Hộ Gần Đây
            </Typography>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="rescues-container"
            >
              {recentRescues.map((rescue) => (
                <motion.div key={rescue.id} variants={itemVariants}>
                  <Card className="rescue-card">
                    <Grid container>
                      <Grid item xs={4}>
                        <CardMedia
                          component="img"
                          height="100%"
                          image={rescue.image}
                          alt={rescue.title}
                          className="rescue-image"
                        />
                      </Grid>
                      <Grid item xs={8}>
                        <CardContent className="rescue-content">
                          <Typography variant="h6" className="rescue-title">
                            {rescue.title}
                          </Typography>
                          <Typography variant="body2" className="rescue-description">
                            {rescue.description}
                          </Typography>
                          <Typography variant="caption" className="rescue-date">
                            {rescue.date}
                          </Typography>
                        </CardContent>
                      </Grid>
                    </Grid>
                  </Card>
                </motion.div>
              ))}
              
              <Box className="view-all-container">
                <Button 
                  variant="outlined" 
                  color="primary" 
                  className="view-all-btn"
                >
                  Xem tất cả câu chuyện cứu hộ
                </Button>
              </Box>
            </motion.div>
          </Grid>
          
          {/* Testimonials */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" className="subsection-title animate-slideInRight">
              Chia Sẻ Từ Người Nhận Nuôi
            </Typography>
            
            <Box className="testimonials-container animate-slideInRight">
              <Box className="testimonials-slider">
                {testimonials.map((testimonial, index) => (
                  <Box 
                    key={testimonial.id} 
                    className={`testimonial-item ${index === activeTestimonial ? 'active' : ''}`}
                  >
                    <Box className="testimonial-content">
                      <Box className="testimonial-quote">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 11H6C5.44772 11 5 10.5523 5 10V6C5 5.44772 5.44772 5 6 5H10C10.5523 5 11 5.44772 11 6V10C11 10.5523 10.5523 11 10 11ZM10 11V14C10 15.6569 8.65685 17 7 17H6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M19 11H15C14.4477 11 14 10.5523 14 10V6C14 5.44772 14.4477 5 15 5H19C19.5523 5 20 5.44772 20 6V10C20 10.5523 19.5523 11 19 11ZM19 11V14C19 15.6569 17.6569 17 16 17H15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Box>
                      
                      <Typography variant="body1" className="testimonial-text">
                        {testimonial.content}
                      </Typography>
                      
                      <Box className="testimonial-rating">
                        {[...Array(5)].map((_, i) => (
                          <span 
                            key={i} 
                            className={`star ${i < testimonial.rating ? 'filled' : ''}`}
                          >
                            ★
                          </span>
                        ))}
                      </Box>
                      
                      <Box className="testimonial-author">
                        <Avatar 
                          src={testimonial.avatar} 
                          alt={testimonial.name} 
                          className="testimonial-avatar"
                        />
                        <Typography variant="subtitle1" className="testimonial-name">
                          {testimonial.name}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
              
              <Box className="testimonial-dots">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`testimonial-dot ${index === activeTestimonial ? 'active' : ''}`}
                    onClick={() => setActiveTestimonial(index)}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </section>
  );
};

export default SuccessStories;