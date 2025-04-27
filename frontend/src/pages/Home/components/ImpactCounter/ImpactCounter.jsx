// ImpactCounter.jsx
import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, Card } from '@mui/material';
import { useInView } from 'react-intersection-observer';
import styles from './ImpactCounter.module.css';

const ImpactCounter = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [counters, setCounters] = useState({
    rescued: 0,
    adopted: 0,
    volunteers: 0,
    events: 0,
  });

  const targetValues = {
    rescued: 500,
    adopted: 300,
    volunteers: 100,
    events: 50,
  };

  const counterData = [
    {
      id: 'rescued',
      icon: 'pets',
      value: counters.rescued,
      label: 'Thú cưng được cứu hộ',
      description: 'Số lượng thú cưng đã được cứu hộ thành công từ các tình huống nguy hiểm',
      color: '#E91E63', // Pink
    },
    {
      id: 'adopted',
      icon: 'home',
      value: counters.adopted,
      label: 'Thú cưng tìm được mái ấm mới',
      description: 'Số lượng thú cưng đã được nhận nuôi và có được gia đình mới yêu thương',
      color: '#4CAF50', // Green
    },
    {
      id: 'volunteers',
      icon: 'volunteer',
      value: counters.volunteers,
      label: 'Tình nguyện viên',
      description: 'Đội ngũ tình nguyện viên tận tâm, luôn sẵn sàng hỗ trợ các hoạt động cứu hộ',
      color: '#FF9800', // Orange
    },
    {
      id: 'events',
      icon: 'event',
      value: counters.events,
      label: 'Sự kiện mỗi năm',
      description: 'Các sự kiện nhận nuôi, quyên góp và nâng cao nhận thức cộng đồng',
      color: '#3F51B5', // Blue
    },
  ];

  useEffect(() => {
    if (inView) {
      const duration = 2000;
      const frameDuration = 1000 / 60;
      const totalFrames = Math.round(duration / frameDuration);
      
      let frame = 0;
      const timer = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        
        setCounters({
          rescued: Math.floor(progress * targetValues.rescued),
          adopted: Math.floor(progress * targetValues.adopted),
          volunteers: Math.floor(progress * targetValues.volunteers),
          events: Math.floor(progress * targetValues.events),
        });
        
        if (frame === totalFrames) {
          clearInterval(timer);
          setCounters(targetValues);
        }
      }, frameDuration);
      
      return () => clearInterval(timer);
    }
  }, [inView]);

  return (
    <Container maxWidth="lg">
      <Box textAlign="center" mb={4}>
        <Typography variant="h2" component="h2" className={styles.impact__title} gutterBottom>
          Tác Động Của Chúng Tôi
        </Typography>
        <Typography variant="subtitle1" className={styles.impact__subtitle}>
          Mỗi con số đều đại diện cho một câu chuyện, một cuộc đời được thay đổi
        </Typography>
      </Box>
      
      <Grid container spacing={4} className={styles.impact__container} ref={ref}>
        {counterData.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.id}>
            <Card className={styles.impact__card}>
              <Box className={styles.impact__iconContainer} sx={{ backgroundColor: `${stat.color}20` }}>
                <Box className={styles.impact__icon} sx={{ color: stat.color }}>
                  {stat.icon === 'pets' && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="40" height="40">
                      <path d="M4.5 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm3-5.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm9 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm3 5.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm-3 5.5c-1.4 0-2.5-1.1-2.5-2.5 0-1.4-1.1-2.5-2.5-2.5s-2.5 1.1-2.5 2.5c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5c0-4.1 3.4-7.5 7.5-7.5s7.5 3.4 7.5 7.5c0 1.4-1.1 2.5-2.5 2.5z"/>
                    </svg>
                  )}
                  {stat.icon === 'volunteer' && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="40" height="40">
                      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                    </svg>
                  )}
                  {stat.icon === 'home' && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="40" height="40">
                      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                    </svg>
                  )}
                  {stat.icon === 'event' && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="40" height="40">
                      <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
                    </svg>
                  )}
                </Box>
              </Box>
              
              <Typography 
                variant="h3" 
                className={`${styles.impact__value} ${styles.impact__value_animated}`}
                sx={{ color: stat.color }}
              >
                {stat.value}+
              </Typography>
              
              <Typography 
                variant="h6" 
                className={styles.impact__label}
              >
                {stat.label}
              </Typography>
              
              <Typography 
                variant="body2" 
                className={styles.impact__description}
              >
                {stat.description}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ImpactCounter;