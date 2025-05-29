import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Avatar,
  IconButton,
  Image,
  VStack,
  HStack,
  useColorModeValue,
  useClipboard,
  useToast,
  Input,
  Button,
  FormControl,
  FormLabel,
  chakra,
} from '@chakra-ui/react';
import { CopyIcon, CheckIcon } from '@chakra-ui/icons';
import { FaPaw } from 'react-icons/fa'; // Icon dấu chân thú cưng

// Dữ liệu mẫu
const paymentMethods = [
  {
    name: 'Chuyển khoản',
    logo: 'https://cdn-icons-png.flaticon.com/512/2830/2830284.png',
    details: {
      bank: 'Ngân hàng Vietcombank',
      accountNumber: '1234567890',
      accountName: 'Pet Rescue Hub',
      content: 'Ủng hộ Pet Rescue Hub',
    },
    qrCode: 'https://via.placeholder.com/200?text=Bank+QR',
  },
  {
    name: 'Momo',
    logo: 'https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png',
    apiEndpoint: '/api/payments/momo',
    defaultContent: 'Ủng hộ Pet Rescue Hub qua Momo',
  },
  {
    name: 'VNPay',
    logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png',
    apiEndpoint: '/api/payments/vnpay',
    defaultContent: 'Ủng hộ Pet Rescue Hub qua VNPay',
  },
  {
    name: 'ZaloPay',
    logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png',
    apiEndpoint: '/api/payments/zalopay',
    defaultContent: 'Ủng hộ Pet Rescue Hub qua ZaloPay',
  },
];

