import React, { useState, useRef } from 'react';
import { Typography, Button, Avatar, Box, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const ProfileHeader = ({ user }) => {
  const defaultAvatar = 'https://i.pravatar.cc/300';
  
  const [avatar, setAvatar] = useState(user?.avatar || defaultAvatar);
  
  const avatarInputRef = useRef(null);
  
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target.result);
        // Ở đây bạn có thể thêm logic để gửi ảnh lên server
        console.log('Avatar mới đã được chọn:', file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box className="profile-header-container" sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', sm: 'row' },
      alignItems: 'center',
      gap: 3,
      py: 3
    }}>
      <Box className="profile-avatar-wrapper" sx={{ position: 'relative' }}>
        <Avatar 
          src={avatar} 
          alt={user?.name}
          sx={{ 
            width: 120, 
            height: 120,
            border: '4px solid #fff',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }}
        />
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          ref={avatarInputRef}
          onChange={handleAvatarChange}
        />
        <Tooltip title="Thay đổi ảnh đại diện" placement="top">
          <IconButton 
            className="avatar-edit-button"
            size="small"
            onClick={() => avatarInputRef.current.click()}
            sx={{
              position: 'absolute',
              bottom: 5,
              right: 5,
              backgroundColor: 'rgba(255, 255, 255, 0.9) !important',
              color: '#555 !important',
              width: '30px !important',
              height: '30px !important',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2) !important',
              '&:hover': {
                backgroundColor: '#fff !important',
                transform: 'scale(1.1)'
              }
            }}
          >
            <CameraAltIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      
      <Box className="profile-info" sx={{ textAlign: { xs: 'center', sm: 'left' }, flex: 1 }}>
        <Typography variant="h4" className="profile-name" gutterBottom>
          {user?.fullname || user?.name}
        </Typography>
        <Typography variant="subtitle1" className="profile-username" color="text.secondary">
          @{user?.username || (user?.fullname || user?.name)?.toLowerCase().replace(/\s+/g, '')}
        </Typography>
        <Typography variant="body1" className="profile-bio" sx={{ mt: 1 }}>
          {user?.bio || "Tôi là một tín đồ yêu động vật và luôn mong muốn giúp đỡ những thú cưng cần được cứu trợ."}
        </Typography>
      </Box>
      
      <Button 
        variant="contained" 
        className="edit-profile-button"
        startIcon={<EditIcon />}
        sx={{ 
          alignSelf: { xs: 'center', sm: 'flex-start' },
          bgcolor: '#e91e63', 
          '&:hover': { bgcolor: '#c2185b' },
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}
      >
        Chỉnh sửa hồ sơ
      </Button>
    </Box>
  );
};

export default ProfileHeader;