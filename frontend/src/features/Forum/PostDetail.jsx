import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Card,
  CardBody,
  Heading,
  Text,
  IconButton,
  Button,
  Avatar,
  HStack,
  VStack,
  Divider,
  Box,
  Image,
  Flex,
  useColorModeValue,
  ChakraProvider,
  Spinner,
  Alert,
  AlertIcon,
  Tag,
  TagLabel,
  Wrap,
  WrapItem,
  Badge,
  useDisclosure,
  SlideFade,
  Tooltip,
} from '@chakra-ui/react';
import { FaArrowLeft, FaRegCalendarAlt, FaComment, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { useAuth } from '../../components/contexts/AuthContext';
import { motion } from 'framer-motion';
import Reaction from '../../components/common/interactions/Reaction';
import CommentForm from '../../components/common/interactions/CommentForm';
import CommentList from '../../components/common/interactions/CommentList';
import ShareButton from '../../components/common/interactions/ShareButton';
import ScrollToTopButton from '../../components/button/ScrollToTopButton';
import PostSticker from './components/PostSticker';
import { useForum } from '../../components/hooks/useForum';
import apiService from '../../services/api.service';
import api from '../../utils/axios';

const MotionBox = motion(Box);

const postTypeConfig = {
  ForumPost: {
    title: 'Bài viết',
    gradient: 'linear(to-r, blue.400, blue.600)',
    badgeColor: 'blue',
    backPath: '/forum',
    icon: '📝',
  },
  Question: {
    title: 'Câu hỏi',
    gradient: 'linear(to-r, orange.400, orange.600)',
    badgeColor: 'orange',
    backPath: '/forum',
    icon: '❓',
  },
  EventPost: {
    title: 'Sự kiện',
    gradient: 'linear(to-r, green.400, green.600)',
    badgeColor: 'green',
    backPath: '/forum',
    icon: '📅',
  },
  FindLostPetPost: {
    title: 'Tìm thú cưng',
    gradient: 'linear(to-r, red.400, red.600)',
    badgeColor: 'red',
    backPath: '/forum',
    icon: '🐾',
  },
};

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: false });
  const commentSectionRef = useRef(null);
  const { formatDate } = useForum();

  // State management
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700');
  const tagBg = useColorModeValue('blue.50', 'blue.900');
  const tagColor = useColorModeValue('blue.600', 'blue.200');
  const shadowColor = useColorModeValue('lg', 'dark-lg');

  // Fetch post details
  useEffect(() => {
    const fetchPostDetails = async () => {
      if (!id) {
        setError('ID bài viết không hợp lệ');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await apiService.forum.posts.getById(id);
        if (response && response.data) {
          const postData = response.data;
          setPost(postData);
          setIsFavorited(postData.isFavorited || false);
          if (postData.comments) {
            setComments(postData.comments);
          } else {
            fetchComments(id);
          }
        } else {
          throw new Error(response?.message || 'Không tìm thấy bài viết');
        }
      } catch (error) {
        console.error('Error fetching post details:', error);
        setError(error.message || 'Không thể tải bài viết. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [id]);

  // Fetch comments separately
  const fetchComments = async (postId) => {
    try {
      setCommentLoading(true);
      const response = await apiService.forum.comments.getAll({ postId });
      if (response && response.data) {
        setComments(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  // Handle reaction
  const handleReaction = async (reactionType) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const previousReaction = post.userReaction;
    const previousReactions = { ...post.reactions };

    try {
      const updatedReactions = { ...post.reactions };
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

      setPost({
        ...post,
        userReaction: reactionType,
        reactions: updatedReactions,
      });

      await apiService.forum.reactions.addOrUpdate({
        targetId: post._id,
        targetType: 'Post',
        reactionType: reactionType === null ? previousReaction : reactionType,
      });
    } catch (error) {
      console.error('Error handling reaction:', error);
      setPost({
        ...post,
        userReaction: previousReaction,
        reactions: previousReactions,
      });
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (commentText) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!commentText.trim()) return;

    try {
      const response = await apiService.forum.comments.create({
        postId: post._id,
        content: commentText,
      });
      if (response && response.data) {
        const newComment = response.data;
        setComments([newComment, ...comments]);
        onToggle();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Handle comment deletion
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await apiService.forum.comments.delete(commentId);
      if (response && response.status === 200) {
        setComments(comments.filter((comment) => comment._id !== commentId));
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  // Handle comment editing
  const handleEditComment = async (commentId, newContent) => {
    try {
      const response = await apiService.forum.comments.update(commentId, {
        content: newContent,
      });
      if (response && response.data) {
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? { ...comment, content: newContent, isEdited: true }
              : comment
          )
        );
      }
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };

  // Handle post actions
  const handleEditPost = () => {
    navigate(`/forum/edit/${post._id}`);
  };

  const handleDeletePost = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      try {
        const response = await apiService.forum.posts.delete(post._id);
        if (response && response.status === 200) {
          const config = postTypeConfig[post.postType] || postTypeConfig.ForumPost;
          navigate(config.backPath);
        }
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleReportPost = async () => {
    try {
      const response = await api.post(
        '/forum/posts/report',
        { postId: post._id },
        { withCredentials: true }
      );
      if (response && response.status === 200) {
        alert('Đã báo cáo bài viết thành công');
      }
    } catch (error) {
      console.error('Error reporting post:', error);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const previousFavorited = isFavorited;
    setIsFavorited(!isFavorited);

    try {
      // Call API to toggle favorite (implement your API endpoint)
      await apiService.forum.posts.toggleFavorite(post._id);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setIsFavorited(previousFavorited);
    }
  };

  const getPostConfig = (postType) => {
    return postTypeConfig[postType] || postTypeConfig.ForumPost;
  };

  if (loading) {
    return (
      <ChakraProvider>
        <Container maxW="container.md" py={6}>
          <Flex justify="center" align="center" minH="400px">
            <VStack spacing={4}>
              <Spinner size="xl" color="blue.500" thickness="4px" speed="0.65s" />
              <Text>Đang tải bài viết...</Text>
            </VStack>
          </Flex>
        </Container>
      </ChakraProvider>
    );
  }

  if (error || !post) {
    return (
      <ChakraProvider>
        <Container maxW="container.md" py={6}>
          <Alert status="error" borderRadius="md" mb={4} variant="left-accent">
            <AlertIcon />
            {error || 'Không tìm thấy bài viết'}
          </Alert>
          <VStack spacing={4} textAlign="center">
            <Button
              leftIcon={<FaArrowLeft />}
              colorScheme="blue"
              onClick={() => navigate('/forum')}
              size="md"
              borderRadius="full"
            >
              Quay lại diễn đàn
            </Button>
          </VStack>
        </Container>
      </ChakraProvider>
    );
  }

  const config = getPostConfig(post.postType);
  const isOwner = user?.id === post.authorId || user?._id === post.authorId;

  return (
    <ChakraProvider>
      <Container maxW="container.lg" py={8}>
        <Card
          bg={cardBgColor}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="lg"
          shadow="md"
          position="relative"
          overflow="hidden"
          transition="all 0.2s ease-in-out"
          _hover={{ shadow: shadowColor, transform: 'translateY(-2px)' }}
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            bgGradient: config.gradient,
            zIndex: 1,
          }}
        >
          <PostSticker type={post.postType} />
          <CardBody p={{ base: 4, md: 6 }} pt={12}>
            <VStack spacing={6} align="stretch">
              {/* Header */}
              <Flex justify="space-between" align="center" flexWrap="wrap">
                <HStack spacing={4} flex={1}>
                  <IconButton
                    icon={<FaArrowLeft />}
                    onClick={() => navigate(config.backPath)}
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
                <HStack spacing={2}>
                  {isOwner && (
                    <>
                      <Tooltip label="Chỉnh sửa bài viết" hasArrow>
                        <Button size="sm" variant="ghost" onClick={handleEditPost}>
                          Chỉnh sửa
                        </Button>
                      </Tooltip>
                      <Tooltip label="Xóa bài viết" hasArrow>
                        <Button size="sm" variant="ghost" colorScheme="red" onClick={handleDeletePost}>
                          Xóa
                        </Button>
                      </Tooltip>
                    </>
                  )}
                  {!isOwner && user && (
                    <Tooltip label="Báo cáo bài viết" hasArrow>
                      <Button size="sm" variant="ghost" colorScheme="orange" onClick={handleReportPost}>
                        Báo cáo
                      </Button>
                    </Tooltip>
                  )}
                  <Tooltip label={isFavorited ? 'Bỏ lưu bài viết' : 'Lưu bài viết'} hasArrow>
                    <IconButton
                      aria-label="favorite"
                      icon={isFavorited ? <FaBookmark /> : <FaRegBookmark />}
                      size="md"
                      variant="ghost"
                      colorScheme={isFavorited ? 'blue' : 'gray'}
                      onClick={handleFavoriteToggle}
                    />
                  </Tooltip>
                </HStack>
              </Flex>

              <Divider borderColor={borderColor} />

              {/* Author Info */}
              <HStack spacing={4}>
                <Avatar
                  src={post.authorAvatar || post.author?.avatar}
                  name={post.author?.username || post.author?.name || 'User'}
                  size="md"
                />
                <VStack align="start" spacing={1}>
                  <Text fontSize="lg" fontWeight="semibold">
                    {post.author?.username || post.author?.name || 'User'}
                  </Text>
                  <HStack spacing={2}>
                    <FaRegCalendarAlt color={textSecondary} />
                    <Text fontSize="sm" color={textSecondary}>
                      {formatDate
                        ? formatDate(post.createdAt || post.date)
                        : dayjs(post.createdAt || post.date).locale('vi').format('DD/MM/YYYY HH:mm')}
                      {post.updatedAt !== post.createdAt && ' • Đã chỉnh sửa'}
                    </Text>
                  </HStack>
                </VStack>
              </HStack>

              {/* Images */}
              {(post.images && post.images.length > 0) || post.imgUrl ? (
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <VStack spacing={4}>
                    {post.images?.map((image, index) => (
                      <Image
                        key={index}
                        src={image}
                        alt={`${post.title} - Hình ${index + 1}`}
                        w="100%"
                        maxH="500px"
                        objectFit="cover"
                        borderRadius="md"
                        fallbackSrc="/placeholder-image.jpg"
                        loading="lazy"
                      />
                    ))}
                    {post.imgUrl?.length > 0 &&
                      post.imgUrl.map((url, index) => {
                        const driveIdMatch = url.match(/[-\w]{25,}/);
                        const driveId = driveIdMatch?.[0];
                        return driveId ? (
                          <Box key={index} w="100%" maxW="600px">
                            <iframe
                              src={`https://drive.google.com/file/d/${driveId}/preview`}
                              width="100%"
                              height="350px"
                              style={{ border: 'none', borderRadius: '8px' }}
                              allow="autoplay"
                              title={`Google Drive Image ${index + 1}`}
                            />
                          </Box>
                        ) : null;
                      })}
                  </VStack>
                </MotionBox>
              ) : null}

              {/* Content */}
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Text fontSize={{ base: 'md', md: 'lg' }} whiteSpace="pre-line" lineHeight="tall">
                  {post.content}
                </Text>
              </MotionBox>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Text fontSize="sm" fontWeight="semibold" mb={2} color={textSecondary}>
                    Tags:
                  </Text>
                  <Wrap>
                    {post.tags.map((tag, index) => (
                      <WrapItem key={index}>
                        <Tag
                          size="md"
                          bg={tagBg}
                          color={tagColor}
                          borderRadius="md"
                          fontWeight="bold"
                          _hover={{ bg: useColorModeValue('blue.100', 'blue.800'), cursor: 'pointer' }}
                        >
                          <TagLabel>{tag.startsWith('#') ? tag : `#${tag}`}</TagLabel>
                        </Tag>
                      </WrapItem>
                    ))}
                  </Wrap>
                </MotionBox>
              )}

              {/* Actions */}
              <Divider borderColor={borderColor} />
              <Flex justify="space-between" align="center" pt={2}>
                <HStack spacing={4}>
                  <Reaction
                    targetId={post._id}
                    targetType="Post"
                    reactions={post.reactions || {}}
                    userReaction={post.userReaction}
                    onReact={handleReaction}
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
                      onClick={onToggle}
                      _hover={{ bg: hoverBgColor }}
                    />
                    <Text fontSize="sm" color={textSecondary}>
                      {comments.length}
                    </Text>
                  </HStack>
                  <ShareButton url={window.location.href} title={post.title} />
                </HStack>
              </Flex>

              {/* Comments Section */}
              <SlideFade in={isOpen} offsetY="20px">
                <VStack align="stretch" spacing={4} ref={commentSectionRef} mt={4}>
                  <Flex justify="space-between" align="center">
                    <Heading size="md">Bình luận ({comments.length})</Heading>
                    {commentLoading && <Spinner size="sm" color="blue.500" />}
                  </Flex>
                  {user ? (
                    <CommentForm onSubmit={handleCommentSubmit} userAvatar={user.avatar} />
                  ) : (
                    <Alert status="info" borderRadius="md">
                      <AlertIcon />
                      <VStack align="start" spacing={2}>
                        <Text>Đăng nhập để bình luận</Text>
                        <Button size="sm" colorScheme="blue" onClick={() => navigate('/login')}>
                          Đăng nhập
                        </Button>
                      </VStack>
                    </Alert>
                  )}
                  <CommentList
                    comments={comments}
                    currentUserId={user?.id || user?._id}
                    onDelete={handleDeleteComment}
                    onEdit={handleEditComment}
                    loading={commentLoading}
                  />
                </VStack>
              </SlideFade>
            </VStack>
          </CardBody>
        </Card>
        <ScrollToTopButton />
      </Container>
    </ChakraProvider>
  );
};

export default PostDetail;