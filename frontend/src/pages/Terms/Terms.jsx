import React, { useEffect } from 'react';
import {
  Container,
  Box,
  Heading,
  Text,
  Divider,
  VStack,
  List,
  ListItem,
  ListIcon,
  useColorModeValue,
  ChakraProvider,
  extendTheme
} from '@chakra-ui/react';
import { GiPawPrint } from 'react-icons/gi';
import { FaEnvelope, FaPhone, FaMapPin } from 'react-icons/fa';

// Tùy chỉnh theme với các màu và style từ Terms.css
const theme = extendTheme({
  colors: {
    primary: '#D34F81', // --primary-color
    secondary: '#666', // --secondary-color
    heading: '#333', // --heading-color
    text: '#444', // --text-color
    background: '#fff', // --background-color
    containerBg: '#f9f9f9' // --container-padding background
  },
  components: {
    Heading: {
      baseStyle: {
        fontWeight: '700',
        color: 'heading',
        _hover: { color: 'primary', transition: 'color 0.2s' }
      }
    },
    Text: {
      baseStyle: {
        lineHeight: '1.6',
        color: 'text'
      }
    }
  }
});

const Terms = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const bgColor = useColorModeValue('background', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const containerBg = useColorModeValue('containerBg', 'gray.900');

  return (
    <ChakraProvider theme={theme}>
      <Container
        maxW="container.lg"
        py={{ base: 6, md: 10 }} // --container-padding: 40px
        bg={containerBg}
      >
        <Box
          bg={bgColor}
          shadow="md"
          borderRadius="lg"
          p={{ base: 6, md: 10 }} // --paper-padding: 40px, responsive cho mobile
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
            bgGradient: 'linear(to-r, primary, pink.300)',
            borderTopRadius: 'lg'
          }}
        >
          <VStack spacing={6} align="start">
            <Heading
              size={{ base: 'lg', md: 'xl' }} // font-size: 1.8rem (mobile), 2rem (desktop)
              color="primary"
              textAlign="center"
              w="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              _hover={{ transform: 'scale(1.02)', transition: 'transform 0.2s' }}
            >
              <GiPawPrint style={{ marginRight: '8px' }} />
              Điều khoản sử dụng & Chính sách riêng tư
            </Heading>
            <Text
              fontSize="sm"
              color="secondary"
              textAlign="center"
              w="full"
              fontStyle="italic"
            >
              Cập nhật lần cuối: 06/05/2025
            </Text>
            <Divider borderColor={borderColor} my={6} /> {/* terms-divider */}

            <Box w="full">
              <Heading size="md" mb={4} fontWeight="600">
                <GiPawPrint style={{ display: 'inline-block', marginRight: '8px' }} />
                1. Giới thiệu
              </Heading>
              <Text mb={4}>
                PetRescueHub là nền tảng tiên phong trong việc kết nối cộng đồng những người yêu thú cưng tại Việt Nam. Chúng tôi cam kết tạo ra một môi trường an toàn và đáng tin cậy, nơi mỗi thú cưng đều có cơ hội tìm được mái ấm mới và nhận được sự chăm sóc tốt nhất.
              </Text>
            </Box>

            <Box w="full">
              <Heading size="md" mb={4} fontWeight="600">
                <GiPawPrint style={{ display: 'inline-block', marginRight: '8px' }} />
                2. Sử dụng dịch vụ
              </Heading>
              <Text mb={4}>
                Bạn phải tuân thủ mọi chính sách có sẵn cho bạn trong dịch vụ. Bạn không được sử dụng Dịch vụ của chúng tôi sai mục đích. Ví dụ: không được can thiệp vào Dịch vụ của chúng tôi hoặc cố gắng truy cập chúng bằng phương pháp nào khác ngoài giao diện và hướng dẫn mà chúng tôi cung cấp.
              </Text>
              <Text mb={4}>
                Chúng tôi có thể đình chỉ hoặc ngừng cung cấp Dịch vụ cho bạn nếu bạn không tuân thủ các điều khoản hoặc chính sách của chúng tôi hoặc nếu chúng tôi đang điều tra hành vi bị nghi ngờ là sai phạm.
              </Text>
            </Box>

            <Box w="full">
              <Heading size="md" mb={4} fontWeight="600">
                <GiPawPrint style={{ display: 'inline-block', marginRight: '8px' }} />
                3. Quyền riêng tư và bảo vệ bản quyền
              </Heading>
              <Text mb={4}>
                Chính sách quyền riêng tư của PetRescueHub giải thích cách chúng tôi xử lý dữ liệu cá nhân của bạn và bảo vệ quyền riêng tư của bạn khi bạn sử dụng Dịch vụ của chúng tôi. Bằng cách sử dụng Dịch vụ của chúng tôi, bạn đồng ý rằng PetRescueHub có thể sử dụng dữ liệu đó theo chính sách quyền riêng tư của chúng tôi.
              </Text>
            </Box>

            <Box w="full">
              <Heading size="md" mb={4} fontWeight="600">
                <GiPawPrint style={{ display: 'inline-block', marginRight: '8px' }} />
                4. Nội dung của bạn trong Dịch vụ của chúng tôi
              </Heading>
              <Text mb={4}>
                Dịch vụ của chúng tôi cho phép bạn tải lên, gửi, lưu trữ hoặc nhận nội dung. Bạn vẫn giữ quyền sở hữu trí tuệ đối với nội dung đó. Tóm lại, những gì thuộc về bạn vẫn là của bạn.
              </Text>
              <Text mb={4}>
                Khi bạn tải lên, gửi, lưu trữ, gửi hoặc nhận nội dung đến hoặc thông qua Dịch vụ của chúng tôi, bạn cấp cho PetRescueHub (và những đối tác mà chúng tôi hợp tác) giấy phép toàn cầu để sử dụng, lưu trữ, sao chép, sửa đổi, tạo các tác phẩm phái sinh, truyền tải, xuất bản, hiển thị và phân phối công khai nội dung đó. Giấy phép bạn cấp cho PetRescueHub là nhằm mục đích vận hành, quảng bá và cải thiện Dịch vụ của chúng tôi, cũng như phát triển các dịch vụ mới.
              </Text>
            </Box>

            <Box w="full">
              <Heading size="md" mb={4} fontWeight="600">
                <GiPawPrint style={{ display: 'inline-block', marginRight: '8px' }} />
                5. Bảo vệ thông tin cá nhân
              </Heading>
              <Text mb={4}>
                Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Chúng tôi sẽ chỉ thu thập và sử dụng thông tin cá nhân của bạn theo cách được mô tả trong Chính sách Quyền riêng tư của chúng tôi và chỉ khi cần thiết để cung cấp dịch vụ hoặc thực hiện các nghĩa vụ pháp lý của chúng tôi.
              </Text>
              <Text mb={4}>
                Chúng tôi sẽ không chia sẻ thông tin cá nhân của bạn với bên thứ ba mà không có sự đồng ý của bạn, trừ khi được yêu cầu bởi pháp luật hoặc để bảo vệ quyền, tài sản hoặc sự an toàn cá nhân của chúng tôi hoặc người khác.
              </Text>
            </Box>

            <Box w="full">
              <Heading size="md" mb={4} fontWeight="600">
                <GiPawPrint style={{ display: 'inline-block', marginRight: '8px' }} />
                6. Thay đổi và cập nhật
              </Heading>
              <Text mb={4}>
                Chúng tôi có thể sửa đổi các Điều khoản này theo thời gian. Chúng tôi sẽ đăng bất kỳ sửa đổi nào lên trang web của chúng tôi và, nếu những thay đổi đó là đáng kể, chúng tôi sẽ cung cấp thông báo nổi bật hơn (bao gồm, đối với một số dịch vụ, thông báo qua email về các thay đổi đối với Điều khoản).
              </Text>
              <Text mb={4}>
                Nếu bạn không đồng ý với các Điều khoản đã sửa đổi, bạn nên ngừng sử dụng Dịch vụ của chúng tôi. Việc bạn tiếp tục sử dụng Dịch vụ sau khi các thay đổi có hiệu lực sẽ cấu thành sự chấp nhận của bạn đối với các Điều khoản đã sửa đổi.
              </Text>
            </Box>

            <Box w="full">
              <Heading size="md" mb={4} fontWeight="600">
                <GiPawPrint style={{ display: 'inline-block', marginRight: '8px' }} />
                7. Liên hệ và Hỗ trợ
              </Heading>
              <List spacing={3} pl={5}>
                <ListItem>
                  <ListIcon as={FaEnvelope} color="primary" />
                  <Text as="span" _hover={{ color: 'primary', cursor: 'pointer' }}>
                    Email: <a href="mailto:support@petrescuehub.com">support@petrescuehub.com</a>
                  </Text>
                </ListItem>
                <ListItem>
                  <ListIcon as={FaPhone} color="primary" />
                  <Text as="span" _hover={{ color: 'primary', cursor: 'pointer' }}>
                    Hotline: <a href="tel:0984268233">0984268233</a>
                  </Text>
                </ListItem>
                <ListItem>
                  <ListIcon as={FaMapPin} color="primary" />
                  <Text as="span">Văn phòng: 254 Nguyen Van Linh, TP. Da Nang</Text>
                </ListItem>
              </List>
            </Box>
          </VStack>
        </Box>
      </Container>
    </ChakraProvider>
  );
};

export default Terms;