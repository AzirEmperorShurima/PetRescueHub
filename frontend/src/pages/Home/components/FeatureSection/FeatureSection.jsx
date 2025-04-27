import React from 'react';
import { Container, Grid, Typography, Box, Button, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import { 
  Pets as PetsIcon, 
  Handshake as VolunteerIcon,
  LocalHospital as EmergencyIcon,
  Event as EventIcon
} from '@mui/icons-material';
import styles from './FeatureSection.module.css';

const features = [
  {
    id: 1,
    icon: <EmergencyIcon />,
    title: 'Cứu hộ khẩn cấp',
    description: 'Kết nối với các tình nguyện viên gần bạn trong trường hợp khẩn cấp. Chúng tôi sẵn sàng hỗ trợ 24/7 cho các trường hợp cứu hộ khẩn cấp.',
    link: '/emergency',
    buttonText: 'Cấp cứu ngay',
    color: '#4CAF50'
  },
  {
    id: 2,
    icon: <VolunteerIcon />,
    title: 'Đăng ký tình nguyện',
    description: 'Đăng ký làm tình nguyện viên và tham gia cộng đồng yêu thương động vật. Bạn có thể giúp đỡ trong nhiều hoạt động khác nhau.',
    link: '/volunteer',
    buttonText: 'Đăng ký tình nguyện viên',
    color: '#FF9800'
  },
  {
    id: 3,
    icon: <PetsIcon />,
    title: 'Tìm kiếm và nhận nuôi thú cưng',
    description: 'Tìm kiếm thú cưng không chỉ là việc phát hiện những bé vật nuôi bị thất lạc, mà còn là cơ hội nhận nuôi một người bạn bốn chân tuyệt vời và tìm kiếm ngôi nhà mới đầy yêu thương cho những thú cưng cần sự chăm sóc. Chúng tôi hỗ trợ bạn kết nối và mang niềm vui, hạnh phúc đến cho mọi gia đình.',
    link: '/rescue',
    buttonText: 'Tìm kiếm ngay',
    color: '#E91E63'
  },  
  {
    id: 4,
    icon: <EventIcon />,
    title: 'Sự kiện cộng đồng',
    description: 'Tham gia các sự kiện cộng đồng, hội thảo và buổi gặp mặt để chia sẻ kinh nghiệm và mở rộng mạng lưới yêu thương động vật.',
    link: '/event',
    buttonText: 'Xem lịch sự kiện',
    color: '#3F51B5'
  }
];

const FeatureSection = () => {
  return (
    <section className={styles.featureSection}>
      <Container maxWidth="lg">
        <Box className={styles.featureSection__header}>
          <Typography variant="h2" className={styles.featureSection__title}>
           Dịch vụ của chúng tôi
          </Typography>
          <Typography variant="subtitle1" className={styles.featureSection__subtitle}>
            Khám phá các tính năng của Pet Rescue Hub giúp kết nối và hỗ trợ cộng đồng yêu thương động vật
          </Typography>
        </Box>
        
        <Grid container spacing={4} className={styles.featureSection__container}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={feature.id}>
              <Card 
                className={styles.featureSection__card} 
                sx={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardContent className={styles.featureSection__cardContent}>
                  <Box 
                    className={styles.featureSection__iconContainer}
                    sx={{ backgroundColor: `${feature.color}20` }}
                  >
                    <Box className={styles.featureSection__icon} sx={{ color: feature.color }}>
                      {feature.icon}
                    </Box>
                  </Box>
                  
                  <Typography variant="h5" className={styles.featureSection__featureTitle}>
                    {feature.title}
                  </Typography>
                  
                  <Typography variant="body1" className={styles.featureSection__featureDescription}>
                    {feature.description}
                  </Typography>
                  
                  <Button 
                    component={Link} 
                    to={feature.link} 
                    variant="contained" 
                    className={styles.featureSection__button}
                    sx={{ backgroundColor: feature.color }}
                  >
                    {feature.buttonText}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </section>
  );
};

export default FeatureSection;