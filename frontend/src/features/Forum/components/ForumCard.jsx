import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Avatar, 
  Text, 
  Image,
  Badge,
  IconButton,
  HStack,
  VStack,
  Flex,
  useColorModeValue,
  useTheme
} from '@chakra-ui/react';
import { 
  FaHeart, 
  FaRegHeart,
  FaComment,
  FaEye,
  FaEllipsisV,
  FaBookmark,
  FaRegBookmark
} from 'react-icons/fa';
import PropTypes from 'prop-types';
import PostSticker from './PostSticker';

const ForumCard = ({ 
  item, 
  type, 
  categories, 
  onToggleLike, 
  onToggleFavorite, 
  formatDate,
  onClick
}) => {
  const theme = useTheme();
  
  // Color mode values
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const tagBg = useColorModeValue('blue.50', 'blue.900');
  const tagColor = useColorModeValue('blue.600', 'blue.200');
  const shadowColor = useColorModeValue('lg', 'dark-lg');
  
  // Sử dụng categories được truyền vào hoặc sử dụng categoryObj từ item
  const category = item.categoryObj || (categories && categories.find(cat => cat.id === item.category));
  
  const getDetailUrl = () => {
    switch(type) {
      case 'post':
        return `/forum/post/${item.id}`;
      case 'question':
        return `/forum/question/${item.id}`;
      case 'event':
        return `/event/${item.id}`;
      default:
        return '#';
    }
  };

  return (
    <Box 
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      shadow="md"
      mb={6}
      position="relative"
      transition="all 0.2s ease-in-out"
      cursor={onClick ? "pointer" : "default"}
      _hover={{
        transform: 'translateY(-5px)',
        shadow: shadowColor,
      }}
      onClick={onClick ? () => onClick(item.id) : undefined}
    >
      <PostSticker type={type} />
      
      <Box p={4}>
        {/* Author Section */}
        <HStack mb={4} spacing={3}>
          <Avatar 
            src={item.author?.avatar} 
            name={item.author?.name}
            size="sm"
          />
          <VStack align="start" spacing={0}>
            <Text fontSize="sm" fontWeight="medium">
              {item.author?.name}
            </Text>
            <Text fontSize="xs" color={textSecondary}>
              {formatDate ? formatDate(item.createdAt) : new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </VStack>
        </HStack>

        {/* Content Section */}
        <Box as={Link} to={getDetailUrl()} _hover={{ textDecoration: 'none' }}>
          <Text 
            fontSize="lg" 
            fontWeight="semibold" 
            mb={3}
            lineHeight="shorter"
            _hover={{ color: 'blue.500' }}
          >
            {item.title}
          </Text>
          
          <Text 
            fontSize="sm" 
            color={textSecondary} 
            mb={4}
            lineHeight="base"
          >
            {item.content?.substring(0, 150)}
            {item.content?.length > 150 ? '...' : ''}
          </Text>
        </Box>

        {/* Image Section */}
        {item.image && (
          <Image
            src={item.image}
            alt={item.title}
            w="100%"
            borderRadius="md"
            maxH="450px"
            objectFit="cover"
            mb={4}
          />
        )}

        {/* Tags Section */}
        {item.tags && item.tags.length > 0 && (
          <Flex flexWrap="wrap" gap={2} mb={4}>
            {item.tags.map((tag, index) => (
              <Badge
                key={index}
                px={2}
                py={1}
                bg={tagBg}
                color={tagColor}
                borderRadius="md"
                fontSize="xs"
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

      {/* Actions Section */}
      <Box 
        px={4} 
        pb={4}
        borderTop="1px"
        borderColor={borderColor}
        pt={3}
      >
        <Flex justify="space-between" w="100%">
          <HStack spacing={1}>
            {/* Like Button */}
            <IconButton
              aria-label="like"
              icon={item.isLiked ? <FaHeart /> : <FaRegHeart />}
              size="sm"
              variant="ghost"
              colorScheme={item.isLiked ? "red" : "gray"}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleLike && onToggleLike(item.id);
              }}
              rightIcon={
                <Text fontSize="xs" ml={1}>
                  {item.likes || 0}
                </Text>
              }
            />

            {/* Comment Button */}
            <IconButton
              aria-label="comments"
              icon={<FaComment />}
              size="sm"
              variant="ghost"
              colorScheme="gray"
              rightIcon={
                <Text fontSize="xs" ml={1}>
                  {item.comments || 0}
                </Text>
              }
            />

            {/* Views Button */}
            <IconButton
              aria-label="views"
              icon={<FaEye />}
              size="sm"
              variant="ghost"
              colorScheme="gray"
              rightIcon={
                <Text fontSize="xs" ml={1}>
                  {item.views || 0}
                </Text>
              }
            />
          </HStack>

          <HStack spacing={1}>
            {/* Favorite Button */}
            <IconButton
              aria-label="favorite"
              icon={item.isFavorited ? <FaBookmark /> : <FaRegBookmark />}
              size="sm"
              variant="ghost"
              colorScheme={item.isFavorited ? "blue" : "gray"}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite && onToggleFavorite(item.id);
              }}
            />

            {/* More Options Button */}
            <IconButton
              aria-label="more options"
              icon={<FaEllipsisV />}
              size="sm"
              variant="ghost"
              colorScheme="gray"
            />
          </HStack>
        </Flex>
      </Box>
    </Box>
  );
};

ForumCard.propTypes = {
  item: PropTypes.object.isRequired,
  type: PropTypes.oneOf(['post', 'question', 'event']).isRequired,
  categories: PropTypes.array,
  onToggleLike: PropTypes.func,
  onToggleFavorite: PropTypes.func,
  formatDate: PropTypes.func,
  onClick: PropTypes.func
};

export default memo(ForumCard);