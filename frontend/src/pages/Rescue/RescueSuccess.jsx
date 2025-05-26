import React, { useEffect } from 'react';
import {
  Container,
  Card,
  CardBody,
  Heading,
  Text,
  Button,
  VStack,
  Icon,
  Box,
  useColorModeValue,
  ChakraProvider,
  extendTheme
} from '@chakra-ui/react';
import { FaCheckCircle, FaHome } from 'react-icons/fa';
import { GiPawPrint } from 'react-icons/gi'; // Correct import for GiPawPrint
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

// Màu sắc dùng chung
const colors = {
  primary: '#D34F81',
  secondary: '#666',
  success: 'green.500'
};

// Theme tối giản cho style chung
const theme = extendTheme({
  components: {
    Heading: { baseStyle: { fontWeight: 'bold', color: 'gray.800' } },
    Button: { baseStyle: { _hover: { transform: 'scale(1.05)', transition: 'all 0.2s' } } }
  }
});

const RescueSuccess = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const missionId = state?.missionId || 'UNKNOWN';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const bgColor = useColorModeValue('#f9f9f9', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <ChakraProvider theme={theme}>
      <Container maxW="container.md" py={10} bg={bgColor}>
        <Card
          bg={cardBg}
          shadow="lg"
          borderRadius="xl"
          border="1px"
          borderColor={borderColor}
          position="relative"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            bgGradient: `linear(to-r, ${colors.primary}, pink.300)`,
            borderTopRadius: 'xl'
          }}
        >
          <CardBody p={{ base: 6, md: 8 }}>
            <VStack spacing={6} align="center" textAlign="center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Icon as={FaCheckCircle} color={colors.success} boxSize={20} />
              </motion.div>

              <Heading size="2xl" display="flex" alignItems="center">
                <Icon as={GiPawPrint} mr={2} />
                Báo cáo cứu hộ đã được gửi!
              </Heading>

              <Text fontSize="md" color={colors.secondary}>
                Cảm ơn bạn đã báo cáo. Chúng tôi sẽ xử lý thông tin trong thời gian sớm nhất.
              </Text>

              <Box
                p={4}
                bg="gray.50"
                borderRadius="md"
                border="1px"
                borderColor={borderColor}
                _hover={{ shadow: 'md', transform: 'scale(1.02)' }}
                transition="all 0.2s"
              >
                <Text fontSize="xs" color={colors.secondary} fontWeight="medium">
                  Mã báo cáo cứu hộ
                </Text>
                <Text fontSize="lg" fontWeight="bold" color="gray.800">
                  {missionId}
                </Text>
              </Box>

              <Text fontSize="sm" color={colors.secondary}>
                Tình nguyện viên sẽ liên hệ bạn sớm. Vui lòng giữ điện thoại luôn bật.
              </Text>

              <Button
                bg={colors.primary}
                color="white"
                leftIcon={<FaHome />}
                onClick={() => navigate('/')}
                size="lg"
                _hover={{ bg: '#b71c50' }}
                aria-label="Quay về trang chủ"
              >
                Về trang chủ
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </ChakraProvider>
  );
};

export default RescueSuccess;