import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Avatar,
  Text,
  Badge,
  HStack,
  VStack,
  Flex,
  Button,
  Heading,
  Divider,
  Skeleton,
  SkeletonText,
  Alert,
  AlertIcon,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  IconButton,
  useToast,
  Spinner,
  Center
} from '@chakra-ui/react';
import { FaArrowLeft, FaEdit, FaTrash, FaFlag, FaShare } from 'react-icons/fa';
import PropTypes from 'prop-types';
import PostSticker from './components/PostSticker';
import PostActions from './PostActions';
import { useAuth } from '../../components/contexts/AuthContext';
import apiService from '../../services/api.service';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  // Color mode values
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const tagBg = useColorModeValue('blue.50', 'blue.900');
  const tagColor = useColorModeValue('blue.600', 'blue.200');
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const headerBg = useColorModeValue('white', 'gray.800');

  // State management
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  // Determine post type from URL
  const getPostTypeFromUrl = useCallback(() => {
    const path = window.location.pathname;
    if (path.includes('/forum/post/')) return 'ForumPost';
    if (path.includes('/forum/question/')) return 'Question';
    if (path.includes('/forum/event/')) return 'EventPost';
    if (path.includes('/forum/findLostPet/')) return 'FindLostPetPost';
    return 'ForumPost';
  }, []);

  const postType = getPostTypeFromUrl();

  // Fetch post data
  const fetchPost = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.forum.posts.getById(id);
      if (response?.data) {
        setPost(response.data);
      } else {
        throw new Error('Post not found');
      }
    } catch (err) {
      console.error('Error fetching post:', err);
      setError('Không thể tải bài viết. Vui lòng thử lại sau.');
      toast({
        title: 'Lỗi',
        description: 'Không thể tải bài viết',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  // Fetch comments
  const fetchComments = useCallback(async () => {
    if (!id) return;
    
    try {
      setCommentsLoading(true);
      const response = await apiService.forum.comments.getByPost(id);
      if (response?.data) {
        setComments(response.data);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setCommentsLoading(false);
    }
  }, [id]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await apiService.forum.categories.getAll();
      if (response?.data) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  // Effects
  useEffect(() => {
    fetchPost();
    fetchComments();
    fetchCategories();
  }, [fetchPost, fetchComments, fetchCategories]);

  // Handler functions
  const handleGoBack = () => {
    navigate(-1);
  };

  const handleReactionChange = async (reactionType, updatedReactions) => {
    if (!post) return;
    
    setPost(prev => ({
      ...prev,
      userReaction: reactionType,
      reactions: updatedReactions
    }));
  };

  const handleFavoriteToggle = async () => {
    if (!post || !user) return;
    
    try {
      setActionLoading(true);
      const targetId = post.id || post._id;
      
      const response = await apiService.forum.favorites.toggle(targetId);
      
      setPost(prev => ({
        ...prev,
        isFavorited: !prev.isFavorited
      }));

      toast({
        title: post.isFavorited ? 'Đã bỏ yêu thích' : 'Đã thêm vào yêu thích',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Error toggling favorite:', err);
      toast({
        title: 'Lỗi',
        description: 'Không thể thực hiện thao tác',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCommentSubmit = async (commentText) => {
    if (!post || !user || !commentText.trim()) return;
    
    try {
      const targetId = post.id || post._id;
      const response = await apiService.forum.comments.create({
        postId: targetId,
        content: commentText.trim()
      });
      
      if (response?.data) {
        setComments(prev => [...prev, response.data]);
        toast({
          title: 'Đã thêm bình luận',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      toast({
        title: 'Lỗi',
        description: 'Không thể thêm bình luận',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      await apiService.forum.comments.delete(commentId);
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      toast({
        title: 'Đã xóa bình luận',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Error deleting comment:', err);
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa bình luận',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditPost = () => {
    if (!post) return;
    const targetId = post.id || post._id;
    navigate(`/forum/edit/${targetId}`);
  };

  const handleDeletePost = async () => {
    if (!post) return;
    
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa bài viết này?');
    if (!confirmDelete) return;
    
    try {
      const targetId = post.id || post._id;
      await apiService.forum.posts.delete(targetId);
      
      toast({
        title: 'Đã xóa bài viết',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      
      navigate('/forum');
    } catch (err) {
      console.error('Error deleting post:', err);
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa bài viết',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleReportPost = async () => {
    if (!post) return;
    
    try {
      const targetId = post.id || post._id;
      await apiService.forum.posts.report(targetId);
      
      toast({
        title: 'Đã báo cáo bài viết',
        description: 'Chúng tôi sẽ xem xét báo cáo của bạn',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Error reporting post:', err);
      toast({
        title: 'Lỗi',
        description: 'Không thể báo cáo bài viết',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Không rõ';
    }
  };

  const getPostTypeLabel = (type) => {
    const labels = {
      'ForumPost': 'Bài viết',
      'Question': 'Câu hỏi',
      'EventPost': 'Sự kiện',
      'FindLostPetPost': 'Tìm thú cưng'
    };
    return labels[type] || 'Bài viết';
  };

  const getBreadcrumbPath = (type) => {
    const paths = {
      'ForumPost': '/forum',
      'Question': '/forum?tab=1',
      'EventPost': '/forum?tab=3',
      'FindLostPetPost': '/forum?tab=2'
    };
    return paths[type] || '/forum';
  };

  const category = post?.categoryObj || (categories && categories.find(cat => cat.id === post?.category));

  // Loading state
  if (loading) {
    return (
      <Box bg={bgColor} minH="100vh">
        <Container maxW="container.lg" py={6}>
          <VStack spacing={6} align="stretch">
            <Skeleton height="40px" />
            <Box bg={cardBg} borderRadius="lg" p={6}>
              <HStack mb={4}>
                <Skeleton height="40px" width="40px" borderRadius="full" />
                <VStack align="start" spacing={1}>
                  <Skeleton height="20px" width="120px" />
                  <Skeleton height="16px" width="80px" />
                </VStack>
              </HStack>
              <SkeletonText mt={4} noOfLines={4} spacing={4} skeletonHeight={4} />
              <Skeleton height="300px" mt={6} borderRadius="md" />
            </Box>
          </VStack>
        </Container>
      </Box>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <Box bg={bgColor} minH="100vh">
        <Container maxW="container.lg" py={6}>
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <VStack align="start" spacing={2}>
              <Text fontWeight="semibold">Không thể tải bài viết</Text>
              <Text>{error || 'Bài viết không tồn tại hoặc đã bị xóa'}</Text>
              <Button size="sm" colorScheme="blue" onClick={handleGoBack}>
                Quay lại
              </Button>
            </VStack>
          </Alert>
        </Container>
      </Box>
    );
  }

  const isOwner = user && (user._id === post.author?._id || user.id === post.author?.id);

  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW="container.lg" py={6}>
        <VStack spacing={6} align="stretch">
          {/* Header with navigation */}
          <Box bg={headerBg} borderRadius="lg" p={4} shadow="sm">
            <HStack justify="space-between" align="center">
              <HStack spacing={4}>
                <IconButton
                  icon={<FaArrowLeft />}
                  onClick={handleGoBack}
                  variant="ghost"
                  size="sm"
                  aria-label="Quay lại"
                />
                <Breadcrumb separator="›">
                  <BreadcrumbItem>
                    <BreadcrumbLink as={Link} to={getBreadcrumbPath(postType)}>
                      Diễn đàn
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink>{getPostTypeLabel(postType)}</BreadcrumbLink>
                  </BreadcrumbItem>
                </Breadcrumb>
              </HStack>
            </HStack>
          </Box>

          {/* Main post content */}
          <Box
            bg={cardBg}
            borderRadius="lg"
            shadow="md"
            overflow="hidden"
            position="relative"
            transition="all 0.2s ease-in-out"
          >
            <PostSticker type={postType} />

            <Box p={6}>
              {/* Author section */}
              <HStack mb={6} spacing={3}>
                <Avatar 
                  src={post.author?.avatar} 
                  name={post.author?.fullname || post.author?.username} 
                  size="md" 
                />
                <VStack align="start" spacing={1}>
                  <Text fontSize="lg" fontWeight="semibold">
                    {post.author?.fullname || post.author?.username || 'Người dùng ẩn danh'}
                  </Text>
                  <HStack spacing={2}>
                    <Text fontSize="sm" color={textSecondary}>
                      {formatDate(post.createdAt)}
                    </Text>
                    {category && (
                      <>
                        <Text color={textSecondary}>•</Text>
                        <Badge colorScheme="blue" fontSize="xs">
                          {category.name}
                        </Badge>
                      </>
                    )}
                  </HStack>
                </VStack>
              </HStack>

              {/* Title */}
              <Heading
                as="h1"
                size="xl"
                mb={4}
                lineHeight="shorter"
                color={useColorModeValue('gray.800', 'white')}
              >
                {post.title}
              </Heading>

              {/* Content */}
              <Text
                fontSize="lg"
                lineHeight="tall"
                mb={6}
                color={useColorModeValue('gray.700', 'gray.300')}
                whiteSpace="pre-wrap"
              >
                {post.content}
              </Text>

              {/* Images */}
              {post.imgUrl && post.imgUrl.length > 0 && (
                <VStack spacing={4} mb={6} align="stretch">
                  {post.imgUrl.map((url, index) => {
                    const driveId = url.match(/[-\w]{25,}/)?.[0];
                    return driveId ? (
                      <Box key={index} borderRadius="lg" overflow="hidden" shadow="sm">
                        <iframe
                          src={`https://drive.google.com/file/d/${driveId}/preview`}
                          width="100%"
                          height="400px"
                          style={{ border: 'none' }}
                          allow="autoplay"
                          title={`Hình ảnh ${index + 1}`}
                        />
                      </Box>
                    ) : (
                      <Box
                        key={index}
                        as="img"
                        src={url}
                        alt={`Hình ảnh ${index + 1}`}
                        maxH="500px"
                        w="100%"
                        objectFit="contain"
                        borderRadius="lg"
                        shadow="sm"
                      />
                    );
                  })}
                </VStack>
              )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <Flex flexWrap="wrap" gap={2} mb={6}>
                  {post.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      px={3}
                      py={1}
                      bg={tagBg}
                      color={tagColor}
                      borderRadius="full"
                      fontSize="sm"
                      fontWeight="medium"
                      cursor="pointer"
                      transition="all 0.2s"
                      _hover={{
                        bg: useColorModeValue('blue.100', 'blue.800'),
                        transform: 'translateY(-1px)'
                      }}
                    >
                      #{tag}
                    </Badge>
                  ))}
                </Flex>
              )}
            </Box>

            <Divider />

            {/* Post Actions */}
            <PostActions
              post={post}
              currentUser={user}
              isDetail={true}
              comments={comments}
              commentLoading={commentsLoading}
              isLoading={actionLoading}
              isOwner={isOwner}
              onReactionChange={handleReactionChange}
              onFavoriteToggle={handleFavoriteToggle}
              onCommentSubmit={handleCommentSubmit}
              onCommentDelete={handleCommentDelete}
              onEditPost={handleEditPost}
              onDeletePost={handleDeletePost}
              onReportPost={handleReportPost}
            />
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default PostDetail;