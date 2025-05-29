import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Flex,
  VStack,
  HStack,
  useColorModeValue,
  Badge,
  Icon,
  useDisclosure,
  useToast,
  IconButton,
  Tooltip,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Card,
  CardBody,
  Collapse,
  useBreakpointValue,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
// Import icons từ react-icons - sử dụng các icon tồn tại
import { 
  BiSearch, 
  BiHeart, 
  BiGrid, 
  BiListUl, 
  BiRefresh, 
  BiArrowToTop,
  BiStar, // Thay thế BiSparkle
  BiGroup,
  BiShield,
  BiAward,
  BiFilter
} from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import ScrollToTopButton from '../../components/button/ScrollToTopButton';
import { useAdopt } from '../../components/hooks/useAdopt';

// Import components với fallback
const PetFilters = React.lazy(() => 
  import('../../features/Adopt/components/PetFilters').catch(() => ({
    default: () => <div>PetFilters component not found</div>
  }))
);

const PetCard = React.lazy(() => 
  import('../../features/Adopt/components/PetCard').catch(() => ({
    default: () => <div>PetCard component not found</div>
  }))
);

const PetSkeleton = React.lazy(() => 
  import('../../features/Adopt/components/PetSkeleton').catch(() => ({
    default: () => <div>Loading...</div>
  }))
);

const PetSkeletonGrid = ({ count = 8 }) => (
  <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
    {Array.from({ length: count }).map((_, index) => (
      <React.Suspense key={index} fallback={<Box h="300px" bg="gray.100" borderRadius="lg" />}>
        <PetSkeleton />
      </React.Suspense>
    ))}
  </SimpleGrid>
);

// Motion components
const MotionBox = motion(Box);
const MotionSimpleGrid = motion(SimpleGrid);

const Adopt = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState(new Set());
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showHero, setShowHero] = useState(true);
  
  const { 
    isOpen: isFiltersOpen, 
    onOpen: onFiltersOpen, 
    onClose: onFiltersClose 
  } = useDisclosure();

  // Responsive values
  const heroHeight = useBreakpointValue({ base: '70vh', md: '60vh', lg: '65vh' });
  const containerMaxW = useBreakpointValue({ base: 'container.xl', '2xl': 'container.2xl' });
  const gridColumns = useBreakpointValue({ 
    base: 1, 
    md: 2, 
    lg: viewMode === 'grid' ? 3 : 1,
    xl: viewMode === 'grid' ? 4 : 1
  });

  // Theme colors
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const gradientBg = useColorModeValue(
    'linear(to-br, blue.50, purple.50, pink.50)',
    'linear(to-br, blue.900, purple.900, pink.900)'
  );

  // Custom hook for pet data với error handling
  const {
    pets,
    loading,
    error,
    searchTerm,
    filters,
    sortBy,
    handleSearchChange,
    handleFilterChange,
    handleSortChange,
    resetFilters
  } = useAdopt();

  useEffect(() => {
    // Safely load favorites - không sử dụng browser storage
    const initialFavorites = new Set();
    setFavorites(initialFavorites);

    // Handle scroll events
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowScrollTop(scrollY > 400);
      setShowHero(scrollY < 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handlers với error boundary
  const handlePetClick = (pet) => {
    try {
      if (pet?.id) {
        navigate(`/adopt/${pet.id}`);
      }
    } catch (error) {
      console.error('Error navigating to pet detail:', error);
      toast({
        title: "Lỗi",
        description: "Không thể mở trang chi tiết thú cưng",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleFavoriteToggle = (pet) => {
    try {
      if (!pet?.id) return;
      
      const newFavorites = new Set(favorites);
      if (newFavorites.has(pet.id)) {
        newFavorites.delete(pet.id);
        toast({
          title: "Đã xóa khỏi danh sách yêu thích",
          status: "info",
          duration: 2000,
          isClosable: true,
          position: "bottom-right",
        });
      } else {
        newFavorites.add(pet.id);
        toast({
          title: "Đã thêm vào danh sách yêu thích",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "bottom-right",
        });
      }
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật danh sách yêu thích",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const scrollToTop = () => {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      window.scrollTo(0, 0);
    }
  };

  const scrollToPets = () => {
    try {
      const element = document.getElementById('pet-list');
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    } catch (error) {
      console.warn('Smooth scroll not supported');
    }
  };

  // Safe wrapper functions
  const handleSearchChangeWrapper = (value) => {
    try {
      if (typeof handleSearchChange === 'function') {
        handleSearchChange(value);
      }
    } catch (error) {
      console.error('Error in search change:', error);
    }
  };

  const handleFilterChangeWrapper = (filterData) => {
    try {
      if (typeof handleFilterChange === 'function') {
        handleFilterChange(filterData);
      }
    } catch (error) {
      console.error('Error in filter change:', error);
    }
  };

  const handleSortChangeWrapper = (sortValue) => {
    try {
      if (typeof handleSortChange === 'function') {
        handleSortChange(sortValue);
      }
    } catch (error) {
      console.error('Error in sort change:', error);
    }
  };

  const resetFiltersWrapper = () => {
    try {
      if (typeof resetFilters === 'function') {
        resetFilters();
      }
    } catch (error) {
      console.error('Error resetting filters:', error);
    }
  };

  return (
    <Box bg={bgColor} minH="100vh" position="relative">
      {/* Optimized Hero Section */}
      <Collapse in={showHero} animateOpacity>
        <MotionBox
          bgGradient={gradientBg}
          height={heroHeight}
          display="flex"
          alignItems="center"
          position="relative"
          overflow="hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Background decorations - Sử dụng BiStar thay vì BiSparkle */}
          <Box
            position="absolute"
            top="10%"
            right="10%"
            w="100px"
            h="100px"
            opacity={0.1}
            transform="rotate(45deg)"
          >
            <Icon as={BiStar} w="full" h="full" />
          </Box>
          
          <Container maxW={containerMaxW}>
            <VStack spacing={6} textAlign="center" maxW="800px" mx="auto">
              <MotionBox
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Heading
                  size={{ base: 'xl', md: '2xl', lg: '3xl' }}
                  bgGradient="linear(to-r, blue.600, purple.600, pink.600)"
                  bgClip="text"
                  lineHeight="shorter"
                >
                  Tìm người bạn đồng hành hoàn hảo
                </Heading>
              </MotionBox>
              
              <MotionBox
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Text 
                  fontSize={{ base: 'lg', md: 'xl' }} 
                  color={textSecondary} 
                  lineHeight="tall"
                >
                  Hàng trăm thú cưng đáng yêu đang chờ đợi một ngôi nhà ấm áp. 
                  Hãy mang niềm vui và tình yêu vào cuộc sống của bạn.
                </Text>
              </MotionBox>
              
              <MotionBox
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <HStack spacing={4} flexWrap="wrap" justify="center">
                  <Button
                    size="lg"
                    colorScheme="blue"
                    leftIcon={<Icon as={BiGroup} />}
                    onClick={scrollToPets}
                    shadow="lg"
                    _hover={{
                      transform: 'translateY(-2px)',
                      shadow: 'xl',
                    }}
                    transition="all 0.3s"
                  >
                    Khám phá ngay
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    colorScheme="purple"
                    leftIcon={<Icon as={BiAward} />}
                    onClick={() => {
                      try {
                        navigate('/findhome');
                      } catch (error) {
                        console.error('Navigation error:', error);
                      }
                    }}
                    bg={cardBg}
                    _hover={{
                      transform: 'translateY(-2px)',
                      shadow: 'lg',
                    }}
                    transition="all 0.3s"
                  >
                    Đăng thông tin thú cưng
                  </Button>
                </HStack>
              </MotionBox>

              {/* Stats */}
              <MotionBox
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <HStack 
                  spacing={8} 
                  justify="center" 
                  mt={8}
                  flexWrap="wrap"
                >
                  <VStack spacing={1}>
                    <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                      {loading ? '...' : pets.length}+
                    </Text>
                    <Text fontSize="sm" color={textSecondary}>
                      Thú cưng
                    </Text>
                  </VStack>
                  <VStack spacing={1}>
                    <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                      {favorites.size}
                    </Text>
                    <Text fontSize="sm" color={textSecondary}>
                      Yêu thích
                    </Text>
                  </VStack>
                  <VStack spacing={1}>
                    <Text fontSize="2xl" fontWeight="bold" color="pink.600">
                      100%
                    </Text>
                    <Text fontSize="sm" color={textSecondary}>
                      Yêu thương
                    </Text>
                  </VStack>
                </HStack>
              </MotionBox>
            </VStack>
          </Container>
        </MotionBox>
      </Collapse>

      {/* Main Content */}
      <Container maxW={containerMaxW} py={8}>
        <Flex gap={6} align="start">
          {/* Desktop Filters Sidebar */}
          <Box
            w="320px"
            flexShrink={0}
            display={{ base: 'none', lg: 'block' }}
          >
            <React.Suspense fallback={<Box p={4}>Loading filters...</Box>}>
              <PetFilters
                filters={filters}
                searchTerm={searchTerm}
                sortBy={sortBy}
                onSearchChange={(e) => handleSearchChangeWrapper(e.target.value)}
                onFilterChange={handleFilterChangeWrapper}
                onSortChange={handleSortChangeWrapper}
                onResetFilters={resetFiltersWrapper}
              />
            </React.Suspense>
          </Box>

          {/* Main Content */}
          <Box flex={1} id="pet-list">
            {/* Enhanced Controls Bar */}
            <Card bg={cardBg} shadow="md" p={4} mb={6} borderRadius="xl">
              <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                <HStack spacing={4}>
                  <Button
                    leftIcon={<Icon as={BiFilter} />}
                    variant="outline"
                    onClick={onFiltersOpen}
                    display={{ base: 'flex', lg: 'none' }}
                    colorScheme="blue"
                  >
                    Bộ lọc
                  </Button>
                  
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold" fontSize="lg">
                      {loading ? 'Đang tải...' : `${pets.length} thú cưng`}
                    </Text>
                    <Text fontSize="sm" color={textSecondary}>
                      đang tìm kiếm ngôi nhà mới
                    </Text>
                  </VStack>
                </HStack>

                <HStack spacing={4}>
                  {/* View Mode Toggle */}
                  <HStack spacing={1} bg={useColorModeValue('gray.100', 'gray.700')} p={1} borderRadius="lg">
                    <IconButton
                      icon={<Icon as={BiGrid} />}
                      size="sm"
                      variant={viewMode === 'grid' ? 'solid' : 'ghost'}
                      colorScheme="blue"
                      onClick={() => setViewMode('grid')}
                      borderRadius="md"
                    />
                    <IconButton
                      icon={<Icon as={BiListUl} />}
                      size="sm"
                      variant={viewMode === 'list' ? 'solid' : 'ghost'}
                      colorScheme="blue"
                      onClick={() => setViewMode('list')}
                      borderRadius="md"
                    />
                  </HStack>

                  <Tooltip label="Danh sách yêu thích">
                    <Button
                      leftIcon={<Icon as={BiHeart} />}
                      variant="outline"
                      colorScheme="red"
                      onClick={() => {
                        try {
                          navigate('/favorites');
                        } catch (error) {
                          console.error('Navigation error:', error);
                        }
                      }}
                      position="relative"
                    >
                      Yêu thích
                      {favorites.size > 0 && (
                        <Badge
                          position="absolute"
                          top="-1"
                          right="-1"
                          colorScheme="red"
                          borderRadius="full"
                          minW="5"
                          h="5"
                          fontSize="xs"
                        >
                          {favorites.size}
                        </Badge>
                      )}
                    </Button>
                  </Tooltip>
                </HStack>
              </Flex>
            </Card>

            {/* Pet Grid/List with Enhanced Loading */}
            <AnimatePresence mode="wait">
              {loading ? (
                <PetSkeletonGrid key="skeleton" count={8} />
              ) : pets.length > 0 ? (
                <MotionSimpleGrid
                  key="pets"
                  columns={gridColumns}
                  spacing={6}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {pets.map((pet) => (
                    <React.Suspense 
                      key={pet.id} 
                      fallback={<Box h="400px" bg="gray.100" borderRadius="lg" />}
                    >
                      <PetCard
                        pet={pet}
                        onClick={handlePetClick}
                        onFavorite={handleFavoriteToggle}
                        isFavorited={favorites.has(pet.id)}
                      />
                    </React.Suspense>
                  ))}
                </MotionSimpleGrid>
              ) : (
                <MotionBox
                  key="empty"
                  textAlign="center"
                  py={20}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <VStack spacing={6}>
                    <Text fontSize="6xl">🐕🐱</Text>
                    <VStack spacing={2}>
                      <Heading size="lg" color={textSecondary}>
                        Không tìm thấy thú cưng nào
                      </Heading>
                      <Text color={textSecondary} maxW="400px">
                        Hãy thử thay đổi bộ lọc tìm kiếm của bạn hoặc xóa bộ lọc để xem tất cả thú cưng
                      </Text>
                    </VStack>
                    <HStack spacing={3}>
                      <Button 
                        colorScheme="blue" 
                        onClick={resetFiltersWrapper}
                        leftIcon={<Icon as={BiRefresh} />}
                      >
                        Xóa bộ lọc
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => window.location.reload()}
                      >
                        Tải lại trang
                      </Button>
                    </HStack>
                  </VStack>
                </MotionBox>
              )}
            </AnimatePresence>
          </Box>
        </Flex>
      </Container>

      {/* Enhanced Adoption Process Section */}
      <Box bg={cardBg} py={16} mt={16} borderTop="1px" borderColor={borderColor}>
        <Container maxW={containerMaxW}>
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Icon as={BiShield} w={12} h={12} color="blue.500" />
              <Heading size="xl">Quy trình nhận nuôi an toàn</Heading>
              <Text color={textSecondary} maxW="600px" fontSize="lg">
                Quy trình được thiết kế để đảm bảo thú cưng tìm được ngôi nhà phù hợp và yêu thương nhất
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
              {[
                {
                  step: '1',
                  title: 'Tìm kiếm và liên hệ',
                  description: 'Duyệt qua danh sách thú cưng, tìm hiểu thông tin chi tiết và liên hệ với chúng tôi',
                  icon: '🔍',
                  color: 'blue'
                },
                {
                  step: '2', 
                  title: 'Gặp mặt và tương tác',
                  description: 'Đến trung tâm để gặp gỡ trực tiếp và tương tác với thú cưng bạn quan tâm',
                  icon: '🤝',
                  color: 'purple'
                },
                {
                  step: '3',
                  title: 'Hoàn tất và đón về',
                  description: 'Hoàn thành giấy tờ, nhận hướng dẫn chăm sóc và đón thú cưng về ngôi nhà mới',
                  icon: '🏠',
                  color: 'green'
                }
              ].map((process, index) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card 
                    bg={bgColor} 
                    shadow="lg" 
                    p={8} 
                    textAlign="center"
                    borderRadius="xl"
                    border="1px"
                    borderColor={borderColor}
                    _hover={{
                      shadow: 'xl',
                      transform: 'translateY(-4px)',
                    }}
                    transition="all 0.3s"
                  >
                    <VStack spacing={6}>
                      <Text fontSize="5xl" mb={2}>{process.icon}</Text>
                      <Badge 
                        colorScheme={process.color} 
                        fontSize="md" 
                        px={4} 
                        py={2} 
                        borderRadius="full"
                        variant="solid"
                      >
                        Bước {process.step}
                      </Badge>
                      <VStack spacing={3}>
                        <Heading size="md" color={useColorModeValue('gray.800', 'white')}>
                          {process.title}
                        </Heading>
                        <Text color={textSecondary} lineHeight="tall">
                          {process.description}
                        </Text>
                      </VStack>
                    </VStack>
                  </Card>
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Mobile Filters Drawer */}
      <Drawer isOpen={isFiltersOpen} placement="left" onClose={onFiltersClose} size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            <HStack spacing={2}>
              <Icon as={BiFilter} />
              <Text>Bộ lọc tìm kiếm</Text>
            </HStack>
          </DrawerHeader>
          <DrawerBody p={0}>
            <Box p={4}>
              <React.Suspense fallback={<Box p={4}>Loading filters...</Box>}>
                <PetFilters
                  filters={filters}
                  searchTerm={searchTerm}
                  sortBy={sortBy}
                  onSearchChange={(e) => handleSearchChangeWrapper(e.target.value)}
                  onFilterChange={handleFilterChangeWrapper}
                  onSortChange={handleSortChangeWrapper}
                  onResetFilters={resetFiltersWrapper}
                />
              </React.Suspense>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <ScrollToTopButton />   

      {error && (
        <Alert status="error" mb={6} borderRadius="lg">
          <AlertIcon />
          <Text>{error}</Text>
        </Alert>
      )}
    </Box>
  );
};

export default Adopt;