import React from 'react';
import { Container, Grid, Typography, Box, Card, CardContent, Avatar, Rating } from '@mui/material';
import styles from './TestimonialsSection.module.css';

const TestimonialsSection = ({ testimonials = [] }) => {
  // Nếu không có dữ liệu testimonials, sử dụng dữ liệu mẫu
  const defaultTestimonials = [
    {
      id: 1,
      content: 'Pet Rescue Hub đã giúp tôi tìm được một người bạn bốn chân tuyệt vời. Cảm ơn đội ngũ đã kết nối chúng tôi!',
      name: 'Nguyễn Văn A',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      rating: 5
    },
    {
      id: 2,
      content: 'Tôi rất ấn tượng với sự nhiệt tình và chuyên nghiệp của các tình nguyện viên. Họ thực sự quan tâm đến từng thú cưng.',
      name: 'Trần Thị B',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      rating: 5
    },
    {
      id: 3,
      content: 'Nền tảng dễ sử dụng và cộng đồng rất thân thiện. Tôi đã tham gia làm tình nguyện viên và đó là trải nghiệm tuyệt vời!',
      name: 'Lê Văn C',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      rating: 4
    }
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials;

  return (
    <section className={styles.testimonials}>
      <Container className={styles.testimonials__container}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h2" className={styles.testimonials__title}>
            Đánh giá từ cộng đồng
          </Typography>
          <Typography variant="subtitle1" className={styles.testimonials__subtitle}>
            Những chia sẻ từ người nhận nuôi và tình nguyện viên
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {displayTestimonials.map((testimonial) => (
            <Grid item lg={4} md={6} sm={12} key={testimonial.id}>
              <Card className={styles.testimonials__card}>
                <CardContent className={styles.testimonials__cardContent}>
                  <Typography className={styles.testimonials__content}>
                    {testimonial.content}
                  </Typography>
                  
                  <Box className={styles.testimonials__author}>
                    <Avatar 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className={styles.testimonials__avatar}
                    />
                    <Box className={styles.testimonials__info}>
                      <Typography className={styles.testimonials__name}>
                        {testimonial.name}
                      </Typography>
                      <Rating 
                        value={testimonial.rating} 
                        readOnly 
                        size="small"
                        className={styles.testimonials__rating}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </section>
  );
};

export default TestimonialsSection;