import React from 'react';
import { Container, Grid, Heading, Text, Box, Button, Card, CardBody } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { 
  FaAmbulance, 
  FaHandshake,
  FaPaw,
  FaCalendarAlt
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import styles from './FeatureSection.module.css';

const features = [
  {
    id: 1,
    icon: <FaAmbulance />,
    title: 'Cứu hộ khẩn cấp',
    description: 'Kết nối với các tình nguyện viên gần bạn trong trường hợp khẩn cấp. Chúng tôi sẵn sàng hỗ trợ 24/7 cho các trường hợp cứu hộ khẩn cấp.',
    link: '/emergency',
    buttonText: 'Cấp cứu ngay',
    color: '#4CAF50'
  },
  {
    id: 2,
    icon: <FaHandshake />,
    title: 'Đăng ký tình nguyện',
    description: 'Đăng ký làm tình nguyện viên và tham gia cộng đồng yêu thương động vật. Bạn có thể giúp đỡ trong nhiều hoạt động khác nhau.',
    link: '/volunteer',
    buttonText: 'Đăng ký tình nguyện viên',
    color: '#FF9800'
  },
  {
    id: 3,
    icon: <FaPaw />,
    title: 'Tìm kiếm và nhận nuôi thú cưng',
    description: 'Tìm kiếm thú cưng không chỉ là việc phát hiện những bé vật nuôi bị thất lạc, mà còn là cơ hội nhận nuôi một người bạn bốn chân tuyệt vời và tìm kiếm ngôi nhà mới đầy yêu thương cho những thú cưng cần sự chăm sóc. Chúng tôi hỗ trợ bạn kết nối và mang niềm vui, hạnh phúc đến cho mọi gia đình.',
    link: '/rescue',
    buttonText: 'Tìm kiếm ngay',
    color: '#E91E63'
  },  
  {
    id: 4,
    icon: <FaCalendarAlt />,
    title: 'Sự kiện cộng đồng',
    description: 'Tham gia các sự kiện cộng đồng, hội thảo và buổi gặp mặt để chia sẻ kinh nghiệm và mở rộng mạng lưới yêu thương động vật.',
    link: '/event',
    buttonText: 'Xem lịch sự kiện',
    color: '#3F51B5'
  }
];

const FeatureSection = () => {
  // Tạo hiệu ứng container cho animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  // Hiệu ứng cho từng card
  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: (i) => ({ 
      y: 0, 
      opacity: 1,
      transition: { 
        delay: i * 0.2,
        duration: 0.5
      }
    }),
    hover: { 
      y: -10,
      boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
      transition: { 
        type: "spring", 
        stiffness: 300 
      }
    }
  };

  // Sử dụng Box của Chakra UI với className để giữ lại CSS modules
  const MotionBox = motion(Box);
  const MotionCard = motion(Card);

  return (
    <Box as="section" className={styles.featureSection}>
      <Container maxW="container.lg">
        <Box className={styles.featureSection__header}>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Heading as="h2" className={styles.featureSection__title}>
             Dịch vụ của chúng tôi
            </Heading>
            <Text fontSize="lg" className={styles.featureSection__subtitle}>
              Khám phá các tính năng của Pet Rescue Hub giúp kết nối và hỗ trợ cộng đồng yêu thương động vật
            </Text>
          </MotionBox>
        </Box>
        
        <MotionBox
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid templateColumns={{ base: "repeat(1, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={4} className={styles.featureSection__container}>
            {features.map((feature, index) => (
              <MotionBox
                key={feature.id}
                custom={index}
                variants={cardVariants}
                whileHover="hover"
              >
                <Card className={styles.featureSection__card}>
                  <CardBody className={styles.featureSection__cardContent}>
                    <Box 
                      className={styles.featureSection__iconContainer}
                      bg={`${feature.color}20`}
                    >
                      <Box className={styles.featureSection__icon} color={feature.color}>
                        {feature.icon}
                      </Box>
                    </Box>
                    
                    <Heading as="h5" size="md" className={styles.featureSection__featureTitle}>
                      {feature.title}
                    </Heading>
                    
                    <Text className={styles.featureSection__featureDescription}>
                      {feature.description}
                    </Text>
                    
                    <Button 
                      as={Link} 
                      to={feature.link} 
                      variant="solid" 
                      className={styles.featureSection__button}
                      bg={feature.color}
                      color="white"
                      _hover={{ bg: feature.color, opacity: 0.9 }}
                    >
                      {feature.buttonText}
                    </Button>
                  </CardBody>
                </Card>
              </MotionBox>
            ))}
          </Grid>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default FeatureSection;