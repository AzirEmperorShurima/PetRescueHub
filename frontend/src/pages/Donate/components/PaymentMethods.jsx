import React from 'react';
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
  useColorModeValue,
  useClipboard,
  useToast,
} from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';

// Dữ liệu mẫu (có thể lấy từ API hoặc props)
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
    qrCode: 'https://via.placeholder.com/200?text=Momo+QR',
  },
  {
    name: 'VNPay',
    logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png',
    qrCode: 'https://via.placeholder.com/200?text=VNPay+QR',
  },
  {
    name: 'ZaloPay',
    logo: 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png',
    qrCode: 'https://via.placeholder.com/200?text=ZaloPay+QR',
  },
];

const PaymentMethods = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const titleColor = useColorModeValue('pink.600', 'pink.300');
  const toast = useToast();

  return (
    <Box
      id="payment-methods"
      py={{ base: 8, md: 12 }}
      px={{ base: 4, md: 8 }}
      bg={useColorModeValue('gray.50', 'gray.900')}
      borderRadius="lg"
      boxShadow="md"
      mx="auto"
      maxW="7xl"
    >
      <Heading
        as="h2"
        size="xl"
        textAlign="center"
        mb={{ base: 6, md: 10 }}
        color={titleColor}
      >
        Phương thức quyên góp
      </Heading>

      <Tabs isFitted variant="soft-rounded" colorScheme="pink">
        <TabList mb={4}>
          {paymentMethods.map((method) => (
            <Tab key={method.name}>
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
                      description: `${value} đã được sao chép vào clipboard.`,
                      status: 'success',
                      duration: 2000,
                      isClosable: true,
                    });
                  }}
                />
              ) : (
                <PaymentAppTab appName={method.name} qrCode={method.qrCode} />
              )}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Box>
  );
};

const BankTransferTab = ({ accountDetails, qrCode, onCopy }) => (
  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 6 }}>
    <VStack align="start" spacing={4} bg={useColorModeValue('white', 'gray.800')} p={4} borderRadius="md">
      <Heading as="h3" size="md" color={useColorModeValue('pink.600', 'pink.300')}>
        Thông tin chuyển khoản
      </Heading>
      {Object.entries(accountDetails).map(([key, value]) => (
        <Box key={key} display="flex" alignItems="center" w="full">
          <Text fontWeight="bold" minW="120px" color={useColorModeValue('gray.700', 'gray.200')}>
            {key === 'bank' ? 'Ngân hàng' : key === 'accountNumber' ? 'Số tài khoản' : key === 'accountName' ? 'Tên tài khoản' : 'Nội dung'}:
          </Text>
          <Text flex="1" color={useColorModeValue('gray.600', 'gray.300')}>
            {value}
          </Text>
          <IconButton
            icon={<CopyIcon />}
            size="sm"
            variant="ghost"
            onClick={() => onCopy(value)}
            aria-label={`Sao chép ${key}`}
          />
        </Box>
      ))}
    </VStack>
    <VStack spacing={2}>
      <Image
        src={qrCode}
        alt="QR Code Chuyển khoản"
        boxSize={{ base: '200px', md: '250px' }}
        objectFit="contain"
        borderRadius="md"
      />
      <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.300')}>
        Quét mã QR để chuyển khoản
      </Text>
    </VStack>
  </SimpleGrid>
);

const PaymentAppTab = ({ appName, qrCode }) => (
  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 6 }}>
    <VStack align="start" spacing={4} bg={useColorModeValue('white', 'gray.800')} p={4} borderRadius="md">
      <Heading as="h3" size="md" color={useColorModeValue('pink.600', 'pink.300')}>
        Hướng dẫn thanh toán qua {appName}
      </Heading>
      <Box as="ol" pl={4} color={useColorModeValue('gray.600', 'gray.300')}>
        <li>Mở ứng dụng {appName} trên điện thoại</li>
        <li>Chọn "Quét mã QR"</li>
        <li>Quét mã QR bên cạnh</li>
        <li>Nhập số tiền bạn muốn quyên góp</li>
        <li>Nhập nội dung: "Ủng hộ [Tên của bạn]"</li>
        <li>Xác nhận thanh toán</li>
      </Box>
    </VStack>
    <VStack spacing={2}>
      <Image
        src={qrCode}
        alt={`QR Code ${appName}`}
        boxSize={{ base: '200px', md: '250px' }}
        objectFit="contain"
        borderRadius="md"
      />
      <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.300')}>
        Quét mã QR bằng ứng dụng {appName}
      </Text>
    </VStack>
  </SimpleGrid>
);

export default PaymentMethods;