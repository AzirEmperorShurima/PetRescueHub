import React from 'react';
import {
  Container,
  Grid,
  Heading,
  Text,
  Box,
  Button,
  Card,
  CardBody,
  useColorModeValue,
  VStack,
  Icon,
  Flex
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import {
  FaAmbulance,
  FaHandshake,
  FaPaw,
  FaCalendarAlt
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const features = [
  {
    id: 1,
    icon: FaAmbulance,
    title: 'Hỗ trợ cứu hộ khẩn cấp',
    description:
      'Kết nối với các tình nguyện viên gần bạn trong trường hợp khẩn cấp. Chúng tôi sẵn sàng hỗ trợ 24/7 cho các trường hợp cứu hộ khẩn cấp.',
    link: '/rescue',
    buttonText: 'Cấp cứu ngay',
    color: '#4CAF50',
    gradient: 'linear(to-br, #4CAF50, #45a049)'
  },
  {
    id: 2,
    icon: FaHandshake,
    title: 'Trở thành tình nguyện viên',
    description:
      'Đăng ký làm tình nguyện viên và tham gia cộng đồng yêu thương động vật. Bạn có thể giúp đỡ trong nhiều hoạt động khác nhau.',
    link: '/volunteer',
    buttonText: 'Đăng ký tình nguyện viên',
    color: '#FF9800',
    gradient: 'linear(to-br, #FF9800, #F57C00)'
  },
  {
    id: 3,
    icon: FaPaw,
    title: 'Tìm kiếm và nhận nuôi thú cưng',
    description:
      'Tìm kiếm thú cưng không chỉ là việc phát hiện những bé vật nuôi bị thất lạc, mà còn là cơ hội nhận nuôi một người bạn bốn chân tuyệt vời và tìm kiếm ngôi nhà mới đầy yêu thương cho những thú cưng cần sự chăm sóc.',
    link: '/adopt',
    buttonText: 'Tìm kiếm ngay',
    color: '#E91E63',
    gradient: 'linear(to-br, #E91E63, #C2185B)'
  },
  {
    id: 4,
    icon: FaCalendarAlt,
    title: 'Sự kiện cộng đồng',
    description:
      'Tham gia các sự kiện cộng đồng, hội thảo và buổi gặp mặt để chia sẻ kinh nghiệm và mở rộng mạng lưới yêu thương động vật.',
    link: '/event',
    buttonText: 'Xem lịch sự kiện',
    color: '#3F51B5',
    gradient: 'linear(to-br, #3F51B5, #303F9F)'
  }
];

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const FeatureSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        type: "spring",
        stiffness: 100
      }
    }),
    hover: {
      y: -15,
      scale: 1.03,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');

  return (
    <Box as="section" bg={bgColor} py={20}>
      <Container maxW="container.xl">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          textAlign="center"
          mb={16}
        >
          <Heading
            as="h2"
            size="2xl"
            mb={6}
            bgGradient="linear(to-r, #4CAF50, #3F51B5)"
            bgClip="text"
            fontWeight="extrabold"
          >
            Dịch vụ của chúng tôi
          </Heading>
          <Text fontSize="xl" color="gray.600" maxW="2xl" mx="auto">
            Khám phá các tính năng của Pet Rescue Hub giúp kết nối và hỗ trợ cộng đồng yêu thương động vật
          </Text>
        </MotionBox>

        <MotionBox variants={containerVariants} initial="hidden" animate="visible">
          <Grid
            templateColumns={{
              base: '1fr',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(4, 1fr)'
            }}
            gap={8}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <MotionCard
                  key={feature.id}
                  variants={cardVariants}
                  custom={index}
                  whileHover="hover"
                  bg={cardBg}
                  borderRadius="xl"
                  overflow="hidden"
                  boxShadow="xl"
                >
                  <CardBody p={8} h="100%">
                    <Flex direction="column" h="100%" justify="space-between">
                      <VStack spacing={6} align="stretch">
                        <Flex
                          w={16}
                          h={16}
                          mx="auto"
                          borderRadius="full"
                          bgGradient={feature.gradient}
                          align="center"
                          justify="center"
                          boxShadow="lg"
                        >
                          <Icon as={Icon} boxSize={8} color="white" />
                        </Flex>
                        <VStack spacing={4} align="center">
                          <Heading
                            as="h3"
                            size="lg"
                            textAlign="center"
                            color={feature.color}
                          >
                            {feature.title}
                          </Heading>
                          <Text
                            fontSize="md"
                            textAlign="center"
                            color="gray.600"
                            lineHeight="tall"
                            minH="72px"
                          >
                            {feature.description}
                          </Text>
                        </VStack>
                      </VStack>
                      <Button
                        as={Link}
                        to={feature.link}
                        size="md"
                        fontSize="md"
                        px={6}
                        py={4}
                        mt={8}
                        bgGradient={feature.gradient}
                        color="white"
                        _hover={{
                          transform: 'translateY(-2px)',
                          boxShadow: 'lg',
                        }}
                        _active={{
                          transform: 'translateY(0)',
                        }}
                        transition="all 0.2s"
                        fontWeight="bold"
                        letterSpacing="wide"
                        w="100%"
                        borderRadius="lg"
                      >
                        {feature.buttonText}
                      </Button>
                    </Flex>
                  </CardBody>
                </MotionCard>
              );
            })}
          </Grid>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default FeatureSection;
