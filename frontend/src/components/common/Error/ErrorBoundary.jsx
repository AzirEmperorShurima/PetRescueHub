import React, { Component } from 'react';
import {
  Box,
  Text,
  Heading,
  Button,
  Container,
  Flex,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { FaExclamationTriangle } from 'react-icons/fa';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Cập nhật state để hiển thị UI fallback
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Ghi log lỗi
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ error, errorInfo });
    
    // Gửi lỗi đến service theo dõi lỗi (nếu có)
    // errorTrackingService.captureException(error, { extra: errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Hiển thị UI khi có lỗi
      return (
        <ErrorUI 
          error={this.state.error} 
          errorInfo={this.state.errorInfo} 
          onReload={this.handleReload} 
          onGoHome={this.handleGoHome} 
        />
      );
    }

    // Nếu không có lỗi, hiển thị children bình thường
    return this.props.children;
  }
}

// Tách UI ra thành functional component để có thể sử dụng hooks của Chakra
const ErrorUI = ({ error, errorInfo, onReload, onGoHome }) => {
  // Sử dụng theme color cho light/dark mode
  const bgColor = useColorModeValue('red.50', 'red.900');
  const borderColor = useColorModeValue('red.100', 'red.700');
  const errorTextColor = useColorModeValue('red.600', 'red.300');
  const codeBlockBg = useColorModeValue('gray.50', 'gray.700');

  return (
    <Container maxW="container.md" py={8}>
      <Box 
        p={6} 
        mt={4} 
        textAlign="center"
        borderRadius="lg"
        bg={bgColor}
        boxShadow="md"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Icon as={FaExclamationTriangle} w={16} h={16} color={errorTextColor} mb={4} />
        <Heading as="h1" size="xl" color={errorTextColor} mb={3}>
          Đã xảy ra lỗi
        </Heading>
        <Text fontSize="lg" mb={6}>
          Rất tiếc, đã xảy ra lỗi khi tải trang này. Đội ngũ kỹ thuật của chúng tôi đã được thông báo và đang khắc phục.
        </Text>
        
        {process.env.NODE_ENV === 'development' && error && (
          <Box 
            mt={4} 
            mb={6} 
            textAlign="left" 
            p={4} 
            bg={codeBlockBg} 
            borderRadius="md"
            overflowX="auto"
          >
            <Text 
              color={errorTextColor} 
              fontFamily="mono"
              fontWeight="bold"
            >
              {error.toString()}
            </Text>
            {errorInfo && (
              <Text 
                as="pre" 
                mt={2} 
                fontSize="sm" 
                maxH="200px" 
                overflowY="auto"
                fontFamily="mono"
                whiteSpace="pre-wrap"
              >
                {errorInfo.componentStack}
              </Text>
            )}
          </Box>
        )}
        
        <Flex mt={6} justify="center" gap={4}>
          <Button colorScheme="blue" onClick={onReload}>
            Tải lại trang
          </Button>
          <Button variant="outline" colorScheme="blue" onClick={onGoHome}>
            Về trang chủ
          </Button>
        </Flex>
      </Box>
    </Container>
  );
};

export default ErrorBoundary;