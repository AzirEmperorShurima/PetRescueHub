import React from 'react';
import PropTypes from 'prop-types';
import {
  Flex,
  HStack,
  VStack,
  IconButton,
  Badge,
  Heading,
  useColorModeValue
} from '@chakra-ui/react';
import { FaArrowLeft } from 'react-icons/fa';
import PostActions from '../PostActions';

const PostDetailHeader = ({
  post,
  config,
  onBack,
  currentUser,
  onReactionChange,
  onFavoriteToggle,
  onEditPost,
  onDeletePost,
  onReportPost
}) => {
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700');
  const isOwner = currentUser && (currentUser.id === post.authorId || currentUser._id === post.authorId);

  return (
    <Flex justify="space-between" align="center" flexWrap="wrap">
      <HStack spacing={4} flex={1}>
        <IconButton
          icon={<FaArrowLeft />}
          onClick={onBack}
          variant="ghost"
          aria-label={`Quay lại ${config.title.toLowerCase()}`}
          size="lg"
          colorScheme="gray"
          _hover={{ bg: hoverBgColor }}
        />
        <VStack align="start" spacing={1} flex={1}>
          <HStack spacing={2}>
            <Badge colorScheme={config.badgeColor} fontSize="sm" px={2} py={1} borderRadius="md">
              {config.title}
            </Badge>
            {post.categoryObj && (
              <Badge colorScheme="purple" fontSize="sm" px={2} py={1} borderRadius="md">
                {post.categoryObj.name}
              </Badge>
            )}
          </HStack>
          <Heading size={{ base: 'lg', md: 'xl' }} wordBreak="break-word" lineHeight="shorter">
            {post.title}
          </Heading>
        </VStack>
      </HStack>
      <PostActions
        post={post}
        currentUser={currentUser}
        onReactionChange={onReactionChange}
        onFavoriteToggle={onFavoriteToggle}
        onEditPost={onEditPost}
        onDeletePost={onDeletePost}
        onReportPost={onReportPost}
        isOwner={isOwner}
      />
    </Flex>
  );
};

PostDetailHeader.propTypes = {
  post: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  onReactionChange: PropTypes.func,
  onFavoriteToggle: PropTypes.func,
  onEditPost: PropTypes.func,
  onDeletePost: PropTypes.func,
  onReportPost: PropTypes.func
};

export default PostDetailHeader; 