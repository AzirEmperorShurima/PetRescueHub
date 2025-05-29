import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Text,
  Divider,
  useColorModeValue,
  useDisclosure,
  SlideFade,
  VStack,
  Heading,
  Spinner,
  Alert,
  AlertIcon,
  Button
} from '@chakra-ui/react';
import { FaComment, FaBookmark, FaRegBookmark, FaEllipsisV } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Reaction from '../../components/common/interactions/Reaction';
import ShareButton from '../../components/common/interactions/ShareButton';
import CommentForm from '../../components/common/interactions/CommentForm';
import CommentList from '../../components/common/interactions/CommentList';
import apiService from '../../services/api.service';
import { useAuth } from '../../components/contexts/AuthContext';

const PostActions = ({
  post,
  isDetail = false,
  currentUser,
  onReactionChange,
  onFavoriteToggle,
  onCommentSubmit,
  onCommentDelete,
  onCommentEdit,
  onEditPost,
  onDeletePost,
  onReportPost,
  comments = [],
  commentLoading = false,
  showCommentSection = false,
  onToggleCommentSection,
  isLoading = false
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Định nghĩa các hàm xử lý authentication
  const requireLogin = () => {
    if (!user) {
      goToLogin();
      return false;
    }
    return true;
  };
  
  const goToLogin = () => {
    const currentPath = window.location.pathname;
    navigate('/auth/login', { state: { returnUrl: currentPath } });
  };
  
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: showCommentSection });
  
  // Color mode values
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700');

  // Local state
  const [localPost, setLocalPost] = useState(post);
  const [loading, setLoading] = useState(false);

  // Cập nhật local state khi post props thay đổi
  useEffect(() => {
    setLocalPost(post);
  }, [post]);

  // Fetch user reaction khi component mount hoặc khi post ID thay đổi
  useEffect(() => {
    const fetchUserReaction = async () => {
      try {
        // Chỉ gọi API nếu có targetId và user đã đăng nhập
        if ((localPost.id || localPost._id) && currentUser) {
          const targetId = localPost.id || localPost._id;
          console.log('Fetching user reaction for:', targetId);
          
          const response = await apiService.forum.reactions.getUserReaction('Post', targetId);
          if (response && response.data) {
            console.log('User reaction response:', response.data);
            // Cập nhật local state với userReaction từ API
            setLocalPost(prev => ({
              ...prev,
              userReaction: response.data.userReaction
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching user reaction:', error);
        // Không cần làm gì nếu không fetch được user reaction
      }
    };

    fetchUserReaction();
  }, [localPost.id, localPost._id, currentUser]);

  // Handle reaction change
  const handleReaction = async (reactionType) => {
    if (!requireLogin()) {
      return;
    }

    const previousReaction = localPost.userReaction;
    const previousReactions = { ...localPost.reactions };
  
    try {
      setLoading(true);
      
      const updatedReactions = { ...localPost.reactions };
      if (reactionType === null) {
        if (previousReaction && updatedReactions[previousReaction]) {
          updatedReactions[previousReaction] -= 1;
        }
      } else {
        if (previousReaction && updatedReactions[previousReaction]) {
          updatedReactions[previousReaction] -= 1;
        }
        updatedReactions[reactionType] = (updatedReactions[reactionType] || 0) + 1;
      }
  
      // Optimistic UI Update
      setLocalPost({
        ...localPost,
        userReaction: reactionType,
        reactions: updatedReactions,
      });
  
      // Gọi API để cập nhật reaction
      const targetId = localPost.id || localPost._id;
      const response = await apiService.forum.reactions.addOrUpdate({
        targetId: targetId,
        targetType: 'Post',
        reactionType: reactionType
      });
      
      // Cập nhật với data từ server nếu có
      if (response && response.data) {
        setLocalPost(prev => ({
          ...prev,
          userReaction: response.data.userReaction || reactionType,
          reactions: response.data.reactions || updatedReactions
        }));
      }
  
      // Callback để parent component cập nhật state
      if (onReactionChange) {
        onReactionChange(reactionType, updatedReactions);
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
      
      // Rollback optimistic update
      setLocalPost({
        ...localPost,
        userReaction: previousReaction,
        reactions: previousReactions,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle favorite toggle
  const handleFavoriteToggle = async () => {
    if (!requireLogin()) {
      return;
    }

    const previousFavorited = localPost.isFavorited;
    
    setLoading(true);
    setLocalPost({
      ...localPost,
      isFavorited: !previousFavorited
    });

    try {
      if (onFavoriteToggle) {
        await onFavoriteToggle();
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      
      // Rollback nếu thất bại
      setLocalPost(prev => ({
        ...prev,
        isFavorited: previousFavorited
      }));
    } finally {
      setLoading(false);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (commentText) => {
    if (!requireLogin()) {
      return;
    }

    if (!commentText.trim()) return;

    try {
      if (onCommentSubmit) {
        await onCommentSubmit(commentText);
      }
      
      if (!isOpen && onToggleCommentSection) {
        onToggleCommentSection();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Handle comment toggle
  const handleCommentToggle = () => {
    if (onToggleCommentSection) {
      onToggleCommentSection();
    } else {
      onToggle();
    }
  };

  // Handle post actions
  const handleActionClick = (action) => {
    switch (action) {
      case 'edit':
        if (onEditPost) onEditPost();
        break;
      case 'delete':
        if (onDeletePost) onDeletePost();
        break;
      case 'report':
        if (onReportPost) onReportPost();
        break;
      default:
        break;
    }
  };

  const isOwner = currentUser && (currentUser.id === localPost.authorId || currentUser._id === localPost.authorId);

  return (
    <>
      {/* Action Section */}
      <Box px={isDetail ? 0 : 4} pb={1} borderTop="1px" borderColor={borderColor} pt={1}>
        <Flex justify="space-between" w="100%" align="center">
          <HStack spacing={4}>
            <Reaction
              targetId={localPost.id || localPost._id}
              targetType="Post"
              reactions={localPost.reactions || {}}
              userReaction={localPost.userReaction}
              onReact={handleReaction}
              size="md"
              variant="emoji"
              showCount={true}
              isLoading={loading || isLoading}
            />

            <HStack spacing={2}>
              <IconButton
                aria-label="comments"
                icon={<FaComment />}
                size="md"
                variant="ghost"
                colorScheme="gray"
                onClick={handleCommentToggle}
                _hover={{ bg: hoverBgColor }}
              />
              <Text fontSize="sm" color={textSecondary}>
                {comments.length || localPost.comments || 0}
              </Text>
            </HStack>
            
            {isDetail && <ShareButton url={window.location.href} title={localPost.title} />}
          </HStack>

          <HStack spacing={3}>
            {/* Favorite Button */}
            <IconButton
              aria-label="favorite"
              icon={localPost.isFavorited ? <FaBookmark /> : <FaRegBookmark />}
              size="md"
              variant="ghost"
              colorScheme={localPost.isFavorited ? 'blue' : 'gray'}
              onClick={handleFavoriteToggle}
              isLoading={loading || isLoading}
            />

            {/* More Options Button */}
            {(isOwner || (!isOwner && onReportPost)) && (
              <IconButton
                aria-label="more options"
                icon={<FaEllipsisV />}
                size="md"
                variant="ghost"
                colorScheme="gray"
                onClick={() => {
                  const actions = [];
                  if (isOwner && onEditPost) actions.push({ label: 'Chỉnh sửa', action: 'edit' });
                  if (isOwner && onDeletePost) actions.push({ label: 'Xóa', action: 'delete' });
                  if (!isOwner && onReportPost) actions.push({ label: 'Báo cáo', action: 'report' });
                  
                  // Hiển thị menu với các action tương ứng
                  // Đây là phần giả định, bạn cần triển khai menu thực tế
                  console.log('Actions:', actions);
                }}
              />
            )}
          </HStack>
        </Flex>
      </Box>

      {/* Comments Section - Chỉ hiển thị trong chế độ chi tiết */}
      {isDetail && (
        <SlideFade in={isOpen} offsetY="20px">
          <VStack align="stretch" spacing={4} mt={4}>
            <Flex justify="space-between" align="center">
              <Heading size="md">Bình luận ({comments.length})</Heading>
              {commentLoading && <Spinner size="sm" color="blue.500" />}
            </Flex>
            {currentUser ? (
              <CommentForm onSubmit={handleCommentSubmit} userAvatar={currentUser.avatar} />
            ) : (
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <VStack align="start" spacing={2}>
                  <Text>Đăng nhập để bình luận</Text>
                  <Button size="sm" colorScheme="blue" onClick={goToLogin}>
                    Đăng nhập
                  </Button>
                </VStack>
              </Alert>
            )}
            <CommentList
              comments={comments}
              currentUserId={currentUser?.id || currentUser?._id}
              onDelete={onCommentDelete}
              onEdit={onCommentEdit}
              loading={commentLoading}
            />
          </VStack>
        </SlideFade>
      )}
    </>
  );
};

// PropTypes không thay đổi
PostActions.propTypes = {
  post: PropTypes.object.isRequired,
  isDetail: PropTypes.bool,
  currentUser: PropTypes.object,
  onReactionChange: PropTypes.func,
  onFavoriteToggle: PropTypes.func,
  onCommentSubmit: PropTypes.func,
  onCommentDelete: PropTypes.func,
  onCommentEdit: PropTypes.func,
  onEditPost: PropTypes.func,
  onDeletePost: PropTypes.func,
  onReportPost: PropTypes.func,
  comments: PropTypes.array,
  commentLoading: PropTypes.bool,
  showCommentSection: PropTypes.bool,
  onToggleCommentSection: PropTypes.func,
  isLoading: PropTypes.bool
};

export default PostActions;