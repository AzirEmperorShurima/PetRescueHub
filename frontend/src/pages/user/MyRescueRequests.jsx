import React, { useState, useEffect } from 'react';
import {
  Box, Tabs, TabList, TabPanels, Tab, TabPanel, Heading, Text, Card, CardBody, Stack, Badge,
  Button, Flex, Spinner, useToast, VStack, HStack, Icon, useDisclosure, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalBody, ModalCloseButton, Avatar, SimpleGrid, AvatarGroup, Tooltip
} from '@chakra-ui/react';
import { FiMapPin, FiClock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import api from '../../utils/axios';

const MyRescueRequests = () => {
  const [activeRequests, setActiveRequests] = useState([]);
  const [historyRequests, setHistoryRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchCurrentRequests();
  }, []);

  const fetchCurrentRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/PetRescue/rescue/rescue-missions/me');
      const data = response?.data?.data?.current;
      setActiveRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải yêu cầu cứu hộ hiện tại',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setActiveRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequestHistory = async () => {
    try {
      setHistoryLoading(true);
      const response = await api.get('/PetRescue/rescue/rescue-missions/me?status=completed,cancelled,timeout');
      console.log('History response:', response.data);
      
      // Kiểm tra và lấy mảng history từ response
      const historyData = response.data?.data?.history || [];
      setHistoryRequests(Array.isArray(historyData) ? historyData : []);
      
      // Log để debug
      console.log('History data after processing:', historyData);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải lịch sử yêu cầu cứu hộ',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setHistoryRequests([]); // Set empty array on error
    } finally {
      setHistoryLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'yellow', text: 'Chờ xử lý' },
      accepted: { color: 'blue', text: 'Đã nhận' },
      in_progress: { color: 'orange', text: 'Đang thực hiện' },
      completed: { color: 'green', text: 'Hoàn thành' },
      cancelled: { color: 'red', text: 'Đã hủy' },
      timeout: { color: 'red', text: 'Hết hạn' },
    };
    const config = statusConfig[status] || { color: 'gray', text: status };
    return (
      <Badge colorScheme={config.color} px={2} py={1} borderRadius="full">
        {config.text}
      </Badge>
    );
  };

  const RequestCard = ({ request }) => (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="sm"
      p={6}
      bg="white"
      _hover={{ boxShadow: 'md', borderColor: 'blue.300' }}
      transition="all 0.2s"
      mb={4}
      cursor="pointer"
      minW="350px"
      maxW="100%"
      w="100%"
      onClick={() => {
        setSelectedRequest(request);
        onOpen();
      }}
    >
      <Flex justify="space-between" align="flex-start" wrap="wrap">
        <VStack align="start" spacing={4} flex={1}>
          <Text fontWeight="bold" fontSize="xl" color="blue.700">
            Yêu cầu cứu hộ #{request.missionId}
          </Text>
          <Box>
            <Text fontWeight="medium" mb={2}>Tình nguyện viên tham gia:</Text>
            <AvatarGroup size="md" max={3}>
              {request.selectedVolunteers?.map((vol) => (
                <Tooltip key={vol._id} label={vol.fullname}>
                  <Avatar src={vol.avatar || undefined} name={vol.fullname} />
                </Tooltip>
              ))}
            </AvatarGroup>
          </Box>
          <HStack>
            <Icon as={FiMapPin} color="blue.500" />
            <Text fontSize="md">
              {request.location?.coordinates
                ? `[${request.location.coordinates[0]}, ${request.location.coordinates[1]}]`
                : 'Chưa có vị trí'}
            </Text>
            {request.location?.coordinates && (
              <Button
                as="a"
                href={`https://www.google.com/maps?q=${request.location.coordinates[1]},${request.location.coordinates[0]}`}
                target="_blank"
                size="sm"
                colorScheme="blue"
                variant="ghost"
                ml={2}
              >
                Xem bản đồ
              </Button>
            )}
          </HStack>
        </VStack>
        <VStack align="end" spacing={3} minW="200px">
          {getStatusBadge(request.status)}
          <HStack>
            <Icon as={FiClock} color="orange.400" />
            <Text fontSize="md">{new Date(request.createdAt).toLocaleString('vi-VN')}</Text>
          </HStack>
          {request.endedAt && (
            <HStack>
              <Icon as={FiClock} color="green.400" />
              <Text fontSize="md">Kết thúc: {new Date(request.endedAt).toLocaleString('vi-VN')}</Text>
            </HStack>
          )}
        </VStack>
      </Flex>
    </Box>
  );

  const RequestDetailModal = () => (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent p={2} maxW="700px">
        <ModalHeader fontSize="2xl">Chi tiết yêu cầu cứu hộ</ModalHeader>
        <ModalCloseButton boxSize={8} fontSize="xl" />
        <ModalBody pb={8}>
          {selectedRequest && (
            <VStack spacing={6} align="stretch">
              <Box>
                <Flex justify="space-between" align="center" mb={3}>
                  <Heading size="lg">Yêu cầu cứu hộ #{selectedRequest.missionId}</Heading>
                  {getStatusBadge(selectedRequest.status)}
                </Flex>
              </Box>
              <Box>
                <Heading size="md" mb={3}>Tình nguyện viên tham gia</Heading>
                <SimpleGrid columns={selectedRequest.selectedVolunteers?.length > 1 ? 2 : 1} spacing={4}>
                  {selectedRequest.selectedVolunteers?.map((volunteer) => (
                    <HStack key={volunteer._id} spacing={3} align="center">
                      <Avatar size="lg" src={volunteer.avatar || undefined} name={volunteer.fullname} />
                      <VStack align="start" spacing={0}>
                        <Text fontSize="lg" fontWeight="semibold">{volunteer.fullname}</Text>
                        <Text fontSize="md" color="gray.600">
                          @{volunteer.username || volunteer.email || ''}
                        </Text>
                      </VStack>
                    </HStack>
                  ))}
                </SimpleGrid>
              </Box>
              <Box>
                <Heading size="md" mb={3}>Thông tin chi tiết</Heading>
                <VStack align="stretch" spacing={3}>
                  <HStack>
                    <Icon as={FiMapPin} color="blue.500" boxSize={6} />
                    <Text fontSize="md">
                      Vị trí cứu hộ: {selectedRequest.location?.coordinates ?
                        `[${selectedRequest.location.coordinates[0]}, ${selectedRequest.location.coordinates[1]}]` :
                        'Chưa có vị trí'}
                    </Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiClock} color="orange.500" boxSize={6} />
                    <Text fontSize="md">Thời gian tạo: {new Date(selectedRequest.createdAt).toLocaleString('vi-VN')}</Text>
                  </HStack>
                  {selectedRequest.endedAt && (
                    <HStack>
                      <Icon as={FiCheckCircle} color="green.500" boxSize={6} />
                      <Text fontSize="md">Kết thúc: {new Date(selectedRequest.endedAt).toLocaleString('vi-VN')}</Text>
                    </HStack>
                  )}
                  {selectedRequest.timeoutAt && (
                    <HStack>
                      <Icon as={FiAlertCircle} color="red.500" boxSize={6} />
                      <Text fontSize="md">Hết hạn: {new Date(selectedRequest.timeoutAt).toLocaleString('vi-VN')}</Text>
                    </HStack>
                  )}
                </VStack>
              </Box>
              {selectedRequest.notes && (
                <Box>
                  <Heading size="md" mb={2}>Ghi chú</Heading>
                  <Text fontSize="md">{selectedRequest.notes}</Text>
                </Box>
              )}
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );

  return (
    <Box p={4}>
      <Heading mb={6}>Yêu cầu cứu hộ của tôi</Heading>
      <Tabs variant="enclosed" colorScheme="blue" onChange={(index) => {
        if (index === 1 && historyRequests.length === 0) {
          fetchRequestHistory();
        }
      }}>
        <TabList>
          <Tab>Yêu cầu hiện tại</Tab>
          <Tab>Lịch sử yêu cầu</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {loading ? (
              <Flex justify="center" align="center" h="200px">
                <Spinner size="xl" color="blue.500" />
              </Flex>
            ) : Array.isArray(activeRequests) && activeRequests.length > 0 ? (
              <VStack spacing={4} align="stretch">
                {activeRequests.map((request) => (
                  <RequestCard key={request._id} request={request} />
                ))}
              </VStack>
            ) : (
              <Text textAlign="center" color="gray.500" py={8}>
                Không có yêu cầu nào đang chờ xử lý
              </Text>
            )}
          </TabPanel>
          <TabPanel>
            {historyLoading ? (
              <Flex justify="center" align="center" h="200px">
                <Spinner size="xl" color="blue.500" />
              </Flex>
            ) : historyRequests.length === 0 ? (
              <Text textAlign="center" color="gray.500" py={8}>
                Chưa có lịch sử yêu cầu
              </Text>
            ) : (
              <VStack spacing={4} align="stretch">
                {historyRequests.map((request) => (
                  <RequestCard key={request._id} request={request} />
                ))}
              </VStack>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
      <RequestDetailModal />
    </Box>
  );
};

export default MyRescueRequests;
