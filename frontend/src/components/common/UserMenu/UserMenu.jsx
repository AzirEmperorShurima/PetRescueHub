import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Select,
  useDisclosure,
  FormControl,
  FormLabel,
  Icon,
  HStack,
} from '@chakra-ui/react';
import {
  FiUser,
  FiSettings,
  FiLogOut,
  FiHelpCircle,
  FiBell,
  FiMapPin,
  FiList,
} from 'react-icons/fi';
import { FaPaw, FaHeart } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useNotification } from '../../contexts/NotificationContext';
import './UserMenu.css';

const UserMenu = ({ user }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { showSuccess, showError } = useNotification();
  const { user: contextUser } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [rescueStatus, setRescueStatus] = useState('not ready');
  const [location, setLocation] = useState(null);

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

  // Kiểm tra quyền admin
  const isAdmin = contextUser && Array.isArray(contextUser.roles)
    ? contextUser.roles.some(r => (typeof r === 'string' ? (r === 'admin' || r === 'super_admin') : (r.name === 'admin' || r.name === 'super_admin')))
    : false;

  // Kiểm tra quyền volunteer
  const isVolunteer = contextUser && Array.isArray(contextUser.roles)
    ? contextUser.roles.some(r => (typeof r === 'string' ? r === 'volunteer' : r.name === 'volunteer'))
    : false;

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          showSuccess('Đã lấy vị trí thành công!');
        },
        (error) => {
          showError('Không thể lấy vị trí: ' + error.message);
        }
      );
    } else {
      showError('Trình duyệt của bạn không hỗ trợ định vị');
    }
  };

  const handleUpdateRescueStatus = async () => {
    if (!location) {
      showError('Vui lòng lấy vị trí trước khi cập nhật trạng thái');
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/volunteer/v1/updating/volunteer/status`,
        {
          volunteerStatus: rescueStatus,
          latitude: location.lat,
          longitude: location.lng
        },
        { withCredentials: true },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      console.log('response.data VOLUNTEER :' + response.data);
      if (response.data.success) {
        showSuccess('Cập nhật trạng thái thành công!');
        onClose();
        setLocation(null); // Reset location
        setRescueStatus('not ready'); // Reset status
      } else {
        showError(response.data.message || 'Cập nhật trạng thái thất bại');
      }
    } catch (error) {
      console.error('Update status error:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Cập nhật trạng thái thất bại';
      showError(errorMessage);
    }
  };

  const menuItems = [
    { icon: <FiUser />, text: 'Hồ sơ cá nhân', path: '/profile' },
    { icon: <FaPaw />, text: 'Thú cưng của tôi', path: '/my-pets' },
    { icon: <FaHeart />, text: 'Yêu thích', path: '/favorites' },
    { icon: <FiSettings />, text: 'Cài đặt', path: '/settings' },
    { icon: <FiHelpCircle />, text: 'Trợ giúp', path: '/help' },
    // Thêm option quản trị viên nếu là admin
    ...(isAdmin ? [{
      icon: <FiUser />,
      text: 'Quản trị viên',
      path: '/admin',
      style: {
        color: 'purple.700',
        fontWeight: 'bold',
        backgroundColor: 'purple.50',
        borderRadius: 'md',
        _hover: {
          backgroundColor: 'purple.100'
        }
      }
    }] : []),
    // Thêm các option cho volunteer
    ...(isVolunteer ? [
      {
        icon: <FiList />,
        text: 'Nhiệm vụ cứu hộ',
        path: '/volunteer/rescue-tasks',
        style: {
          color: 'green.500',
          fontWeight: 'bold',
          backgroundColor: 'green.50',
          borderRadius: 'md',
          _hover: {
            backgroundColor: 'green.100'
          }
        }
      },
      {
        icon: <FiMapPin />,
        text: 'Cập nhật trạng thái cứu hộ',
        onClick: onOpen,
        style: {
          color: 'blue.500',
          fontWeight: 'bold',
          backgroundColor: 'blue.50',
          borderRadius: 'md',
          _hover: {
            backgroundColor: 'blue.100'
          }
        }
      }
    ] : []),
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
                    {user?.fullname}
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
                  {...item.style}
                >
                  {item.text === 'Quản trị viên' ? (
                    <HStack
                      bg="white.100"
                      color="pink.700"
                      px={3}
                      py={1}
                      borderRadius="md"
                      fontWeight="bold"
                      fontSize="md"
                      w="100%"
                      spacing={2}
                    >
                      <Text>Quản trị viên</Text>
                    </HStack>
                  ) : item.text}
                </MenuItem>
              )
            ))}
          </MenuList>
        </Menu>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cập nhật trạng thái cứu hộ</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mb={4}>
              <FormLabel>Vị trí hiện tại</FormLabel>
              <Button
                leftIcon={<FiMapPin />}
                onClick={getCurrentLocation}
                colorScheme="blue"
                variant="outline"
                width="100%"
                mb={2}
              >
                Lấy vị trí hiện tại
              </Button>
              {location && (
                <Text fontSize="sm" color="gray.600">
                  Vĩ độ: {location.lat}, Kinh độ: {location.lng}
                </Text>
              )}
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Trạng thái cứu hộ</FormLabel>
              <Select
                value={rescueStatus}
                onChange={(e) => setRescueStatus(e.target.value)}
              >
                <option value="not ready">Không sẵn sàng</option>
                <option value="alreadyRescue">Sẵn sàng cứu hộ</option>
              </Select>
            </FormControl>

            <Button
              colorScheme="blue"
              onClick={handleUpdateRescueStatus}
              width="100%"
              isDisabled={!location}
              size="lg"
              fontWeight="bold"
              _hover={{
                transform: 'scale(1.02)',
                boxShadow: 'lg'
              }}
            >
              Cập nhật
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UserMenu;
