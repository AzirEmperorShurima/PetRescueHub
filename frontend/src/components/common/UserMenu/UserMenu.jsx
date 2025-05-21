import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Menu, MenuItem, IconButton, Divider, ListItemIcon, ListItemText } from '@mui/material';
import { AccountCircle, Settings, ExitToApp, Notifications, Favorite, Pets, Help } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useNotification } from '../../contexts/NotificationContext';
import './UserMenu.css';

const UserMenu = ({ user }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { showSuccess } = useNotification();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Sử dụng useCallback để tối ưu hóa các hàm xử lý sự kiện
  const handleClick = useCallback((event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    if (anchorEl) {
      setAnchorEl(null);
    }
  }, [anchorEl]);
  

  // Tạo hàm điều hướng chung để giảm lặp code
  const handleNavigation = useCallback((path) => {
    handleClose();
    setTimeout(() => {
      navigate(path);
    }, 100);
  }, [handleClose, navigate]);

  // Các hàm xử lý sự kiện sử dụng hàm điều hướng chung
  const handleProfile = useCallback(() => {
    handleClose();
    setTimeout(() => {
      navigate('/profile');
    }, 100); // Chờ 100ms để menu đóng
  }, [handleClose, navigate]);
  
  const handleSettings = useCallback(() => handleNavigation('/settings'), [handleNavigation]);
  const handleMyPets = useCallback(() => handleNavigation('/my-pets'), [handleNavigation]);
  const handleMyFavorites = useCallback(() => handleNavigation('/favorites'), [handleNavigation]);
  const handleHelp = useCallback(() => handleNavigation('/help'), [handleNavigation]);

  const handleLogout = useCallback(async () => {
    try {
      handleClose();
      await logout();
      showSuccess('Đăng xuất thành công!');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Đăng xuất thất bại. Vui lòng thử lại.';
      showSuccess('Đăng xuất thất bại: ' + errorMessage);
      navigate('/');
    }
  }, [handleClose, logout, navigate, showSuccess]);

  // Tạo mảng các mục menu để dễ dàng quản lý và mở rộng
  const menuItems = [
    { icon: <AccountCircle fontSize="small" />, text: 'Hồ sơ cá nhân', onClick: handleProfile },
    { icon: <Pets fontSize="small" />, text: 'Thú cưng của tôi', onClick: handleMyPets },
    { icon: <Favorite fontSize="small" />, text: 'Yêu thích', onClick: handleMyFavorites },
    { icon: <Settings fontSize="small" />, text: 'Cài đặt', onClick: handleSettings },
    { icon: <Help fontSize="small" />, text: 'Trợ giúp', onClick: handleHelp },
    { divider: true },
    { icon: <ExitToApp fontSize="small" />, text: 'Đăng xuất', onClick: handleLogout }
  ];

  const defaultAvatar = `${process.env.REACT_APP_API_URL}/root/Default_Avatar_Non_Align.jpg`;

  return (
    <div className="user-menu-container">
      <div className="user-menu-icons">
        <IconButton color="inherit" aria-label="notifications" className="notification-button">
          <Notifications className="notification-icon" />
        </IconButton>
        
        <div className="user-info-preview">
          <span className="user-name-preview">{user?.fullname}</span>
          <IconButton
            onClick={handleClick}
            size="small"
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar 
              src={user?.avatar || defaultAvatar}
              alt={user?.fullname || 'User Avatar'}
              sx={{ width: 32, height: 32 }}
            />
          </IconButton>
        </div>
      </div>
      
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        disableScrollLock={true}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            width: 250,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <div className="user-info">
          <Avatar src={user?.avatar || defaultAvatar} alt={user?.name || 'User'} />
          <div className="user-details">
            <div className="user-name">{user?.fullname || user?.name || 'User'}</div>
            <div className="user-email">{user?.email || ''}</div>
          </div>
        </div>
        
        <Divider />
        
        {menuItems.map((item, index) => (
          item.divider ? (
            <Divider key={`divider-${index}`} />
          ) : (
            <MenuItem key={item.text} onClick={item.onClick}>
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText>{item.text}</ListItemText>
            </MenuItem>
          )
        ))}
      </Menu>
    </div>
  );
};

export default UserMenu;