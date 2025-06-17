import React from 'react';
import { Box, Heading, Text, Grid, Avatar, Divider } from '@chakra-ui/react';
import { FaHeart, FaPaw } from 'react-icons/fa';
import { GiTrophy } from 'react-icons/gi';
import { MdArticle } from 'react-icons/md';
import { Icon } from '@chakra-ui/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

const ActivityTimeline = ({ user, rescues = [], donations = [], posts = [] }) => {
  if (user?.role !== 'volunteer') {
    return null;
  }

  const formatDate = (dateString) => {
    try {
      return dayjs(dateString).locale('vi').format('DD MMMM YYYY');
    } catch (error) {
      return 'Không rõ ngày';
    }
  };

  const createActivitiesList = () => {
    const activities = [];

    rescues.forEach((rescue) => {
      activities.push({
        id: `rescue-${rescue.id}`,
        type: 'rescue',
        icon: <Icon as={FaHeart} />,
        color: '#e91e63',
        title: rescue.title || 'Hoạt động cứu hộ',
        description: rescue.description || 'Đã tham gia cứu hộ thú cưng',
        date: rescue.reportedAt || new Date(),
        status: rescue.status,
      });
    });

    donations.forEach((donation) => {
      activities.push({
        id: `donation-${donation.id}`,
        type: 'donation',
        icon: <Icon as={FaHeart} />,
        color: '#4caf50',
        title: 'Quyên góp',
        description: `Đã quyên góp ${donation.amount.toLocaleString()} đồng cho ${donation.campaign || 'hoạt động cứu trợ'}`,
        date: donation.date || new Date(),
      });
    });

    posts.forEach((post) => {
      activities.push({
        id: `post-${post.id}`,
        type: 'post',
        icon: <Icon as={MdArticle} />,
        color: '#2196f3',
        title: 'Đăng bài viết',
        description: post.title || 'Đã đăng một bài viết mới',
        date: post.createdAt || new Date(),
      });
    });

    if (activities.length === 0) {
      activities.push(
        {
          id: 'sample-1',
          type: 'rescue',
          icon: <Icon as={FaHeart} />,
          color: '#e91e63',
          title: 'Cứu hộ thành công',
          description: 'Đã cứu hộ thành công một chú chó bị bỏ rơi tại quận 1',
          date: new Date(2023, 5, 15),
        },
        {
          id: 'sample-2',
          type: 'donation',
          icon: <Icon as={FaHeart} />,
          color: '#4caf50',
          title: 'Quyên góp',
          description: 'Đã quyên góp 500.000 đồng cho chiến dịch "Mái ấm cho mèo hoang"',
          date: new Date(2023, 4, 20),
        },
        {
          id: 'sample-3',
          type: 'achievement',
          icon: <Icon as={GiTrophy} />,
          color: '#ff9800',
          title: 'Đạt thành tích mới',
          description: 'Đã nhận huy hiệu "Người hùng cứu hộ" sau khi cứu trợ 10 thú cưng',
          date: new Date(2023, 3, 10),
        }
      );
    }

    return activities.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const activities = createActivitiesList();

  return (
    <Box mt={8}>
      <Heading as="h5" size="lg" mb={6}>
        Dòng thời gian hoạt động
      </Heading>
      <Box boxShadow="md" borderRadius="lg" p={6} bg="white">
        <Box position="relative">
          <Divider
            orientation="vertical"
            position="absolute"
            left={{ base: '20px', md: '50%' }}
            top={0}
            bottom={0}
            transform={{ md: 'translateX(-50%)' }}
            display={{ base: 'block', md: 'block' }}
            borderColor="gray.200"
          />
          {activities.map((activity, index) => (
            <Grid
              key={activity.id}
              templateColumns={{ base: '1fr', md: '5fr 2fr 5fr' }}
              mb={8}
              position="relative"
            >
              <Box
                textAlign={{ base: 'left', md: index % 2 === 0 ? 'right' : 'left' }}
                pr={{ md: index % 2 === 0 ? 6 : 0 }}
                pl={{ md: index % 2 === 0 ? 0 : 6 }}
                order={{ base: 2, md: index % 2 === 0 ? 1 : 3 }}
                mt={{ base: 2, md: 0 }}
                ml={{ base: 10, md: 0 }}
              >
                <Text color="gray.500">{formatDate(activity.date)}</Text>
              </Box>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="flex-start"
                order={{ base: 1, md: 2 }}
                position={{ base: 'absolute', md: 'static' }}
                left={{ base: '10px', md: 'auto' }}
              >
                <Avatar
                  bg={activity.color}
                  size="md"
                  boxShadow="md"
                  zIndex={1}
                  icon={activity.icon}
                />
              </Box>
              <Box
                order={{ base: 3, md: index % 2 === 0 ? 3 : 1 }}
                pl={{ base: 10, md: index % 2 === 0 ? 6 : 0 }}
                pr={{ md: index % 2 === 0 ? 0 : 6 }}
              >
                <Box
                  p={4}
                  bg="white"
                  borderRadius="md"
                  boxShadow="sm"
                  _hover={{ boxShadow: 'md', transition: 'box-shadow 0.3s ease-in-out' }}
                >
                  <Heading as="h6" size="sm">
                    {activity.title}
                  </Heading>
                  <Text fontSize="sm" color="gray.600" mt={2}>
                    {activity.description}
                  </Text>
                  {activity.status && (
                    <Text
                      fontSize="xs"
                      display="inline-block"
                      mt={2}
                      px={2}
                      py={1}
                      borderRadius="md"
                      bg={
                        activity.status === 'completed'
                          ? 'green.100'
                          : activity.status === 'in_progress'
                          ? 'blue.100'
                          : activity.status === 'pending'
                          ? 'yellow.100'
                          : 'gray.100'
                      }
                    >
                      {activity.status === 'completed'
                        ? 'Hoàn thành'
                        : activity.status === 'in_progress'
                        ? 'Đang thực hiện'
                        : activity.status === 'pending'
                        ? 'Đang chờ'
                        : 'Không xác định'}
                    </Text>
                  )}
                </Box>
              </Box>
            </Grid>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ActivityTimeline;