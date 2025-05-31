import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Heading, 
  Text,
  Box, 
  SimpleGrid, 
  Button, 
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  VStack,
  HStack,
  Center,
  Skeleton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure
} from '@chakra-ui/react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import './Event.css';
import ScrollToTopButton from '../../components/button/ScrollToTopButton';
import EventCard from './components/EventCard';
import { useAuth } from '../../components/contexts/AuthContext';
import apiService from '../../services/api.service';
import EventCalendar from './components/EventCalendar';

const Event = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredEvent, setFeaturedEvent] = useState(null);

  // Color mode values
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const searchBg = useColorModeValue('white', 'gray.700');

  const { isOpen: isCalendarOpen, onOpen: onCalendarOpen, onClose: onCalendarClose } = useDisclosure();

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await apiService.forum.posts.getAll({
          postType: 'EventPost',
          limit: 100
        });
        const eventsList = response.data?.data || [];
        
        // Set featured event (first approved event or first event)
        const featured = eventsList.find(event => 
          event.status === 'approved' && event.featured
        ) || eventsList[0];
        
        setFeaturedEvent(featured);
        setEvents(eventsList.filter(event => event._id !== featured?._id));
        
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleCreateEvent = () => {
    if (!user) {
      navigate('/auth/login', { state: { returnUrl: '/event/create' } });
      return;
    }
    navigate('/event/create');
  };

  // Handle reactions and favorites
  const handleToggleReaction = async (postId, userReaction, reactions) => {
    if (!user) return;
    try {
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event._id === postId
            ? { ...event, userReaction, reactions }
            : event
        )
      );

      if (featuredEvent?._id === postId) {
        setFeaturedEvent(prev => ({
          ...prev,
          userReaction,
          reactions
        }));
      }
    } catch (error) {
      console.error('Error toggling reaction:', error);
    }
  };

  const handleToggleFavorite = async (postId) => {
    if (!user) return;
    try {
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event._id === postId
            ? { ...event, isFavorited: !event.isFavorited }
            : event
        )
      );

      if (featuredEvent?._id === postId) {
        setFeaturedEvent(prev => ({
          ...prev,
          isFavorited: !prev.isFavorited
        }));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // Filter events based on search term
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const eventsPerPage = 6;
  const pageCount = Math.ceil(filteredEvents.length / eventsPerPage);
  const displayedEvents = filteredEvents.slice(
    (page - 1) * eventsPerPage,
    page * eventsPerPage
  );

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
          <Button colorScheme="blue" variant="outline" onClick={onCalendarOpen} className="calendar-event-btn">
            Lịch sự kiện
          </Button>
          <Button colorScheme="pink" leftIcon={<FaPlus />} onClick={handleCreateEvent} className="create-event-btn">
            Tạo sự kiện
          </Button>
        </HStack>

        {/* Featured Event */}
        {loading ? (
          <Box mb={12}>
            <Heading as="h2" size="lg" mb={4} className="section-title">
              Sự kiện nổi bật
            </Heading>
            <Skeleton height="100px" />
          </Box>
        ) : featuredEvent ? (
          <Box mb={12}>
            <Heading as="h2" size="lg" mb={4} className="section-title">
              Sự kiện nổi bật
            </Heading>
            <EventCard 
              event={featuredEvent} 
              isFeatured={true}
              onToggleReaction={handleToggleReaction}
              onToggleFavorite={handleToggleFavorite}
              currentUser={user}
            />
          </Box>
        ) : null}

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
                <EventCard 
                  key={event._id} 
                  event={event}
                  onToggleReaction={handleToggleReaction}
                  onToggleFavorite={handleToggleFavorite}
                  currentUser={user}
                  isOwner={user && (user.id === event.authorId || user._id === event.authorId)}
                />
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

      <Modal isOpen={isCalendarOpen} onClose={onCalendarClose} size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Lịch sự kiện</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <EventCalendar events={events.concat(featuredEvent ? [featuredEvent] : [])} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Event;