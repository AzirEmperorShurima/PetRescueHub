import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Avatar,
  Text,
  Badge,
  HStack,
  VStack,
  Flex,
  useColorModeValue
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import PostSticker from './PostSticker';
import PostActions from '../PostActions';

const ForumCard = ({
  item,
  type,
  categories,
  onToggleLike,
  onToggleFavorite,
  formatDate,
  onClick,
  currentUser,
  isOwner,
  onEdit,
  onDelete,
  onReport
}) => {
  // Color mode values
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const tagBg = useColorModeValue('blue.50', 'blue.900');
  const tagColor = useColorModeValue('blue.600', 'blue.200');
  const shadowColor = useColorModeValue('lg', 'dark-lg');

  const category = item.categoryObj || (categories && categories.find(cat => cat.id === item.category));

  const getDetailUrl = () => {
    const itemId = item.id || item._id;
    switch (type) {
      case 'post':
      case 'ForumPost':
        return `/forum/post/${itemId}`;
      case 'question':
      case 'Question':
        return `/forum/question/${itemId}`;
      case 'event':
      case 'EventPost':
        return `/event/${itemId}`;
      case 'FindLostPetPost':
        return `/forum/findLostPet/${itemId}`;
      default:
        return '#';
    }
  };

  // Handlers for PostActions
  const handleReactionChange = (reactionType, updatedReactions) => {
    if (onToggleLike) {
      onToggleLike(reactionType, updatedReactions);
    }
  };

  const handleFavoriteToggle = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    if (onToggleFavorite) {
      const targetId = item.id || item._id;
      onToggleFavorite(targetId);
    }
  };

  const handleEdit = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    if (onEdit) {
      const itemId = item.id || item._id;
      onEdit(itemId);
    }
  };

  const handleDelete = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    if (onDelete) {
      const itemId = item.id || item._id;
      onDelete(itemId);
    }
  };

  const handleReport = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    if (onReport) {
      const itemId = item.id || item._id;
      onReport(itemId);
    }
  };

  const handleCardClick = (e) => {
    // Ngăn chặn sự kiện click khi nhấn vào các nút action
    if (e.target.closest('.action-buttons')) {
      e.stopPropagation();
      return;
    }
    
    if (onClick) {
      const itemId = item.id || item._id;
      onClick(itemId);
    }
  };

  return (
    <Box
      w="100%"
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      shadow="md"
      mb={4}
      position="relative"
      transition="all 0.2s ease-in-out"
      cursor={onClick ? 'pointer' : 'default'}
      _hover={{ 
        shadow: shadowColor,
        transform: onClick ? 'translateY(-2px)' : 'none'
      }}
      onClick={(e) => {
        // Ngăn chặn sự kiện click khi nhấn vào các nút action
        if (e.target.closest('.action-buttons')) {
          e.stopPropagation();
          return;
        }
        onClick?.();
      }}
    >
      <PostSticker type={type} />

      <Box p={4}>
        {/* Author Section */}
        <HStack mb={3} spacing={2}>
          <Avatar src={item.author?.avatar} name={item.author?.fullname} size="sm" />
          <VStack align="start" spacing={0}>
            <Text fontSize="sm" fontWeight="medium">
              {item.author?.fullname}
            </Text>
            <Text fontSize="xs" color={textSecondary}>
              {formatDate ? formatDate(item.createdAt) : new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </VStack>
        </HStack>

        {/* Content Section */}
        <Box as={Link} to={getDetailUrl()} _hover={{ textDecoration: 'none' }}>
          <Text 
            fontSize="xl" 
            fontWeight="semibold" 
            mb={2} 
            lineHeight="shorter" 
            _hover={{ color: 'blue.500' }}
          >
            {item.title}
          </Text>

          <Text 
            fontSize="md" 
            color={textSecondary} 
            mb={3} 
            lineHeight="base"
            noOfLines={3}
          >
            {item.content}
          </Text>
        </Box>

        {/* Image Section (iframe Google Drive) */}
        {item.imgUrl && item.imgUrl.length > 0 && (
          <Box mb={4}>
            {item.imgUrl.map((url, index) => {
              const driveId = url.match(/[-\w]{25,}/)?.[0];
              return driveId ? (
                <Box key={index} mb={index < item.imgUrl.length - 1 ? 4 : 0}>
                  <iframe
                    src={`https://drive.google.com/file/d/${driveId}/preview`}
                    width="100%"
                    height="350px"
                    style={{ 
                      border: 'none', 
                      borderRadius: '8px' 
                    }}
                    allow="autoplay"
                    title={`Google Drive Image ${index + 1}`}
                  />
                </Box>
              ) : null;
            })}
          </Box>
        )}

        {/* Tags Section */}
        {item.tags && item.tags.length > 0 && (
          <Flex flexWrap="wrap" gap={2} mb={2}>
            {item.tags.map((tag, index) => (
              <Badge
                key={index}
                px={3}
                py={1}
                bg={tagBg}
                color={tagColor}
                borderRadius="md"
                fontSize="sm"
                fontWeight="medium"
                _hover={{ 
                  bg: useColorModeValue('blue.100', 'blue.800'),
                  cursor: 'pointer' 
                }}
              >
                {tag}
              </Badge>
            ))}
          </Flex>
        )}
      </Box>

      {/* Action Section */}
      <Box className="action-buttons">
        <PostActions
          post={item}
          isDetail={false}
          currentUser={currentUser}
          onReactionChange={handleReactionChange}
          onFavoriteToggle={handleFavoriteToggle}
          onEditPost={handleEdit}
          onDeletePost={handleDelete}
          onReportPost={handleReport}
          isOwner={isOwner}
        />
      </Box>
    </Box>
  );
};

ForumCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string,
    _id: PropTypes.string,
    title: PropTypes.string.isRequired,
    content: PropTypes.string,
    author: PropTypes.shape({
      name: PropTypes.string,
      avatar: PropTypes.string
    }),
    createdAt: PropTypes.string,
    imgUrl: PropTypes.arrayOf(PropTypes.string),
    tags: PropTypes.arrayOf(PropTypes.string),
    category: PropTypes.string,
    categoryObj: PropTypes.object,
    reactions: PropTypes.object,
    userReaction: PropTypes.string,
    isFavorited: PropTypes.bool
  }).isRequired,
  type: PropTypes.oneOf(['ForumPost', 'Question', 'EventPost', 'FindLostPetPost']).isRequired,
  categories: PropTypes.array,
  onToggleLike: PropTypes.func,
  onToggleFavorite: PropTypes.func,
  formatDate: PropTypes.func,
  onClick: PropTypes.func,
  currentUser: PropTypes.object,
  isOwner: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onReport: PropTypes.func
};

export default memo(ForumCard);