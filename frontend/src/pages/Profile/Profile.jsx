import React, { useEffect, useState } from 'react';
import {
  Container, Grid, Box, Tabs, Tab, Divider, Typography,
  Card, CardContent, TextField, Button, Avatar,
  FormControl, InputLabel, Select, MenuItem, CircularProgress, Chip,
  Snackbar, Alert, IconButton, Paper
} from '@mui/material';
import {
  Person, Email, Phone, LocationOn, Cake,
  Badge, Pets, Article, EmojiEvents, VolunteerActivism,
  Edit, Save, Cancel, Male, Female, QuestionMark
} from '@mui/icons-material';
// import ProfileHeader from './components/ProfileHeader';
// import ProfileStats from './components/ProfileStats';
import PetGrid from './components/PetGrid';
import PostGrid from './components/PostGrid';
import Achievements from './components/Achievements';
import ProfileActions from './components/ProfileActions';
import RescueActivities from './components/RescueActivities';
import VolunteerBadges from './components/VolunteerBadges';
import ActivityTimeline from './components/ActivityTimeline';
import TabPanel from './components/TabPanel';
import './Profile.css';
import { pets as mockPets } from '../../mocks/pets';
import { forumPosts as mockPosts } from '../../mocks/forum';
import { testimonials as mockAchievements } from '../../mocks/homeMock';
import { rescues as mockRescues } from '../../mocks/rescues';
import apiService from '../../services/api.service';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

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
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // Xử lý thay đổi tab
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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
        
        setNotification({
          open: true,
          message: 'Cập nhật thông tin thành công!',
          severity: 'success'
        });
        setIsEditing(false);
      } else {
        throw new Error('Không nhận được phản hồi từ server');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      setNotification({
        open: true,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin!',
        severity: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

   // Xử lý tải lên avatar mới
   const handleAvatarUpload = async (file) => {
    try {
      setIsSaving(true);
      
      // Tạo FormData để gửi file
      const formData = new FormData();
      formData.append('avatar', file);
      
      // Gọi API để tải lên avatar
      const response = await apiService.auth.uploadAvatar(formData);
      
      if (response && response.data && response.data.avatarUrl) {
        // Cập nhật avatar trong state
        setUser({
          ...user,
          avatar: response.data.avatarUrl
        });
        
        setNotification({
          open: true,
          message: 'Cập nhật ảnh đại diện thành công!',
          severity: 'success'
        });
      } else {
        throw new Error('Không nhận được URL avatar từ server');
      }
    } catch (error) {
      console.error('Lỗi khi tải lên avatar:', error);
      setNotification({
        open: true,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi tải lên ảnh đại diện!',
        severity: 'error'
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
  
  // Đóng thông báo
  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  useEffect(() => {
    // Gọi API để lấy dữ liệu từ backend
    const fetchData = async () => {
      try {
        setLoading(true);

        // Gọi API để lấy thông tin profile
        const response = await apiService.auth.getProfile();

        if (response && response.data && response.data.userProfile) {
          const userProfile = response.data.userProfile;
          console.log('Thông tin người dùng từ API:', userProfile);
          console.log('Avatar từ API:', userProfile.avatar);

          // Xử lý avatar
          const processedAvatar = processAvatarUrl(userProfile.avatar);
          console.log('Avatar sau khi xử lý:', processedAvatar);

          // Cập nhật state với dữ liệu từ API
          setUser({
            id: userProfile.id,
            username: userProfile.username,
            fullname: userProfile.fullName || userProfile.fullname,
            email: userProfile.email,
            // Xử lý avatar đúng cách
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

          const userPets = mockPets.filter(p => p.ownerId === userProfile.id);
          const userPosts = mockPosts.filter(p => p.authorId === userProfile.id);
          const userAchievements = mockAchievements || [];
          const userRoles = Array.isArray(userProfile.roles) ? userProfile.roles : [];
          const isVolunteer = userRoles.includes('volunteer');
          const userRescues = isVolunteer ?
            mockRescues.filter(r => r.assignedTo === userProfile.username) : [];
          const userDonations = isVolunteer ? [
            { id: 1, amount: 500000, campaign: 'Mái ấm cho mèo hoang', date: '2023-05-20' },
            { id: 2, amount: 300000, campaign: 'Thức ăn cho chó bị bỏ rơi', date: '2023-06-15' },
            { id: 3, amount: 1000000, campaign: 'Phẫu thuật cho thú cưng bị thương', date: '2023-07-10' }
          ] : [];

          setPets(userPets);
          setPosts(userPosts);
          setAchievements(userAchievements);
          setRescues(userRescues);
          setDonations(userDonations);
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
      { label: 'Thông tin cá nhân', icon: <Person /> },
      { label: 'Thú cưng', icon: <Pets /> },
      { label: 'Bài viết', icon: <Article /> }
    ];

    const userRoles = Array.isArray(user?.roles) ? user.roles : [];
    if (userRoles.includes('volunteer')) {
      tabs.push(
        { label: 'Thành tích', icon: <EmojiEvents /> },
        { label: 'Hoạt động cứu hộ', icon: <VolunteerActivism /> }
      );
    }

    return tabs;
  };

  // Hiển thị biểu tượng giới tính
  const renderGenderIcon = (gender) => {
    switch (gender) {
      case 'male':
        return <Male color="primary" />;
      case 'female':
        return <Female color="secondary" />;
      default:
        return <QuestionMark color="action" />;
    }
  };

  // Format ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
    } catch (error) {
      return 'Định dạng không hợp lệ';
    }
  };

  // Hàm xử lý URL avatar
  const processAvatarUrl = (avatarPath) => {
    if (!avatarPath) return null;

    // Kiểm tra nếu là URL đầy đủ
    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
      return avatarPath;
    }

    // Kiểm tra nếu là đường dẫn tương đối
    if (avatarPath.startsWith('/')) {
      // Thêm domain của backend vào trước đường dẫn
      // Thay thế URL dưới đây bằng URL thực tế của backend của bạn
      return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${avatarPath}`;
    }

    // Trường hợp khác, trả về đường dẫn gốc
    return avatarPath;
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-loading">
        <p>{error}</p>
        <p>Vui lòng đăng nhập lại hoặc thử lại sau.</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-loading">
        <p>Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* <ProfileHeader user={user} /> */}

      <Container maxWidth="lg">
        <Grid container spacing={4} className="profile-content-container">
          <Grid container item spacing={3}>
            {/* Sidebar - Thông tin người dùng */}
            <Grid item xs={12} md={4}>
              <Card className="profile-sidebar" elevation={3}>
                <CardContent className="profile-avatar-container">
                  <Avatar
                    src={user.avatar}
                    alt={user.fullname || user.username}
                    className="profile-avatar"
                  />
                  <Typography variant="h5" className="profile-name">
                    {user.fullname || 'Anonymous'}
                  </Typography>
                  <Typography variant="body2" className="profile-username">
                    @{user.username}
                  </Typography>
                  {user.roles && user.roles.length > 0 && (
                    <Chip
                      label={typeof user.roles[0] === 'object' ? user.roles[0].name : user.roles[0]}
                      color="primary"
                      size="small"
                      className="role-chip"
                    />
                  )}
                </CardContent>

                <Divider className="sidebar-divider" />

                <div className="sidebar-section">
                  <Typography variant="h6" className="sidebar-title">
                    Thông tin liên hệ
                  </Typography>

                  <div className="info-item">
                    <Typography variant="subtitle2" color="textSecondary">
                      Email
                    </Typography>
                    <Typography variant="body1" className="profile-email">
                      {user.email}
                    </Typography>
                  </div>

                  {user.phonenumber && (
                    <div className="info-item">
                      <Typography variant="subtitle2" color="textSecondary">
                        Số điện thoại
                      </Typography>
                      <Typography variant="body1">
                        {user.phonenumber}
                      </Typography>
                    </div>
                  )}

                  {user.address && (
                    <div className="info-item">
                      <Typography variant="subtitle2" color="textSecondary">
                        Địa chỉ
                      </Typography>
                      <Typography variant="body1">
                        {user.address}
                      </Typography>
                    </div>
                  )}
                </div>

                <Divider className="sidebar-divider" />

                <div className="sidebar-section">
                  <Typography variant="h6" className="sidebar-title">
                    Thông tin khác
                  </Typography>

                  <div className="info-item">
                    <Typography variant="subtitle2" color="textSecondary">
                      Ngày tham gia
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(user.createdAt)}
                    </Typography>
                  </div>

                  <div className="info-item">
                    <Typography variant="subtitle2" color="textSecondary">
                      Giới tính
                    </Typography>
                    <Box display="flex" alignItems="center">
                      {renderGenderIcon(user.gender)}
                      <Typography variant="body1" sx={{ ml: 1 }}>
                        {user.gender === 'male' ? 'Nam' :
                          user.gender === 'female' ? 'Nữ' : 'Chưa cung cấp'}
                      </Typography>
                    </Box>
                  </div>

                  {user.birthdate && (
                    <div className="info-item">
                      <Typography variant="subtitle2" color="textSecondary">
                        Ngày sinh
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(user.birthdate)}
                      </Typography>
                    </div>
                  )}
                </div>

                <div className="profile-actions">
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Edit />}
                    fullWidth
                    onClick={handleEditProfile}
                    className="edit-profile-button"
                  >
                    Chỉnh sửa hồ sơ
                  </Button>
                </div>
              </Card>
            </Grid>

            {/* Main Content */}
            <Grid item xs={12} md={8}>
              <Paper elevation={3} className="profile-content">
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    aria-label="profile tabs"
                    variant="scrollable"
                    scrollButtons="auto"
                    className="profile-tabs"
                  >
                    {getTabs().map((tab, index) => (
                      <Tab
                        key={index}
                        label={tab.label}
                        icon={tab.icon}
                        iconPosition="start"
                        className="profile-tab"
                      />
                    ))}
                  </Tabs>
                </Box>

                <Box className="profile-tab-content">
                  {/* Tab 0: Thông tin cá nhân */}
                  <TabPanel value={activeTab} index={0}>
                    <div className="tab-header">
                      <Typography variant="h5" className="tab-title">
                        Thông tin cá nhân
                      </Typography>

                      {isEditing ? (
                        <Box className="profile-edit-actions">
                          <Button
                            variant="contained"
                            color="success"
                            startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <Save />}
                            onClick={handleSaveProfile}
                            disabled={isSaving || !isFormValid()} // Thêm kiểm tra tính hợp lệ của form
                            className="save-profile-button"
                          >
                            {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<Cancel />}
                            onClick={handleCancelEdit}
                            disabled={isSaving}
                            className="cancel-button"
                            sx={{ ml: 1 }}
                          >
                            Hủy
                          </Button>
                        </Box>
                      ) : null}
                    </div>

                    <Grid container spacing={3}>
                      {/* Thông tin cơ bản */}
                      <Grid item xs={12} md={6}>
                        <Card className="profile-section-card">
                          <CardContent>
                            <Typography variant="h6" className="section-title">
                              Thông tin cơ bản
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Box className="profile-field-container">
                              <Box className="profile-field">
                                <Typography variant="subtitle2" className="field-label">
                                  <Person fontSize="small" /> Họ và tên
                                </Typography>
                                {isEditing ? (
                                  <TextField
                                    fullWidth
                                    name="fullname"
                                    value={editedUser.fullname || ''}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    size="small"
                                    className="edit-field"
                                  />
                                ) : (
                                  <Typography variant="body1" className="field-value highlight-field">
                                    {user.fullname || 'Chưa cập nhật'}
                                  </Typography>
                                )}
                              </Box>

                              <Box className="profile-field">
                                <Typography variant="subtitle2" className="field-label">
                                  <Badge fontSize="small" /> Tên đăng nhập
                                </Typography>
                                <Typography variant="body1" className="field-value">
                                  {user.username}
                                </Typography>
                              </Box>

                              <Box className="profile-field">
                                <Typography variant="subtitle2" className="field-label">
                                  <Email fontSize="small" /> Email
                                </Typography>
                                {isEditing ? (
                                  <TextField
                                    fullWidth
                                    name="email"
                                    value={editedUser.email || ''}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    size="small"
                                    className="edit-field"
                                  />
                                ) : (
                                  <Typography variant="body1" className="field-value">
                                    {user.email}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>

                      {/* Thông tin liên hệ */}
                      <Grid item xs={12} md={6}>
                        <Card className="profile-section-card">
                          <CardContent>
                            <Typography variant="h6" className="section-title">
                              Thông tin liên hệ
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Box className="profile-field-container">
                              <Box className="profile-field">
                                <Typography variant="subtitle2" className="field-label">
                                  <Phone fontSize="small" /> Số điện thoại
                                </Typography>
                                {isEditing ? (
                                  <TextField
                                    fullWidth
                                    name="phonenumber"
                                    value={editedUser.phonenumber || ''}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    size="small"
                                    className="edit-field"
                                  />
                                ) : (
                                  <Typography variant="body1" className="field-value">
                                    {user.phonenumber || 'Chưa cập nhật'}
                                  </Typography>
                                )}
                              </Box>

                              <Box className="profile-field">
                                <Typography variant="subtitle2" className="field-label">
                                  <LocationOn fontSize="small" /> Địa chỉ
                                </Typography>
                                {isEditing ? (
                                  <TextField
                                    fullWidth
                                    name="address"
                                    value={editedUser.address || ''}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    size="small"
                                    className="edit-field"
                                  />
                                ) : (
                                  <Typography variant="body1" className="field-value">
                                    {user.address || 'Chưa cập nhật'}
                                  </Typography>
                                )}
                              </Box>

                              <Box className="profile-field">
                                <Typography variant="subtitle2" className="field-label">
                                  <Cake fontSize="small" /> Ngày sinh
                                </Typography>
                                {isEditing ? (
                                  <TextField
                                    fullWidth
                                    name="birthdate"
                                    type="date"
                                    value={editedUser.birthdate ? new Date(editedUser.birthdate).toISOString().split('T')[0] : ''}
                                    onChange={handleInputChange}
                                    variant="outlined"
                                    size="small"
                                    className="edit-field"
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                  />
                                ) : (
                                  <Typography variant="body1" className="field-value">
                                    {user.birthdate ? formatDate(user.birthdate) : 'Chưa cập nhật'}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>

                      {/* Thông tin bổ sung */}
                      <Grid item xs={12}>
                        <Card className="profile-section-card">
                          <CardContent>
                            <Typography variant="h6" className="section-title">
                              Thông tin bổ sung
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Box className="profile-field-container">
                              <Box className="profile-field">
                                <Typography variant="subtitle2" className="field-label">
                                  Giới tính
                                </Typography>
                                {isEditing ? (
                                  <FormControl fullWidth size="small" className="edit-field">
                                    <InputLabel id="gender-select-label">Giới tính</InputLabel>
                                    <Select
                                      labelId="gender-select-label"
                                      id="gender-select"
                                      name="gender"
                                      value={
                                        editedUser.gender === 'not provided'
                                          ? 'not_provided'
                                          : (editedUser.gender || 'not_provided')
                                      }
                                      label="Giới tính"
                                      onChange={handleInputChange}
                                    >
                                      <MenuItem value="male">Nam</MenuItem>
                                      <MenuItem value="female">Nữ</MenuItem>
                                      <MenuItem value="not_provided">Không cung cấp</MenuItem>
                                    </Select>
                                  </FormControl>
                                ) : (
                                  <Box display="flex" alignItems="center">
                                    {renderGenderIcon(user.gender)}
                                    <Typography variant="body1" className="field-value" sx={{ ml: 1 }}>
                                      {user.gender === 'male' ? 'Nam' :
                                        user.gender === 'female' ? 'Nữ' : 'Chưa cung cấp'}
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </TabPanel>

                  {/* Tab 1: Thú cưng */}
                  <TabPanel value={activeTab} index={1}>
                    <PetGrid pets={pets} />
                  </TabPanel>

                  {/* Tab 2: Bài viết */}
                  <TabPanel value={activeTab} index={2}>
                    <PostGrid posts={posts} />
                  </TabPanel>

                  {/* Tab 3: Thành tích (chỉ hiển thị với volunteer) */}
                  <TabPanel value={activeTab} index={3}>
                    <Achievements achievements={achievements} />
                    <VolunteerBadges user={user} achievements={achievements} />
                  </TabPanel>

                  {/* Tab 4: Hoạt động cứu hộ (chỉ hiển thị với volunteer) */}
                  <TabPanel value={activeTab} index={4}>
                    <RescueActivities rescues={rescues} user={user} />
                    <ActivityTimeline user={user} rescues={rescues} donations={donations} posts={posts} />
                  </TabPanel>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Container>

      {/* Snackbar thông báo */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Profile;