const PaymentMethods = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const titleColor = useColorModeValue('pink.500', 'pink.300');
  const accentColor = useColorModeValue('green.300', 'green.200');
  const toast = useToast();

  return (
    <Box
      id="payment-methods"
      py={{ base: 8, md: 12 }}
      px={{ base: 4, md: 8 }}
      bg={useColorModeValue('gray.50', 'gray.900')}
      borderRadius="2xl"
      boxShadow="xl"
      mx="auto"
      maxW="7xl"
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '10px',
        bgGradient: 'linear(to-r, pink.300, green.300)',
        borderTopRadius: '2xl',
      }}
    >
      <Heading
        as="h2"
        size="xl"
        textAlign="center"
        mb={{ base: 6, md: 3 }}
        color={titleColor}
        textShadow="0 2px 4px rgba(0,0,0,0.1)"
      >Hỗ trợ cứu hộ thú cưng 
       <FaPaw />
      </Heading>

      <Tabs isFitted variant="soft-rounded" colorScheme="pink">
        <TabList mb={4} borderBottom="2px" borderColor={accentColor}>
          {paymentMethods.map((method) => (
            <Tab
              key={method.name}
              _selected={{ bg: accentColor, color: 'white', borderRadius: 'md' }}
              _hover={{ bg: 'pink.100' }}
            >
              <Avatar src={method.logo} size="sm" mr={2} />
              {method.name}
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          {paymentMethods.map((method) => (
            <TabPanel key={method.name}>
              {method.name === 'Chuyển khoản' ? (
                <BankTransferTab
                  accountDetails={method.details}
                  qrCode={method.qrCode}
                  onCopy={(value) => {
                    navigator.clipboard.writeText(value);
                    toast({
                      title: 'Đã sao chép!',
                      description: `${value} đã được sao chép.`,
                      status: 'success',
                      duration: 2000,
                      isClosable: true,
                    });
                  }}
                />
              ) : (
                <PaymentAppTab
                  appName={method.name}
                  apiEndpoint={method.apiEndpoint}
                  defaultContent={method.defaultContent}
                />
              )}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Box>
  );
};

const BankTransferTab = ({ accountDetails, qrCode, onCopy }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const accentColor = useColorModeValue('green.300', 'green.200');

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 6 }} alignItems="center">
      <VStack align="start" spacing={4} bg={bgColor} p={6} borderRadius="xl" boxShadow="md">
        <Heading as="h3" size="md" color={accentColor}>
          Thông tin chuyển khoản
        </Heading>
        {Object.entries(accountDetails).map(([key, value]) => (
          <HStack key={key} w="full" spacing={4}>
            <Text fontWeight="bold" minW="120px" color={textColor}>
              {key === 'bank' ? 'Ngân hàng' : key === 'accountNumber' ? 'Số tài khoản' : key === 'accountName' ? 'Tên tài khoản' : 'Nội dung'}:
            </Text>
            <Text flex="1" color={textColor}>
              {value}
            </Text>
            <IconButton
              icon={<CopyIcon />}
              size="sm"
              variant="ghost"
              colorScheme="green"
              onClick={() => onCopy(value)}
              aria-label={`Sao chép ${key}`}
            />
          </HStack>
        ))}
      </VStack>
      <VStack spacing={4} align="center">
        <Image
          src={qrCode}
          alt="QR Code Chuyển khoản"
          boxSize={{ base: '200px', md: '250px' }}
          objectFit="contain"
          borderRadius="lg"
          border="2px solid"
          borderColor={accentColor}
        />
        <Text fontSize="sm" color={textColor}>
          Quét mã QR để chuyển khoản
        </Text>
      </VStack>
    </SimpleGrid>
  );
};

const PaymentAppTab = ({ appName, apiEndpoint, defaultContent }) => {
  const [amount, setAmount] = useState('');
  const [content, setContent] = useState(defaultContent);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const accentColor = useColorModeValue('pink.500', 'pink.300');

  const handlePayment = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập số tiền hợp lệ lớn hơn 0.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!content) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập nội dung chuyển khoản.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount), content }),
      });

      const data = await response.json();
      if (response.ok && data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error(data.message || 'Không thể tạo yêu cầu thanh toán.');
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={4}>
      <VStack
        align="start"
        spacing={6}
        bg={bgColor}
        p={8}
        borderRadius="2xl"
        boxShadow="lg"
        border="2px solid"
        borderColor={accentColor}
        _hover={{ boxShadow: 'xl', transform: 'translateY(-2px)', transition: 'all 0.2s' }}
      >
        <Heading as="h3" size="md" color={accentColor} textTransform="uppercase">
          Hỗ trợ qua {appName}
          <FaPaw style={{ marginLeft: '8px', verticalAlign: 'middle', color: 'green.300' }} />
        </Heading>
        <VStack align="start" spacing={5} w="full">
          <FormControl>
            <FormLabel fontWeight="bold" color={textColor}>
              Số tiền quyên góp (VND)
            </FormLabel>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Nhập số tiền (VD: 100000)"
              min="1"
              bg="gray.50"
              borderColor="gray.300"
              borderRadius="md"
              size="lg"
              px={6}
              py={4}
              _focus={{ borderColor: accentColor, boxShadow: '0 0 0 1px pink.300' }}
              _placeholder={{ color: 'gray.400' }}
            />
          </FormControl>
          <FormControl>
            <FormLabel fontWeight="bold" color={textColor}>
              Nội dung chuyển khoản
            </FormLabel>
            <Input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung (VD: Ủng hộ Pet Rescue)"
              bg="gray.50"
              borderColor="gray.300"
              borderRadius="md"
              size="lg"
              px={6}
              py={4}
              _focus={{ borderColor: accentColor, boxShadow: '0 0 0 1px pink.300' }}
              _placeholder={{ color: 'gray.400' }}
            />
          </FormControl>
          <Button
            colorScheme="pink"
            onClick={handlePayment}
            isLoading={isLoading}
            loadingText="Đang xử lý..."
            w="full"
            size="lg"
            py={6}
            fontSize="lg"
            rightIcon={<FaPaw />}
            _hover={{ bg: 'pink.600', transform: 'scale(1.05)', transition: 'all 0.2s' }}
          >
            Thanh toán ngay
          </Button>
          <Text fontSize="sm" color={textColor} textAlign="center" w="full">
            Hãy cùng cứu hộ những người bạn bốn chân!
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
};

export default PaymentMethods;