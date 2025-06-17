import React from 'react';
import {
  Text,
  Button,
  Box,
  VStack,
  HStack,
  Image,
  Card,
  CardBody,
  Flex,
} from '@chakra-ui/react';
import { FiEye, FiHeart, FiMessageCircle, FiShare2, FiFileText } from 'react-icons/fi';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

const PostGrid = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return (
      <Box className="empty-posts">
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Bài viết
        </Text>
        <Text color="gray.600">
          Bạn chưa có bài viết nào. Hãy chia sẻ câu chuyện đầu tiên của bạn!
        </Text>
      </Box>
    );
  }

  const formatDate = (dateString) => {
    try {
      return dayjs(dateString).locale('vi').format('DD MMMM YYYY');
    } catch (error) {
      return 'Không rõ ngày';
    }
  };

  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold" className="tab-title" mb={6}>
        Bài viết
      </Text>
      <VStack spacing={6} className="activities-timeline">
        {posts.map((post) => (
          <Card key={post.id} className="activity-item" width="100%" shadow="md">
            <CardBody p={6}>
              <HStack spacing={4} align="flex-start">
                <Box
                  className="activity-icon-container"
                  p={3}
                  bg="pink.100"
                  borderRadius="full"
                  color="pink.500"
                >
                  <FiFileText size={20} className="activity-icon" />
                </Box>
                <VStack spacing={4} align="stretch" flex={1} className="activity-content">
                  <Flex justify="space-between" align="flex-start" className="activity-header">
                    <Text fontSize="lg" fontWeight="bold" className="activity-title">
                      {post.title}
                    </Text>
                    <Text fontSize="sm" color="gray.600" className="activity-date">
                      {formatDate(post.createdAt)}
                    </Text>
                  </Flex>
                  {post.image && (
                    <Box className="activity-image-container">
                      <Image
                        src={post.image}
                        alt={post.title}
                        className="activity-image"
                        borderRadius="md"
                        maxH="300px"
                        objectFit="cover"
                      />
                    </Box>
                  )}
                  <Text>{post.content}</Text>
                  <HStack spacing={4} className="activity-actions" flexWrap="wrap">
                    <Button
                      leftIcon={<FiEye />}
                      variant="ghost"
                      size="sm"
                      className="activity-action-button"
                    >
                      Xem chi tiết
                    </Button>
                    <Button
                      leftIcon={<FiHeart />}
                      variant="ghost"
                      size="sm"
                      className="activity-action-button"
                      colorScheme="red"
                    >
                      {post.likes} Thích
                    </Button>
                    <Button
                      leftIcon={<FiMessageCircle />}
                      variant="ghost"
                      size="sm"
                      className="activity-action-button"
                      colorScheme="blue"
                    >
                      {post.comments} Bình luận
                    </Button>
                    <Button
                      leftIcon={<FiShare2 />}
                      variant="ghost"
                      size="sm"
                      className="activity-action-button"
                      colorScheme="green"
                    >
                      Chia sẻ
                    </Button>
                  </HStack>
                </VStack>
              </HStack>
            </CardBody>
          </Card>
        ))}
      </VStack>
    </Box>
  );
};

export default PostGrid;