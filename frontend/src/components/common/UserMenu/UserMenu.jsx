import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
  Box,
  Text,
  Flex,
} from '@chakra-ui/react';
import {
  FiUser,
  FiSettings,
  FiLogOut,
  FiHelpCircle,
  FiBell,
} from 'react-icons/fi';
import { FaPaw, FaHeart } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useNotification } from '../../contexts/NotificationContext';
import './UserMenu.css';

const UserMenu = ({ user }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { showSuccess } = useNotification();
  const [anchorEl, setAnchorEl] = useState(null);

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
    { icon: <FiUser />, text: 'Hồ sơ cá nhân', onClick: handleProfile },
    { icon: <FaPaw />, text: 'Thú cưng của tôi', onClick: handleMyPets },
    { icon: <FaHeart />, text: 'Yêu thích', onClick: handleMyFavorites },
    { icon: <FiSettings />, text: 'Cài đặt', onClick: handleSettings },
    { icon: <FiHelpCircle />, text: 'Trợ giúp', onClick: handleHelp },
    { divider: true },
    { icon: <FiLogOut />, text: 'Đăng xuất', onClick: handleLogout }
  ];

  const defaultAvatar = `${process.env.REACT_APP_API_URL}/root/Default_Avatar_Non_Align.jpg`;

  return (
    <Box className="user-menu-container">
      <Flex className="user-menu-icons" alignItems="center">
        <IconButton
          aria-label="notifications"
          icon={<FiBell />}
          variant="ghost"
          className="notification-button"
          color="inherit"
        />
        
        <Flex className="user-info-preview" alignItems="center">
          <Text className="user-name-preview" mr={2}>{user?.fullname}</Text>
          <Menu>
            <MenuButton
              as={IconButton}
              size="sm"
              rounded="full"
              variant="link"
              cursor="pointer"
              minW={0}
            >
              <Avatar 
                src={user?.avatar || defaultAvatar}
                name={user?.fullname || 'User Avatar'}
                size="sm"
              />
            </MenuButton>
            <MenuList
              zIndex={100}
              boxShadow="lg"
              width="250px"
            >
              <Box p={3} className="user-info">
                <Flex alignItems="center">
                  <Avatar 
                    src={user?.avatar || defaultAvatar} 
                    name={user?.fullname || 'User'} 
                    size="sm"
                    mr={2}
                  />
                  <Box className="user-details">
                    <Text fontWeight="bold" className="user-name">
                      {user?.fullname || user?.name || 'User'}
                    </Text>
                    <Text fontSize="sm" color="gray.600" className="user-email">
                      {user?.email || ''}
                    </Text>
                  </Box>
                </Flex>
              </Box>
              
              <MenuDivider />
              
              {menuItems.map((item, index) => (
                item.divider ? (
                  <MenuDivider key={`divider-${index}`} />
                ) : (
                  <MenuItem key={item.text} onClick={item.onClick} icon={item.icon}>
                    {item.text}
                  </MenuItem>
                )
              ))}
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
};

export default UserMenu;