import React from 'react';
import { Box, Typography, Paper, Grid, Divider, Avatar } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ArticleIcon from '@mui/icons-material/Article';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const ActivityTimeline = ({ user, rescues = [], donations = [], posts = [] }) => {
  // Nếu không phải volunteer thì không hiển thị
  if (user?.role !== 'volunteer') {
    return null;
  }

  // Hàm format ngày tháng
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: vi });
    } catch (error) {
      return 'Không rõ ngày';
    }
  };

  // Tạo danh sách các hoạt động từ nhiều nguồn khác nhau
  const createActivitiesList = () => {
    const activities = [];
    
    // Thêm hoạt động cứu hộ
    rescues.forEach(rescue => {
      activities.push({
        id: `rescue-${rescue.id}`,
        type: 'rescue',
        icon: <VolunteerActivismIcon />,
        color: '#e91e63',
        title: rescue.title || 'Hoạt động cứu hộ',
        description: rescue.description || 'Đã tham gia cứu hộ thú cưng',
        date: rescue.reportedAt || new Date(),
        status: rescue.status
      });
    });
    
    // Thêm hoạt động quyên góp
    donations.forEach(donation => {
      activities.push({
        id: `donation-${donation.id}`,
        type: 'donation',
        icon: <FavoriteIcon />,
        color: '#4caf50',
        title: 'Quyên góp',
        description: `Đã quyên góp ${donation.amount.toLocaleString()} đồng cho ${donation.campaign || 'hoạt động cứu trợ'}`,
        date: donation.date || new Date()
      });
    });
    
    // Thêm bài viết
    posts.forEach(post => {
      activities.push({
        id: `post-${post.id}`,
        type: 'post',
        icon: <ArticleIcon />,
        color: '#2196f3',
        title: 'Đăng bài viết',
        description: post.title || 'Đã đăng một bài viết mới',
        date: post.createdAt || new Date()
      });
    });
    
    // Thêm một số hoạt động mẫu nếu không có dữ liệu
    if (activities.length === 0) {
      activities.push(
        {
          id: 'sample-1',
          type: 'rescue',
          icon: <VolunteerActivismIcon />,
          color: '#e91e63',
          title: 'Cứu hộ thành công',
          description: 'Đã cứu hộ thành công một chú chó bị bỏ rơi tại quận 1',
          date: new Date(2023, 5, 15)
        },
        {
          id: 'sample-2',
          type: 'donation',
          icon: <FavoriteIcon />,
          color: '#4caf50',
          title: 'Quyên góp',
          description: 'Đã quyên góp 500.000 đồng cho chiến dịch "Mái ấm cho mèo hoang"',
          date: new Date(2023, 4, 20)
        },
        {
          id: 'sample-3',
          type: 'achievement',
          icon: <EmojiEventsIcon />,
          color: '#ff9800',
          title: 'Đạt thành tích mới',
          description: 'Đã nhận huy hiệu "Người hùng cứu hộ" sau khi cứu trợ 10 thú cưng',
          date: new Date(2023, 3, 10)
        }
      );
    }
    
    // Sắp xếp theo thời gian giảm dần (mới nhất lên đầu)
    return activities.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const activities = createActivitiesList();

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Dòng thời gian hoạt động
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ position: 'relative' }}>
          {/* Đường kẻ dọc ở giữa */}
          <Box sx={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: '2px',
            bgcolor: 'divider',
            transform: 'translateX(-50%)',
            display: { xs: 'none', md: 'block' }
          }} />
          
          {/* Đường kẻ dọc ở bên trái cho mobile */}
          <Box sx={{
            position: 'absolute',
            left: '20px',
            top: 0,
            bottom: 0,
            width: '2px',
            bgcolor: 'divider',
            display: { xs: 'block', md: 'none' }
          }} />
          
          {activities.map((activity, index) => (
            <Grid container key={activity.id} sx={{ mb: 4, position: 'relative' }}>
              {/* Ngày tháng - Hiển thị bên trái với index chẵn, bên phải với index lẻ trên desktop */}
              <Grid item xs={12} md={5} sx={{
                textAlign: { xs: 'left', md: index % 2 === 0 ? 'right' : 'left' },
                pr: { md: index % 2 === 0 ? 3 : 0 },
                pl: { md: index % 2 === 0 ? 0 : 3 },
                order: { xs: 2, md: index % 2 === 0 ? 1 : 3 },
                mt: { xs: 1, md: 0 },
                ml: { xs: 4, md: 0 }
              }}>
                <Typography color="text.secondary">
                  {formatDate(activity.date)}
                </Typography>
              </Grid>
              
              {/* Icon ở giữa */}
              <Grid item xs={12} md={2} sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                order: { xs: 1, md: 2 },
                position: { xs: 'absolute', md: 'static' },
                left: { xs: '10px', md: 'auto' }
              }}>
                <Avatar sx={{
                  bgcolor: activity.color,
                  width: 40,
                  height: 40,
                  boxShadow: 2,
                  zIndex: 1
                }}>
                  {activity.icon}
                </Avatar>
              </Grid>
              
              {/* Nội dung */}
              <Grid item xs={12} md={5} sx={{
                order: { xs: 3, md: index % 2 === 0 ? 3 : 1 },
                pl: { xs: 4, md: index % 2 === 0 ? 3 : 0 },
                pr: { md: index % 2 === 0 ? 0 : 3 }
              }}>
                <Box sx={{
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  boxShadow: 1,
                  '&:hover': {
                    boxShadow: 3,
                    transition: 'box-shadow 0.3s ease-in-out'
                  }
                }}>
                  <Typography variant="h6" component="div">
                    {activity.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {activity.description}
                  </Typography>
                  {activity.status && (
                    <Typography variant="caption" sx={{
                      display: 'inline-block',
                      mt: 1,
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor: activity.status === 'completed' ? 'success.light' : 
                               activity.status === 'in_progress' ? 'info.light' : 
                               activity.status === 'pending' ? 'warning.light' : 'default.light'
                    }}>
                      {activity.status === 'completed' ? 'Hoàn thành' : 
                       activity.status === 'in_progress' ? 'Đang thực hiện' : 
                       activity.status === 'pending' ? 'Đang chờ' : 'Không xác định'}
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default ActivityTimeline;