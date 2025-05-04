import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Menu, MenuItem, IconButton, Divider, ListItemIcon, ListItemText } from '@mui/material';
import { AccountCircle, Settings, ExitToApp, Notifications, Favorite, Pets, Help } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext.jsx';
import './UserMenu.css';
import apiService from '../../../services/api.service';

const UserMenu = ({ user }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    navigate('/profile');
    handleClose();
  };

  const handleSettings = () => {
    navigate('/settings');
    handleClose();
  };

  const handleMyPets = () => {
    navigate('/my-pets');
    handleClose();
  };

  const handleMyFavorites = () => {
    navigate('/favorites');
    handleClose();
  };

  const handleHelp = () => {
    navigate('/help');
    handleClose();
  };

  const handleLogout = async () => {
    try {
      await apiService.auth.logout();
      logout();
      navigate('/');
      handleClose();
    } catch (error) {
      console.error('Đăng xuất thất bại:', error);
      logout();
      navigate('/');
      handleClose();
    }
  };

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
            className="avatar-button"
          >
            <Avatar 
              src={user?.avatar} 
              alt={user?.name || 'User'} 
              className="user-avatar"
            />
          </IconButton>
        </div>
      </div>
      
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
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
          <Avatar src={user?.avatar} alt={user?.name || 'User'} />
          <div className="user-details">
            <div className="user-name">{user?.fullname || user?.name || 'User'}</div>
            <div className="user-email">{user?.email || ''}</div>
          </div>
        </div>
        
        <Divider />
        
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          <ListItemText>Hồ sơ cá nhân</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleMyPets}>
          <ListItemIcon>
            <Pets fontSize="small" />
          </ListItemIcon>
          <ListItemText>Thú cưng của tôi</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleMyFavorites}>
          <ListItemIcon>
            <Favorite fontSize="small" />
          </ListItemIcon>
          <ListItemText>Yêu thích</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleSettings}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText>Cài đặt</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleHelp}>
          <ListItemIcon>
            <Help fontSize="small" />
          </ListItemIcon>
          <ListItemText>Trợ giúp</ListItemText>
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <ExitToApp fontSize="small" />
          </ListItemIcon>
          <ListItemText>Đăng xuất</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default UserMenu;