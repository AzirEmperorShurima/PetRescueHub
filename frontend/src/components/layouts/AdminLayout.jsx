import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet, NavLink } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Avatar,
  Menu,
  MenuItem,
  ListItemButton,
  Badge,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as DashboardIcon,
  People as PeopleIcon,
  Pets as PetsIcon,
  Event as EventIcon,
  MonetizationOn as DonationIcon,
  Handshake as HandshakeIcon,
  AccountCircle,
  ChevronLeft as ChevronLeftIcon,
  Email as EmailIcon,
  Help as HelpIcon,
  Settings as SettingsIcon,
  Lock as LockIcon,
  ExitToApp as LogoutIcon,
  Notifications as NotificationsIcon,
  LocalHospital as RescueIcon,
  Report as ReportIcon
} from '@mui/icons-material';
// Import logo
import logo from '../../assets/images/logo.svg';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import axios from 'axios';

const drawerWidth = 260;

const AdminLayout = () => {
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  // const { showSuccess, showError } = useNotification();

  // Fetch notifications thật từ API
  useEffect(() => {
    // const fetchNotifications = async () => {
    //   try {
    //     const res = await axios.get('/api/admin/notifications', { withCredentials: true });
    //     setNotifications(res.data || []);
    //   } catch (error) {
    //     setNotifications([]);
    //   }
    // };
    // fetchNotifications();
  }, []);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate('/admin/profile');
  };

  const handleMessagesClick = () => {
    handleMenuClose();
    // Điều hướng đến trang tin nhắn
    navigate('/admin/messages');
  };

  const handleHelpCenterClick = () => {
    handleMenuClose();
    // Mở trung tâm trợ giúp
    window.open('/admin/help', '_blank');
  };

  const handleSettingsClick = () => {
    handleMenuClose();
    // Điều hướng đến trang cài đặt
    navigate('/admin/settings');
  };

  const handleBackToUserPage = () => {
    handleMenuClose();
    localStorage.removeItem('screenLocked');
    navigate('/');
  };

  const handleLogout = async () => {
    handleMenuClose();
    try {
      await logout();
      showSuccess('Đăng xuất thành công!');
      navigate('/');
    } catch (error) {
      showError('Đăng xuất thất bại. Vui lòng thử lại.');
      navigate('/');
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { text: 'Quản lý cứu hộ', icon: <RescueIcon />, path: '/admin/rescues' },
    { text: 'Quản lý người dùng', icon: <PeopleIcon />, path: '/admin/users' },
    { text: 'Quản lý thú cưng', icon: <PetsIcon />, path: '/admin/pets' },
    { text: 'Quản lý tình nguyện viên', icon: <HandshakeIcon />, path: '/admin/volunteers' },
    { text: 'Quản lý sự kiện', icon: <EventIcon />, path: '/admin/events' },
    { text: 'Quản lý quyên góp', icon: <DonationIcon />, path: '/admin/donations' },
    { text: 'Quản lý báo cáo', icon: <ReportIcon />, path: '/admin/reports' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          transition: (theme) => theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: (theme) => theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
          bgcolor: '#D34F81',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Pet Rescue Hub - Quản trị viên
          </Typography>
          
          {/* Thêm nút thông báo */}
          <Tooltip title="Thông báo">
            <IconButton 
              color="inherit"
              onClick={handleNotificationMenuOpen}
              sx={{ mr: 2 }}
            >
              <Badge badgeContent={notifications.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          {/* Menu thông báo */}
          <Menu
            id="notification-menu"
            anchorEl={notificationAnchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(notificationAnchorEl)}
            onClose={handleNotificationMenuClose}
            PaperProps={{
              sx: { width: 320, maxHeight: 400, mt: 1 }
            }}
          >
            {notifications.length === 0 ? (
              <MenuItem disabled>
                <Typography variant="body2" color="text.secondary">Không có thông báo mới</Typography>
              </MenuItem>
            ) : (
              notifications.map((noti) => (
                <MenuItem key={noti.id} onClick={handleNotificationMenuClose}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{noti.title}</Typography>
                    <Typography variant="body2">{noti.content}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {new Date(noti.createdAt).toLocaleString('vi-VN')}
                    </Typography>
                  </Box>
                </MenuItem>
              ))
            )}
          </Menu>
          
          {/* Nút profile */}
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          
          {/* Menu profile */}
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: { 
                width: 220,
                mt: 1,
                '& .MuiMenuItem-root': {
                  py: 1.5
                }
              }
            }}
          >
            <MenuItem onClick={handleMessagesClick}>
              <ListItemIcon sx={{ color: '#1976d2' }}>
                <EmailIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Messages" />
            </MenuItem>
            
            <MenuItem onClick={handleHelpCenterClick}>
              <ListItemIcon sx={{ color: '#1976d2' }}>
                <HelpIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Help Center" />
            </MenuItem>
            
            <MenuItem onClick={handleSettingsClick}>
              <ListItemIcon sx={{ color: '#1976d2' }}>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </MenuItem>
            
            <Divider />
            
            <MenuItem onClick={handleBackToUserPage}>
              <ListItemIcon sx={{ color: '#1976d2' }}>
                <LockIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="About user page" />
            </MenuItem>
            
            <MenuItem onClick={handleLogout}>
              <ListItemIcon sx={{ color: '#f44336' }}>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Log out" sx={{ color: '#f44336' }} />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      {/* Khôi phục lại phần Drawer */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : 64,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 64,
            transition: (theme) => theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
            backgroundColor: '#f8f9fa',
            borderRight: '1px solid #e0e0e0',
          },
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: open ? 'flex-end' : 'center',
            px: [1],
          }}
        >
          {open && (
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <img src={logo} alt="Logo" style={{ height: 40, marginRight: 10 }} />
              <Typography variant="h6" sx={{ color: '#D34F81', fontWeight: 600 }}>
                Pet Rescue Hub
              </Typography>
            </Box>
          )}
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List
          sx={{
            padding: '16px 8px',
          }}
        >
          {menuItems.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ display: 'block', mb: 2 }}>
              <ListItemButton
                component={NavLink}
                to={item.path}
                sx={{
                  minHeight: 48,
                  px: open ? 2.5 : 0,
                  justifyContent: open ? 'initial' : 'center',
                  borderRadius: '8px',
                  '&.active': {
                    bgcolor: 'rgba(211, 79, 129, 0.1)',
                    color: '#D34F81',
                    '& .MuiListItemIcon-root': {
                      color: '#D34F81',
                    },
                    fontWeight: 'bold',
                  },
                  '&:hover': {
                    bgcolor: 'rgba(211, 79, 129, 0.05)',
                  },
                  ...(open ? {} : { py: 1.5 }),
                }}
                end
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: 'inherit',
                    fontSize: !open ? '1.5rem' : 'inherit',
                    '& .MuiSvgIcon-root': {
                      fontSize: !open ? '1.75rem' : '1.5rem',
                    },
                    ...(open ? {} : {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      ml: 0,
                      mr: 0
                    }),
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    opacity: open ? 1 : 0,
                    display: open ? 'block' : 'none',
                    '& .MuiTypography-root': {
                      fontWeight: 'normal',
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          bgcolor: '#f8f9fa',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default AdminLayout;