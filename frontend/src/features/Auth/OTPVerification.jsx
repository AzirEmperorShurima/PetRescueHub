import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  IconButton,
  Button,
  Input,
  Box,
  Text,
  Flex,
  useColorModeValue,
  PinInput,
  PinInputField,
  HStack,
  Center,
  Icon
} from '@chakra-ui/react';
import { FiX } from 'react-icons/fi';
import { FaPaw, FaCat, FaDog, FaKiwiBird } from 'react-icons/fa';
import authService from '../../services/auth.service';
import { useNotification } from '../../components/contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';

const OTPVerification = ({ open, onClose, email, onVerify }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const resendDelay = 60; // 60 seconds

  // Color mode values to match MUI theme
  const closeIconColor = useColorModeValue('gray.500', 'gray.400');
  const textSecondaryColor = useColorModeValue('gray.600', 'gray.400');
  const errorColor = useColorModeValue('red.500', 'red.300');
  const primaryColorScheme = '#FF4081'; // Thay đổi màu thành #FF4081
  const borderColor = useColorModeValue('gray.300', 'gray.600');
  const bgColor = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    if (open && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [open]);

  useEffect(() => {
    let timer;
    if (open && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [countdown, open]);

  const handleChange = (index, value) => {
    if (value.length > 1) {
      value = value.charAt(0);
    }

    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Thêm xử lý phím Enter để xác thực
    if (e.key === 'Enter') {
      handleVerify();
      return;
    }
    
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');

    if (!/^\d+$/.test(pastedData)) {
      return;
    }

    const digits = pastedData.slice(0, 6).split('');
    const newOtp = [...otp];

    digits.forEach((digit, index) => {
      if (index < 6) {
        newOtp[index] = digit;
      }
    });

    setOtp(newOtp);

    if (digits.length > 0 && digits.length < 6) {
      inputRefs.current[digits.length].focus();
    } else if (digits.length === 6) {
      // Tự động xác thực khi dán đủ 6 số
      setTimeout(() => {
        inputRefs.current[5].focus();
        // Không tự động xác thực để người dùng có thể kiểm tra lại
      }, 100);
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setError('Vui lòng nhập đủ 6 chữ số OTP');
      return;
    }

    try {
      console.log("Verifying OTP with:", { email, otpCode });
      let response;
      try {
        response = await onVerify(otpCode);
        console.log("OTP verification response:", response);
      } catch (err) {
        setError(err.message);
        return;
      }

      const isSuccess =
        response === true ||
        response === 'success' ||
        response?.status === 200 ||
        response?.status === 201 ||
        response?.success === true ||
        (response?.data && (response.data.success === true || response.data.status === 'success'));

      if (isSuccess) {
        showNotification('Xác thực OTP thành công!', 'success');
        // Sửa lại logic để tránh gọi onVerify hai lần
        onClose();
      } else {
        const errorMessage =
          response?.message ||
          response?.data?.message ||
          response?.error ||
          response?.data?.error ||
          'Xác thực OTP thất bại';

        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setError(err.message || 'Xác thực OTP thất bại. Vui lòng thử lại.');
    }
  };

  const handleResend = async () => {
    setCountdown(resendDelay);
    setCanResend(false);

    try {
      const response = await authService.sendOTP(email, 'register');
      if (response.success) {
        showNotification('Mã OTP mới đã được gửi đến email của bạn', 'info');
        setError('');
      } else {
        setError(response.message || 'Không thể gửi lại mã OTP. Vui lòng thử lại sau.');
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
      setError(err.response?.data?.message || 'Không thể gửi lại mã OTP. Vui lòng thử lại sau.');
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent 
        maxW="2xl" 
        w="full" 
        borderRadius="md" 
        boxShadow="xl"
        bg={bgColor}
      >
        <ModalHeader 
          borderBottomWidth="1px" 
          borderColor={borderColor}
          py={4}
          position="relative"
          textAlign="center" // Căn giữa tiêu đề
        >
          <Center>
            <Icon as={FaPaw} mr={2} color={primaryColorScheme} />
            <Text fontSize="2xl" fontWeight="bold">Xác thực OTP</Text>
            <Icon as={FaPaw} ml={2} color={primaryColorScheme} />
          </Center>
          <IconButton
            icon={<FiX />}
            size="sm"
            variant="ghost"
            position="absolute"
            right={3}
            top={3}
            onClick={onClose}
            aria-label="Close"
            color={closeIconColor}
          />
        </ModalHeader>

        <ModalBody py={6} px={6}>
          <Box textAlign="center" mb={6}>
            <Text fontSize="lg" color={textSecondaryColor}>
              Chúng tôi đã gửi mã OTP đến email {email}. Vui lòng nhập mã để hoàn tất quá trình.
            </Text>
          </Box>

          <Box mb={6}>
            <HStack spacing={4} justify="center">
              {otp.map((digit, index) => (
                <PinInput key={index} size="lg">
                  <PinInputField
                    ref={(el) => (inputRefs.current[index] = el)}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={(e) => handlePaste(e)} // Cho phép dán ở bất kỳ ô nào
                    borderColor={borderColor}
                    _focus={{
                      borderColor: primaryColorScheme,
                      boxShadow: `0 0 0 1px ${primaryColorScheme}`,
                    }}
                    fontSize="xl"
                    width="50px"
                    height="50px"
                  />
                </PinInput>
              ))}
            </HStack>
          </Box>

          {error && (
            <Text color={errorColor} textAlign="center" mb={4}>
              {error}
            </Text>
          )}

          <Button
            width="100%"
            onClick={handleVerify}
            mb={4}
            bg={primaryColorScheme}
            color="white"
            _hover={{
              bg: '#D81B60', // Màu tối hơn khi hover
            }}
          >
            Xác thực
          </Button>

          <Flex justify="center" align="center">
            <Text fontSize="sm" color={textSecondaryColor}>
              Chưa nhận được mã? 
            </Text>
            <Button
              variant="link"
              fontSize="sm"
              ml={1}
              color={primaryColorScheme}
              onClick={handleResend}
              isDisabled={!canResend}
            >
              Gửi lại {!canResend && `sau ${countdown}s`}
            </Button>
          </Flex>
          
          {/* Thêm biểu tượng động vật ở cuối */}
          <Flex justify="center" mt={6} color={textSecondaryColor}>
            <Icon as={FaDog} mx={2} />
            <Icon as={FaCat} mx={2} />
            <Icon as={FaKiwiBird} mx={2} />
            <Icon as={FaPaw} mx={2} />
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default OTPVerification;
