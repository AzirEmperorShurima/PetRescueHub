import React from 'react';
import {
  Box,
  SimpleGrid,
  Card,
  CardBody,
  CardFooter,
  Image,
  Text,
  Heading,
  Button,
  Tag,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { AddIcon, ViewIcon, EditIcon, Icon as ChakraIcon } from '@chakra-ui/icons';
import { FaPaw } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const PetGrid = ({ pets = [] }) => {
  const navigate = useNavigate();

  if (!pets || pets.length === 0) {
    return (
      <Box className="empty-pets" textAlign="center" py={4}>
        <Heading as="h5" size="lg" mb={4}>
          Hồ sơ thú cưng
        </Heading>
        <Text color="gray.500" mb={4}>
          Bạn chưa có hồ sơ thú cưng nào. Hãy thêm thú cưng đầu tiên của bạn!
        </Text>
        <Button
          colorScheme="blue"
          leftIcon={<AddIcon />}
          className="add-pet-button"
          onClick={() => navigate('/findhome')}
        >
          Thêm thú cưng
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4} className="tab-header">
        <Heading as="h5" size="lg" className="tab-title">
          Hồ sơ thú cưng
        </Heading>
        <Button
          colorScheme="blue"
          leftIcon={<AddIcon />}
          className="add-pet-button"
          onClick={() => navigate('/findhome')}
        >
          Thêm thú cưng
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6} className="pets-grid">
        {pets.map((pet) => (
          <Card key={pet.id} className="pet-card" boxShadow="md" borderRadius="lg" overflow="hidden">
            <Box position="relative" className="pet-image-container">
              <Image
                src={pet.imageUrl || 'https://source.unsplash.com/random/300x200/?pet'}
                alt={pet.name}
                className="pet-image"
                objectFit="cover"
                height="200px"
                width="100%"
              />
              <Box
                position="absolute"
                top={2}
                right={2}
                bg="white"
                borderRadius="full"
                p={2}
                className="pet-type-badge"
              >
                <Icon as={FaPaw} color="blue.500" />
              </Box>
            </Box>

            <CardBody className="pet-info">
              <Heading as="h6" size="md" mb={2} className="pet-name">
                {pet.name}
              </Heading>
              <Flex gap={2} mb={2} className="pet-details-row">
                <Tag size="sm" colorScheme="cyan" className="pet-age-chip">
                  {pet.age || '1 tuổi'}
                </Tag>
                <Tag size="sm" colorScheme="teal" className="pet-breed-chip">
                  {pet.breed || 'Không rõ giống'}
                </Tag>
              </Flex>
              <Text fontSize="sm" color="gray.600" className="pet-description">
                {pet.description || 'Một thú cưng đáng yêu đang cần được chăm sóc và yêu thương.'}
              </Text>
            </CardBody>

            <CardFooter className="pet-actions" justifyContent="space-between">
              <Button
                size="sm"
                variant="outline"
                colorScheme="blue"
                leftIcon={<ViewIcon />}
                className="pet-action-button"
              >
                Chi tiết
              </Button>
              <Button
                size="sm"
                colorScheme="blue"
                leftIcon={<EditIcon />}
                className="pet-action-button edit-profile-button"
              >
                Chỉnh sửa
              </Button>
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default PetGrid;