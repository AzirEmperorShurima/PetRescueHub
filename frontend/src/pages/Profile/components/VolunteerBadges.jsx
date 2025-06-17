import React from 'react';
import { 
  Box, Text, SimpleGrid, Tooltip, Avatar, Progress, Card, CardBody, VStack
} from '@chakra-ui/react';
import {
  FiAward, FiUsers, FiHeart, FiStar, FiTrendingUp, FiZap
} from 'react-icons/fi';

const VolunteerBadges = ({ user, achievements = [] }) => {
  // Nếu không phải volunteer thì không hiển thị
  if (user?.role !== 'volunteer') {
    return null;
  }
  
  // Tạo danh sách huy hiệu với thông tin chi tiết
  const badges = [
    {
      id: 'rescue-hero',
      icon: <FiUsers size={24} />,
      title: 'Người hùng cứu hộ',
      description: 'Đã tham gia cứu trợ thành công nhiều thú cưng',
      progress: Math.min(100, (user?.rescuedPets || 0) * 10), // 10 thú cưng = 100%
      value: user?.rescuedPets || 0,
      target: 10,
      color: 'pink'
    },
    {
      id: 'pet-lover',
      icon: <FiHeart size={24} />,
      title: 'Người yêu thú cưng',
      description: 'Đăng ký hồ sơ và chăm sóc nhiều thú cưng',
      progress: Math.min(100, (user?.petsCount || 0) * 20), // 5 thú cưng = 100%
      value: user?.petsCount || 0,
      target: 5,
      color: 'blue'
    },
    {
      id: 'community-star',
      icon: <FiStar size={24} />,
      title: 'Ngôi sao cộng đồng',
      description: 'Đóng góp tích cực cho cộng đồng yêu thú cưng',
      progress: Math.min(100, (user?.contributionPoints || 0) * 2), // 50 điểm = 100%
      value: user?.contributionPoints || 0,
      target: 50,
      color: 'orange'
    },
    {
      id: 'donation-heart',
      icon: <FiHeart size={24} />,
      title: 'Trái tim nhân ái',
      description: 'Quyên góp và hỗ trợ các hoạt động cứu trợ',
      progress: Math.min(100, (user?.donationCount || 0) * 10), // 10 lần = 100%
      value: user?.donationCount || 0,
      target: 10,
      color: 'green'
    },
    {
      id: 'rescue-streak',
      icon: <FiZap size={24} />,
      title: 'Chuỗi hoạt động',
      description: 'Duy trì hoạt động cứu hộ liên tục',
      progress: Math.min(100, (user?.activityStreak || 0) * 5), // 20 ngày = 100%
      value: user?.activityStreak || 0,
      target: 20,
      color: 'purple'
    },
    // Thêm các huy hiệu từ achievements
    ...achievements.map((achievement, index) => ({
      id: `achievement-${index}`,
      icon: <FiAward size={24} />,
      title: achievement.title || 'Thành tích',
      description: achievement.content || 'Đã đạt được thành tích đặc biệt',
      progress: 100, // Đã đạt được
      value: 1,
      target: 1,
      color: 'teal'
    }))
  ];

  return (
    <Box mt={6}>
      <Text fontSize="xl" fontWeight="bold" mb={6}>
        Huy hiệu & Thành tích
      </Text>
      
      <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
        {badges.map((badge) => (
          <Tooltip 
            key={badge.id}
            label={`${badge.value}/${badge.target} - ${badge.description}`} 
            placement="top"
            hasArrow
          >
            <Card
              cursor="pointer"
              transition="all 0.3s ease"
              _hover={{ 
                transform: 'translateY(-5px)',
                shadow: 'lg'
              }}
              shadow="md"
              borderRadius="xl"
            >
              <CardBody p={4}>
                <VStack spacing={3}>
                  <Avatar
                    size="lg"
                    bg={`${badge.color}.100`}
                    color={`${badge.color}.600`}
                    icon={badge.icon}
                  />
                  
                  <VStack spacing={1}>
                    <Text 
                      fontSize="sm" 
                      fontWeight="bold" 
                      textAlign="center"
                      noOfLines={2}
                    >
                      {badge.title}
                    </Text>
                    <Text fontSize="xs" color="gray.600">
                      {badge.value}/{badge.target}
                    </Text>
                  </VStack>
                  
                  <Progress 
                    value={badge.progress} 
                    colorScheme={badge.color}
                    size="sm"
                    width="100%"
                    borderRadius="full"
                  />
                </VStack>
              </CardBody>
            </Card>
          </Tooltip>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default VolunteerBadges;