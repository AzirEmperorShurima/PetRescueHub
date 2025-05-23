import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Grid,
  Box,
  Button,
  Heading,
  Text,
  useBreakpointValue,
  Image,
  HStack
} from '@chakra-ui/react';
import { images } from '../../../../config/LinkImage.config';

const AboutSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToImpact = useCallback((e) => {
    e.preventDefault();
    const impactSection = document.getElementById('impact-counter');
    if (impactSection) {
      impactSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const imageSize = useBreakpointValue({ base: '100%', md: 'auto' });

  return (
    <Box py={10} bg="gray.50">
      <Container maxW="6xl">
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8} alignItems="center">
          <Box position="relative">
            <Box borderRadius="md" overflow="hidden">
              {images.map((image, index) => (
                <Image
                  key={index}
                  src={image.url}
                  alt={image.alt}
                  display={index === currentImageIndex ? 'block' : 'none'}
                  w={imageSize}
                  borderRadius="md"
                  transition="opacity 0.5s ease-in-out"
                />
              ))}
            </Box>
            <HStack spacing={2} justify="center" mt={4}>
              {images.map((_, index) => (
                <Box
                  key={index}
                  w={3}
                  h={3}
                  borderRadius="full"
                  bg={index === currentImageIndex ? 'blue.500' : 'gray.300'}
                  cursor="pointer"
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </HStack>
          </Box>

          <Box>
            <Heading as="h3" size="lg" mb={4}>
              Về Pet Rescue Hub
            </Heading>
            <Text fontSize="md" mb={4}>
              Pet Rescue Hub là nền tảng kết nối cộng đồng yêu thương động vật, nơi mọi người có thể cùng nhau giúp đỡ, cứu hộ và chăm sóc những thú cưng gặp khó khăn.
            </Text>
            <Text fontSize="md" mb={6}>
              Chúng tôi tin rằng mỗi thú cưng đều xứng đáng có một mái ấm hạnh phúc và được yêu thương. Với sứ mệnh đó, chúng tôi xây dựng một cộng đồng kết nối những người yêu động vật, tình nguyện viên và các tổ chức cứu hộ.
            </Text>
            <Button onClick={scrollToImpact} variant="outline" colorScheme="blue">
              Xem Tác Động Của Chúng Tôi
            </Button>
          </Box>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutSection;