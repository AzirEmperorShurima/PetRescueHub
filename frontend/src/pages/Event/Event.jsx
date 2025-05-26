import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Heading, 
  Text,
  Box, 
  SimpleGrid, 
  Button, 
  Image,
  Badge,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  useBreakpointValue,
  useColorModeValue,
  VStack,
  HStack,
  Flex,
  Skeleton,
  SkeletonText,
  Center,
  Stack,
  Spacer
} from '@chakra-ui/react';
import { 
  FaPlus,
  FaSearch,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaArrowRight
} from 'react-icons/fa';
import './Event.css';
import ScrollToTopButton from '../../components/button/ScrollToTopButton';
// Thay đổi import để sử dụng dữ liệu mock từ file events.js
import { events } from '../../mocks/events';

const Event = () => {
  const isMobile = useBreakpointValue({ base: true, sm: false });
  const navigate = useNavigate();
  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredEvent, setFeaturedEvent] = useState(null);

  // Color mode values
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const searchBg = useColorModeValue('white', 'gray.700');
  const shadowColor = useColorModeValue('lg', 'dark-lg');

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // Sử dụng dữ liệu từ mock events
        setTimeout(() => {
          // Tìm sự kiện nổi bật (sự kiện đầu tiên)
          if (events.length > 0) {
            setFeaturedEvent(events[0]);
            setEventsList(events.slice(1));
          } else {
            setEventsList([]);
          }
          
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = eventsList.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleCreateEvent = () => {
    navigate('/event/create');
  };

  // Phân trang
  const eventsPerPage = 6;
  const pageCount = Math.ceil(filteredEvents.length / eventsPerPage);
  const displayedEvents = filteredEvents.slice(
    (page - 1) * eventsPerPage,
    page * eventsPerPage
  );

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  // Custom Pagination Component
  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    
    return (
      <HStack spacing={2} justify="center">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Trước
        </Button>
        
        {pages.map(pageNum => (
          <Button
            key={pageNum}
            size="sm"
            variant={pageNum === currentPage ? "solid" : "outline"}
            colorScheme={pageNum === currentPage ? "blue" : "gray"}
            onClick={() => onPageChange(pageNum)}
          >
            {pageNum}
          </Button>
        ))}
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Sau
        </Button>
      </HStack>
    );
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    // Cuộn lên đầu trang khi chuyển trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box className="event-page" py={8}>
      <Container maxW="6xl">
        {/* Header */}
        <VStack spacing={4} textAlign="center" mb={8} className="event-header">
          <Heading as="h1" size="2xl" className="event-title">
            Sự kiện
          </Heading>
          <Text fontSize="lg" color={textSecondary} className="event-subtitle">
            Tham gia các sự kiện của chúng tôi để gặp gỡ cộng đồng yêu thú cưng
          </Text>
        </VStack>

        {/* Search and Create */}
        <Flex 
          justify="space-between" 
          align="center" 
          mb={8} 
          flexWrap="wrap" 
          gap={4} 
          className="event-actions"
        >
          <InputGroup maxW={{ base: "100%", md: "900px" }} className="event-search">
            <Input
              placeholder="Tìm kiếm sự kiện..."
              value={searchTerm}
              onChange={handleSearchChange}
              bg={searchBg}
              borderColor={borderColor}
              _hover={{ borderColor: 'blue.300' }}
              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
            />
            <InputRightElement>
              <IconButton
                aria-label="search"
                icon={<FaSearch />}
                size="sm"
                variant="ghost"
              />
            </InputRightElement>
          </InputGroup>
          
          <Button
            colorScheme="blue"
            leftIcon={<FaPlus />}
            onClick={handleCreateEvent}
            className="create-event-btn"
          >
            Tạo sự kiện
          </Button>
        </Flex>

        {/* Featured Event */}
        {featuredEvent && (
          <Box mb={12}>
            <Heading as="h2" size="lg" mb={4} className="section-title">
              Sự kiện nổi bật
            </Heading>
            <Box
              bg={cardBg}
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="lg"
              overflow="hidden"
              shadow={shadowColor}
              className="featured-event-card"
            >
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={0}>
                <Box className="featured-event-image-container">
                  <Image
                    src={featuredEvent.imageUrl}
                    alt={featuredEvent.title}
                    w="100%"
                    h="300px"
                    objectFit="cover"
                    className="featured-event-image"
                  />
                </Box>
                <Box p={6}>
                  <VStack align="start" spacing={4} className="featured-event-content">
                    <Heading as="h3" size="md" className="featured-event-title">
                      {featuredEvent.title}
                    </Heading>
                    
                    <VStack align="start" spacing={2}>
                      <HStack className="event-info-item">
                        <FaCalendarAlt color="blue" />
                        <Text fontSize="sm" color={textSecondary}>
                          {formatDate(featuredEvent.date)}
                        </Text>
                      </HStack>
                      
                      <HStack className="event-info-item">
                        <FaMapMarkerAlt color="blue" />
                        <Text fontSize="sm" color={textSecondary}>
                          {featuredEvent.location}
                        </Text>
                      </HStack>
                      
                      <HStack className="event-info-item">
                        <FaUsers color="blue" />
                        <Text fontSize="sm" color={textSecondary}>
                          {featuredEvent.participants} người tham gia
                        </Text>
                      </HStack>
                    </VStack>
                    
                    <Text fontSize="sm" className="featured-event-description">
                      {featuredEvent.description}
                    </Text>
                    
                    <Flex flexWrap="wrap" gap={2} className="event-tags">
                      {featuredEvent.tags.map((tag, index) => (
                        <Badge 
                          key={index} 
                          colorScheme="blue" 
                          variant="subtle"
                          className="event-tag-chip"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </Flex>
                    
                    <HStack spacing={4}>
                      <Button 
                        colorScheme="blue"
                        rightIcon={<FaArrowRight />}
                        as={Link}
                        to={`/event/${featuredEvent.id}`}
                        className="event-details-btn"
                      >
                        Xem chi tiết
                      </Button>
                      <Button 
                        variant="outline" 
                        colorScheme="blue"
                        className="event-register-btn"
                      >
                        Tham gia
                      </Button>
                    </HStack>
                  </VStack>
                </Box>
              </SimpleGrid>
            </Box>
          </Box>
        )}

        {/* Event List */}
        <Box mb={8}>
          <Heading as="h2" size="lg" mb={6} className="section-title">
            Tất cả sự kiện
          </Heading>
          
          {loading ? (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6} className="event-skeleton-container">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Box
                  key={item}
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={borderColor}
                  borderRadius="lg"
                  overflow="hidden"
                  className="event-card skeleton"
                >
                  <Skeleton height="200px" />
                  <Box p={4}>
                    <SkeletonText mt={2} noOfLines={4} spacing={2} />
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          ) : displayedEvents.length > 0 ? (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
              {displayedEvents.map((event) => (
                <Box
                  key={event.id}
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={borderColor}
                  borderRadius="lg"
                  overflow="hidden"
                  shadow="md"
                  transition="all 0.2s"
                  _hover={{ 
                    transform: 'translateY(-5px)', 
                    shadow: shadowColor 
                  }}
                  className="event-card"
                >
                  <Box className="event-card-media-container">
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      w="100%"
                      h="200px"
                      objectFit="cover"
                      className="event-card-media"
                    />
                  </Box>
                  <Box p={4} className="event-card-content">
                    <VStack align="start" spacing={3}>
                      <Heading as="h3" size="sm" className="event-card-title">
                        {event.title}
                      </Heading>
                      
                      <VStack align="start" spacing={1}>
                        <HStack className="event-info-item">
                          <FaCalendarAlt size={12} color="blue" />
                          <Text fontSize="xs" color={textSecondary}>
                            {formatDate(event.date)}
                          </Text>
                        </HStack>
                        
                        <HStack className="event-info-item">
                          <FaMapMarkerAlt size={12} color="blue" />
                          <Text fontSize="xs" color={textSecondary}>
                            {event.location}
                          </Text>
                        </HStack>
                        
                        <HStack className="event-info-item">
                          <FaUsers size={12} color="blue" />
                          <Text fontSize="xs" color={textSecondary}>
                            {event.participants} người tham gia
                          </Text>
                        </HStack>
                      </VStack>
                      
                      <Text fontSize="sm" color={textSecondary} className="event-card-description">
                        {event.description.length > 120 
                          ? `${event.description.substring(0, 120)}...` 
                          : event.description}
                      </Text>
                      
                      <Flex flexWrap="wrap" gap={1} className="event-tags">
                        {event.tags.slice(0, 3).map((tag, index) => (
                          <Badge 
                            key={index} 
                            size="sm"
                            colorScheme="blue"
                            variant="subtle"
                            className="event-tag-chip"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </Flex>
                    </VStack>
                  </Box>
                  <Box p={4} pt={0} className="event-card-actions">
                    <HStack spacing={2}>
                      <Button 
                        size="sm" 
                        colorScheme="blue"
                        variant="ghost"
                        as={Link}
                        to={`/event/${event.id}`}
                        className="event-details-btn"
                      >
                        Xem chi tiết
                      </Button>
                      <Spacer />
                      <Button 
                        size="sm" 
                        variant="outline"
                        colorScheme="blue"
                        className="event-register-btn"
                      >
                        Tham gia
                      </Button>
                    </HStack>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          ) : (
            <Center py={12} className="no-events-message">
              <Text color={textSecondary}>Không tìm thấy sự kiện nào phù hợp.</Text>
            </Center>
          )}
        </Box>

        {/* Pagination */}
        {pageCount > 1 && (
          <Box className="event-pagination">
            <Pagination
              currentPage={page}
              totalPages={pageCount}
              onPageChange={handlePageChange}
            />
          </Box>
        )}
      </Container>
      <ScrollToTopButton />
    </Box>
  );
};

export default Event;