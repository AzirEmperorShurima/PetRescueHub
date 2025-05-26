import React, { useState, useEffect } from 'react';
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
  extendTheme,
  Spinner,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { useAuth } from '../../components/contexts/AuthContext';
import { postDetailMock, postCommentsMock } from '../../mocks/postDetailMock';
import { motion } from 'framer-motion';

// Custom Components (adapted for Chakra UI)
// import ActionMenu from '../../components/common/interactions/ActionMenu';
import Reaction from '../../components/common/interactions/Reaction';
import CommentForm from '../../components/common/interactions/CommentForm';
import CommentList from '../../components/common/interactions/CommentList';
import ShareButton from '../../components/common/interactions/ShareButton';
import ScrollToTopButton from '../../components/button/ScrollToTopButton';

// Define theme to match MUI colors
const colors = {
  primary: '#D34F81', // From RescueSuccess context
  secondary: '#757575', // MUI text.secondary
  background: '#fff',
  border: '#e0e0e0' // MUI Paper elevation=1 border
};

const theme = extendTheme({
  colors,
  components: {
    Card: {
      baseStyle: {
        bg: 'background',
        borderRadius: 'lg',
        border: '1px solid',
        borderColor: 'border'
      }
    },
    Heading: {
      baseStyle: {
        fontWeight: 'bold',
        color: 'gray.800'
      }
    },
    Text: {
      baseStyle: {
        color: 'gray.800'
      }
    },
    Button: {
      baseStyle: {
        _hover: { transform: 'scale(1.05)', transition: 'all 0.2s' }
      }
    }
  }
});

const MotionBox = motion(Box);

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    const fetchPostDetails = async () => {
      setLoading(true);
      try {
        // Mock API call
        setTimeout(() => {
          setPost(postDetailMock);
          setLikeCount(15);
          setComments(postCommentsMock);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching post details:', error);
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [id]);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleCommentSubmit = (commentText) => {
    const newComment = {
      id: Date.now(),
      author: user?.name || 'Người dùng ẩn danh',
      avatar: user?.avatar || 'https://i.pravatar.cc/150?img=8',
      content: commentText,
      createdAt: new Date().toISOString(),
      userId: user?.id || 'anonymous'
    };
    setComments([newComment, ...comments]);
  };

  const handleDeleteComment = (commentId) => {
    setComments(comments.filter(comment => comment.id !== commentId));
  };

  const handleEditComment = (comment) => {
    console.log('Edit comment:', comment);
  };

  const handleEditPost = () => {
    console.log('Edit post:', post);
  };

  const handleDeletePost = () => {
    console.log('Delete post:', post);
    navigate('/forum');
  };

  const handleReportPost = () => {
    console.log('Report post:', post);
  };

  if (loading) {
    return (
      <Container maxW="container.md" py={6}>
        <Flex justify="center" my={6}>
          <Spinner size="lg" color="primary" />
        </Flex>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container maxW="container.md" py={6}>
        <VStack spacing={4} textAlign="center" my={6}>
          <Text fontSize="xl" fontWeight="bold">
            Không tìm thấy bài viết
          </Text>
          <Button
            bg="primary"
            color="white"
            onClick={() => navigate('/forum')}
            _hover={{ bg: '#b71c50' }}
            size="lg"
          >
            Quay lại diễn đàn
          </Button>
        </VStack>
      </Container>
    );
  }

  const isOwner = user?.id === post.authorId;

  return (
    <ChakraProvider theme={theme}>
      <Container maxW="container.md" py={6}>
        <Card
          bg={bgColor}
          shadow="md"
          position="relative"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            bgGradient: 'linear(to-r, primary, pink.300)',
            borderTopRadius: 'lg'
          }}
        >
          <CardBody p={{ base: 4, md: 6 }}>
            <VStack spacing={6} align="stretch">
              {/* Header */}
              <Flex justify="space-between" align="center">
                <HStack>
                  <IconButton
                    icon={<FaArrowLeft />}
                    onClick={() => navigate('/forum')}
                    variant="ghost"
                    aria-label="Quay lại diễn đàn"
                  />
                  <Heading size="lg">{post.title}</Heading>
                </HStack>
                {/* <ActionMenu
                  onEdit={isOwner ? handleEditPost : null}
                  onDelete={isOwner ? handleDeletePost : null}
                  onReport={!isOwner ? handleReportPost : null}
                  isOwner={isOwner}
                /> */}
              </Flex>

              <Divider borderColor={borderColor} />

              {/* Author Info */}
              <HStack spacing={3}>
                <Avatar
                  src={post.authorAvatar}
                  name={post.author}
                  size="md"
                />
                <VStack align="start" spacing={0}>
                  <Text fontSize="md" fontWeight="medium">
                    {post.author}
                  </Text>
                  <Text fontSize="sm" color="secondary">
                    {dayjs(post.date).locale('vi').format('DD/MM/YYYY HH:mm')}
                  </Text>
                </VStack>
              </HStack>

              {/* Image */}
              {post.image && (
                <MotionBox
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Image
                    src={post.image}
                    alt={post.title}
                    w="100%"
                    maxH="400px"
                    objectFit="cover"
                    borderRadius="md"
                    fallbackSrc="/placeholder-image.jpg"
                    loading="lazy"
                  />
                </MotionBox>
              )}

              {/* Content */}
              <Text fontSize="md" whiteSpace="pre-line">
                {post.content}
              </Text>

              {/* Tags */}
              {/* <TagList tags={post.tags} /> */}

              {/* Actions */}
              <HStack spacing={4}>
                <Reaction liked={liked} likeCount={likeCount} onLike={handleLike} />
                <ShareButton url={window.location.href} title={post.title} />
              </HStack>

              <Divider borderColor={borderColor} />

              {/* Comments */}
              <VStack align="stretch" spacing={4}>
                <Heading size="md">Bình luận ({comments.length})</Heading>
                <CommentForm onSubmit={handleCommentSubmit} userAvatar={user?.avatar} />
                <CommentList
                  comments={comments}
                  currentUserId={user?.id}
                  onDelete={handleDeleteComment}
                  onEdit={handleEditComment}
                />
              </VStack>
            </VStack>
          </CardBody>
          <ScrollToTopButton />
        </Card>
      </Container>
    </ChakraProvider>
  );
};

export default PostDetail;