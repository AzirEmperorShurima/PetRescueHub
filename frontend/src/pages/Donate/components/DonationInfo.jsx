import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Divider,
  Flex,
  Tag,
  Card,
  CardBody,
  Image,
  Button,
  Stack,
  useTheme,
} from '@chakra-ui/react';
import { FaPaw, FaHeart, FaHandsHelping } from 'react-icons/fa';
import { motion } from 'framer-motion';

// DonationInfo Component
const DonationInfo = ({ rescueStats }) => {
  const { colors } = useTheme();

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'pets':
        return <FaPaw size={24} color={colors.brand[500]} />;
      case 'favorite':
        return <FaHeart size={24} color={colors.brand[500]} />;
      case 'volunteer':
        return <FaHandsHelping size={24} color={colors.brand[500]} />;
      default:
        return null;
    }
  };

  return (
    <Card
      boxShadow="lg"
      borderRadius="lg"
      bg="white"
      _hover={{ boxShadow: 'xl', transform: 'translateY(-4px)' }}
      transition="all 0.3s"
    >
      <CardBody p={{ base: 4, md: 6 }}>
        <Text fontSize={{ base: 'md', md: 'lg' }} mb={4} lineHeight="tall">
          PetRescueHub là nơi đem đến hy vọng và sự sống mới cho những người bạn nhỏ vô gia cư. Mọi hoạt động của chúng tôi đều phụ thuộc hoàn toàn vào tấm lòng vàng từ cộng đồng. Mỗi tháng, nhóm phải đối mặt với những chi phí không nhỏ, bao gồm tiền thuê nhà, viện phí, thức ăn, điện, nước, thuốc men, cùng các vật dụng thiết yếu như bỉm, tã và đồ dùng.
        </Text>

        <Box
          bg="brand.50"
          p={4}
          borderLeft="4px solid"
          borderColor="brand.500"
          borderRadius="md"
          textAlign="center"
          mb={6}
        >
          <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold" color="brand.500">
            Hãy giúp chúng tôi lan tỏa lòng yêu thương, vì một thế giới mà không ai bị bỏ rơi.
          </Text>
        </Box>

        <Divider my={6} />

        <Text fontSize={{ base: 'md', md: 'lg' }} mb={4} lineHeight="tall">
          Chi phí sẽ được chia đều cho các bé khác còn nằm viện và gây dựng nhà chung. Ngoài ra, nhóm cũng tiếp nhận quyên góp bằng hiện vật như:
        </Text>

        <Flex wrap="wrap" gap={3} mb={6}>
          {['Quần áo cũ', 'Bỉm', 'Găng tay y tế', 'Thức ăn', 'Cát vệ sinh'].map((item) => (
            <Tag
              key={item}
              size="lg"
              variant="solid"
              bg="brand.500"
              color="white"
              borderRadius="full"
              px={4}
              py={2}
              _hover={{ bg: 'brand.600' }}
              transition="background-color 0.2s"
            >
              {item}
            </Tag>
          ))}
        </Flex>

        <Text fontSize="sm" color="gray.600" fontStyle="italic">
          *Lưu ý: Nhóm không dùng Zalo và KHÔNG BAO GIỜ yêu cầu Mạnh Thường Quân cung cấp thông tin thẻ hoặc mã OTP.
        </Text>
      </CardBody>
    </Card>
  );
};

export default DonationInfo;