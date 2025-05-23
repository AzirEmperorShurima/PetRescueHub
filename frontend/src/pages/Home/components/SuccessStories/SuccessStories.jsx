import React, { useState, useEffect, useMemo } from 'react';
import { 
  Container, 
  Box, 
  Grid, 
  GridItem, 
  Heading, 
  Text, 
  Card, 
  CardBody, 
  Image, 
  Avatar, 
  Button, 
  Flex, 
  Stack 
} from '@chakra-ui/react';
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
    <Box as="section" className={styles.successStories}>
      <Container maxW="container.lg">
        <Box className={styles.successStories__header}>
          <Heading as="h2" className={styles.successStories__title}>
            Câu Chuyện Thành Công
          </Heading>
          <Text className={styles.successStories__subtitle}>
            Những câu chuyện cảm động về hành trình cứu hộ và tìm mái ấm mới cho thú cưng
          </Text>
        </Box>
        
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
          {/* Recent Rescues */}
          <GridItem>
            <Heading as="h5" size="md" className={styles.successStories__subsectionTitle}>
              Cứu Hộ Gần Đây
            </Heading>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={styles.successStories__rescuesContainer}
            >
              {recentRescues.map((rescue) => (
                <motion.div key={rescue.id} variants={itemVariants}>
                  <Card className={styles.successStories__rescueCard}>
                    <Grid templateColumns={{ base: "1fr", sm: "1fr 2fr" }}>
                      <GridItem>
                        <Image
                          src={rescue.image}
                          alt={rescue.title}
                          objectFit="cover"
                          height="100%"
                          className={styles.successStories__rescueImage}
                        />
                      </GridItem>
                      <GridItem>
                        <CardBody className={styles.successStories__rescueContent}>
                          <Heading as="h6" size="sm" className={styles.successStories__rescueTitle}>
                            {rescue.title}
                          </Heading>
                          <Text fontSize="sm" className={styles.successStories__rescueDescription}>
                            {rescue.description}
                          </Text>
                          <Text fontSize="xs" className={styles.successStories__rescueDate}>
                            {rescue.date}
                          </Text>
                        </CardBody>
                      </GridItem>
                    </Grid>
                  </Card>
                </motion.div>
              ))}
              
              <Box className={styles.successStories__viewAllContainer}>
                <Button 
                  variant="outline" 
                  colorScheme="blue" 
                  className={styles.successStories__viewAllBtn}
                >
                  Xem tất cả câu chuyện cứu hộ
                </Button>
              </Box>
            </motion.div>
          </GridItem>
          
          {/* Testimonial Slider */}
          <GridItem>
            <Heading as="h5" size="md" className={styles.successStories__subsectionTitle}>
              Chia Sẻ Từ Người Nhận Nuôi
            </Heading>
            
            <Box className={styles.successStories__testimonialSlider}>
              {testimonials.map((testimonial, index) => (
                <Box 
                  key={testimonial.id} 
                  className={`${styles.successStories__testimonial} ${index === activeTestimonial ? styles.successStories__testimonial_active : ''}`}
                >
                  <Box className={styles.successStories__testimonialContent}>
                    <Text>{testimonial.content}</Text>
                  </Box>
                  
                  <Flex className={styles.successStories__testimonialAuthor}>
                    <Avatar 
                      src={testimonial.avatar} 
                      name={testimonial.name}
                      className={styles.successStories__testimonialAvatar}
                    />
                    <Stack spacing={0} className={styles.successStories__testimonialInfo}>
                      <Text fontWeight="bold" className={styles.successStories__testimonialName}>
                        {testimonial.name}
                      </Text>
                      <Text fontSize="sm" className={styles.successStories__testimonialRole}>
                        {testimonial.role}
                      </Text>
                    </Stack>
                  </Flex>
                </Box>
              ))}
              
              <Flex className={styles.successStories__testimonialIndicators}>
                {testimonials.map((_, index) => (
                  <Box 
                    key={index} 
                    className={`${styles.successStories__testimonialIndicator} ${index === activeTestimonial ? styles.successStories__testimonialIndicator_active : ''}`}
                    onClick={() => setActiveTestimonial(index)}
                  />
                ))}
              </Flex>
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default SuccessStories;