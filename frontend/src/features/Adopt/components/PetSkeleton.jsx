import React from 'react';
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  VStack,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';

const PetSkeleton = () => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Card
      bg={cardBg}
      borderColor={borderColor}
      borderWidth="1px"
      shadow="md"
      borderRadius="xl"
      overflow="hidden"
      h="full"
      display="flex"
      flexDirection="column"
      _hover={{
        shadow: 'lg',
        transform: 'translateY(-2px)',
      }}
      transition="all 0.3s ease"
    >
      {/* Image Skeleton */}
      <Box position="relative" w="full" paddingTop="75%" overflow="hidden">
        <Skeleton
          position="absolute"
          top={0}
          left={0}
          w="full"
          h="full"
          startColor="gray.200"
          endColor="gray.300"
          speed={1.5}
        />
        {/* Status Badge Skeleton */}
        <Skeleton
          position="absolute"
          top={3}
          right={3}
          w="20"
          h="6"
          borderRadius="full"
          startColor="blue.200"
          endColor="blue.300"
        />
      </Box>

      <CardBody flex="1" p={4}>
        <VStack spacing={3} align="stretch">
          {/* Title and Type */}
          <HStack justify="space-between" align="center">
            <Skeleton h="6" w="60%" borderRadius="md" />
            <Skeleton h="5" w="20%" borderRadius="md" />
          </HStack>

          {/* Pet Details */}
          <VStack spacing={2} align="stretch">
            {/* Gender */}
            <HStack spacing={2}>
              <SkeletonCircle size="4" />
              <Skeleton h="4" w="30%" />
            </HStack>

            {/* Age */}
            <HStack spacing={2}>
              <SkeletonCircle size="4" />
              <Skeleton h="4" w="40%" />
            </HStack>

            {/* Breed */}
            <HStack spacing={2}>
              <SkeletonCircle size="4" />
              <Skeleton h="4" w="50%" />
            </HStack>
          </VStack>

          {/* Tags/Chips */}
          <HStack spacing={2} wrap="wrap">
            <Skeleton h="6" w="16" borderRadius="full" />
            <Skeleton h="6" w="20" borderRadius="full" />
            <Skeleton h="6" w="14" borderRadius="full" />
          </HStack>

          {/* Description */}
          <Box mt={2}>
            <SkeletonText
              noOfLines={3}
              spacing="2"
              skeletonHeight="3"
              startColor="gray.200"
              endColor="gray.300"
            />
          </Box>
        </VStack>
      </CardBody>

      <CardFooter p={4} pt={0}>
        <Skeleton
          w="full"
          h="10"
          borderRadius="lg"
          startColor="blue.200"
          endColor="blue.300"
        />
      </CardFooter>
    </Card>
  );
};

// Grid Skeleton Component for multiple skeletons
export const PetSkeletonGrid = ({ count = 6 }) => {
  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        base: '1fr',
        md: 'repeat(2, 1fr)',
        lg: 'repeat(3, 1fr)',
        xl: 'repeat(4, 1fr)',
      }}
      gap={6}
      w="full"
    >
      {Array.from({ length: count }).map((_, index) => (
        <PetSkeleton key={index} />
      ))}
    </Box>
  );
};

export default PetSkeleton;