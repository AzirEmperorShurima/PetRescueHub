import React from 'react';
import { Box, Typography, Paper, Grid, Tooltip, Avatar } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import PetsIcon from '@mui/icons-material/Pets';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import StarIcon from '@mui/icons-material/Star';
import { styled } from '@mui/material/styles';

const BadgeAvatar = styled(Avatar)(({ theme }) => ({
  width: 60,
  height: 60,
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  margin: '0 auto 10px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)'
  }
}));

const BadgeItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 16,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)'
  }
}));

const ProgressBar = styled(Box)(({ theme, value }) => ({
  width: '100%',
  height: 6,
  backgroundColor: theme.palette.grey[200],
  borderRadius: 3,
  position: 'relative',
  marginTop: theme.spacing(1),
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: `${value}%`,
    backgroundColor: theme.palette.primary.main,
    borderRadius: 3,
  }
}));

const VolunteerBadges = ({ user, achievements = [] }) => {
  // Nếu không phải volunteer thì không hiển thị
  if (user?.role !== 'volunteer') {
    return null;
  }
  
  // Tạo danh sách huy hiệu với thông tin chi tiết
  const badges = [
    {
      id: 'rescue-hero',
      icon: <VolunteerActivismIcon fontSize="large" />,
      title: 'Người hùng cứu hộ',
      description: 'Đã tham gia cứu trợ thành công nhiều thú cưng',
      progress: Math.min(100, (user?.rescuedPets || 0) * 10), // 10 thú cưng = 100%
      value: user?.rescuedPets || 0,
      target: 10,
      color: '#e91e63'
    },
    {
      id: 'pet-lover',
      icon: <PetsIcon fontSize="large" />,
      title: 'Người yêu thú cưng',
      description: 'Đăng ký hồ sơ và chăm sóc nhiều thú cưng',
      progress: Math.min(100, (user?.petsCount || 0) * 20), // 5 thú cưng = 100%
      value: user?.petsCount || 0,
      target: 5,
      color: '#2196f3'
    },
    {
      id: 'community-star',
      icon: <StarIcon fontSize="large" />,
      title: 'Ngôi sao cộng đồng',
      description: 'Đóng góp tích cực cho cộng đồng yêu thú cưng',
      progress: Math.min(100, (user?.contributionPoints || 0) * 2), // 50 điểm = 100%
      value: user?.contributionPoints || 0,
      target: 50,
      color: '#ff9800'
    },
    {
      id: 'donation-heart',
      icon: <FavoriteIcon fontSize="large" />,
      title: 'Trái tim nhân ái',
      description: 'Quyên góp và hỗ trợ các hoạt động cứu trợ',
      progress: Math.min(100, (user?.donationCount || 0) * 10), // 10 lần = 100%
      value: user?.donationCount || 0,
      target: 10,
      color: '#4caf50'
    },
    {
      id: 'rescue-streak',
      icon: <LocalFireDepartmentIcon fontSize="large" />,
      title: 'Chuỗi hoạt động',
      description: 'Duy trì hoạt động cứu hộ liên tục',
      progress: Math.min(100, (user?.activityStreak || 0) * 5), // 20 ngày = 100%
      value: user?.activityStreak || 0,
      target: 20,
      color: '#9c27b0'
    },
    // Thêm các huy hiệu từ achievements
    ...achievements.map((achievement, index) => ({
      id: `achievement-${index}`,
      icon: <EmojiEventsIcon fontSize="large" />,
      title: achievement.title || 'Thành tích',
      description: achievement.content || 'Đã đạt được thành tích đặc biệt',
      progress: 100, // Đã đạt được
      value: 1,
      target: 1,
      color: '#795548'
    }))
  ];

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Huy hiệu & Thành tích
      </Typography>
      
      <Grid container spacing={3}>
        {badges.map((badge) => (
          <Grid item xs={6} sm={4} md={4} key={badge.id}>
            <Tooltip title={`${badge.value}/${badge.target} - ${badge.description}`} arrow placement="top">
              <BadgeItem elevation={2}>
                <BadgeAvatar sx={{ bgcolor: badge.color }}>
                  {badge.icon}
                </BadgeAvatar>
                <Typography variant="subtitle1" fontWeight="bold" noWrap>
                  {badge.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  {badge.value}/{badge.target}
                </Typography>
                <ProgressBar value={badge.progress} />
              </BadgeItem>
            </Tooltip>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default VolunteerBadges;