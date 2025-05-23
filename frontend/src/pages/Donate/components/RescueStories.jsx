import React from 'react';
import { Box, Heading, Text, SimpleGrid, Button, Image, VStack, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion'; // Giữ framer-motion cho hiệu ứng hover

// Dữ liệu mẫu (có thể lấy từ API hoặc props)
const stories = [
  {
    id: 1,
    title: 'Câu chuyện của Lucky',
    excerpt: 'Lucky được tìm thấy trong tình trạng bị bỏ rơi bên đường. Sau 3 tháng chăm sóc, Lucky đã tìm được gia đình mới...',
    image: 'https://via.placeholder.com/400x300?text=Lucky', // Thay bằng URL thực
  },
  {
    id: 2,
    title: 'Hành trình của Mèo Mun',
    excerpt: 'Mèo Mun bị bỏ rơi khi chỉ mới 2 tháng tuổi. Nhờ sự giúp đỡ của cộng đồng, Mun đã vượt qua...',
    image: 'https://via.placeholder.com/400x300?text=Mèo+Mun',
  },
  {
    id: 3,
    title: 'Phép màu cho Bông',
    excerpt: 'Bông được tìm thấy trong tình trạng bị thương nặng. Sau nhiều tháng điều trị, Bông đã hồi phục...',
    image: 'https://via.placeholder.com/400x300?text=Bông',
  },
];

const RescueStories = ({ rescueImages = stories.map(s => s.image) }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const titleColor = useColorModeValue('pink.600', 'pink.300');

  return (
    <Box
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
        Câu chuyện cứu hộ
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 4, md: 6 }}>
        {stories.map((story, index) => (
          <motion.div
            key={story.id}
            whileHover={{ y: -10 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <VStack
              bg={bgColor}
              borderRadius="md"
              boxShadow="lg"
              overflow="hidden"
              transition="all 0.3s"
              _hover={{ boxShadow: 'xl' }}
            >
              <Image
                src={rescueImages[index] || story.image}
                alt={story.title}
                objectFit="cover"
                w="full"
                h={{ base: '200px', md: '250px' }}
              />
              <VStack p={4} align="start" spacing={3}>
                <Heading as="h3" size="md" color={titleColor}>
                  {story.title}
                </Heading>
                <Text fontSize="sm" color={textColor} noOfLines={3}>
                  {story.excerpt}
                </Text>
                <Button
                  colorScheme="pink"
                  variant="outline"
                  size="sm"
                  _hover={{ bg: 'pink.500', color: 'white' }}
                >
                  Đọc tiếp
                </Button>
              </VStack>
            </VStack>
          </motion.div>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default RescueStories;