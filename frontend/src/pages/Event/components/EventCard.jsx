import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  SimpleGrid,
  Image,
  Stack,
  Heading,
  Text,
  Button,
  HStack,
  VStack,
  Badge,
  Flex,
  useColorModeValue,
  Spacer
} from '@chakra-ui/react';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaArrowRight } from 'react-icons/fa';
import PropTypes from 'prop-types';

const EventCard = ({ event, isFeatured = false }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const shadowColor = useColorModeValue('lg', 'dark-lg');

  const formattedDate = useMemo(() => {
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(event.date).toLocaleDateString('vi-VN', options);
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Không xác định';
    }
  }, [event.date]);

  const truncatedDescription = useMemo(() => {
    const limit = isFeatured ? 200 : 120;
    return event.description.length > limit
      ? `${event.description.slice(0, limit)}...`
      : event.description;
  }, [event.description, isFeatured]);

  if (isFeatured) {
    return (
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
              src={event.imageUrl}
              alt={event.title}
              w="100%"
              h="300px"
              objectFit="cover"
              className="featured-event-image"
            />
          </Box>
          <Box p={6}>
            <VStack align="start" spacing={4} className="featured-event-content">
              <Heading as="h3" size="md" className="featured-event-title">
                {event.title}
              </Heading>
              
              <VStack align="start" spacing={2}>
                <HStack className="event-info-item">
                  <FaCalendarAlt color="blue" />
                  <Text fontSize="sm" color={textSecondary}>
                    {formattedDate}
                  </Text>
                </HStack>
                
                <HStack className="event-info-item">
                  <FaMapMarkerAlt color="blue" />
                  <Text fontSize="sm" color={textSecondary}>
                    {event.location}
                  </Text>
                </HStack>
                
                <HStack className="event-info-item">
                  <FaUsers color="blue" />
                  <Text fontSize="sm" color={textSecondary}>
                    {event.participants} người tham gia
                  </Text>
                </HStack>
              </VStack>
              
              <Text fontSize="sm" className="featured-event-description">
                {truncatedDescription}
              </Text>
              
              <Flex flexWrap="wrap" gap={2} className="event-tags">
                {event.tags.map((tag, index) => (
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
                  to={`/event/${event.id}`}
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
    );
  }

  return (
    <Box
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
                {formattedDate}
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
            {truncatedDescription}
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
  );
};

EventCard.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
    imageUrl: PropTypes.string.isRequired,
    participants: PropTypes.number.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    organizer: PropTypes.string,
    status: PropTypes.string
  }).isRequired,
  isFeatured: PropTypes.bool
};

export default EventCard;