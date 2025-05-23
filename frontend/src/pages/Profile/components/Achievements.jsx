import React from 'react';
import { Box, Heading, Tag, Tooltip, HStack } from '@chakra-ui/react';
import { FaHeart, FaPaw } from 'react-icons/fa';
import { GiTrophy } from 'react-icons/gi';
import { Icon } from '@chakra-ui/icons';

const Achievements = ({ achievements, user }) => {
  if (user?.role !== 'volunteer') {
    return null;
  }

  const allAchievements = [
    {
      id: 'rescue-5',
      icon: <Icon as={FaHeart} className="achievement-icon" />,
      label: 'Đã cứu trợ 5 thú cưng',
      tooltip: 'Đã tham gia cứu trợ thành công 5 thú cưng',
    },
    {
      id: 'donate-10',
      icon: <Icon as={FaHeart} className="achievement-icon" />,
      label: 'Nhà hảo tâm',
      tooltip: 'Đã quyên góp 10 lần cho các hoạt động cứu trợ',
    },
    {
      id: 'pet-lover',
      icon: <Icon as={FaPaw} className="achievement-icon" />,
      label: 'Người yêu thú cưng',
      tooltip: 'Đã đăng ký 3 hồ sơ thú cưng',
    },
    ...(achievements || []).map((a) => ({
      id: a.id || `achievement-${Math.random()}`,
      icon: <Icon as={GiTrophy} className="achievement-icon" />,
      label: a.title || 'Thành tích',
      tooltip: a.content || 'Đã đạt được thành tích',
    })),
  ];

  return (
    <Box>
      <Heading as="h5" size="lg" mb={4}>
        Thành tích
      </Heading>
      <HStack spacing={3} className="achievements-container" wrap="wrap">
        {allAchievements.map((achievement) => (
          <Tooltip
            key={achievement.id}
            label={achievement.tooltip}
            hasArrow
            placement="top"
          >
            <Tag
              size="lg"
              variant="solid"
              colorScheme="blue"
              className="achievement-chip"
            >
              {achievement.icon}
              <Box ml={2}>{achievement.label}</Box>
            </Tag>
          </Tooltip>
        ))}
      </HStack>
    </Box>
  );
};

export default Achievements;