import React from 'react';
import { 
  Typography, 
  Box, 
  Button, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Divider,
  Paper
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';

const ProfileActions = ({ user }) => {
  return (
    <Paper className="profile-sidebar" elevation={0}>
      <Typography variant="h6" className="sidebar-title">
        Thông tin cá nhân
      </Typography>
      
      <List>
        <ListItem className="info-item">
          <ListItemIcon>
            <EmailIcon color="primary" />
          </ListItemIcon>
          <ListItemText 
            primary="Email" 
            secondary={user.email || 'example@petrescuehub.com'} 
            className="profile-email"
          />
        </ListItem>
        
        <ListItem className="info-item">
          <ListItemIcon>
            <LocationOnIcon color="primary" />
          </ListItemIcon>
          <ListItemText 
            primary="Địa chỉ" 
            secondary={user.location || 'TP. Hồ Chí Minh, Việt Nam'} 
          />
        </ListItem>
        
        <ListItem className="info-item">
          <ListItemIcon>
            <CalendarTodayIcon color="primary" />
          </ListItemIcon>
          <ListItemText 
            primary="Tham gia từ" 
            secondary={user.joinDate || 'Tháng 1, 2023'} 
          />
        </ListItem>
      </List>
      
      <Divider className="sidebar-divider" />
      
      <div className="profile-actions">
        <Button 
          variant="contained" 
          fullWidth 
          className="edit-profile-button"
          startIcon={<EditIcon />}
        >
          Chỉnh sửa hồ sơ
        </Button>
        
        <Button 
          variant="outlined" 
          fullWidth 
          startIcon={<SettingsIcon />}
        >
          Cài đặt tài khoản
        </Button>
        
        <Button 
          variant="text" 
          fullWidth 
          className="cancel-button"
          startIcon={<LogoutIcon />}
        >
          Đăng xuất
        </Button>
      </div>
    </Paper>
  );
};

export default ProfileActions;