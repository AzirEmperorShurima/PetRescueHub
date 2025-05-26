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

  const handleNavigation = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      showSuccess('Đăng xuất thành công!');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Đăng xuất thất bại. Vui lòng thử lại.';
      showSuccess('Đăng xuất thất bại: ' + errorMessage);
      navigate('/');
    }
  }, [logout, navigate, showSuccess]);

  const menuItems = [
    { icon: <FiUser />, text: 'Hồ sơ cá nhân', path: '/profile' },
    { icon: <FaPaw />, text: 'Thú cưng của tôi', path: '/my-pets' },
    { icon: <FaHeart />, text: 'Yêu thích', path: '/favorites' },
    { icon: <FiSettings />, text: 'Cài đặt', path: '/settings' },
    { icon: <FiHelpCircle />, text: 'Trợ giúp', path: '/help' },
    { divider: true },
    { icon: <FiLogOut />, text: 'Đăng xuất', onClick: handleLogout }
  ];

  const defaultAvatar = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/root/Default_Avatar_Non_Align.jpg`;

  return (
    <div className="nav-buttons">
      <Flex className="user-menu-container" alignItems="center" justifyContent="center">
        <IconButton
          aria-label="notifications"
          icon={<FiBell />}
          variant="ghost"
          className="notification-button"
          size="sm"
        />

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
          <MenuList zIndex={100} boxShadow="lg" width="280px">
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
                <MenuItem
                  key={item.text}
                  icon={item.icon}
                  onClick={item.onClick || (() => handleNavigation(item.path))}
                >
                  {item.text}
                </MenuItem>
              )
            ))}
          </MenuList>
        </Menu>
      </Flex>
    </div>
  );
};

export default UserMenu;
