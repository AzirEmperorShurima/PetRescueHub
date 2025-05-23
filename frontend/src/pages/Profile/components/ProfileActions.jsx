import React from 'react';
import { 
  Text, 
  Box, 
  Button, 
  VStack,
  HStack,
  Divider,
  Card,
  CardBody
} from '@chakra-ui/react';
import { 
  FiMail, FiMapPin, FiCalendar, FiEdit, 
  FiLogOut, FiSettings 
} from 'react-icons/fi';

const ProfileActions = ({ user }) => {
  return (
    <Card className="profile-sidebar" shadow="none">
      <CardBody>
        <Text fontSize="lg" fontWeight="bold" className="sidebar-title" mb={4}>
          Thông tin cá nhân
        </Text>
        
        <VStack spacing={4} align="stretch">
          <Box className="info-item">
            <HStack spacing={3}>
              <Box color="pink.500">
                <FiMail size={20} />
              </Box>
              <VStack align="flex-start" spacing={0}>
                <Text fontSize="sm" fontWeight="semibold" color="gray.600">
                  Email
                </Text>
                <Text fontSize="sm" className="profile-email">
                  {user.email || 'example@petrescuehub.com'}
                </Text>
              </VStack>
            </HStack>
          </Box>
          
          <Box className="info-item">
            <HStack spacing={3}>
              <Box color="pink.500">
                <FiMapPin size={20} />
              </Box>
              <VStack align="flex-start" spacing={0}>
                <Text fontSize="sm" fontWeight="semibold" color="gray.600">
                  Địa chỉ
                </Text>
                <Text fontSize="sm">
                  {user.location || 'TP. Hồ Chí Minh, Việt Nam'}
                </Text>
              </VStack>
            </HStack>
          </Box>
          
          <Box className="info-item">
            <HStack spacing={3}>
              <Box color="pink.500">
                <FiCalendar size={20} />
              </Box>
              <VStack align="flex-start" spacing={0}>
                <Text fontSize="sm" fontWeight="semibold" color="gray.600">
                  Tham gia từ
                </Text>
                <Text fontSize="sm">
                  {user.joinDate || 'Tháng 1, 2023'}
                </Text>
              </VStack>
            </HStack>
          </Box>
        </VStack>
        
        <Divider className="sidebar-divider" my={6} />
        
        <VStack spacing={3} className="profile-actions">
          <Button 
            colorScheme="pink"
            width="full"
            className="edit-profile-button"
            leftIcon={<FiEdit />}
          >
            Chỉnh sửa hồ sơ
          </Button>
          
          <Button 
            variant="outline"
            width="full"
            leftIcon={<FiSettings />}
          >
            Cài đặt tài khoản
          </Button>
          
          <Button 
            variant="ghost"
            width="full"
            className="cancel-button"
            leftIcon={<FiLogOut />}
            colorScheme="red"
          >
            Đăng xuất
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default ProfileActions;