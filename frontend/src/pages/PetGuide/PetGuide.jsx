import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Image,
  Button,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  Flex,
  VStack,
  HStack,
  Icon,
  Divider
} from '@chakra-ui/react';
import {
  FaHeart,
  FaPlay,
  FaBook,
  FaStar,
  FaClock,
  FaEye,
  FaDownload,
  FaSearch,
  FaArrowRight,
  FaVideo,
  FaFilePdf,
  FaFileWord,
  FaNewspaper
} from 'react-icons/fa';
import ScrollToTopButton from '../../components/button/ScrollToTopButton';

const PetGuide = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const videoData = useMemo(() => [
    {
      id: 1,
      title: 'Cách huấn luyện chó cơ bản cho người mới bắt đầu',
      thumbnail: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop',
      duration: '15:30',
      category: 'dog-training',
      views: '125k',
      level: 'Cơ bản',
      rating: 4.8,
      author: 'Chuyên gia Pet Care'
    },
    {
      id: 2,
      title: 'Chăm sóc mèo con trong tháng đầu tiên',
      thumbnail: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop',
      duration: '12:45',
      category: 'cat-care',
      views: '89k',
      level: 'Trung bình',
      rating: 4.7,
      author: 'Dr. Nguyễn Thảo'
    },
    {
      id: 3,
      title: 'Dấu hiệu nhận biết thú cưng bị bệnh',
      thumbnail: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop',
      duration: '18:20',
      category: 'health',
      views: '203k',
      level: 'Nâng cao',
      rating: 4.9,
      author: 'Bác sĩ thú y Linh'
    },
    {
      id: 4,
      title: 'Cách tắm cho chó đúng cách',
      thumbnail: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop',
      duration: '10:15',
      category: 'dog-care',
      views: '76k',
      level: 'Cơ bản',
      rating: 4.6,
      author: 'Pet Groomer Pro'
    },
    {
      id: 5,
      title: 'Dinh dưỡng cho thú cưng theo từng giai đoạn',
      thumbnail: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop',
      duration: '22:30',
      category: 'nutrition',
      views: '154k',
      level: 'Trung bình',
      rating: 4.8,
      author: 'Chuyên gia dinh dưỡng'
    },
    {
      id: 6,
      title: 'Cách huấn luyện mèo đi vệ sinh đúng chỗ',
      thumbnail: 'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=400&h=300&fit=crop',
      duration: '08:45',
      category: 'cat-training',
      views: '92k',
      level: 'Cơ bản',
      rating: 4.5,
      author: 'Cat Whisperer'
    }
  ], []);

  const resourceData = useMemo(() => [
    {
      id: 1,
      title: 'Cẩm nang chăm sóc chó con',
      type: 'pdf',
      category: 'dog-care',
      pages: 45,
      downloadCount: '2.1k',
      size: '2.4MB',
      difficulty: 'Cơ bản',
      preview: 'Hướng dẫn chi tiết từ A-Z về cách chăm sóc chó con từ 0-6 tháng tuổi...'
    },
    {
      id: 2,
      title: 'Hướng dẫn dinh dưỡng cho mèo',
      type: 'doc',
      category: 'cat-care',
      pages: 28,
      downloadCount: '1.8k',
      size: '1.2MB',
      difficulty: 'Trung bình',
      preview: 'Chế độ dinh dưỡng phù hợp cho mèo ở mọi lứa tuổi và tình trạng sức khỏe...'
    },
    {
      id: 3,
      title: 'Các bệnh thường gặp ở thú cưng',
      type: 'article',
      category: 'health',
      readTime: '12 phút',
      views: '5.2k',
      difficulty: 'Nâng cao',
      preview: 'Nhận biết sớm các dấu hiệu bệnh tật và cách phòng tránh hiệu quả...'
    },
    {
      id: 4,
      title: 'Lịch tiêm phòng cho chó mèo',
      type: 'pdf',
      category: 'health',
      pages: 12,
      downloadCount: '3.4k',
      size: '890KB',
      difficulty: 'Cơ bản',
      preview: 'Lịch tiêm phòng chi tiết theo từng giai đoạn phát triển của thú cưng...'
    },
    {
      id: 5,
      title: 'Kỹ thuật huấn luyện nâng cao',
      type: 'article',
      category: 'training',
      readTime: '18 phút',
      views: '3.7k',
      difficulty: 'Nâng cao',
      preview: 'Các phương pháp huấn luyện chuyên sâu cho thú cưng thông minh...'
    },
    {
      id: 6,
      title: 'Sổ tay thú y cơ bản',
      type: 'pdf',
      category: 'health',
      pages: 67,
      downloadCount: '1.9k',
      size: '3.8MB',
      difficulty: 'Trung bình',
      preview: 'Kiến thức thú y cơ bản mà mọi chủ nuôi thú cưng nên biết...'
    }
  ], []);

  const categories = [
    { id: 'all', name: 'Tất cả', icon: '🏠' },
    { id: 'dog-care', name: 'Chăm sóc chó', icon: '🐕' },
    { id: 'cat-care', name: 'Chăm sóc mèo', icon: '🐱' },
    { id: 'health', name: 'Sức khỏe', icon: '🏥' },
    { id: 'training', name: 'Huấn luyện', icon: '🎯' },
    { id: 'nutrition', name: 'Dinh dưỡng', icon: '🍽️' }
  ];

  const filteredVideos = useMemo(() => {
    return videoData.filter(video => 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === 'all' || video.category === selectedCategory)
    );
  }, [videoData, searchQuery, selectedCategory]);

  const filteredResources = useMemo(() => {
    return resourceData.filter(resource => 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === 'all' || resource.category === selectedCategory)
    );
  }, [resourceData, searchQuery, selectedCategory]);

  const handleTabChange = useCallback((index) => {
    setActiveTab(index);
  }, []);

  const VideoCard = ({ video }) => (
    <Card 
      shadow="md" 
      border="1px" 
      borderColor="gray.100" 
      _hover={{ shadow: 'lg', borderColor: 'pink.200', transform: 'scale(1.02)' }}
      transition="all 0.3s"
      overflow="hidden"
    >
      <Box position="relative">
        <Image 
          src={video.thumbnail} 
          alt={video.title}
          h="48"
          objectFit="cover"
          transition="transform 0.7s"
          _groupHover={{ transform: 'scale(1.1)' }}
        />
        <Box 
          position="absolute" 
          inset={0} 
          bgGradient="linear(to-t, blackAlpha.600, transparent)" 
          opacity={0} 
          _groupHover={{ opacity: 1 }}
          transition="opacity 0.3s"
        />
        <Box position="absolute" top={4} right={4} bg="blackAlpha.700" color="white" px={2} py={1} borderRadius="lg" fontSize="sm">
          {video.duration}
        </Box>
        <Flex 
          position="absolute" 
          inset={0} 
          align="center" 
          justify="center" 
          opacity={0} 
          _groupHover={{ opacity: 1 }}
          transition="opacity 0.3s"
        >
          <Box bg="whiteAlpha.900" p={4} borderRadius="full" _hover={{ bg: 'white' }} transition="background 0.2s">
            <Icon as={FaPlay} w={8} h={8} color="pink.500" />
          </Box>
        </Flex>
        <Box position="absolute" top={4} left={4}>
          <Badge 
            colorScheme={video.level === 'Cơ bản' ? 'green' : video.level === 'Trung bình' ? 'yellow' : 'red'}
            px={3} 
            py={1} 
            fontSize="xs"
            fontWeight="semibold"
            borderRadius="full"
          >
            {video.level}
          </Badge>
        </Box>
      </Box>
      <CardBody p={6}>
        <Heading size="md" color="gray.800" mb={3} noOfLines={2} _groupHover={{ color: 'pink.600' }}>
          {video.title}
        </Heading>
        <Flex justify="space-between" align="center" color="gray.600" mb={4}>
          <Text fontWeight="medium" color="pink.600">{video.author}</Text>
          <HStack spacing={1}>
            <Icon as={FaStar} w={4} h={4} color="yellow.400" />
            <Text fontWeight="medium">{video.rating}</Text>
          </HStack>
        </Flex>
        <Flex justify="space-between" align="center" color="gray.500" fontSize="sm">
          <HStack spacing={1}>
            <Icon as={FaEye} w={4} h={4} />
            <Text>{video.views} lượt xem</Text>
          </HStack>
          <Icon as={FaArrowRight} w={4} h={4} color="pink.500" _groupHover={{ transform: 'translateX(4px)' }} transition="transform 0.2s" />
        </Flex>
      </CardBody>
    </Card>
  );

  const ResourceCard = ({ resource }) => (
    <Card 
      shadow="md" 
      border="1px" 
      borderColor="gray.100" 
      _hover={{ shadow: 'lg', borderColor: 'blue.200', transform: 'scale(1.02)' }}
      transition="all 0.3s"
      overflow="hidden"
    >
      <CardBody p={6}>
        <Flex justify="space-between" align="start" mb={4}>
          <Box 
            p={3} 
            borderRadius="xl" 
            bg={resource.type === 'pdf' ? 'red.100' : resource.type === 'doc' ? 'blue.100' : 'green.100'}
            color={resource.type === 'pdf' ? 'red.600' : resource.type === 'doc' ? 'blue.600' : 'green.600'}
          >
            <Icon as={resource.type === 'pdf' ? FaFilePdf : resource.type === 'doc' ? FaFileWord : FaNewspaper} w={6} h={6} />
          </Box>
          <Badge 
            colorScheme={resource.difficulty === 'Cơ bản' ? 'green' : resource.difficulty === 'Trung bình' ? 'yellow' : 'red'}
            px={3} 
            py={1} 
            fontSize="xs"
            fontWeight="semibold"
            borderRadius="full"
          >
            {resource.difficulty}
          </Badge>
        </Flex>
        <Heading size="md" color="gray.800" mb={3} _groupHover={{ color: 'blue.600' }}>
          {resource.title}
        </Heading>
        <Text color="gray.600" fontSize="sm" mb={4} noOfLines={2}>
          {resource.preview}
        </Text>
        <Flex justify="space-between" align="center" color="gray.500" fontSize="sm" mb={4}>
          {resource.pages && (
            <HStack spacing={1}>
              <Icon as={FaBook} w={4} h={4} />
              <Text>{resource.pages} trang</Text>
            </HStack>
          )}
          {resource.readTime && (
            <HStack spacing={1}>
              <Icon as={FaClock} w={4} h={4} />
              <Text>{resource.readTime}</Text>
            </HStack>
          )}
          {resource.downloadCount && (
            <HStack spacing={1}>
              <Icon as={FaDownload} w={4} h={4} />
              <Text>{resource.downloadCount}</Text>
            </HStack>
          )}
        </Flex>
        <Button
          colorScheme="blue"
          bgGradient="linear(to-r, blue.500, purple.600)"
          _hover={{ bgGradient: 'linear(to-r, blue.600, purple.700)' }}
          w="full"
          py={3}
          borderRadius="xl"
          fontWeight="semibold"
          boxShadow="lg"
          _groupHover={{ transform: 'scale(1.05)', boxShadow: 'xl' }}
          transition="all 0.2s"
        >
          {resource.type === 'article' ? 'Đọc ngay' : 'Tải xuống'}
        </Button>
      </CardBody>
    </Card>
  );

  return (
    <Box minH="100vh" bgGradient="linear(to-br, pink.50, purple.50, blue.50)">
      {/* Header */}
      <Box bgGradient="linear(to-r, pink.500, purple.600, blue.600)" color="white" position="relative" overflow="hidden">
        <Box position="absolute" inset={0} bg="blackAlpha.100" />
        <Box 
          position="absolute" 
          inset={0} 
          bgImage="url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KPGcgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjA1Ij4KPHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptMC00djJoLTJ2LTJoMnptLTItOHY0aDJ2LTRoLTJ6bTQgMHY0aDJ2LTRoLTJ6bTIgNnYyaC0ydi0yaDJ6bTAgNHYyaC0ydi0yaDJ6bS0yIDR2MmgtMnYtMmgyek0zNiAxNGgtMnY0aDJ2LTR6Ii8+CjwvZz4KPC9nPgo8L3N2Zz4=')"
          opacity={0.3}
        />
        <Box position="relative" maxW="container.xl" mx="auto" px={6} py={20}>
          <VStack spacing={6} textAlign="center" maxW="4xl" mx="auto">
            <HStack spacing={4}>
              <Box p={3} bg="whiteAlpha.200" backdropFilter="blur(4px)" borderRadius="2xl">
                <Text fontSize="3xl">🐾</Text>
              </Box>
              <Heading 
                as="h1" 
                fontSize={{ base: '4xl', md: '6xl' }} 
                bgGradient="linear(to-r, white, pink.100)" 
                bgClip="text"
              >
                Hướng dẫn chăm sóc thú cưng
              </Heading>
              <Box p={3} bg="whiteAlpha.200" backdropFilter="blur(4px)" borderRadius="2xl">
                <Icon as={FaHeart} w={8} h={8} />
              </Box>
            </HStack>
            <Text fontSize={{ base: 'lg', md: '2xl' }} color="pink.100" lineHeight="relaxed">
              Khám phá các hướng dẫn, video và tài liệu để chăm sóc thú cưng của bạn tốt nhất 🐕🐈
            </Text>
            <HStack spacing={8} fontSize="lg" justify="center">
              {/* <HStack>
                <Icon as={IoSparkles} w={5} h={5} />
                <Text>{videoData.length}+ Video HD</Text>
              </HStack>
              <HStack>
                <Icon as={FaBook} w={5} h={5} />
                <Text>{resourceData.length}+ Tài liệu</Text>
              </HStack>
              <HStack>
                <Icon as={FaHeart} w={5} h={5} />
                <Text>10k+ Người yêu thích</Text>
              </HStack> */}
            </HStack>
          </VStack>
        </Box>
      </Box>

      {/* Main Content */}
      <Box maxW="container.xl" mx="auto" px={6} py={12}>
        {/* Tabs */}
        <Card shadow="2xl" border="1px" borderColor="gray.100" borderRadius="3xl" mb={8} bg="white">
          <Box 
            bgGradient="linear(to-r, gray.50, gray.100)" 
            p={6} 
            borderBottom="1px" 
            borderColor="gray.200"
          >
            <HStack justify="center" spacing={2}>
              <Button
                onClick={() => handleTabChange(0)}
                bg={activeTab === 0 ? 'linear(to-r, pink.500, purple.600)' : 'white'}
                color={activeTab === 0 ? 'white' : 'gray.600'}
                _hover={{ bg: activeTab === 0 ? 'linear(to-r, pink.600, purple.700)' : 'gray.50', shadow: 'lg' }}
                shadow={activeTab === 0 ? 'lg' : 'md'}
                transform={activeTab === 0 ? 'scale(1.05)' : 'none'}
                transition="all 0.3s"
                borderRadius="2xl"
                px={8}
                py={4}
                fontWeight="semibold"
                leftIcon={<Icon as={FaPlay} w={5} h={5} />}
              >
                Video hướng dẫn
                <Badge 
                  ml={3} 
                  colorScheme={activeTab === 0 ? 'whiteAlpha' : 'pink'} 
                  fontSize="sm"
                  borderRadius="full"
                  px={3}
                  py={1}
                >
                  {videoData.length} videos
                </Badge>
              </Button>
              <Button
                onClick={() => handleTabChange(1)}
                bg={activeTab === 1 ? 'linear(to-r, blue.500, purple.600)' : 'white'}
                color={activeTab === 1 ? 'white' : 'gray.600'}
                _hover={{ bg: activeTab === 1 ? 'linear(to-r, blue.600, purple.700)' : 'gray.50', shadow: 'lg' }}
                shadow={activeTab === 1 ? 'lg' : 'md'}
                transform={activeTab === 1 ? 'scale(1.05)' : 'none'}
                transition="all 0.3s"
                borderRadius="2xl"
                px={8}
                py={4}
                fontWeight="semibold"
                leftIcon={<Icon as={FaBook} w={5} h={5} />}
              >
                Tài liệu & Bài đọc
                <Badge 
                  ml={3} 
                  colorScheme={activeTab === 1 ? 'whiteAlpha' : 'blue'} 
                  fontSize="sm"
                  borderRadius="full"
                  px={3}
                  py={1}
                >
                  {resourceData.length} tài liệu
                </Badge>
              </Button>
            </HStack>
          </Box>

          {/* Search and Filter */}
          <Box p={6} bg="gray.50" borderBottom="1px" borderColor="gray.200">
            <Flex direction={{ base: 'column', md: 'row' }} gap={4} align="center">
              <InputGroup flex={1}>
                <InputLeftElement>
                  <Icon as={FaSearch} color="gray.400" w={5} h={5} />
                </InputLeftElement>
                <Input
                  placeholder="Tìm kiếm video, tài liệu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  borderRadius="xl"
                  borderColor="gray.300"
                  _focus={{ borderColor: 'pink.500', ring: 2, ringColor: 'pink.500' }}
                  pl={12}
                  py={3}
                />
              </InputGroup>
              <HStack spacing={2} overflowX="auto">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    bg={selectedCategory === category.id ? 'linear(to-r, pink.500, purple.600)' : 'white'}
                    color={selectedCategory === category.id ? 'white' : 'gray.600'}
                    _hover={{ bg: selectedCategory === category.id ? 'linear(to-r, pink.600, purple.700)' : 'gray.100' }}
                    border="1px"
                    borderColor={selectedCategory === category.id ? 'transparent' : 'gray.300'}
                    borderRadius="xl"
                    px={4}
                    py={2}
                    fontWeight="medium"
                    whiteSpace="nowrap"
                    leftIcon={<Text>{category.icon}</Text>}
                  >
                    {category.name}
                  </Button>
                ))}
              </HStack>
            </Flex>
          </Box>

          {/* Content */}
          <Box p={8}>
            {activeTab === 0 ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
                {filteredVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </SimpleGrid>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
                {filteredResources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </SimpleGrid>
            )}
          </Box>
        </Card>
        <ScrollToTopButton />
        {/* Statistics */}
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
          <Card 
            bgGradient="linear(to-br, pink.400, pink.600)" 
            color="white" 
            p={8} 
            borderRadius="2xl" 
            shadow="xl"
            _hover={{ transform: 'scale(1.05)' }}
            transition="transform 0.3s"
            textAlign="center"
          >
            <Heading size="2xl" mb={2}>{videoData.length}+</Heading>
            <Text color="pink.100">Video hướng dẫn</Text>
          </Card>
          <Card 
            bgGradient="linear(to-br, blue.400, blue.600)" 
            color="white" 
            p={8} 
            borderRadius="2xl" 
            shadow="xl"
            _hover={{ transform: 'scale(1.05)' }}
            transition="transform 0.3s"
            textAlign="center"
          >
            <Heading size="2xl" mb={2}>{resourceData.length}+</Heading>
            <Text color="blue.100">Tài liệu chuyên môn</Text>
          </Card>
          <Card 
            bgGradient="linear(to-br, green.400, green.600)" 
            color="white" 
            p={8} 
            borderRadius="2xl" 
            shadow="xl"
            _hover={{ transform: 'scale(1.05)' }}
            transition="transform 0.3s"
            textAlign="center"
          >
            <Heading size="2xl" mb={2}>10k+</Heading>
            <Text color="green.100">Người dùng hài lòng</Text>
          </Card>
          <Card 
            bgGradient="linear(to-br, purple.400, purple.600)" 
            color="white" 
            p={8} 
            borderRadius="2xl" 
            shadow="xl"
            _hover={{ transform: 'scale(1.05)' }}
            transition="transform 0.3s"
            textAlign="center"
          >
            <Heading size="2xl" mb={2}>4.8★</Heading>
            <Text color="purple.100">Đánh giá trung bình</Text>
          </Card>
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default PetGuide;