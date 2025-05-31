import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Heading,
  Text,
  Box,
  Button,
  Divider,
  Image,
  HStack,
  VStack,
  Flex,
  useColorModeValue,
  Spinner,
  Center,
  Badge,
  SimpleGrid,
  Avatar,
} from '@chakra-ui/react';
import { FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaThumbtack } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../components/contexts/AuthContext';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import apiService from '../../services/api.service';
import '../../pages/Event/components/EventCard.css';
// Import components
import CommentForm from '../../components/common/interactions/CommentForm';
import CommentList from '../../components/common/interactions/CommentList';
import Reaction from '../../components/common/interactions/Reaction';
import ShareButton from '../../components/common/interactions/ShareButton';
import PostActions from '../Forum/PostActions';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Color mode values
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const shadowColor = useColorModeValue('lg', 'dark-lg');

  // State
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // (Bạn có thể thêm state cho like, comment nếu muốn)

  // Fetch event from API
  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiService.forum.posts.getById(id);
        // Dữ liệu thực tế có thể nằm trong response.data.data tuỳ backend
        const eventData = response.data?.data || response.data;
        setEvent(eventData);
      } catch (err) {
        setError('Không tìm thấy sự kiện hoặc có lỗi xảy ra.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEvent();
  }, [id]);

  // Sử dụng useCallback cho hàm điều hướng
  const handleNavigateBack = useCallback(() => {
    navigate('/event');
  }, [navigate]);

  // Format date with day.js
  const formatDateTime = (dateString) => {
    try {
      return dayjs(dateString).locale('vi').format('DD MMMM YYYY HH:mm');
    } catch (error) {
      return 'Không rõ ngày';
    }
  };

  if (loading) {
    return (
      <Container maxW="6xl">
        <Box py={8}>
          <Center>
            <VStack spacing={4}>
              <Spinner size="xl" color="blue.500" />
              <Text>Đang tải thông tin sự kiện...</Text>
            </VStack>
          </Center>
        </Box>
      </Container>
    );
  }

  if (error || !event) {
    return (
      <Container maxW="6xl">
        <Box py={8}>
          <VStack spacing={4} align="start">
            <Text fontSize="lg">{error || 'Không tìm thấy sự kiện'}</Text>
            <Button
              leftIcon={<FaArrowLeft />}
              onClick={handleNavigateBack}
              colorScheme="blue"
              variant="outline"
            >
              Quay lại danh sách sự kiện
            </Button>
          </VStack>
        </Box>
      </Container>
    );
  }

  // Chuẩn hoá dữ liệu cho UI
  const eventImage = event.imgUrl && event.imgUrl.length > 0 ? event.imgUrl[0] : '';
  const eventTags = event.tags || [];
  const eventTitle = event.title || '';
  const eventContent = event.content || event.description || '';
  const eventLocation = event.location || '';
  const eventDate = event.date || event.createdAt || '';
  const eventAuthor = event.author?.username || event.organizer || '';
  const eventAvatar = event.author?.avatar || '';
  const eventFavoriteCount = event.favoriteCount || 0;
  const eventStatus = event.postStatus || '';
  const eventType = event.postType || '';
  const eventScore = event.score || '';
  const eventReactions = event.reactions || {};
  const eventCommentCount = event.commentCount || 0;
  const eventIsLiked = event.isLiked;
  const eventId = event._id || event.id;

  return (
    <Container maxW="6xl">
      <Box py={8}>
        <Button
          leftIcon={<FaArrowLeft />}
          onClick={handleNavigateBack}
          mb={6}
          variant="ghost"
          colorScheme="blue"
        >
          Quay lại danh sách sự kiện
        </Button>

        <Box
          className="event-card"
          bg={cardBg}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="lg"
          shadow={shadowColor}
          p={6}
          mb={6}
        >
          {/* Event image */}
          {eventImage && (
            <Box mb={6}>
              <Image
                className="event-card-media"
                src={eventImage}
                alt={eventTitle}
                w="100%"
                maxH="400px"
                objectFit="cover"
                borderRadius="md"
              />
            </Box>
          )}

          {/* Event header */}
          <Flex align="center" mb={4} gap={4} flexWrap="wrap">
            <Heading as="h1" size="xl" className="event-card-title">
              {eventTitle}
            </Heading>
            {eventTags.length > 0 && (
              <HStack spacing={2} ml={2} flexWrap="wrap">
                {eventTags.map((tag, idx) => (
                  <Badge key={idx} className="event-tag-chip" colorScheme="blue" variant="subtle">
                    {tag}
                  </Badge>
                ))}
              </HStack>
            )}
          </Flex>

          {/* Author & meta */}
          <Flex align="center" mb={4} gap={4} flexWrap="wrap">
            <Avatar size="md" name={eventAuthor} src={eventAvatar} mr={2} />
            <VStack align="start" spacing={0}>
              <Text fontWeight="bold">{eventAuthor}</Text>
              <Text fontSize="sm" color={textSecondary}>Ngày đăng: {formatDateTime(eventDate)}</Text>
            </VStack>
            <Badge colorScheme={eventStatus === 'public' ? 'green' : 'gray'} ml={4}>{eventStatus}</Badge>
            <Badge colorScheme="purple" ml={2}>{eventType}</Badge>
            <Badge colorScheme="orange" ml={2}>Score: {eventScore}</Badge>
          </Flex>

          {/* Event location */}
          {eventLocation && (
            <HStack mb={4} spacing={2}>
              <FaMapMarkerAlt color="blue" />
              <Text fontSize="sm" color={textSecondary}>{eventLocation}</Text>
            </HStack>
          )}

          {/* Event description/content */}
          <Text fontSize="md" className="event-card-description" lineHeight="tall" mb={6}>
            {eventContent}
          </Text>

          {/* Thống kê */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={4}>
            <Box textAlign="center">
              <Text fontWeight="bold">Lượt thích</Text>
              <Text>{eventFavoriteCount}</Text>
            </Box>
            <Box textAlign="center">
              <Text fontWeight="bold">Bình luận</Text>
              <Text>{eventCommentCount}</Text>
            </Box>
            <Box textAlign="center">
              <Text fontWeight="bold">Score</Text>
              <Text>{eventScore}</Text>
            </Box>
            <Box textAlign="center">
              <Text fontWeight="bold">ID</Text>
              <Text fontSize="xs">{eventId}</Text>
            </Box>
          </SimpleGrid>

          {/* Reactions */}
          <Box mb={4}>
            <Text fontWeight="bold" mb={2}>Cảm xúc:</Text>
            <HStack spacing={3}>
              {Object.entries(eventReactions).map(([type, count]) => (
                <Badge key={type} colorScheme="blue" px={2}>{type}: {count}</Badge>
              ))}
            </HStack>
          </Box>

          {/* PostActions (like, favorite, share, comment, ... ) */}
          <Box mt={6}>
            <PostActions post={event} isDetail={true} />
          </Box>
        </Box>

        {/* Comments section */}
        <Box
          bg={cardBg}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="lg"
          shadow={shadowColor}
          p={6}
        >
          <Heading as="h2" size="md" mb={4}>
            Bình luận {/* ({comments.length}) */}
          </Heading>

          {/* Nếu có user thì cho phép comment, nếu không thì nhắc đăng nhập */}
          {user ? (
            <Box mb={6}>
              <CommentForm onSubmit={() => {}} />
            </Box>
          ) : (
            <Box mb={6}>
              <Text fontSize="sm" color={textSecondary}>
                Vui lòng{' '}
                <Button
                  variant="link"
                  colorScheme="blue"
                  size="sm"
                  onClick={() => navigate('/auth/login')}
                  p={0}
                  h="auto"
                  minH="auto"
                >
                  đăng nhập
                </Button>{' '}
                để bình luận
              </Text>
            </Box>
          )}

          <Divider mb={6} />

          {/* <CommentList comments={comments} /> */}
        </Box>
      </Box>
    </Container>
  );
};

export default EventDetail;