import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
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
  Center,
} from '@chakra-ui/react';
import { CopyIcon, CheckIcon } from '@chakra-ui/icons';
import { FaPaw } from 'react-icons/fa'; // Icon dấu chân thú cưng
import bankQRCode from '../../../assets/images/qrCodesBank.jpg';
import donationService from '../../../services/donation.service';

// Dữ liệu mẫu
const paymentMethods = [
  {
    name: 'Chuyển khoản',
    logo: 'https://cdn-icons-png.flaticon.com/512/2830/2830284.png',
    details: {
      bank: 'Ngân hàng Vietcombank',
      accountNumber: '9984268233',
      accountName: 'PHAM MINH THIEN',
      content: 'Ủng hộ Pet Rescue Hub',
    },
  },
  {
    name: 'Momo',
    logo: 'https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png',
    defaultContent: 'Ủng hộ Pet Rescue Hub qua Momo',
  },
  {
    name: 'VNPay',
    logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png',
    defaultContent: 'Ủng hộ Pet Rescue Hub qua VNPay',
  },
  {
    name: 'ZaloPay',
    logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png',
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
          {paymentMethods.map((method, index) => (
            <TabPanel key={method.name}>
              {method.name === 'Chuyển khoản' ? (
                <BankTransferTab
                  accountDetails={method.details}
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
                  defaultContent={method.defaultContent}
                  methodIndex={index}
                />
              )}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Box>
  );
};

const BankTransferTab = ({ accountDetails, onCopy }) => {
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
              {key === 'bank' ? 'Ngân hàng' : 
               key === 'accountNumber' ? 'Số tài khoản' : 
               key === 'accountName' ? 'Tên tài khoản' : 'Nội dung'}:
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
      <VStack spacing={4} align="center" w="full">
        <Box
          p={2}
          bg="white"
          borderRadius="xl"
          boxShadow="lg"
          border="2px solid"
          borderColor={accentColor}
          _hover={{ transform: 'scale(1.02)', transition: 'all 0.2s ease-in-out' }}
        >
          <Image
            src={bankQRCode}
            alt="QR Code Chuyển khoản"
            boxSize={{ base: "280px", md: "320px" }}
            objectFit="cover"
            borderRadius="lg"
            quality={100}
          />
        </Box>
        <Text fontSize="sm" color={textColor} fontWeight="medium">
          Quét mã QR để chuyển khoản
        </Text>
      </VStack>
    </SimpleGrid>
  );
};

const PaymentAppTab = ({ appName, defaultContent, methodIndex }) => {
  const [amount, setAmount] = useState('');
  const [content, setContent] = useState(defaultContent);
  const [isLoading, setIsLoading] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [orderUrl, setOrderUrl] = useState('');
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const accentColor = useColorModeValue('pink.500', 'pink.300');

  const handlePayment = async () => {
    if (!amount || isNaN(amount) || Number(amount) < 10000) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập số tiền hợp lệ (tối thiểu 10.000đ).',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      let response;
      switch (methodIndex) {
        case 1: // Momo
          response = await donationService.createMomoPayment(Number(amount));
          if (response?.shortLink || response?.payUrl) {
            const redirectUrl = response.shortLink || response.payUrl;
            window.open(redirectUrl, '_blank', 'noopener,noreferrer');
          }
          break;
        case 2: // VNPay
          response = await donationService.createVnPayPayment(Number(amount));
          if (response?.shortLink || response?.payUrl) {
            const redirectUrl = response.shortLink || response.payUrl;
            window.open(redirectUrl, '_blank', 'noopener,noreferrer');
          }
          break;
        case 3: // ZaloPay
          response = await donationService.createZaloPayment(Number(amount));
          if (response?.qr_code) {
            setQrCode(response.qr_code);
            setOrderUrl(response.order_url || '');
          }
          break;
        default:
          throw new Error('Phương thức thanh toán không hợp lệ');
      }

      if (!response) {
        throw new Error('Không nhận được phản hồi từ server');
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

  const handleOpenApp = () => {
    if (orderUrl) {
      window.open(orderUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const formatAmount = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
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
          <FaPaw style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
        </Heading>

        <VStack align="start" spacing={5} w="full">
          <FormControl>
            <FormLabel fontWeight="bold" color={textColor}>
              Số tiền quyên góp
            </FormLabel>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Nhập số tiền (VD: 100000)"
              min="10000"
              bg="gray.50"
              borderColor="gray.300"
              borderRadius="md"
              size="lg"
              _focus={{ borderColor: accentColor }}
            />
            {amount && (
              <Text fontSize="sm" color="gray.500" mt={1}>
                {formatAmount(amount)}
              </Text>
            )}
          </FormControl>

          {qrCode && methodIndex === 3 ? (
            <VStack spacing={4} w="full" align="center">
              <Box
                p={4}
                bg="white"
                borderRadius="xl"
                boxShadow="lg"
                border="2px solid"
                borderColor={accentColor}
                _hover={{ transform: 'scale(1.02)', transition: 'all 0.2s ease-in-out' }}
              >
                <QRCodeSVG
                  value={qrCode}
                  size={250}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: "https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png",
                    x: undefined,
                    y: undefined,
                    height: 40,
                    width: 40,
                    excavate: true,
                  }}
                />
              </Box>
              <Text fontSize="sm" color={textColor} textAlign="center">
                Quét mã QR bằng ứng dụng ZaloPay để thanh toán
              </Text>
              <Button
                colorScheme="blue"
                variant="outline"
                onClick={handleOpenApp}
                leftIcon={<Image src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png" boxSize="20px" />}
                w="full"
              >
                Mở App ZaloPay
              </Button>
            </VStack>
          ) : (
            <Button
              colorScheme="pink"
              onClick={handlePayment}
              isLoading={isLoading}
              loadingText="Đang xử lý..."
              w="full"
              size="lg"
              rightIcon={<FaPaw />}
            >
              {methodIndex === 3 ? 'Tạo mã QR' : 'Thanh toán ngay'}
            </Button>
          )}

          <Text fontSize="sm" color={textColor} textAlign="center" w="full">
            Hãy cùng cứu hộ những người bạn bốn chân!
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
};

export default PaymentMethods;