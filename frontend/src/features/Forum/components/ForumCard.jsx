import React, { memo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Avatar,
  Text,
  Badge,
  IconButton,
  HStack,
  VStack,
  Flex,
  useColorModeValue,
  useTheme
} from '@chakra-ui/react';
import {
  FaEllipsisV
} from 'react-icons/fa';
import PropTypes from 'prop-types';
import PostSticker from './PostSticker';
import apiService from '../../../services/api.service';
import PostActions from '../PostActions';

const ForumCard = ({
  item,
  type,
  categories,
  onToggleLike,
  onToggleFavorite,
  formatDate,
  onClick,
  currentUser
}) => {
  const theme = useTheme();
  
  // Local state để quản lý item và loading
  const [localItem, setLocalItem] = useState(item);
  const [loading, setLoading] = useState(false);

  // Cập nhật local state khi item props thay đổi
  useEffect(() => {
    setLocalItem(item);
  }, [item]);

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const tagBg = useColorModeValue('blue.50', 'blue.900');
  const tagColor = useColorModeValue('blue.600', 'blue.200');
  const shadowColor = useColorModeValue('lg', 'dark-lg');

  const category = localItem.categoryObj || (categories && categories.find(cat => cat.id === localItem.category));

  const getDetailUrl = () => {
    const itemId = localItem.id || localItem._id;
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

  // Handler cho favorite
  const handleFavoriteToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (loading) return;
    
    const previousFavorited = localItem.isFavorited;
    
    try {
      setLoading(true);
      
      // Optimistic update
      setLocalItem(prev => ({
        ...prev,
        isFavorited: !prev.isFavorited
      }));
      
      // Gọi callback từ parent component
      if (onToggleFavorite) {
        const targetId = localItem.id || localItem._id;
        await onToggleFavorite(targetId);
      }
      
    } catch (error) {
      console.error('Error toggling favorite:', error);
      
      // Rollback nếu thất bại
      setLocalItem(prev => ({
        ...prev,
        isFavorited: previousFavorited
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      const itemId = localItem.id || localItem._id;
      onClick(itemId);
    }
  };

  // Callback cho PostActions
  const handleReactionChange = (reactionType, updatedReactions) => {
    if (onToggleLike) {
      onToggleLike(reactionType, updatedReactions);
    }
    
    setLocalItem(prev => ({
      ...prev,
      userReaction: reactionType,
      reactions: updatedReactions
    }));
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
      _hover={{ shadow: shadowColor }}
      onClick={onClick ? handleCardClick : undefined}
      opacity={loading ? 0.7 : 1}
    >
      <PostSticker type={type} />

      <Box p={2}>
        {/* Author Section */}
        <HStack mb={2} spacing={2}>
          <Avatar src={localItem.author?.avatar} name={localItem.author?.name} size="sm" />
          <VStack align="start" spacing={0}>
            <Text fontSize="sm" fontWeight="medium">{localItem.author?.name}</Text>
            <Text fontSize="xs" color={textSecondary}>
              {formatDate ? formatDate(localItem.createdAt) : new Date(localItem.createdAt).toLocaleDateString()}
            </Text>
          </VStack>
        </HStack>

        {/* Content Section */}
        <Box as={Link} to={getDetailUrl()} _hover={{ textDecoration: 'none' }}>
          <Text fontSize="25px" fontWeight="semibold" mb={1.5} lineHeight="shorter" _hover={{ color: 'blue.500' }}>
            {localItem.title}
          </Text>

          <Text fontSize="17px" color={textSecondary} mb={2} lineHeight="base">
            {localItem.content?.substring(0, 150)}{localItem.content?.length > 150 ? '...' : ''}
          </Text>
        </Box>

        {/* Image Section (iframe Google Drive) */}
        {localItem.imgUrl && localItem.imgUrl.length > 0 && localItem.imgUrl.map((url, index) => {
          const driveIdMatch = url.match(/[-\w]{25,}/);
          const driveId = driveIdMatch?.[0];
          return driveId ? (
            <Box key={index} mb={4}>
              <iframe
                src={`https://drive.google.com/file/d/${driveId}/preview`}
                width="90%"
                height="350px"
                style={{ border: 'none', borderRadius: '8px', paddingLeft: '10px' }}
                allow="autoplay"
                title={`Google Drive Image ${index + 1}`}
              />
            </Box>
          ) : null;
        })}

        {/* Tags Section */}
        {localItem.tags && localItem.tags.length > 0 && (
          <Flex flexWrap="wrap" gap={2} mb={0}>
            {localItem.tags.map((tag, index) => (
              <Badge
                key={index}
                px={3}
                py={1.5}
                bg={tagBg}
                color={tagColor}
                borderRadius="md"
                fontSize="sm"
                fontWeight="bold"
                _hover={{ bg: useColorModeValue('blue.100', 'blue.800'), cursor: 'pointer' }}
              >
                {tag}
              </Badge>
            ))}
          </Flex>
        )}
      </Box>

      {/* Action Section - Thay thế bằng PostActions */}
      <PostActions 
        post={localItem}
        currentUser={currentUser}
        onReactionChange={handleReactionChange}
        onFavoriteToggle={handleFavoriteToggle}
        isLoading={loading}
      />
    </Box>
  );
};

ForumCard.propTypes = {
  item: PropTypes.object.isRequired,
  type: PropTypes.oneOf(['ForumPost', 'Question', 'EventPost', 'FindLostPetPost']).isRequired,
  categories: PropTypes.array,
  onToggleLike: PropTypes.func,
  onToggleFavorite: PropTypes.func,
  formatDate: PropTypes.func,
  onClick: PropTypes.func,
  currentUser: PropTypes.object
};

export default memo(ForumCard);