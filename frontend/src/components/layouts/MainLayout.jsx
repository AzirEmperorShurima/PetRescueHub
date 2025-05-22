import React from 'react';
import { Flex, Spinner, Text, Box } from '@chakra-ui/react';

const LoadingScreen = ({ message = 'Đang tải...' }) => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      height="100vh"
      width="100%"
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
      <Text 
        fontSize="xl" 
        fontWeight="medium" 
        mt={4}
      >
        {message}
      </Text>
    </Flex>
  );
};

export default LoadingScreen;