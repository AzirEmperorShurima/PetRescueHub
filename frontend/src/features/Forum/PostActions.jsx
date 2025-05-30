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
  Button,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react';
import { FaComment, FaBookmark, FaRegBookmark, FaEllipsisV } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Reaction from '../../components/common/interactions/Reaction';
import ShareButton from '../../components/common/interactions/ShareButton';
import ActionMenu from '../../components/common/interactions/ActionMenu';
import apiService from '../../services/api.service';
import { useAuth } from '../../components/contexts/AuthContext';
import CommentModal from '../../components/common/interactions/CommentModal';
import { useInView } from '../../components/hooks/useInView';

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
  isLoading = false,
  isOwner = false
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
  const [isCommentModalOpen, setCommentModalOpen] = useState(false);
  const [selectedComments, setSelectedComments] = useState([]);
  const [hasFetchedReaction, setHasFetchedReaction] = useState(false);
  const [ref, inView] = useInView({ threshold: 0.2 });

  // Cập nhật local state khi post props thay đổi
  useEffect(() => {
    setLocalPost(post);
    setHasFetchedReaction(false); // Reset khi post thay đổi
  }, [post]);

  // Fetch user reaction khi component mount hoặc khi post ID thay đổi và chỉ khi inView
  useEffect(() => {
    if (
      inView &&
      !hasFetchedReaction &&
      (localPost.id || localPost._id) &&
      currentUser
    ) {
      const fetchUserReaction = async () => {
        try {
          const targetId = localPost.id || localPost._id;
          const response = await apiService.forum.reactions.getUserReaction('Post', targetId);
          if (response && response.data) {
            setLocalPost(prev => ({
              ...prev,
              userReaction: response.data.userReaction
            }));
          }
          setHasFetchedReaction(true);
        } catch (error) {
          console.error('Error fetching user reaction:', error);
        }
      };
      fetchUserReaction();
    }
  }, [inView, hasFetchedReaction, localPost.id, localPost._id, currentUser]);

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
      
      if (response && response.data) {
        setLocalPost(prev => ({
          ...prev,
          userReaction: response.data.userReaction || reactionType,
          reactions: response.data.reactions || updatedReactions
        }));
      }
  
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
      
      setLocalPost(prev => ({
        ...prev,
        isFavorited: previousFavorited
      }));
    } finally {
      setLoading(false);
    }
  };

  // Handle comment toggle
  const handleCommentToggle = () => {
    if (!isDetail) {
      handleOpenCommentModal(localPost);
    } else if (onToggleCommentSection) {
      onToggleCommentSection();
    } else {
      onToggle();
    }
  };

  const handleOpenCommentModal = async (post) => {
    if (!requireLogin()) return;
    
    setCommentModalOpen(true);
    try {
      const res = await apiService.forum.comments.getAll({ postId: post._id || post.id });
      setSelectedComments(res.data?.data || []);
    } catch (e) {
      console.error('Error fetching comments:', e);
      setSelectedComments([]);
    }
  };

  const handleCloseCommentModal = () => {
    setCommentModalOpen(false);
    setSelectedComments([]);
  };

  const handleModalCommentSubmit = async (commentText) => {
    if (!requireLogin()) return;

    try {
      await onCommentSubmit?.(commentText);
      handleOpenCommentModal(localPost);
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  // Handle report user action
  const handleReportUser = async () => {
    if (!requireLogin()) return;
    
    try {
      if (post?.author?._id) {
        await apiService.users.report(post.author._id);
        alert('Đã báo cáo người dùng thành công');
      }
    } catch (error) {
      console.error('Error reporting user:', error);
      alert('Có lỗi xảy ra khi báo cáo người dùng');
    }
  };

  return (
    <>
      {/* Action Section */}
      <Box px={isDetail ? 0 : 4} pb={1} borderTop="1px" borderColor={borderColor} pt={1}>
        <Flex justify="space-between" w="100%" align="center">
          <HStack spacing={4} ref={ref}>
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

            <Box 
              as="button"
              display="flex"
              alignItems="center"
              gap={1}
              p={2}
              borderRadius="md"
              transition="all 0.2s"
              _hover={{ bg: hoverBgColor }}
              onClick={handleCommentToggle}
            >
              <Icon as={FaComment} boxSize={4} color={textSecondary} />
              <Text fontSize="sm" color={textSecondary} fontWeight="medium">
                {comments.length || localPost.comments || 0}
              </Text>
            </Box>
            
            {isDetail && (
              <Box
                as="button"
                p={2}
                borderRadius="md"
                transition="all 0.2s"
                _hover={{ bg: hoverBgColor }}
              >
                <ShareButton url={window.location.href} title={localPost.title} />
              </Box>
            )}
          </HStack>

          <HStack spacing={2}>
            <Box
              as="button"
              p={2}
              borderRadius="md"
              transition="all 0.2s"
              _hover={{ bg: hoverBgColor }}
              onClick={handleFavoriteToggle}
              display="flex"
              alignItems="center"
            >
              <Icon 
                as={localPost.isFavorited ? FaBookmark : FaRegBookmark}
                boxSize={4}
                color={localPost.isFavorited ? 'blue.500' : textSecondary}
                transition="all 0.2s"
              />
            </Box>

            {/* More Options Button */}
            <ActionMenu
              isOwner={isOwner}
              onEdit={onEditPost}
              onDelete={onDeletePost}
              onReportPost={onReportPost}
              onReportUser={handleReportUser}
              size="sm"
              isDisabled={loading || isLoading}
            />
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
          </VStack>
        </SlideFade>
      )}

      {/* Comment Modal */}
      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={handleCloseCommentModal}
        post={post}
        comments={selectedComments}
        currentUser={user}
        onCommentSubmit={handleModalCommentSubmit}
        onCommentDelete={onCommentDelete}
        onCommentEdit={onCommentEdit}
        commentLoading={commentLoading}
      />
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
  isLoading: PropTypes.bool,
  isOwner: PropTypes.bool
};

export default PostActions;