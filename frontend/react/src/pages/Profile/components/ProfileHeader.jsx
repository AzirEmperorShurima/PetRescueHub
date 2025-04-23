import React, { useState, useRef } from 'react';
import { Container, Typography, Button, Avatar, Box, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const ProfileHeader = ({ user }) => {
  const defaultCover = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
  const defaultAvatar = 'https://i.pravatar.cc/300';
  
  const [avatar, setAvatar] = useState(user?.avatar || defaultAvatar);
  const [coverImage, setCoverImage] = useState(user?.coverImage || defaultCover);
  
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);
  
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
  
  const handleCoverChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverImage(e.target.result);
        // Ở đây bạn có thể thêm logic để gửi ảnh lên server
        console.log('Ảnh bìa mới đã được chọn:', file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="profile-cover-container">
        <div 
          className="profile-cover"
          style={{ backgroundImage: `url(${coverImage})` }}
        >
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            ref={coverInputRef}
            onChange={handleCoverChange}
          />
          <Button 
            variant="contained" 
            size="small" 
            className="cover-edit-button"
            startIcon={<CameraAltIcon />}
            onClick={() => coverInputRef.current.click()}
          >
            Chỉnh sửa ảnh bìa
          </Button>
        </div>
      </div>

      <Container maxWidth="lg">
        <div className="profile-header-container">
          <div className="profile-header">
            <div className="profile-avatar-section">
              <div className="profile-avatar-wrapper">
                <Avatar 
                  src={avatar} 
                  alt={user?.name}
                  className="profile-avatar"
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
              </div>
              
              <div className="profile-name-container">
                <Typography variant="h4" className="profile-name">
                  {user?.name}
                </Typography>
                <Typography variant="subtitle1" className="profile-username">
                  @{user?.username || user?.name?.toLowerCase().replace(/\s+/g, '')}
                </Typography>
                <Typography variant="body1" className="profile-bio">
                  {user?.bio || "Tôi là một tín đồ yêu động vật và luôn mong muốn giúp đỡ những thú cưng cần được cứu trợ."}
                </Typography>
              </div>
            </div>
            
            <div className="profile-actions-container">
              <Button 
                variant="contained" 
                className="edit-profile-button"
                startIcon={<EditIcon />}
              >
                Chỉnh sửa hồ sơ
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default ProfileHeader;