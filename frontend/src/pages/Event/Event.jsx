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
  InputLeftElement,
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
import { events } from '../../mocks/events';
import EventCard from './components/EventCard';

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
        setTimeout(() => {
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
    <Box className="event-page" minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
    <Container maxW="container.xl" py={6}>
        {/* Header */}
        <VStack spacing={0} textAlign="center" mb={8} className="event-header">
          <Heading as="h1" size="2xl" className="event-title">
            Sự kiện thú cưng
          </Heading>
          <Text fontSize="lg" color={textSecondary} className="event-subtitle">
            Tham gia các sự kiện của chúng tôi để gặp gỡ cộng đồng yêu thú cưng
          </Text>
        </VStack>

        {/* Search and Create */}
        <HStack spacing={3} mb={6} w="100%">
          <InputGroup size="md" flex="1">
            <InputLeftElement pointerEvents="none">
              <FaSearch color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Tìm kiếm sự kiện..."
              value={searchTerm}
              onChange={handleSearchChange}
              bg={searchBg}
              borderColor={borderColor}
              _hover={{ borderColor: 'blue.300' }}
              _focus={{ 
                borderColor: 'blue.500', 
                boxShadow: '0 0 0 1px blue.500' 
              }}
            />
          </InputGroup>
          <Button
            colorScheme="pink"
            leftIcon={<FaPlus />}
            onClick={handleCreateEvent}
            className="create-event-btn"
          >
            Tạo sự kiện
          </Button>
        </HStack>

        {/* Featured Event */}
        {featuredEvent && (
          <Box mb={12}>
            <Heading as="h2" size="lg" mb={4} className="section-title">
              Sự kiện nổi bật
            </Heading>
            <EventCard event={featuredEvent} isFeatured={true} />
          </Box>
        )}

        {/* Event List */}
        <Box mb={8}>
          <Heading as="h2" size="lg" mb={6} className="section-title">
            Tất cả sự kiện
          </Heading>
          
          {loading ? (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Box
                  key={item}
                  height="400px"
                  bg="gray.100"
                  borderRadius="lg"
                  className="skeleton"
                />
              ))}
            </SimpleGrid>
          ) : displayedEvents.length > 0 ? (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
              {displayedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
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