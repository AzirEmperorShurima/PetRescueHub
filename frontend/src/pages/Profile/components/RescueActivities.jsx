import React from 'react';
import { 
  Text, 
  Box, 
  Card,
  CardBody,
  Tag,
  Button,
  VStack,
  HStack,
  Image,
  SimpleGrid,
  Flex
} from '@chakra-ui/react';
import { FiUsers, FiHeart, FiMapPin, FiCalendar, FiEye } from 'react-icons/fi';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

// Component hiển thị hoạt động cứu hộ của volunteer
const RescueActivities = ({ rescues = [], user }) => {
  // Nếu không phải volunteer thì không hiển thị
  if (user?.role !== 'volunteer') {
    return null;
  }

  // Nếu không có dữ liệu cứu hộ
  if (!rescues || rescues.length === 0) {
    return (
      <Box>
        <Text fontSize="xl" fontWeight="bold" mb={4}>Hoạt động cứu hộ</Text>
        <Card className="empty-rescues">
          <CardBody p={8} textAlign="center">
            <Text color="gray.600">
              Chưa có hoạt động cứu hộ nào được ghi nhận.
            </Text>
          </CardBody>
        </Card>
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

  // Hiển thị trạng thái cứu hộ
  const getStatusTag = (status) => {
    const statusMap = {
      'pending': { label: 'Đang chờ', colorScheme: 'orange' },
      'in_progress': { label: 'Đang thực hiện', colorScheme: 'blue' },
      'completed': { label: 'Hoàn thành', colorScheme: 'green' },
      'cancelled': { label: 'Đã hủy', colorScheme: 'red' }
    };

    const statusInfo = statusMap[status] || { label: 'Không xác định', colorScheme: 'gray' };

    return (
      <Tag 
        colorScheme={statusInfo.colorScheme}
        size="sm" 
        variant="outline"
      >
        {statusInfo.label}
      </Tag>
    );
  };

  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold" className="tab-title" mb={6}>
        Hoạt động cứu hộ
      </Text>
      
      <VStack spacing={6} className="rescue-activities-container">
        {rescues.map((rescue) => (
          <Card key={rescue.id} className="rescue-activity-item" width="100%" shadow="md">
            <CardBody p={6}>
              <VStack spacing={4} align="stretch">
                {/* Header */}
                <Flex justify="space-between" align="flex-start" className="rescue-activity-header">
                  <HStack spacing={3} className="rescue-activity-title-section">
                    <Box color="pink.500" className="rescue-icon">
                      <FiUsers size={24} />
                    </Box>
                    <VStack align="flex-start" spacing={2}>
                      <Text fontSize="lg" fontWeight="bold" className="rescue-title">
                        {rescue.title}
                      </Text>
                      <HStack spacing={3}>
                        {getStatusTag(rescue.status)}
                        <HStack spacing={1} color="gray.600">
                          <FiCalendar size={14} />
                          <Text fontSize="sm">
                            {formatDate(rescue.reportedAt)}
                          </Text>
                        </HStack>
                      </HStack>
                    </VStack>
                  </HStack>
                </Flex>

                {/* Content */}
                <Box className="rescue-activity-content">
                  <Text mb={4}>
                    {rescue.description}
                  </Text>
                  
                  {rescue.images && rescue.images.length > 0 && (
                    <SimpleGrid columns={{ base: 2, md: 3 }} spacing={3} mb={4} className="rescue-images">
                      {rescue.images.map((image, index) => (
                        <Image 
                          key={index}
                          src={image} 
                          alt={`Hình ảnh cứu hộ ${index + 1}`} 
                          className="rescue-image"
                          borderRadius="md"
                          objectFit="cover"
                          h="120px"
                        />
                      ))}
                    </SimpleGrid>
                  )}
                  
                  <VStack spacing={2} align="stretch" className="rescue-details">
                    <HStack spacing={2}>
                      <FiMapPin size={16} color="gray" />
                      <Text fontSize="sm" color="gray.600">
                        {rescue.location}
                      </Text>
                    </HStack>
                    
                    {rescue.assignedTo && (
                      <HStack spacing={2}>
                        <FiHeart size={16} color="gray" />
                        <Text fontSize="sm" color="gray.600">
                          Được giao cho: {rescue.assignedTo}
                        </Text>
                      </HStack>
                    )}
                    
                    {rescue.priority && (
                      <Tag 
                        size="sm" 
                        variant="outline"
                        colorScheme={
                          rescue.priority === 'high' ? 'red' : 
                          rescue.priority === 'medium' ? 'orange' : 'green'
                        }
                        width="fit-content"
                      >
                        Mức độ ưu tiên: {
                          rescue.priority === 'high' ? 'Cao' : 
                          rescue.priority === 'medium' ? 'Trung bình' : 'Thấp'
                        }
                      </Tag>
                    )}
                  </VStack>
                  
                  {rescue.resolution && (
                    <Box mt={4} p={4} bg="gray.50" borderRadius="md">
                      <Text fontSize="sm" fontWeight="semibold" mb={2}>
                        Kết quả cứu hộ:
                      </Text>
                      <Text fontSize="sm">
                        {rescue.resolution}
                      </Text>
                    </Box>
                  )}
                </Box>
                
                {/* Actions */}
                <Flex justify="flex-end" className="rescue-activity-actions">
                  <Button 
                    leftIcon={<FiEye />} 
                    variant="outline"
                    size="sm"
                    colorScheme="pink"
                  >
                    Xem chi tiết
                  </Button>
                </Flex>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </VStack>
    </Box>
  );
};

export default RescueActivities;