import React, { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  SimpleGrid,
  Image,
  Heading,
  Text,
  Button,
  HStack,
  VStack,
  Badge,
  Avatar,
  Flex,
  useColorModeValue,
  Card
} from '@chakra-ui/react';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaArrowRight } from 'react-icons/fa';
import PropTypes from 'prop-types';
import PostActions from '../../../features/Forum/PostActions';

const EventCard = ({
  event,
  isFeatured = false,
  onToggleReaction,
  onToggleFavorite,
  currentUser,
  isOwner
}) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const tagBg = useColorModeValue('blue.50', 'blue.900');
  const tagColor = useColorModeValue('blue.600', 'blue.200');
  const shadowColor = useColorModeValue('lg', 'dark-lg');
  const navigate = useNavigate();

  const formatDate = (date) => {
    try {
      return new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Không xác định';
    }
  };

  const handleReactionChange = (reactionType, reactions) => {
    if (onToggleReaction) {
      onToggleReaction(event._id, reactionType, reactions);
    }
  };

  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(event._id);
    }
  };

  const handleCardClick = (e) => {
    // Kiểm tra nếu click vào các phần tử tương tác thì không chuyển hướng
    if (e.target.closest('.action-buttons') || 
        e.target.closest('button') || 
        e.target.closest('a')) {
      return;
    }
    navigate(`/event/${event._id}`);
  };

  if (isFeatured) {
    return (
      <Card
        bg={cardBg}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="lg"
        overflow="hidden"
        shadow={shadowColor}
        className="featured-event-card"
        onClick={handleCardClick}
        cursor="pointer"
      >
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={0}>
          <Box className="featured-event-image-container">
            {event.imgUrl && event.imgUrl.length > 0 && (
              <iframe
                src={`https://drive.google.com/file/d/${event.imgUrl[0].match(/[-\w]{25,}/)?.[0]}/preview`}
                width="100%"
                height="100%"
                style={{ border: 'none' }}
                allow="autoplay"
                title="Featured Event Image"
              />
            )}
          </Box>
          <Box p={4}>
            <VStack align="start" spacing={3} className="featured-event-content">
              {/* Author Info */}
              <HStack spacing={2}>
                <Avatar src={event.author?.avatar} name={event.author?.name} size="sm" />
                <VStack align="start" spacing={0}>
                  <Text fontSize="sm" fontWeight="medium">{event.author?.name}</Text>
                  <Text fontSize="xs" color={textSecondary}>
                    {formatDate(event.createdAt)}
                  </Text>
                </VStack>
              </HStack>

              <Heading as="h3" size="md" className="featured-event-title">
                {event.title}
              </Heading>
              
              <VStack align="start" spacing={2}>
                <HStack className="event-info-item">
                  <FaCalendarAlt color="blue" />
                  <Text fontSize="sm" color={textSecondary}>
                    {formatDate(event.eventDate || event.createdAt)}
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
                    {event.participants || 0} người tham gia
                  </Text>
                </HStack>
              </VStack>
              
              <Text fontSize="sm" className="featured-event-description">
                {event.content?.length > 200 
                  ? `${event.content.substring(0, 200)}...` 
                  : event.content}
              </Text>
              
              <Flex flexWrap="wrap" gap={2} className="event-tags">
                {event.tags?.map((tag, index) => (
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
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/event/${event._id}`);
                  }}
                  className="event-details-btn"
                >
                  Xem chi tiết
                </Button>
                <Button 
                  variant="outline" 
                  colorScheme="blue"
                  onClick={(e) => e.stopPropagation()}
                  className="event-register-btn"
                >
                  Tham gia
                </Button>
              </HStack>

              {/* Featured Event - PostActions */}
              <Box 
                mt={4}
                width="100%"
                className="action-buttons"
                onClick={(e) => e.stopPropagation()}
              >
                <PostActions 
                  post={event}
                  currentUser={currentUser}
                  onReactionChange={handleReactionChange}
                  onFavoriteToggle={handleFavoriteToggle}
                  isOwner={isOwner}
                  isDetail={false}
                />
              </Box>
            </VStack>
          </Box>
        </SimpleGrid>
      </Card>
    );
  }

  return (
    <Card
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      overflow="visible"
      shadow="md"
      transition="all 0.2s"
      _hover={{ 
        transform: 'translateY(-5px)', 
        shadow: shadowColor 
      }}
      className="event-card"
      display="flex"
      flexDirection="column"
      onClick={handleCardClick}
      cursor="pointer"
      position="relative"
    >
      <Box overflow="hidden" borderTopRadius="lg">
        {event.imgUrl && event.imgUrl.length > 0 && (
          <Box flex="0 0 auto">
            <iframe
              src={`https://drive.google.com/file/d/${event.imgUrl[0].match(/[-\w]{25,}/)?.[0]}/preview`}
              width="100%"
              height="200px"
              style={{ border: 'none' }}
              allow="autoplay"
              title="Event Image"
            />
          </Box>
        )}
      </Box>

      <Box p={4} display="flex" flexDirection="column" flex="1">
        {/* Author Info */}
        <HStack spacing={2} mb={3}>
          <Avatar src={event.author?.avatar} name={event.author?.name} size="sm" />
          <VStack align="start" spacing={0}>
            <Text fontSize="sm" fontWeight="medium">{event.author?.name}</Text>
            <Text fontSize="xs" color={textSecondary}>
              {formatDate(event.createdAt)}
            </Text>
          </VStack>
        </HStack>

        {/* Content */}
        <VStack align="start" spacing={3} flex="1">
          <Heading as="h3" size="sm" className="event-card-title">
            {event.title}
          </Heading>
          
          {/* Event Info */}
          <VStack align="start" spacing={1}>
            <HStack className="event-info-item">
              <FaCalendarAlt size={12} color="blue" />
              <Text fontSize="xs" color={textSecondary}>
                {formatDate(event.eventDate || event.createdAt)}
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
                {event.participants || 0} người tham gia
              </Text>
            </HStack>
          </VStack>
          
          {/* Description */}
          <Text fontSize="sm" color={textSecondary} className="event-card-description">
            {event.content?.length > 120 
              ? `${event.content.substring(0, 120)}...` 
              : event.content}
          </Text>
          
          {/* Tags */}
          <Flex flexWrap="wrap" gap={1} className="event-tags">
            {event.tags?.slice(0, 3).map((tag, index) => (
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

          {/* Action Buttons */}
          <HStack spacing={2} justify="space-between" width="100%" mt="auto">
            <Button 
              size="sm" 
              colorScheme="blue"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/event/${event._id}`);
              }}
              className="event-details-btn"
            >
              Xem chi tiết
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              colorScheme="blue"
              onClick={(e) => e.stopPropagation()}
              className="event-register-btn"
            >
              Tham gia
            </Button>
          </HStack>
        </VStack>

        {/* Post Actions */}
        <Box 
          width="100%" 
          mt={4} 
          className="action-buttons" 
          onClick={(e) => e.stopPropagation()}
          position="relative"
          zIndex="1"
        >
          <PostActions 
            post={event}
            currentUser={currentUser}
            onReactionChange={handleReactionChange}
            onToggleFavorite={handleFavoriteToggle}
            isOwner={isOwner}
            isDetail={false}
          />
        </Box>
      </Box>
    </Card>
  );
};

EventCard.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string,
    location: PropTypes.string,
    eventDate: PropTypes.string,
    participants: PropTypes.number,
    imgUrl: PropTypes.arrayOf(PropTypes.string),
    tags: PropTypes.arrayOf(PropTypes.string),
    author: PropTypes.shape({
      name: PropTypes.string,
      avatar: PropTypes.string
    }),
    createdAt: PropTypes.string,
    reactions: PropTypes.object,
    userReaction: PropTypes.string,
    isFavorited: PropTypes.bool
  }).isRequired,
  isFeatured: PropTypes.bool,
  onToggleReaction: PropTypes.func,
  onToggleFavorite: PropTypes.func,
  currentUser: PropTypes.object,
  isOwner: PropTypes.bool
};

export default memo(EventCard);