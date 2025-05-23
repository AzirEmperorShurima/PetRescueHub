import React from 'react';
import { 
  Box, 
  Skeleton, 
  SkeletonCircle, 
  SkeletonText,
  Card, 
  CardBody, 
  CardFooter,
  VStack,
  HStack,
  Flex,
  useColorModeValue
} from '@chakra-ui/react';
import PropTypes from 'prop-types';

const ForumSkeleton = ({ count = 5 }) => {
  const bg = useColorModeValue('white', 'gray.800');
  
  return (
    <VStack spacing={4} align="stretch">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} bg={bg} shadow="sm" borderRadius="lg">
          <CardBody p={6}>
            {/* User Info Section */}
            <HStack mb={4} spacing={3}>
              <SkeletonCircle size="10" />
              <VStack align="start" spacing={1} flex={1}>
                <Skeleton height="4" width="120px" />
                <Skeleton height="3" width="80px" />
              </VStack>
            </HStack>
            
            {/* Title */}
            <Skeleton height="8" mb={3} />
            
            {/* Content */}
            <SkeletonText mt={2} noOfLines={3} spacing={2} />
            
            {/* Image placeholder */}
            <Skeleton height="200px" mt={4} mb={4} borderRadius="md" />
            
            {/* Tags */}
            <HStack spacing={2} mt={4}>
              <Skeleton height="6" width="60px" borderRadius="full" />
              <Skeleton height="6" width="80px" borderRadius="full" />
              <Skeleton height="6" width="70px" borderRadius="full" />
            </HStack>
          </CardBody>
          
          <CardFooter pt={0} pb={6} px={6}>
            <Flex width="100%" justify="space-between" align="center">
              {/* Left side actions (like, comment, share) */}
              <HStack spacing={4}>
                <HStack spacing={2}>
                  <SkeletonCircle size="6" />
                  <Skeleton height="4" width="20px" />
                </HStack>
                <HStack spacing={2}>
                  <SkeletonCircle size="6" />
                  <Skeleton height="4" width="20px" />
                </HStack>
                <HStack spacing={2}>
                  <SkeletonCircle size="6" />
                  <Skeleton height="4" width="20px" />
                </HStack>
              </HStack>
              
              {/* Right side actions (bookmark, more) */}
              <HStack spacing={3}>
                <SkeletonCircle size="6" />
                <SkeletonCircle size="6" />
              </HStack>
            </Flex>
          </CardFooter>
        </Card>
      ))}
    </VStack>
  );
};

ForumSkeleton.propTypes = {
  count: PropTypes.number
};

export default ForumSkeleton; 