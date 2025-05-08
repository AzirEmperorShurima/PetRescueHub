import React, { useState, useEffect, useMemo } from 'react';
import { Container, Typography, Box, Grid, Card, CardMedia, CardContent, Avatar, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { testimonials, recentRescues } from '../../../../mocks';
import styles from './SuccessStories.module.css';

const SuccessStories = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  // Auto rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);
  
  // Animation variants - Sử dụng useMemo để tránh tạo lại object này mỗi khi component render
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  }), []);
  
  const itemVariants = useMemo(() => ({
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  }), []);

  return (
    <section className={styles.successStories}>
      <Container maxWidth="lg">
        <Box className={styles.successStories__header}>
          <Typography variant="h2" className={styles.successStories__title}>
            Câu Chuyện Thành Công
          </Typography>
          <Typography variant="subtitle1" className={styles.successStories__subtitle}>
            Những câu chuyện cảm động về hành trình cứu hộ và tìm mái ấm mới cho thú cưng
          </Typography>
        </Box>
        
        <Grid container spacing={6}>
          {/* Recent Rescues */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" className={styles.successStories__subsectionTitle}>
              Cứu Hộ Gần Đây
            </Typography>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={styles.successStories__rescuesContainer}
            >
              {recentRescues.map((rescue) => (
                <motion.div key={rescue.id} variants={itemVariants}>
                  <Card className={styles.successStories__rescueCard}>
                    <Grid container>
                      <Grid item xs={4}>
                        <CardMedia
                          component="img"
                          height="100%"
                          image={rescue.image}
                          alt={rescue.title}
                          className={styles.successStories__rescueImage}
                        />
                      </Grid>
                      <Grid item xs={8}>
                        <CardContent className={styles.successStories__rescueContent}>
                          <Typography variant="h6" className={styles.successStories__rescueTitle}>
                            {rescue.title}
                          </Typography>
                          <Typography variant="body2" className={styles.successStories__rescueDescription}>
                            {rescue.description}
                          </Typography>
                          <Typography variant="caption" className={styles.successStories__rescueDate}>
                            {rescue.date}
                          </Typography>
                        </CardContent>
                      </Grid>
                    </Grid>
                  </Card>
                </motion.div>
              ))}
              
              <Box className={styles.successStories__viewAllContainer}>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  className={styles.successStories__viewAllBtn}
                >
                  Xem tất cả câu chuyện cứu hộ
                </Button>
              </Box>
            </motion.div>
          </Grid>
          
          {/* Testimonial Slider */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" className={styles.successStories__subsectionTitle}>
              Chia Sẻ Từ Người Nhận Nuôi
            </Typography>
            
            <div className={styles.successStories__testimonialSlider}>
              {testimonials.map((testimonial, index) => (
                <div 
                  key={testimonial.id} 
                  className={`${styles.successStories__testimonial} ${index === activeTestimonial ? styles.successStories__testimonial_active : ''}`}
                >
                  <div className={styles.successStories__testimonialContent}>
                    <p>{testimonial.content}</p>
                  </div>
                  
                  <div className={styles.successStories__testimonialAuthor}>
                    <Avatar 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className={styles.successStories__testimonialAvatar}
                    />
                    <div className={styles.successStories__testimonialInfo}>
                      <Typography variant="subtitle1" className={styles.successStories__testimonialName}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" className={styles.successStories__testimonialRole}>
                        {testimonial.role}
                      </Typography>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className={styles.successStories__testimonialIndicators}>
                {testimonials.map((_, index) => (
                  <span 
                    key={index} 
                    className={`${styles.successStories__testimonialIndicator} ${index === activeTestimonial ? styles.successStories__testimonialIndicator_active : ''}`}
                    onClick={() => setActiveTestimonial(index)}
                  />
                ))}
              </div>
            </div>
          </Grid>
        </Grid>
      </Container>
    </section>
  );
};

export default SuccessStories;