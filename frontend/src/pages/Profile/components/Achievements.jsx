import React from 'react';
import { Typography, Box, Chip, Tooltip } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PetsIcon from '@mui/icons-material/Pets';

const Achievements = ({ achievements, user }) => {
  // Nếu không phải volunteer thì không hiển thị
  if (user?.role !== 'volunteer') {
    return null;
  }
  
  // Thành tích cố định + thành tích động từ props
  const allAchievements = [
    {
      id: 'rescue-5',
      icon: <VolunteerActivismIcon className="achievement-icon" />,
      label: 'Đã cứu trợ 5 thú cưng',
      tooltip: 'Đã tham gia cứu trợ thành công 5 thú cưng'
    },
    {
      id: 'donate-10',
      icon: <FavoriteIcon className="achievement-icon" />,
      label: 'Nhà hảo tâm',
      tooltip: 'Đã quyên góp 10 lần cho các hoạt động cứu trợ'
    },
    {
      id: 'pet-lover',
      icon: <PetsIcon className="achievement-icon" />,
      label: 'Người yêu thú cưng',
      tooltip: 'Đã đăng ký 3 hồ sơ thú cưng'
    },
    ...(achievements || []).map(a => ({
      id: a.id || `achievement-${Math.random()}`,
      icon: <EmojiEventsIcon className="achievement-icon" />,
      label: a.title || 'Thành tích',
      tooltip: a.content || 'Đã đạt được thành tích'
    }))
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Thành tích</Typography>
      
      <div className="achievements-container">
        {allAchievements.map((achievement) => (
          <Tooltip 
            key={achievement.id}
            title={achievement.tooltip} 
            arrow 
            placement="top"
          >
            <Chip
              icon={achievement.icon}
              label={achievement.label}
              className="achievement-chip"
            />
          </Tooltip>
        ))}
      </div>
    </Box>
  );
};

export default Achievements;