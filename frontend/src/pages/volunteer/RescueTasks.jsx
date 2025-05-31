import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
  Text,
  Card,
  CardBody,
  Stack,
  StackDivider,
  Badge,
  Button,
  Flex,
  Spinner,
  useToast,
  VStack,
  HStack,
  Icon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Textarea,
  Progress,
  Avatar,
  SimpleGrid,
  AvatarGroup,
  Tooltip,
} from '@chakra-ui/react';
import { FiMapPin, FiClock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import axios from 'axios';

const RescueTasks = () => {
  const [activeTasks, setActiveTasks] = useState([]);
  const [historyTasks, setHistoryTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [completionNote, setCompletionNote] = useState('');
  const [cancelTimeout, setCancelTimeout] = useState(null);
  const [cancelProgress, setCancelProgress] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    isOpen: isCompleteOpen, 
    onOpen: onCompleteOpen, 
    onClose: onCompleteClose 
  } = useDisclosure();
  const { 
    isOpen: isCancelOpen, 
    onOpen: onCancelOpen, 
    onClose: onCancelClose 
  } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchCurrentMission();
  }, []);

  const fetchCurrentMission = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/volunteer/current-mission`,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setActiveTasks(response.data.data ? [response.data.data] : []);
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải nhiệm vụ hiện tại',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMissionHistory = async () => {
    try {
      setHistoryLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/volunteer/mission-history`,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setHistoryTasks(response.data.data.missions || []);
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải lịch sử nhiệm vụ',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleAcceptTask = async (taskId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/volunteer/v1/rescue-tasks/${taskId}/accept`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        toast({
          title: 'Thành công',
          description: 'Đã nhận nhiệm vụ thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchCurrentMission();
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể nhận nhiệm vụ',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/volunteer/v1/rescue-tasks/${taskId}/complete`,
        { note: completionNote },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast({
          title: 'Thành công',
          description: 'Đã hoàn thành nhiệm vụ',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setCompletionNote('');
        onCompleteClose();
        fetchCurrentMission();
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể hoàn thành nhiệm vụ',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const startCancelTimeout = (taskId) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      setCancelProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        onCancelOpen();
      }
    }, 150); // 15 seconds total (150 * 100ms = 15s)

    setCancelTimeout(interval);
  };

  const handleCancelTask = async (taskId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/volunteer/v1/rescue-tasks/${taskId}/cancel`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        toast({
          title: 'Thành công',
          description: 'Đã hủy nhiệm vụ',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setCancelProgress(0);
        onCancelClose();
        fetchCurrentMission();
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể hủy nhiệm vụ',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCancelClick = (taskId) => {
    startCancelTimeout(taskId);
  };

  const handleCancelClose = () => {
    if (cancelTimeout) {
      clearInterval(cancelTimeout);
      setCancelTimeout(null);
    }
    setCancelProgress(0);
    onCancelClose();
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'yellow', text: 'Chờ xử lý' },
      accepted: { color: 'blue', text: 'Đã nhận' },
      in_progress: { color: 'orange', text: 'Đang thực hiện' },
      completed: { color: 'green', text: 'Hoàn thành' },
      cancelled: { color: 'red', text: 'Đã hủy' },
    };

    const config = statusConfig[status] || { color: 'gray', text: status };
    return (
      <Badge colorScheme={config.color} px={2} py={1} borderRadius="full">
        {config.text}
      </Badge>
    );
  };

  const TaskCard = ({ task, isHistory = false }) => (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="sm"
      p={5}
      bg="white"
      _hover={{ boxShadow: 'md', borderColor: 'blue.300' }}
      transition="all 0.2s"
      mb={3}
      cursor="pointer"
      onClick={() => {
        setSelectedTask(task);
        onOpen();
      }}
    >
      <Flex justify="space-between" align="flex-start">
        <VStack align="start" spacing={3} flex={1}>
          <Text fontWeight="bold" fontSize="lg" color="blue.700">
            Nhiệm vụ #{task.missionId}
          </Text>
          <HStack>
            <Avatar size="md" src={task.requester?.avatar} name={task.requester?.fullname} />
            <Box>
              <Text fontWeight="semibold">{task.requester?.fullname}</Text>
              <Text fontSize="sm" color="gray.500">@{task.requester?.username}</Text>
            </Box>
          </HStack>
          <Box>
            <Text fontWeight="medium" mb={1}>Tình nguyện viên:</Text>
            <AvatarGroup size="sm" max={3}>
              {task.selectedVolunteers?.map((vol) => (
                <Tooltip key={vol._id} label={vol.fullname}>
                  <Avatar src={vol.avatar} name={vol.fullname} border={task.acceptedVolunteer?._id === vol._id ? "2px solid" : "none"} borderColor="green.400" />
                </Tooltip>
              ))}
            </AvatarGroup>
          </Box>
          <HStack>
            <Icon as={FiMapPin} color="blue.500" />
            <Text fontSize="sm">
              {task.location?.coordinates
                ? `[${task.location.coordinates[0]}, ${task.location.coordinates[1]}]`
                : 'Chưa có vị trí'}
            </Text>
            {task.location?.coordinates && (
              <Button
                as="a"
                href={`https://www.google.com/maps?q=${task.location.coordinates[1]},${task.location.coordinates[0]}`}
                target="_blank"
                size="xs"
                colorScheme="blue"
                variant="ghost"
                ml={2}
              >
                Xem bản đồ
              </Button>
            )}
          </HStack>
        </VStack>

        <VStack align="end" spacing={2} minW="180px">
          <Badge
            colorScheme={
              task.status === 'timeout'
                ? 'red'
                : task.status === 'completed'
                ? 'green'
                : task.status === 'pending'
                ? 'yellow'
                : 'blue'
            }
            fontSize="md"
            px={3}
            py={1}
            borderRadius="full"
          >
            {task.status.toUpperCase()}
          </Badge>
          <HStack>
            <Icon as={FiClock} color="orange.400" />
            <Text fontSize="sm">{new Date(task.createdAt).toLocaleString('vi-VN')}</Text>
          </HStack>
          {task.endedAt && (
            <HStack>
              <Icon as={FiClock} color="green.400" />
              <Text fontSize="sm">Kết thúc: {new Date(task.endedAt).toLocaleString('vi-VN')}</Text>
            </HStack>
          )}
        </VStack>
      </Flex>
    </Box>
  );

  const TaskDetailModal = () => (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chi tiết nhiệm vụ</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {selectedTask && (
            <VStack spacing={4} align="stretch">
              <Box>
                <Flex justify="space-between" align="center" mb={2}>
                  <Heading size="md">Nhiệm vụ #{selectedTask.missionId}</Heading>
                  {getStatusBadge(selectedTask.status)}
                </Flex>
              </Box>
              
              <Box>
                <Heading size="sm" mb={2}>Thông tin người yêu cầu</Heading>
                <HStack spacing={3}>
                  <Avatar size="md" src={selectedTask.requester?.avatar} name={selectedTask.requester?.fullname} />
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="medium">{selectedTask.requester?.fullname}</Text>
                    <Text fontSize="sm" color="gray.600">@{selectedTask.requester?.username}</Text>
                  </VStack>
                </HStack>
              </Box>

              <Box>
                <Heading size="sm" mb={2}>Tình nguyện viên</Heading>
                <VStack align="stretch" spacing={3}>
                  <Text fontWeight="medium">Đã chọn:</Text>
                  <SimpleGrid columns={3} spacing={3}>
                    {selectedTask.selectedVolunteers?.map((volunteer) => (
                      <HStack key={volunteer._id} spacing={2}>
                        <Avatar size="sm" src={volunteer.avatar} name={volunteer.fullname} />
                        <VStack align="start" spacing={0}>
                          <Text fontSize="sm">{volunteer.fullname}</Text>
                          <Text fontSize="xs" color="gray.600">@{volunteer.username}</Text>
                        </VStack>
                      </HStack>
                    ))}
                  </SimpleGrid>

                  {selectedTask.acceptedVolunteer && (
                    <>
                      <Text fontWeight="medium" mt={2}>Đã nhận nhiệm vụ:</Text>
                      <HStack spacing={2}>
                        <Avatar 
                          size="sm" 
                          src={selectedTask.acceptedVolunteer.avatar} 
                          name={selectedTask.acceptedVolunteer.fullname}
                          border="2px solid"
                          borderColor="green.500"
                        />
                        <VStack align="start" spacing={0}>
                          <Text fontSize="sm">{selectedTask.acceptedVolunteer.fullname}</Text>
                          <Text fontSize="xs" color="gray.600">@{selectedTask.acceptedVolunteer.username}</Text>
                        </VStack>
                      </HStack>
                    </>
                  )}
                </VStack>
              </Box>

              <Box>
                <Heading size="sm" mb={2}>Thông tin chi tiết</Heading>
                <VStack align="stretch" spacing={2}>
                  <HStack>
                    <Icon as={FiMapPin} color="blue.500" />
                    <Text>
                      Vị trí cần cứu hộ: {selectedTask.location?.coordinates ? 
                        `[${selectedTask.location.coordinates[0]}, ${selectedTask.location.coordinates[1]}]` : 
                        'Chưa có vị trí'}
                    </Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiClock} color="orange.500" />
                    <Text>Thời gian tạo: {new Date(selectedTask.createdAt).toLocaleString('vi-VN')}</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiClock} color="green.500" />
                    <Text>Bắt đầu: {new Date(selectedTask.startedAt).toLocaleString('vi-VN')}</Text>
                  </HStack>
                  {selectedTask.endedAt && (
                    <HStack>
                      <Icon as={FiCheckCircle} color="green.500" />
                      <Text>Kết thúc: {new Date(selectedTask.endedAt).toLocaleString('vi-VN')}</Text>
                    </HStack>
                  )}
                  {selectedTask.timeoutAt && (
                    <HStack>
                      <Icon as={FiAlertCircle} color="red.500" />
                      <Text>Hết hạn: {new Date(selectedTask.timeoutAt).toLocaleString('vi-VN')}</Text>
                    </HStack>
                  )}
                </VStack>
              </Box>

              {selectedTask.notes && (
                <Box>
                  <Heading size="sm" mb={2}>Ghi chú</Heading>
                  <Text>{selectedTask.notes}</Text>
                </Box>
              )}
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );

  const CompleteTaskModal = () => (
    <Modal isOpen={isCompleteOpen} onClose={onCompleteClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Hoàn thành nhiệm vụ</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            <Text>Vui lòng nhập ghi chú về việc hoàn thành nhiệm vụ:</Text>
            <Textarea
              value={completionNote}
              onChange={(e) => setCompletionNote(e.target.value)}
              placeholder="Nhập ghi chú của bạn..."
              size="sm"
              rows={4}
            />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={() => handleCompleteTask(selectedTask._id)}>
            Xác nhận hoàn thành
          </Button>
          <Button variant="ghost" onClick={onCompleteClose}>Hủy</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  const CancelTaskModal = () => (
    <Modal isOpen={isCancelOpen} onClose={handleCancelClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Xác nhận hủy nhiệm vụ</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            <Text>Bạn có chắc chắn muốn hủy nhiệm vụ này?</Text>
            <Text color="red.500" fontSize="sm">
              Lưu ý: Việc hủy nhiệm vụ sẽ ảnh hưởng đến uy tín của bạn.
            </Text>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={() => handleCancelTask(selectedTask._id)}>
            Xác nhận hủy
          </Button>
          <Button variant="ghost" onClick={handleCancelClose}>Quay lại</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  return (
    <Box p={4}>
      <Heading mb={6}>Nhiệm vụ cứu hộ</Heading>
      
      {cancelProgress > 0 && (
        <Box mb={4}>
          <Progress value={cancelProgress} colorScheme="red" size="sm" />
          <Text fontSize="sm" color="gray.600" mt={1}>
            Đang chuẩn bị hủy nhiệm vụ... ({Math.round(cancelProgress)}%)
          </Text>
        </Box>
      )}

      <Tabs variant="enclosed" colorScheme="blue" onChange={(index) => {
        if (index === 1 && historyTasks.length === 0) {
          fetchMissionHistory();
        }
      }}>
        <TabList>
          <Tab>Nhiệm vụ hiện tại</Tab>
          <Tab>Lịch sử nhiệm vụ</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {loading ? (
              <Flex justify="center" align="center" h="200px">
                <Spinner size="xl" color="blue.500" />
              </Flex>
            ) : activeTasks.length === 0 ? (
              <Text textAlign="center" color="gray.500" py={8}>
                Không có nhiệm vụ nào đang chờ xử lý
              </Text>
            ) : (
              <VStack spacing={4} align="stretch">
                {activeTasks.map((task) => (
                  <TaskCard key={task._id} task={task} />
                ))}
              </VStack>
            )}
          </TabPanel>

          <TabPanel>
            {historyLoading ? (
              <Flex justify="center" align="center" h="200px">
                <Spinner size="xl" color="blue.500" />
              </Flex>
            ) : historyTasks.length === 0 ? (
              <Text textAlign="center" color="gray.500" py={8}>
                Chưa có lịch sử nhiệm vụ
              </Text>
            ) : (
              <VStack spacing={4} align="stretch">
                {historyTasks.map((task) => (
                  <TaskCard key={task._id} task={task} isHistory={true} />
                ))}
              </VStack>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>

      <TaskDetailModal />
      <CompleteTaskModal />
      <CancelTaskModal />
    </Box>
  );
};

export default RescueTasks; 