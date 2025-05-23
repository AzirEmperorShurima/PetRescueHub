import React, { useCallback } from 'react';
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
} from '@chakra-ui/react';
import { FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaThumbtack   } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../components/contexts/AuthContext';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

// Import custom hook
import { useEventDetail } from '../../components/hooks/useEventDetail';

// Import components
import CommentForm from '../../components/common/interactions/CommentForm';
import CommentList from '../../components/common/interactions/CommentList';
import Reaction from '../../components/common/interactions/Reaction';
import ShareButton from '../../components/common/interactions/ShareButton';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Color mode values
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const shadowColor = useColorModeValue('lg', 'dark-lg');

  // Sử dụng custom hook
  const {
    event,
    loading,
    liked,
    likeCount,
    comments,
    handleLike,
    handleCommentSubmit,
  } = useEventDetail(id);

  // Sử dụng useCallback cho hàm điều hướng
  const handleNavigateBack = useCallback(() => {
    navigate('/events');
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

  if (!event) {
    return (
      <Container maxW="6xl">
        <Box py={8}>
          <VStack spacing={4} align="start">
            <Text fontSize="lg">Không tìm thấy sự kiện</Text>
            <Button
              leftIcon={<FaArrowLeft />}
              onClick={() => navigate('/events')}
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

  return (
    <Container maxW="6xl">
      <Box py={8}>
        <Button
          leftIcon={<FaArrowLeft />}
          onClick={() => navigate('/events')}
          mb={6}
          variant="ghost"
          colorScheme="blue"
        >
          Quay lại danh sách sự kiện
        </Button>

        <Box
          bg={cardBg}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="lg"
          shadow={shadowColor}
          p={6}
          mb={6}
        >
          {/* Event header */}
          <Heading as="h1" size="xl" mb={4}>
            {event.title}
          </Heading>

          {/* Event metadata */}
          <Flex flexWrap="wrap" gap={6} mb={6}>
            <HStack spacing={2}>
              <FaCalendarAlt color="blue" />
              <Text fontSize="sm" color={textSecondary}>
                {formatDateTime(event.startDate)} - {formatDateTime(event.endDate)}
              </Text>
            </HStack>
            <HStack spacing={2}>
              <FaMapMarkerAlt color="blue" />
              <Text fontSize="sm" color={textSecondary}>
                {event.location}
              </Text>
            </HStack>
          </Flex>

          {/* Event image */}
          {event.imageUrl && (
            <Box mb={6}>
              <Image
                src={event.imageUrl}
                alt={event.title}
                w="100%"
                maxH="400px"
                objectFit="cover"
                borderRadius="md"
              />
            </Box>
          )}

          {/* Event description */}
          <Text fontSize="md" lineHeight="tall" mb={6}>
            {event.description}
          </Text>

          {/* Event interactions */}
          <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
            <HStack spacing={4}>
              <Reaction
                liked={liked}
                likeCount={likeCount}
                onLike={handleLike}
              />
              <ShareButton url={window.location.href} title={event.title} />
            </HStack>

            {event.status === 'upcoming' && (
              <Button colorScheme="blue" size="md">
                Đăng ký tham gia
              </Button>
            )}
          </Flex>
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
            Bình luận ({comments.length})
          </Heading>

          {user ? (
            <Box mb={6}>
              <CommentForm onSubmit={handleCommentSubmit} />
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

          <CommentList comments={comments} />
        </Box>
      </Box>
    </Container>
  );
};

export default EventDetail;