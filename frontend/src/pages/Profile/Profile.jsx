import React, { useEffect, useState } from 'react';
import {
  Box, Container, Grid, GridItem, Tabs, TabList, TabPanels, Tab, TabPanel,
  Divider, Text, Card, CardBody, Input, Button, Avatar,
  FormControl, FormLabel, Select, Spinner, Tag,
  useToast, IconButton, VStack, HStack, Flex, Heading,
  Radio, RadioGroup, Stack, Textarea, Badge, SimpleGrid
} from '@chakra-ui/react';
import {
  FiUser, FiMail, FiPhone, FiMapPin, FiCalendar,
  FiUserCheck, FiHeart, FiFileText, FiAward, FiUsers,
  FiEdit, FiSave, FiX, FiUserPlus, FiUserMinus, FiHelpCircle
} from 'react-icons/fi';
import PetGrid from './components/PetGrid';
import PostGrid from './components/PostGrid';
import Achievements from './components/Achievements';
import RescueActivities from './components/RescueActivities';
import ActivityTimeline from './components/ActivityTimeline';
import VolunteerBadges from './components/VolunteerBadges';
import './Profile.css';
import { pets as mockPets } from '../../mocks/pets';
import { forumPosts as mockPosts } from '../../mocks/forum';
import { testimonials as mockAchievements } from '../../mocks/homeMock';
import { rescues as mockRescues } from '../../mocks/rescues';
import apiService from '../../services/api.service';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

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
          duration: 5000,
          isClosable: true,
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
        duration: 5000,
        isClosable: true,
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
      { label: 'Thông tin cá nhân', icon: <FiUser /> },
      { label: 'Thú cưng', icon: <FiHeart /> },
      { label: 'Bài viết', icon: <FiFileText /> }
    ];

    const userRoles = Array.isArray(user?.roles) ? user.roles : [];
    if (userRoles.includes('volunteer')) {
      tabs.push(
        { label: 'Hoạt động cứu hộ', icon: <FiUsers /> },
        { label: 'Thành tích', icon: <FiAward /> }
      );
    }

    return tabs;
  };

  // Hiển thị biểu tượng giới tính
  const renderGenderIcon = (gender) => {
    switch (gender) {
      case 'male':
        return <FiUserPlus color="blue" />;
      case 'female':
        return <FiUserMinus color="pink" />;
      default:
        return <FiHelpCircle color="gray" />;
    }
  };

  // Format ngày tháng
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
      <Box className="profile-loading" display="flex" flexDirection="column" alignItems="center" justifyContent="center" minH="60vh">
        <Spinner size="xl" color="pink.500" thickness="4px" />
        <Text mt={4} fontSize="lg">Đang tải thông tin...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="profile-loading" display="flex" flexDirection="column" alignItems="center" justifyContent="center" minH="60vh">
        <Text color="red.500" fontSize="lg">{error}</Text>
        <Text mt={2}>Vui lòng đăng nhập lại hoặc thử lại sau.</Text>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box className="profile-loading" display="flex" flexDirection="column" alignItems="center" justifyContent="center" minH="60vh">
        <Text>Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.</Text>
      </Box>
    );
  }

  return (
    <Box className="profile-page" py={8}>
      <Container maxW="6xl">
        <Grid templateColumns={{ base: "1fr", md: "1fr 2fr" }} gap={6} className="profile-content-container">
          {/* Sidebar - Thông tin người dùng */}
          <GridItem>
            <Card className="profile-sidebar" shadow="lg">
              <CardBody className="profile-avatar-container">
                <VStack spacing={4} align="center">
                  <Avatar
                    src={user.avatar}
                    name={user.fullname || user.username}
                    size="2xl"
                    className="profile-avatar"
                  />
                  <VStack spacing={1} align="center">
                    <Heading as="h3" size="lg" className="profile-name">
                      {user.fullname || 'Anonymous'}
                    </Heading>
                    <Text fontSize="sm" color="gray.600" className="profile-username">
                      @{user.username}
                    </Text>
                    <HStack spacing={2} flexWrap="wrap" justify="center">
                      {(() => {
                        const roles = user.roles.map(role => typeof role === 'object' ? role.name : role);
                        const matchedRole = roles.find(r => r.toLowerCase() === 'volunteer') || roles.find(r => r.toLowerCase() === 'user');
                        if (!matchedRole) return null;

                        return (
                          <Tag
                            key={matchedRole}
                            colorScheme="pink"
                            size="sm"
                          >
                            {matchedRole}
                          </Tag>
                        );
                      })()}
                    </HStack>
                  </VStack>
                </VStack>

                <Divider my={6} className="sidebar-divider" />

                <VStack spacing={6} align="stretch">
                  <Box className="sidebar-section">
                    <Heading as="h4" size="md" mb={3} className="sidebar-title">
                      Thông tin liên hệ
                    </Heading>

                    <VStack spacing={3} align="stretch">
                      <Box className="info-item">
                        <Text fontSize="sm" fontWeight="semibold" color="gray.600" mb={1}>
                          Email
                        </Text>
                        <Text className="profile-email">
                          {user.email}
                        </Text>
                      </Box>

                      {user.phonenumber && (
                        <Box className="info-item">
                          <Text fontSize="sm" fontWeight="semibold" color="gray.600" mb={1}>
                            Số điện thoại
                          </Text>
                          <Text>
                            {user.phonenumber}
                          </Text>
                        </Box>
                      )}

                      {user.address && (
                        <Box className="info-item">
                          <Text fontSize="sm" fontWeight="semibold" color="gray.600" mb={1}>
                            Địa chỉ
                          </Text>
                          <Text>
                            {user.address}
                          </Text>
                        </Box>
                      )}
                    </VStack>
                  </Box>

                  <Divider className="sidebar-divider" />

                  <Box className="sidebar-section">
                    <Heading as="h4" size="md" mb={3} className="sidebar-title">
                      Thông tin khác
                    </Heading>

                    <VStack spacing={3} align="stretch">
                      <Box className="info-item">
                        <Text fontSize="sm" fontWeight="semibold" color="gray.600" mb={1}>
                          Ngày tham gia
                        </Text>
                        <Text>
                          {formatDate(user.createdAt)}
                        </Text>
                      </Box>

                      <Box className="info-item">
                        <Text fontSize="sm" fontWeight="semibold" color="gray.600" mb={1}>
                          Giới tính
                        </Text>
                        <HStack>
                          {renderGenderIcon(user.gender)}
                          <Text>
                            {user.gender === 'male' ? 'Nam' :
                              user.gender === 'female' ? 'Nữ' : 
                              user.gender === 'not provided' ? 'Chưa cung cấp' : 'Chưa cung cấp'}
                          </Text>
                        </HStack>
                      </Box>

                      {user.birthdate && (
                        <Box className="info-item">
                          <Text fontSize="sm" fontWeight="semibold" color="gray.600" mb={1}>
                            Ngày sinh
                          </Text>
                          <Text>
                            {formatDate(user.birthdate)}
                          </Text>
                        </Box>
                      )}
                    </VStack>
                  </Box>

                  <Box className="profile-actions">
                    <Button
                      colorScheme="pink"
                      leftIcon={<FiEdit />}
                      width="full"
                      onClick={handleEditProfile}
                      className="edit-profile-button"
                    >
                      Chỉnh sửa hồ sơ
                    </Button>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>

          {/* Main Content */}
          <GridItem>
            <Card shadow="lg" className="profile-content">
              <CardBody>
                <Tabs index={activeTab} onChange={handleTabChange} variant="enclosed" colorScheme="pink">
                  <TabList className="profile-tabs" flexWrap="wrap">
                    {getTabs().map((tab, index) => (
                      <Tab key={index} className="profile-tab">
                        <HStack spacing={2}>
                          {tab.icon}
                          <Text>{tab.label}</Text>
                        </HStack>
                      </Tab>
                    ))}
                  </TabList>

                  <TabPanels className="profile-tab-content">
                    {/* Tab 0: Thông tin cá nhân */}
                    <TabPanel>
                      <VStack spacing={6} align="stretch">
                        <Flex justify="space-between" align="center" className="tab-header">
                          <Heading as="h3" size="lg" className="tab-title">
                            Thông tin cá nhân
                          </Heading>

                          {isEditing && (
                            <HStack className="profile-edit-actions">
                              <Button
                                colorScheme="green"
                                leftIcon={isSaving ? <Spinner size="sm" /> : <FiSave />}
                                onClick={handleSaveProfile}
                                isLoading={isSaving}
                                isDisabled={!isFormValid()}
                                className="save-profile-button"
                              >
                                {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                              </Button>
                              <Button
                                variant="outline"
                                colorScheme="red"
                                leftIcon={<FiX />}
                                onClick={handleCancelEdit}
                                isDisabled={isSaving}
                                className="cancel-button"
                              >
                                Hủy
                              </Button>
                            </HStack>
                          )}
                        </Flex>

                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                          {/* Thông tin cơ bản */}
                          <Card className="profile-section-card">
                            <CardBody>
                              <VStack spacing={4} align="stretch">
                                <Box>
                                  <Heading as="h4" size="md" className="section-title">
                                    Thông tin cơ bản
                                  </Heading>
                                  <Divider mt={2} mb={4} />
                                </Box>

                                <VStack spacing={4} align="stretch" className="profile-field-container">
                                  <Box className="profile-field">
                                    <HStack mb={2} className="field-label">
                                      <FiUser size={16} />
                                      <Text fontSize="sm" fontWeight="semibold" color="gray.600">
                                        Họ và tên
                                      </Text>
                                    </HStack>
                                    {isEditing ? (
                                      <Input
                                        name="fullname"
                                        value={editedUser.fullname || ''}
                                        onChange={handleInputChange}
                                        size="sm"
                                        className="edit-field"
                                      />
                                    ) : (
                                      <Text className="field-value highlight-field" fontWeight="medium">
                                        {user.fullname || 'Chưa cập nhật'}
                                      </Text>
                                    )}
                                  </Box>

                                  <Box className="profile-field">
                                    <HStack mb={2} className="field-label">
                                      <FiUserCheck size={16} />
                                      <Text fontSize="sm" fontWeight="semibold" color="gray.600">
                                        Tên đăng nhập
                                      </Text>
                                    </HStack>
                                    <Text className="field-value">
                                      {user.username}
                                    </Text>
                                  </Box>

                                  <Box className="profile-field">
                                    <HStack mb={2} className="field-label">
                                      <FiMail size={16} />
                                      <Text fontSize="sm" fontWeight="semibold" color="gray.600">
                                        Email
                                      </Text>
                                    </HStack>
                                    <Text className="field-value">
                                      {user.email}
                                    </Text>
                                  </Box>
                                </VStack>
                              </VStack>
                            </CardBody>
                          </Card>

                          {/* Thông tin liên hệ */}
                          <Card className="profile-section-card">
                            <CardBody>
                              <VStack spacing={4} align="stretch">
                                <Box>
                                  <Heading as="h4" size="md" className="section-title">
                                    Thông tin liên hệ
                                  </Heading>
                                  <Divider mt={2} mb={4} />
                                </Box>

                                <VStack spacing={4} align="stretch" className="profile-field-container">
                                  <Box className="profile-field">
                                    <HStack mb={2} className="field-label">
                                      <FiPhone size={16} />
                                      <Text fontSize="sm" fontWeight="semibold" color="gray.600">
                                        Số điện thoại
                                      </Text>
                                    </HStack>
                                    {isEditing ? (
                                      <Input
                                        name="phonenumber"
                                        value={editedUser.phonenumber || ''}
                                        onChange={handleInputChange}
                                        size="sm"
                                        className="edit-field"
                                      />
                                    ) : (
                                      <Text className="field-value">
                                        {user.phonenumber || 'Chưa cập nhật'}
                                      </Text>
                                    )}
                                  </Box>

                                  <Box className="profile-field">
                                    <HStack mb={2} className="field-label">
                                      <FiMapPin size={16} />
                                      <Text fontSize="sm" fontWeight="semibold" color="gray.600">
                                        Địa chỉ
                                      </Text>
                                    </HStack>
                                    {isEditing ? (
                                      <Input
                                        name="address"
                                        value={editedUser.address || ''}
                                        onChange={handleInputChange}
                                        size="sm"
                                        className="edit-field"
                                      />
                                    ) : (
                                      <Text className="field-value">
                                        {user.address || 'Chưa cập nhật'}
                                      </Text>
                                    )}
                                  </Box>

                                  <Box className="profile-field">
                                    <HStack mb={2} className="field-label">
                                      <FiCalendar size={16} />
                                      <Text fontSize="sm" fontWeight="semibold" color="gray.600">
                                        Ngày sinh
                                      </Text>
                                    </HStack>
                                    {isEditing ? (
                                      <Input
                                        name="birthdate"
                                        type="date"
                                        value={editedUser.birthdate ? new Date(editedUser.birthdate).toISOString().split('T')[0] : ''}
                                        onChange={handleInputChange}
                                        size="sm"
                                        className="edit-field"
                                      />
                                    ) : (
                                      <Text className="field-value">
                                        {user.birthdate ? formatDate(user.birthdate) : 'Chưa cập nhật'}
                                      </Text>
                                    )}
                                  </Box>
                                </VStack>
                              </VStack>
                            </CardBody>
                          </Card>
                        </SimpleGrid>

                        {/* Thông tin bổ sung */}
                        <Card className="profile-section-card">
                          <CardBody>
                            <VStack spacing={4} align="stretch">
                              <Box>
                                <Heading as="h4" size="md" className="section-title">
                                  Thông tin bổ sung
                                </Heading>
                                <Divider mt={2} mb={4} />
                              </Box>

                              <Box className="profile-field">
                                <Text fontSize="sm" fontWeight="semibold" color="gray.600" mb={2}>
                                  Giới tính
                                </Text>
                                {isEditing ? (
                                  <RadioGroup
                                    name="gender"
                                    value={
                                      editedUser.gender === 'not provided'
                                        ? 'not_provided'
                                        : (editedUser.gender || 'not_provided')
                                    }
                                    onChange={(value) => handleInputChange({ target: { name: 'gender', value } })}
                                  >
                                    <Stack direction="row" spacing={4}>
                                      <Radio value="male">Nam</Radio>
                                      <Radio value="female">Nữ</Radio>
                                      <Radio value="not_provided">Không cung cấp</Radio>
                                    </Stack>
                                  </RadioGroup>
                                ) : (
                                  <HStack>
                                    {renderGenderIcon(user.gender)}
                                    <Text className="field-value">
                                      {user.gender === 'male' ? 'Nam' :
                                        user.gender === 'female' ? 'Nữ' : 'Chưa cung cấp'}
                                    </Text>
                                  </HStack>
                                )}
                              </Box>
                            </VStack>
                          </CardBody>
                        </Card>
                      </VStack>
                    </TabPanel>

                    {/* Tab 1: Thú cưng */}
                    <TabPanel>
                      <PetGrid pets={pets} />
                    </TabPanel>

                    {/* Tab 2: Bài viết */}
                    <TabPanel>
                      <PostGrid posts={posts} />
                    </TabPanel>

                    {/* Tab 3: Hoạt động cứu hộ (chỉ hiển thị với volunteer) */}
                    <TabPanel>
                      <RescueActivities rescues={rescues} user={user} />
                      <ActivityTimeline user={user} rescues={rescues} donations={donations} posts={posts} />
                    </TabPanel>

                    {/* Tab 4: Thành tích (chỉ hiển thị với volunteer) */}
                    <TabPanel>
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
    </Box>
  );
};

export default Profile;