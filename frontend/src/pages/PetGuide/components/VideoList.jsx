import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Text,
  SimpleGrid,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Card,
  CardBody,
  Image,
  Badge,
  VStack,
  HStack,
  Icon,
  Container,
  Heading,
  useColorModeValue,
  Flex,
  IconButton,
  Spacer,
  Fade,
  ScaleFade,
  useDisclosure,
  InputRightElement,
  CloseButton
} from '@chakra-ui/react';
import { SearchIcon, TimeIcon, SettingsIcon, CloseIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';

const VideoList = ({ videos }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const { isOpen: showFilters, onToggle: toggleFilters } = useDisclosure();

  // Color mode values
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardHoverBg = useColorModeValue('gray.50', 'gray.700');
  const searchBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const mutedTextColor = useColorModeValue('gray.500', 'gray.400');

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((e) => {
    setCategoryFilter(e.target.value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setCategoryFilter('');
  }, []);

  const filteredVideos = useMemo(() => {
    return videos.filter(video => {
      const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === '' || video.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [videos, searchTerm, categoryFilter]);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(videos.map(video => video.category))];
    return uniqueCategories.map(category => {
      const formattedCategory = category.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      
      return { value: category, label: formattedCategory };
    });
  }, [videos]);

  const hasActiveFilters = searchTerm || categoryFilter;

  return (
    <Container maxW="container.xl" py={8} bg={bgColor} minH="100vh">
      {/* Header Section */}
      <VStack spacing={6} align="stretch">
        <Flex align="center" justify="space-between">
          <Heading 
            size="lg" 
            color={textColor}
            bgGradient="linear(to-r, blue.400, purple.500)"
            bgClip="text"
          >
            Thư viện Video
          </Heading>
          <HStack>
            <Badge 
              colorScheme="blue" 
              variant="subtle" 
              fontSize="sm"
              px={3}
              py={1}
              rounded="full"
            >
              {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}
            </Badge>
            <IconButton
              icon={<SettingsIcon />}
              variant={showFilters ? "solid" : "outline"}
              colorScheme="blue"
              onClick={toggleFilters}
              aria-label="Toggle filters"
              size="sm"
            />
          </HStack>
        </Flex>

        {/* Search and Filter Section */}
        <ScaleFade in={showFilters} initialScale={0.9}>
          <Card bg={cardBg} shadow="md" borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <VStack spacing={4}>
                <HStack w="full" spacing={4}>
                  <Box flex="2">
                    <InputGroup size="lg">
                      <InputLeftElement>
                        <SearchIcon color={mutedTextColor} />
                      </InputLeftElement>
                      <Input
                        placeholder="Tìm kiếm video..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        bg={searchBg}
                        border="2px"
                        borderColor={borderColor}
                        _hover={{ borderColor: "blue.300" }}
                        _focus={{ 
                          borderColor: "blue.500", 
                          boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)" 
                        }}
                        rounded="xl"
                      />
                      {searchTerm && (
                        <InputRightElement>
                          <IconButton
                            icon={<CloseButton />}
                            size="sm"
                            variant="ghost"
                            onClick={clearSearch}
                            aria-label="Clear search"
                          />
                        </InputRightElement>
                      )}
                    </InputGroup>
                  </Box>
                  
                  <Box flex="1">
                    <Select
                      placeholder="Tất cả danh mục"
                      value={categoryFilter}
                      onChange={handleCategoryChange}
                      size="lg"
                      bg={searchBg}
                      border="2px"
                      borderColor={borderColor}
                      _hover={{ borderColor: "blue.300" }}
                      _focus={{ 
                        borderColor: "blue.500", 
                        boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)" 
                      }}
                      rounded="xl"
                    >
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </Select>
                  </Box>
                </HStack>

                {hasActiveFilters && (
                  <Flex w="full" justify="space-between" align="center">
                    <HStack spacing={2}>
                      {searchTerm && (
                        <Badge colorScheme="blue" variant="subtle" rounded="full">
                          Tìm kiếm: "{searchTerm}"
                        </Badge>
                      )}
                      {categoryFilter && (
                        <Badge colorScheme="purple" variant="subtle" rounded="full">
                          {categories.find(cat => cat.value === categoryFilter)?.label}
                        </Badge>
                      )}
                    </HStack>
                    <IconButton
                      icon={<CloseIcon />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={clearFilters}
                      aria-label="Xóa tất cả bộ lọc"
                    />
                  </Flex>
                )}
              </VStack>
            </CardBody>
          </Card>
        </ScaleFade>

        {/* Videos Grid */}
        {filteredVideos.length > 0 ? (
          <Fade in={true}>
            <SimpleGrid 
              columns={{ base: 1, md: 2, lg: 3, xl: 4 }} 
              spacing={6}
              w="full"
            >
              {filteredVideos.map((video, index) => (
                <ScaleFade 
                  key={video.id} 
                  in={true} 
                  delay={index * 0.1}
                  initialScale={0.8}
                >
                  <Card
                    as={Link}
                    to={`/listVideo/${video.id}`}
                    bg={cardBg}
                    shadow="lg"
                    borderWidth="1px"
                    borderColor={borderColor}
                    rounded="2xl"
                    overflow="hidden"
                    transition="all 0.3s ease"
                    _hover={{
                      transform: "translateY(-8px)",
                      shadow: "2xl",
                      bg: cardHoverBg,
                      borderColor: "blue.300"
                    }}
                    _active={{ transform: "translateY(-4px)" }}
                    cursor="pointer"
                    role="group"
                  >
                    <Box position="relative" overflow="hidden">
                      <Image
                        src={video.thumbnail || 'https://source.unsplash.com/random/300x200/?pet'}
                        alt={video.title}
                        w="full"
                        h="200px"
                        objectFit="cover"
                        transition="transform 0.3s ease"
                        _groupHover={{ transform: "scale(1.05)" }}
                      />
                      
                      {/* Play Button Overlay */}
                      <Flex
                        position="absolute"
                        top="0"
                        left="0"
                        right="0"
                        bottom="0"
                        align="center"
                        justify="center"
                        bg="blackAlpha.400"
                        opacity="0"
                        transition="opacity 0.3s ease"
                        _groupHover={{ opacity: 1 }}
                      >
                        <Icon
                          as={TriangleUpIcon}
                          color="white"
                          boxSize="16"
                          filter="drop-shadow(0 4px 8px rgba(0,0,0,0.3))"
                          transform="rotate(90deg)"
                        />
                      </Flex>

                      {/* Duration Badge */}
                      <Badge
                        position="absolute"
                        bottom="3"
                        right="3"
                        colorScheme="blackAlpha"
                        variant="solid"
                        rounded="md"
                        fontSize="xs"
                      >
                        <HStack spacing={1}>
                          <TimeIcon boxSize="2" />
                          <Text>{video.duration}</Text>
                        </HStack>
                      </Badge>
                    </Box>

                    <CardBody p={4}>
                      <VStack align="start" spacing={3}>
                        <Text
                          fontWeight="semibold"
                          fontSize="md"
                          color={textColor}
                          lineHeight="1.3"
                          noOfLines={2}
                          _groupHover={{ color: "blue.500" }}
                          transition="color 0.2s ease"
                        >
                          {video.title}
                        </Text>
                        
                        <Badge
                          colorScheme="purple"
                          variant="subtle"
                          rounded="full"
                          fontSize="xs"
                          px={3}
                          py={1}
                        >
                          {categories.find(cat => cat.value === video.category)?.label || video.category}
                        </Badge>
                      </VStack>
                    </CardBody>
                  </Card>
                </ScaleFade>
              ))}
            </SimpleGrid>
          </Fade>
        ) : (
          <Fade in={true}>
            <Card 
              bg={cardBg} 
              shadow="lg" 
              borderWidth="1px" 
              borderColor={borderColor}
              rounded="2xl"
              p={12}
            >
              <VStack spacing={4} textAlign="center">
                <Icon 
                  as={SearchIcon} 
                  boxSize="16" 
                  color={mutedTextColor}
                  opacity={0.5}
                />
                <Heading size="md" color={textColor}>
                  Không tìm thấy video phù hợp
                </Heading>
                <Text color={mutedTextColor} maxW="md">
                  Hãy thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc để xem thêm video
                </Text>
                {hasActiveFilters && (
                  <IconButton
                    icon={<CloseIcon />}
                    colorScheme="blue"
                    variant="outline"
                    onClick={clearFilters}
                    mt={2}
                  >
                    Xóa bộ lọc
                  </IconButton>
                )}
              </VStack>
            </Card>
          </Fade>
        )}
      </VStack>
    </Container>
  );
};

export default VideoList;