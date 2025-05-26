import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  Card,
  CardBody,
  Input,
  Button,
  Avatar,
  FormControl,
  FormLabel,
  Select,
  Spinner,
  Tag,
  Alert,
  AlertIcon,
  AlertDescription,
  IconButton,
  VStack,
  HStack,
  Divider,
  useToast,
  Flex,
  Spacer,
  useColorModeValue
} from '@chakra-ui/react';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaIdBadge,
  FaPaw,
  FaNewspaper,
  FaTrophy,
  FaHandsHelping,
  FaEdit,
  FaSave,
  FaTimes,
  FaMars,
  FaVenus,
  FaQuestion
} from 'react-icons/fa';
import dayjs from 'dayjs';
import 'dayjs/locale/vi'; // Import Vietnamese locale
import PetGrid from './components/PetGrid';
import PostGrid from './components/PostGrid';
import Achievements from './components/Achievements';
import RescueActivities from './components/RescueActivities';
import ActivityTimeline from './components/ActivityTimeline';
import VolunteerBadges from './components/VolunteerBadges';
import ScrollToTopButton from '../../components/button/ScrollToTopButton';
import { pets as mockPets } from '../../mocks/pets';
import { forumPosts as mockPosts } from '../../mocks/forum';
import { testimonials as mockAchievements } from '../../mocks/homeMock';
import { rescues as mockRescues } from '../../mocks/rescues';
import apiService from '../../services/api.service';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [pets, setPets] = useState([]);
  const [posts, setPosts] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [rescues, setRescues] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState(null);

  // Thêm state cho chức năng chỉnh sửa
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const toast = useToast();

  // Color scheme
  const bgColor = useColorModeValue('#f8f9fa', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('#333', 'white');
  const primaryColor = '#D34F81'; // Updated to match Terms.css --primary-color
  const primaryDark = '#b71c50'; // Darker shade for hover effects

  // Xử lý thay đổi tab
  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  // Xử lý bắt đầu chỉnh sửa
  const handleEditProfile = () => {
    setEditedUser({ ...user });
    setIsEditing(true);
  };

  // Xử lý hủy chỉnh sửa
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedUser(null);
  };

  // Xử lý thay đổi trường input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Xử lý lưu thông tin
  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);

      // Chuẩn bị dữ liệu để gửi lên server
      const profileData = {
        fullName: editedUser.fullname,
        email: editedUser.email,
        phonenumber: editedUser.phonenumber,
        address: editedUser.address,
        birthdate: editedUser.birthdate,
        gender: editedUser.gender,
        bio: editedUser.bio
      };

      // Gọi API để cập nhật thông tin
      const response = await apiService.auth.updateProfile(profileData);

      if (response && response.data) {
        // Cập nhật state với dữ liệu mới
        setUser({
          ...user,
          ...profileData,
          updatedAt: new Date().toISOString()
        });

        toast({
          title: 'Thành công',
          description: 'Cập nhật thông tin thành công!',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'bottom-right'
        });
        setIsEditing(false);
      } else {
        throw new Error('Không nhận được phản hồi từ server');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      toast({
        title: 'Lỗi',
        description: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin!',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-right'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Kiểm tra tính hợp lệ của form
  const isFormValid = () => {
    if (!editedUser) return false;

    // Kiểm tra các trường bắt buộc
    if (!editedUser.fullname || !editedUser.email) return false;

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editedUser.email)) return false;

    // Kiểm tra số điện thoại (nếu có)
    if (editedUser.phonenumber) {
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(editedUser.phonenumber)) return false;
    }

    return true;
  };

  useEffect(() => {
    // Gọi API để lấy dữ liệu từ backend
    const fetchData = async () => {
      try {
        setLoading(true);

        // Gọi API để lấy thông tin profile
        const response = await apiService.auth.getProfile();
        console.log('User profile:', response.data.userProfile);
        if (response && response.data && response.data.userProfile) {
          const userProfile = response.data.userProfile;
          // Cập nhật state với dữ liệu từ API
          setUser({
            id: userProfile.id,
            username: userProfile.username,
            fullname: userProfile.fullName || userProfile.fullname,
            email: userProfile.email,
            avatar: processAvatarUrl(userProfile.avatar),
            address: userProfile.address,
            phonenumber: Array.isArray(userProfile.phonenumber) ? userProfile.phonenumber[0] : userProfile.phonenumber,
            birthdate: userProfile.birthdate,
            gender: userProfile.gender || 'not provided',
            role: Array.isArray(userProfile.roles) ? userProfile.roles[0] : 'user',
            roles: userProfile.roles,
            isActive: userProfile.isActive,
            isEditable: userProfile.isEditable,
            volunteerStatus: userProfile.volunteerStatus,
            volunteerRequestStatus: userProfile.volunteerRequestStatus,
            isVIP: userProfile.isVIP,
            createdAt: userProfile.createdAt,
            updatedAt: userProfile.updatedAt
          });
        } else {
          setError('Không thể lấy thông tin người dùng từ API');
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu profile:', error);
        setError('Đã xảy ra lỗi khi tải thông tin người dùng');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Thêm tab "Thông tin cá nhân"
  const getTabs = () => {
    const tabs = [
      { label: 'Thông tin cá nhân', icon: FaUser },
      { label: 'Thú cưng', icon: FaPaw },
      { label: 'Bài viết', icon: FaNewspaper }
    ];

    const userRoles = Array.isArray(user?.roles) ? user.roles : [];
    if (userRoles.includes('volunteer')) {
      tabs.push(
        { label: 'Hoạt động cứu hộ', icon: FaHandsHelping },
        { label: 'Thành tích', icon: FaTrophy }
      );
    }

    return tabs;
  };

  // Hiển thị biểu tượng giới tính
  const renderGenderIcon = (gender) => {
    switch (gender) {
      case 'male':
        return <Box as={FaMars} color={primaryColor} />;
      case 'female':
        return <Box as={FaVenus} color={primaryColor} />;
      default:
        return <Box as={FaQuestion} color="gray.500" />;
    }
  };

  // Format ngày tháng với dayjs
  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    try {
      return dayjs(dateString).locale('vi').format('DD/MM/YYYY');
    } catch (error) {
      return 'Định dạng không hợp lệ';
    }
  };

  // Hàm xử lý URL avatar
  const processAvatarUrl = (path) => {
    if (!path) return '/default-avatar.png';
    return path.startsWith('http')
      ? path
      : `${process.env.REACT_APP_API_URL || ''}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  if (loading) {
    return (
      <Box 
        minH="100vh" 
        bg={bgColor} 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        flexDirection="column"
      >
        <Spinner 
          size="xl" 
          color={primaryColor}
          thickness="4px"
          speed="0.65s"
        />
        <Text mt={4} color={textColor}>Đang tải thông tin...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box minH="100vh" bg={bgColor} display="flex" alignItems="center" justifyContent="center">
        <Alert status="error" borderRadius="md" maxW="md">
          <AlertIcon />
          <Box>
            <AlertDescription>{error}</AlertDescription>
            <Text mt={2}>Vui lòng đăng nhập lại hoặc thử lại sau.</Text>
          </Box>
        </Alert>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box minH="100vh" bg={bgColor} display="flex" alignItems="center" justifyContent="center">
        <Alert status="warning" borderRadius="md" maxW="md">
          <AlertIcon />
          <AlertDescription>
            Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.
          </AlertDescription>
        </Alert>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={bgColor} py={10}>
      <Container maxW="container.xl">
        <Grid templateColumns={{ base: "1fr", lg: "1fr 2fr" }} gap={6}>
          {/* Sidebar - Thông tin người dùng */}
          <GridItem>
            <Card bg={cardBg} shadow="lg" borderRadius="xl">
              <CardBody p={6}>
                <VStack spacing={4}>
                  <Avatar
                    size="2xl"
                    src={user.avatar}
                    name={user.fullname || user.username}
                    border="4px solid"
                    borderColor="white"
                    shadow="lg"
                  />
                  <VStack spacing={1} textAlign="center">
                    <Text fontSize="xl" fontWeight="bold" color={textColor}>
                      {user.fullname || 'Anonymous'}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      @{user.username}
                    </Text>
                    <HStack>
                      {(() => {
                        const roles = user.roles.map(role => typeof role === 'object' ? role.name : role);
                        const matchedRole = roles.find(r => r.toLowerCase() === 'volunteer') || roles.find(r => r.toLowerCase() === 'user');
                        if (!matchedRole) return null;

                        return (
                          <Tag
                            key={matchedRole}
                            bg={primaryColor}
                            color="white"
                            size="sm"
                            fontWeight="medium"
                          >
                            {matchedRole}
                          </Tag>
                        );
                      })()}
                    </HStack>
                  </VStack>
                </VStack>

                <Divider my={6} />

                <VStack align="stretch" spacing={4}>
                  <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                    Thông tin liên hệ
                  </Text>

                  <VStack align="stretch" spacing={3}>
                    <Box>
                      <Text fontSize="sm" color="gray.500" fontWeight="medium">
                        Email
                      </Text>
                      <Text fontSize="sm" color={textColor}>
                        {user.email}
                      </Text>
                    </Box>

                    {user.phonenumber && (
                      <Box>
                        <Text fontSize="sm" color="gray.500" fontWeight="medium">
                          Số điện thoại
                        </Text>
                        <Text fontSize="sm" color={textColor}>
                          {user.phonenumber}
                        </Text>
                      </Box>
                    )}

                    {user.address && (
                      <Box>
                        <Text fontSize="sm" color="gray.500" fontWeight="medium">
                          Địa chỉ
                        </Text>
                        <Text fontSize="sm" color={textColor}>
                          {user.address}
                        </Text>
                      </Box>
                    )}
                  </VStack>
                </VStack>

                <Divider my={6} />

                <VStack align="stretch" spacing={4}>
                  <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                    Thông tin khác
                  </Text>

                  <VStack align="stretch" spacing={3}>
                    <Box>
                      <Text fontSize="sm" color="gray.500" fontWeight="medium">
                        Ngày tham gia
                      </Text>
                      <Text fontSize="sm" color={textColor}>
                        {formatDate(user.createdAt)}
                      </Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" color="gray.500" fontWeight="medium">
                        Giới tính
                      </Text>
                      <HStack>
                        {renderGenderIcon(user.gender)}
                        <Text fontSize="sm" color={textColor}>
                          {user.gender === 'male' ? 'Nam' :
                            user.gender === 'female' ? 'Nữ' : 
                            user.gender === 'not provided' ? 'Chưa cung cấp' : 'Chưa cung cấp'}
                        </Text>
                      </HStack>
                    </Box>

                    {user.birthdate && (
                      <Box>
                        <Text fontSize="sm" color="gray.500" fontWeight="medium">
                          Ngày sinh
                        </Text>
                        <Text fontSize="sm" color={textColor}>
                          {formatDate(user.birthdate)}
                        </Text>
                      </Box>
                    )}
                  </VStack>
                </VStack>

                <Box mt={6}>
                  <Button
                    bg={primaryColor}
                    color="white"
                    leftIcon={<FaEdit />}
                    width="full"
                    onClick={handleEditProfile}
                    _hover={{
                      bg: primaryDark,
                      transform: 'translateY(-2px)',
                      shadow: 'lg'
                    }}
                    transition="all 0.3s ease"
                  >
                    Chỉnh sửa hồ sơ
                  </Button>
                </Box>
              </CardBody>
            </Card>
          </GridItem>

          {/* Main Content */}
          <GridItem>
            <Card bg={cardBg} shadow="lg" borderRadius="xl" minH="500px">
              <CardBody p={0}>
                <Tabs 
                  index={activeTab} 
                  onChange={handleTabChange}
                  colorScheme="pink"
                  variant="enclosed"
                >
                  <TabList borderBottomColor="gray.200">
                    {getTabs().map((tab, index) => (
                      <Tab
                        key={index}
                        fontSize="sm"
                        fontWeight="medium"
                        _selected={{
                          color: primaryColor,
                          borderBottomColor: primaryColor
                        }}
                      >
                        <HStack spacing={2}>
                          <Box as={tab.icon} />
                          <Text>{tab.label}</Text>
                        </HStack>
                      </Tab>
                    ))}
                  </TabList>

                  <TabPanels>
                    {/* Tab 0: Thông tin cá nhân */}
                    <TabPanel p={6}>
                      <Flex justify="space-between" align="center" mb={6}>
                        <Text fontSize="xl" fontWeight="semibold" color={textColor}>
                          Thông tin cá nhân
                        </Text>

                        {isEditing && (
                          <HStack>
                            <Button
                              bg="#4caf50"
                              color="white"
                              leftIcon={isSaving ? <Spinner size="sm" /> : <FaSave />}
                              onClick={handleSaveProfile}
                              isDisabled={isSaving || !isFormValid()}
                              _hover={{
                                bg: "#43a047",
                                transform: 'translateY(-2px)',
                                shadow: 'lg'
                              }}
                              transition="all 0.3s ease"
                            >
                              {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </Button>
                            <Button
                              variant="outline"
                              colorScheme="red"
                              leftIcon={<FaTimes />}
                              onClick={handleCancelEdit}
                              isDisabled={isSaving}
                            >
                              Hủy
                            </Button>
                          </HStack>
                        )}
                      </Flex>

                      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
                        {/* Thông tin cơ bản */}
                        <GridItem>
                          <Card shadow="sm" borderRadius="lg" h="full">
                            <CardBody>
                              <Text fontSize="md" fontWeight="semibold" color={textColor} mb={4}>
                                Thông tin cơ bản
                              </Text>
                              <Divider mb={4} />
                              
                              <VStack align="stretch" spacing={4}>
                                <Box>
                                  <HStack mb={2}>
                                    <Box as={FaUser} color="gray.500" />
                                    <Text fontSize="sm" color="gray.500" fontWeight="medium">
                                      Họ và tên
                                    </Text>
                                  </HStack>
                                  {isEditing ? (
                                    <Input
                                      name="fullname"
                                      value={editedUser.fullname || ''}
                                      onChange={handleInputChange}
                                      size="sm"
                                    />
                                  ) : (
                                    <Text fontSize="sm" color={primaryColor} fontWeight="medium">
                                      {user.fullname || 'Chưa cập nhật'}
                                    </Text>
                                  )}
                                </Box>

                                <Box>
                                  <HStack mb={2}>
                                    <Box as={FaIdBadge} color="gray.500" />
                                    <Text fontSize="sm" color="gray.500" fontWeight="medium">
                                      Tên đăng nhập
                                    </Text>
                                  </HStack>
                                  <Text fontSize="sm" color={textColor}>
                                    {user.username}
                                  </Text>
                                </Box>

                                <Box>
                                  <HStack mb={2}>
                                    <Box as={FaEnvelope} color="gray.500" />
                                    <Text fontSize="sm" color="gray.500" fontWeight="medium">
                                      Email
                                    </Text>
                                  </HStack>
                                    <Text fontSize="sm" color={textColor}>
                                      {user.email}
                                    </Text>
                                </Box>
                              </VStack>
                            </CardBody>
                          </Card>
                        </GridItem>

                        {/* Thông tin liên hệ */}
                        <GridItem>
                          <Card shadow="sm" borderRadius="lg" h="full">
                            <CardBody>
                              <Text fontSize="md" fontWeight="semibold" color={textColor} mb={4}>
                                Thông tin liên hệ
                              </Text>
                              <Divider mb={4} />
                              
                              <VStack align="stretch" spacing={4}>
                                <Box>
                                  <HStack mb={2}>
                                    <Box as={FaPhone} color="gray.500" />
                                    <Text fontSize="sm" color="gray.500" fontWeight="medium">
                                      Số điện thoại
                                    </Text>
                                  </HStack>
                                  {isEditing ? (
                                    <Input
                                      name="phonenumber"
                                      value={editedUser.phonenumber || ''}
                                      onChange={handleInputChange}
                                      size="sm"
                                    />
                                  ) : (
                                    <Text fontSize="sm" color={textColor}>
                                      {user.phonenumber || 'Chưa cập nhật'}
                                    </Text>
                                  )}
                                </Box>

                                <Box>
                                  <HStack mb={2}>
                                    <Box as={FaMapMarkerAlt} color="gray.500" />
                                    <Text fontSize="sm" color="gray.500" fontWeight="medium">
                                      Địa chỉ
                                    </Text>
                                  </HStack>
                                  {isEditing ? (
                                    <Input
                                      name="address"
                                      value={editedUser.address || ''}
                                      onChange={handleInputChange}
                                      size="sm"
                                    />
                                  ) : (
                                    <Text fontSize="sm" color={textColor}>
                                      {user.address || 'Chưa cập nhật'}
                                    </Text>
                                  )}
                                </Box>

                                <Box>
                                  <HStack mb={2}>
                                    <Box as={FaBirthdayCake} color="gray.500" />
                                    <Text fontSize="sm" color="gray.500" fontWeight="medium">
                                      Ngày sinh
                                    </Text>
                                  </HStack>
                                  {isEditing ? (
                                    <Input
                                      name="birthdate"
                                      type="date"
                                      value={editedUser.birthdate ? dayjs(editedUser.birthdate).format('YYYY-MM-DD') : ''}
                                      onChange={handleInputChange}
                                      size="sm"
                                    />
                                  ) : (
                                    <Text fontSize="sm" color={textColor}>
                                      {user.birthdate ? formatDate(user.birthdate) : 'Chưa cập nhật'}
                                    </Text>
                                  )}
                                </Box>
                              </VStack>
                            </CardBody>
                          </Card>
                        </GridItem>

                        {/* Thông tin bổ sung */}
                        <GridItem colSpan={{ base: 1, md: 2 }}>
                          <Card shadow="sm" borderRadius="lg">
                            <CardBody>
                              <Text fontSize="md" fontWeight="semibold" color={textColor} mb={4}>
                                Thông tin bổ sung
                              </Text>
                              <Divider mb={4} />
                              
                              <Box>
                                <Text fontSize="sm" color="gray.500" fontWeight="medium" mb={2}>
                                  Giới tính
                                </Text>
                                {isEditing ? (
                                  <Select
                                    name="gender"
                                    value={
                                      editedUser.gender === 'not provided'
                                        ? 'not_provided'
                                        : (editedUser.gender || 'not_provided')
                                    }
                                    onChange={handleInputChange}
                                    size="sm"
                                  >
                                    <option value="male">Nam</option>
                                    <option value="female">Nữ</option>
                                    <option value="not_provided">Không cung cấp</option>
                                  </Select>
                                ) : (
                                  <HStack>
                                    {renderGenderIcon(user.gender)}
                                    <Text fontSize="sm" color={textColor}>
                                      {user.gender === 'male' ? 'Nam' :
                                        user.gender === 'female' ? 'Nữ' : 'Chưa cung cấp'}
                                    </Text>
                                  </HStack>
                                )}
                              </Box>
                            </CardBody>
                          </Card>
                        </GridItem>
                      </Grid>
                    </TabPanel>

                    {/* Tab 1: Thú cưng */}
                    <TabPanel p={6}>
                      <PetGrid pets={pets} />
                    </TabPanel>

                    {/* Tab 2: Bài viết */}
                    <TabPanel p={6}>
                      <PostGrid posts={posts} />
                    </TabPanel>

                    {/* Tab 3: Hoạt động cứu hộ (chỉ hiển thị với volunteer) */}
                    <TabPanel p={6}>
                      <RescueActivities rescues={rescues} user={user} />
                      <ActivityTimeline user={user} rescues={rescues} donations={donations} posts={posts} />
                    </TabPanel>

                    {/* Tab 4: Thành tích (chỉ hiển thị với volunteer) */}
                    <TabPanel p={6}>
                      <Achievements achievements={achievements} />
                      <VolunteerBadges user={user} achievements={achievements} />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </Container>
      <ScrollToTopButton />
    </Box>
  );
};

export default Profile;