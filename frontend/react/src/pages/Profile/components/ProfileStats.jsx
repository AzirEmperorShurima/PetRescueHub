import React from 'react';
import { Typography, Tooltip, Box, useTheme, useMediaQuery, Paper, LinearProgress } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import ArticleIcon from '@mui/icons-material/Article';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { styled } from '@mui/material/styles';

// Styled component cho hiệu ứng hover và animation
const StyledStatItem = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  minWidth: 80,
  padding: '15px 10px',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: 8,
  '&:hover': {
    transform: 'translateY(-5px)',
    backgroundColor: 'rgba(233, 30, 99, 0.05)',
  },
  '&:hover .stat-icon': {
    transform: 'scale(1.2)',
    color: theme.palette.primary.main,
  },
  '&:hover .stat-value': {
    color: theme.palette.primary.main,
  }
}));

const ProfileStats = ({ pets, posts, achievements, user }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Chỉ hiển thị thành tích nếu user là volunteer
  const isVolunteer = user?.role === 'volunteer';
  const isAdmin = user?.role === 'admin';
  
  const stats = [
    {
      icon: <PetsIcon className="stat-icon" />,
      value: pets?.length || 0,
      label: 'Thú cưng',
      tooltip: 'Số thú cưng đã đăng trong hồ sơ'
    },
    {
      icon: <ArticleIcon className="stat-icon" />,
      value: posts?.length || 0,
      label: 'Bài viết',
      tooltip: 'Số bài viết đã chia sẻ'
    },
    // Chỉ hiển thị thành tích nếu là volunteer
    ...(isVolunteer ? [{
      icon: <EmojiEventsIcon className="stat-icon" />,
      value: achievements?.length || 0,
      label: 'Thành tích',
      tooltip: 'Số thành tích đã đạt được',
      color: '#ff9800',
      progress: Math.min(100, ((achievements?.length || 0) * 20))
    }] : []),
    // Chỉ hiển thị số thú cưng đã cứu trợ nếu là volunteer hoặc admin
    ...((isVolunteer || isAdmin) ? [{
      icon: <VolunteerActivismIcon className="stat-icon" />,
      value: user?.rescuedPets || 0,
      label: 'Đã cứu trợ',
      tooltip: 'Số thú cưng đã cứu trợ thành công',
      color: '#e91e63',
      progress: Math.min(100, ((user?.rescuedPets || 0) * 10))
    }] : []),
    // Hiển thị số lần quyên góp cho volunteer
    ...(isVolunteer ? [{
      icon: <FavoriteIcon className="stat-icon" />,
      value: user?.donationCount || 0,
      label: 'Quyên góp',
      tooltip: 'Số lần quyên góp cho hoạt động cứu trợ',
      color: '#4caf50',
      progress: Math.min(100, ((user?.donationCount || 0) * 10))
    }] : [])
  ];

  return (
    <Paper elevation={2} className="profile-stats-bar" sx={{
      justifyContent: 'space-around',
      padding: isMobile ? '15px 10px' : '20px',
      borderRadius: 2,
      backgroundColor: '#fff',
      display: 'flex',
      flexWrap: 'wrap',
      gap: 2
    }}>
      {stats.map((stat, index) => (
        <React.Fragment key={index}>
          <Tooltip title={stat.tooltip} arrow placement="top">
            <StyledStatItem>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                width: 50,
                height: 50,
                borderRadius: '50%',
                backgroundColor: 'rgba(233, 30, 99, 0.1)',
                mb: 1
              }}>
                {React.cloneElement(stat.icon, { 
                  className: "stat-icon",
                  sx: { 
                    color: stat.color || '#e91e63',
                    fontSize: 28,
                    transition: 'all 0.3s ease'
                  } 
                })}
              </Box>
              
              <Typography 
                variant="h6" 
                fontWeight="bold" 
                className="stat-value"
                sx={{ 
                  transition: 'all 0.3s ease',
                  fontSize: { xs: '1.25rem', sm: '1.5rem' }
                }}
              >
                {stat.value}
              </Typography>
              
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                {stat.label}
              </Typography>
              
              {stat.progress && (
                <Box sx={{ width: '100%', mt: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={stat.progress} 
                    sx={{ 
                      height: 4, 
                      borderRadius: 2,
                      backgroundColor: 'rgba(0,0,0,0.05)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: stat.color || theme.palette.primary.main
                      }
                    }}
                  />
                </Box>
              )}
            </StyledStatItem>
          </Tooltip>
          
          {index < stats.length - 1 && !isMobile && (
            <div className="stat-divider"></div>
          )}
        </React.Fragment>
      ))}
    </Paper>
  );
};

export default ProfileStats;