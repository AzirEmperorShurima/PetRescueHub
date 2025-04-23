import React, { useEffect, useState } from 'react';
import { Container, Grid, Box, Tabs, Tab, Divider, Typography } from '@mui/material';
import ProfileHeader from './components/ProfileHeader';
import ProfileStats from './components/ProfileStats';
import PetGrid from './components/PetGrid';
import PostGrid from './components/PostGrid';
import Achievements from './components/Achievements';
import ProfileActions from './components/ProfileActions';
import RescueActivities from './components/RescueActivities';
import VolunteerBadges from './components/VolunteerBadges';
import ActivityTimeline from './components/ActivityTimeline';
import TabPanel from './components/TabPanel';
import './Profile.css';
import { usersMock } from '../../mocks/authMock';
import { pets as mockPets } from '../../mocks/pets';
import { forumPosts as mockPosts } from '../../mocks/forum';
import { testimonials as mockAchievements } from '../../mocks/homeMock';
import { rescues as mockRescues } from '../../mocks/rescues';
import PetsIcon from '@mui/icons-material/Pets';
import ArticleIcon from '@mui/icons-material/Article';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [pets, setPets] = useState([]);
  const [posts, setPosts] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [rescues, setRescues] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  // Xử lý thay đổi tab
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    // Giả lập lấy dữ liệu từ API
    const fetchData = async () => {
      try {
        // Lấy user từ localStorage và sessionStorage
        let storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
        
        if (storedUser) {
          try {
            storedUser = JSON.parse(storedUser);
          } catch (e) {
            console.error('Lỗi khi parse dữ liệu người dùng:', e);
            storedUser = null;
          }
        }
        
        if (!storedUser) {
          console.error('Không tìm thấy thông tin người dùng trong localStorage hoặc sessionStorage');
          setLoading(false);
          return;
        }
        
        console.log('Thông tin người dùng từ storage:', storedUser);
        
        // Tìm thông tin đầy đủ của user từ usersMock
        const fullUserData = usersMock.find(u => u.id === storedUser.id);
        
        if (!fullUserData) {
          console.error('Không tìm thấy thông tin đầy đủ của người dùng trong usersMock');
          setUser(storedUser); // Sử dụng thông tin có sẵn nếu không tìm thấy thông tin đầy đủ
        } else {
          console.log('Đã tìm thấy thông tin đầy đủ của người dùng:', fullUserData);
          // Sử dụng thông tin đầy đủ từ mock data
          setUser(fullUserData);
        }
        
        // Lọc pets, posts theo user ID
        const userPets = mockPets.filter(p => p.ownerId === storedUser.id);
        const userPosts = mockPosts.filter(p => p.authorId === storedUser.id);
        
        // Lấy achievements từ user nếu có (cho volunteer)
        const userAchievements = fullUserData?.achievements || [];
        
        // Lọc hoạt động cứu hộ cho volunteer
        const userRescues = storedUser.role === 'volunteer' ? 
          mockRescues.filter(r => r.assignedTo === storedUser.name) : [];
        
        // Tạo dữ liệu mẫu cho quyên góp (trong thực tế sẽ lấy từ API)
        const userDonations = storedUser.role === 'volunteer' ? [
          { id: 1, amount: 500000, campaign: 'Mái ấm cho mèo hoang', date: '2023-05-20' },
          { id: 2, amount: 300000, campaign: 'Thức ăn cho chó bị bỏ rơi', date: '2023-06-15' },
          { id: 3, amount: 1000000, campaign: 'Phẫu thuật cho thú cưng bị thương', date: '2023-07-10' }
        ] : [];
        
        // Cập nhật state
        setPets(userPets);
        setPosts(userPosts);
        setAchievements(userAchievements);
        setRescues(userRescues);
        setDonations(userDonations);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Phần còn lại của component giữ nguyên
  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải thông tin...</p>
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

  // Tạo danh sách tab dựa vào role của user
  const getTabs = () => {
    const tabs = [
      { label: 'Thú cưng', icon: <PetsIcon /> },
      { label: 'Bài viết', icon: <ArticleIcon /> }
    ];

    // Nếu là volunteer, thêm tab thành tích và hoạt động cứu hộ
    if (user?.role === 'volunteer') {
      tabs.push(
        { label: 'Thành tích', icon: <EmojiEventsIcon /> },
        { label: 'Hoạt động cứu hộ', icon: <VolunteerActivismIcon /> }
      );
    }

    return tabs;
  };

  return (
    <div className="profile-page">
      <ProfileHeader user={user} />
      
      <Container maxWidth="lg">
        <Grid container spacing={4} className="profile-content-container">
          <Grid item xs={12}>
            <ProfileStats 
              pets={pets} 
              posts={posts} 
              achievements={achievements} 
              user={user} 
            />
          </Grid>
          
          <Grid item xs={12} md={8}>
            {/* Tab Navigation */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange} 
                aria-label="profile tabs"
                variant="scrollable"
                scrollButtons="auto"
              >
                {getTabs().map((tab, index) => (
                  <Tab 
                    key={index} 
                    label={tab.label} 
                    icon={tab.icon} 
                    iconPosition="start"
                  />
                ))}
              </Tabs>
            </Box>

            {/* Tab Panels */}
            <TabPanel value={activeTab} index={0}>
              <PetGrid pets={pets} />
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              <PostGrid posts={posts} />
            </TabPanel>

            {user?.role === 'volunteer' && (
              <>
                <TabPanel value={activeTab} index={2}>
                  <Achievements achievements={achievements} user={user} />
                </TabPanel>

                <TabPanel value={activeTab} index={3}>
                  <RescueActivities rescues={rescues} user={user} />
                </TabPanel>
              </>
            )}
            
            {/* Hiển thị dòng thời gian hoạt động cho volunteer */}
            {user?.role === 'volunteer' && (
              <ActivityTimeline 
                user={user} 
                rescues={rescues} 
                donations={donations} 
                posts={posts} 
              />
            )}
          </Grid>
          
          <Grid item xs={12} md={4}>
            <ProfileActions user={user} />
            
            {/* Hiển thị huy hiệu thành tích cho volunteer */}
            {user?.role === 'volunteer' && (
              <VolunteerBadges 
                user={user} 
                achievements={achievements} 
              />
            )}
            
            {/* Hiển thị thông tin bổ sung cho user thường */}
            {user?.role === 'user' && (
              <Box sx={{ mt: 3, p: 3, bgcolor: '#fff', borderRadius: 2, boxShadow: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Tham gia cộng đồng
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2" paragraph>
                  Bạn có thể đăng ký trở thành tình nguyện viên để tham gia các hoạt động cứu hộ và nhận được nhiều đặc quyền hơn.
                </Typography>
                <Typography variant="body2">
                  Hãy liên hệ với quản trị viên để biết thêm chi tiết về cách đăng ký và các yêu cầu cần thiết.
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Profile;