import React, { memo } from 'react';
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
  FaComment,
  FaEllipsisV,
  FaBookmark,
  FaRegBookmark
} from 'react-icons/fa';
import PropTypes from 'prop-types';
import PostSticker from './PostSticker';
import Reaction from '../../../components/common/interactions/Reaction';

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

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const tagBg = useColorModeValue('blue.50', 'blue.900');
  const tagColor = useColorModeValue('blue.600', 'blue.200');
  const shadowColor = useColorModeValue('lg', 'dark-lg');

  const category = item.categoryObj || (categories && categories.find(cat => cat.id === item.category));

  const getDetailUrl = () => {
    switch (type) {
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
      onClick={onClick ? () => onClick(item.id) : undefined}
    >
    <PostSticker type={type} />

      <Box p={2}>
        {/* Author Section */}
        <HStack mb={4} spacing={3}>
          <Avatar src={item.author?.avatar} name={item.author?.name} size="sm" />
          <VStack align="start" spacing={0}>
            <Text fontSize="sm" fontWeight="medium">{item.author?.name}</Text>
            <Text fontSize="xs" color={textSecondary}>
              {formatDate ? formatDate(item.createdAt) : new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </VStack>
        </HStack>

        {/* Content Section */}
        <Box as={Link} to={getDetailUrl()} _hover={{ textDecoration: 'none' }}>
          <Text fontSize="25px" fontWeight="semibold" mb={1.5} lineHeight="shorter" _hover={{ color: 'blue.500' }}>
            {item.title}
          </Text>

          <Text fontSize="18px" color={textSecondary} mb={2} lineHeight="base">
            {item.content?.substring(0, 150)}{item.content?.length > 150 ? '...' : ''}
          </Text>
        </Box>

        {/* Image Section (iframe Google Drive) */}
        {item.imgUrl && item.imgUrl.length > 0 && item.imgUrl.map((url, index) => {
          const driveIdMatch = url.match(/[-\w]{25,}/);
          const driveId = driveIdMatch?.[0];
          return driveId ? (
            <Box key={index} mb={4}>
              <iframe
                src={`https://drive.google.com/file/d/${driveId}/preview`}
                width="90%"
                height="350px"
                style={{ border: 'none', borderRadius: '8px' }}
                allow="autoplay"
                title={`Google Drive Image ${index + 1}`}
                padding left="10px"
              />
            </Box>
          ) : null;
        })}

        {/* Tags Section */}
        {item.tags && item.tags.length > 0 && (
          <Flex flexWrap="wrap" gap={2} mb={0}>
            {item.tags.map((tag, index) => (
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

      {/* Action Section */}
      <Box px={4} pb={1} borderTop="1px" borderColor={borderColor} pt={1}>
        <Flex justify="space-between" w="100%" align="center">
          <HStack spacing={4}>
            <Reaction
              reactions={item.reactions}
              userReaction={item.userReaction}
              onReact={(type) => onToggleLike && onToggleLike(item.id, type)}
              size="md"
              variant="emoji"
              showCount={true}
            />

            <HStack spacing={2}>
              <IconButton
                aria-label="comments"
                icon={<FaComment />}
                size="md"
                variant="ghost"
                colorScheme="gray"
              />
              <Text fontSize="sm" color={textSecondary}>
                {item.comments || 0}
              </Text>
            </HStack>
          </HStack>

          <HStack spacing={3}>
             {/* Favorite Button */}
            <IconButton
              aria-label="favorite"
              icon={item.isFavorited ? <FaBookmark /> : <FaRegBookmark />}
              size="md"
              variant="ghost"
              colorScheme={item.isFavorited ? 'blue' : 'gray'}
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
              size="md"
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