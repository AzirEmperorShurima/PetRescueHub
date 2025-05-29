import React, { useState } from 'react';
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  Image,
  Text,
  Badge,
  Button,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Tooltip,
  Tag,
  TagLabel,
  TagLeftIcon,
  Flex,
  AspectRatio,
} from '@chakra-ui/react';
import { 
  FaHeart, 
  FaCalendarAlt, 
  FaUser, 
  FaAward, 
  FaEye, 
  FaMapMarkerAlt 
} from 'react-icons/fa';

const PetCard = ({ 
  pet = {}, 
  onClick = () => {}, 
  onFavorite, 
  isFavorited = false
}) => {
  const [imageError, setImageError] = useState(false);
  
  // Early return nếu không có pet data
  if (!pet || typeof pet !== 'object') {
    console.warn('PetCard: Invalid pet data provided');
    return (
      <Card p={4} bg="gray.50">
        <Text color="gray.500" textAlign="center">
          Không có thông tin thú cưng
        </Text>
      </Card>
    );
  }

  // Destructure với default values
  const {
    name = 'Chưa có tên',
    breed = '',
    breedName = '',
    image = '',
    status = 'unknown',
    gender = 'unknown',
    age = '',
    weight = '',
    height = '',
    size = '',
    description = '',
    location = '',
    specialNeeds = false,
    reproductiveStatus = '',
    vaccinationStatus = [],
    microchipId = '',
  } = pet;
  
  // Color mode values
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.800', 'white');

  // Status color mapping
  const getStatusColorScheme = (status) => {
    const statusMap = {
      'available': 'green',
      'pending': 'orange',
      'adopted': 'red'
    };
    return statusMap[status] || 'gray';
  };

  // Status text mapping
  const getStatusText = (status) => {
    const statusTextMap = {
      'available': '✅ Sẵn sàng nhận nuôi',
      'pending': '⏳ Đang xử lý',
      'adopted': '❤️ Đã được nhận nuôi'
    };
    return statusTextMap[status] || '❓ Chưa rõ trạng thái';
  };

  // Gender icon and color
  const getGenderInfo = (gender) => {
    const genderMap = {
      'male': { icon: '♂️', color: 'blue', text: 'Đực' },
      'female': { icon: '♀️', color: 'pink', text: 'Cái' }
    };
    return genderMap[gender] || { icon: '❓', color: 'gray', text: 'Chưa rõ' };
  };

  // Size mapping
  const getSizeInfo = (size) => {
    const sizeMap = {
      'small': { emoji: '🐕', text: 'Nhỏ' },
      'medium': { emoji: '🐕', text: 'Trung bình' },
      'large': { emoji: '🐕', text: 'Lớn' }
    };
    return sizeMap[size] || { emoji: '🐾', text: 'Chưa rõ' };
  };

  const handleImageError = () => {
    console.warn('Image load error for pet:', name);
    setImageError(true);
  };

  const handleCardClick = () => {
    try {
      if (typeof onClick === 'function') {
        onClick(pet);
      }
    } catch (error) {
      console.error('Error in onClick handler:', error);
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    try {
      if (typeof onFavorite === 'function') {
        onFavorite(pet);
      }
    } catch (error) {
      console.error('Error in onFavorite handler:', error);
    }
  };

  const genderInfo = getGenderInfo(gender);
  const sizeInfo = getSizeInfo(size);
  const defaultImage = 'https://via.placeholder.com/400x300?text=🐾+Pet+Image';
  const fallbackImage = 'https://via.placeholder.com/400x300?text=🐾+No+Image';

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
      position="relative"
      _hover={{
        shadow: 'xl',
        transform: 'translateY(-4px)',
        borderColor: 'blue.300',
      }}
      transition="all 0.3s ease"
      cursor="pointer"
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <Box position="relative" w="full" bg="gray.100">
        <AspectRatio ratio={4/3}>
          <Image
            src={imageError ? fallbackImage : (image || defaultImage)}
            alt={`Ảnh của ${name}`}
            objectFit="cover"
            w="full"
            h="full"
            onError={handleImageError}
            fallbackSrc={fallbackImage}
            loading="lazy"
          />
        </AspectRatio>

        {/* Status Badge */}
        <Badge
          position="absolute"
          top={3}
          right={3}
          colorScheme={getStatusColorScheme(status)}
          variant="solid"
          borderRadius="full"
          px={3}
          py={1}
          fontSize="xs"
          fontWeight="bold"
          shadow="md"
        >
          {getStatusText(status)}
        </Badge>

        {/* Location Badge */}
        {location && (
          <Badge
            position="absolute"
            bottom={3}
            left={3}
            bg="blackAlpha.700"
            color="white"
            borderRadius="full"
            px={2}
            py={1}
            fontSize="xs"
          >
            <HStack spacing={1}>
              <Icon as={FaMapMarkerAlt} w={3} h={3} />
              <Text>{location}</Text>
            </HStack>
          </Badge>
        )}
      </Box>

      <CardBody flex="1" p={4}>
        <VStack spacing={3} align="stretch">
          {/* Pet Name and Type */}
          <Box>
            <Text
              fontSize="xl"
              fontWeight="bold"
              color={headingColor}
              mb={1}
              noOfLines={1}
              title={name} // Tooltip khi hover
            >
              {name}
            </Text>
            {breed && (
              <Text 
                fontSize="sm" 
                color={textColor} 
                noOfLines={1}
                title={breed}
              >
                {breed}
              </Text>
            )}
          </Box>

          {/* Pet Details Tags */}
          <Flex wrap="wrap" gap={2}>
            {/* Gender Tag */}
            <Tag size="sm" colorScheme={genderInfo.color} variant="subtle">
              <TagLabel>{genderInfo.icon} {genderInfo.text}</TagLabel>
            </Tag>

            {/* Age Tag */}
            {age && (
              <Tag size="sm" colorScheme="purple" variant="subtle">
                <TagLeftIcon as={FaCalendarAlt} />
                <TagLabel>{age}</TagLabel>
              </Tag>
            )}

            {/* Size Tag */}
            {size && (
              <Tag size="sm" colorScheme="teal" variant="subtle">
                <TagLabel>{sizeInfo.emoji} {sizeInfo.text}</TagLabel>
              </Tag>
            )}
          </Flex>

          {/* Description */}
          {description && (
            <Text
              fontSize="sm"
              color={textColor}
              noOfLines={3}
              lineHeight="1.4"
              title={description} // Full text on hover
            >
              {description}
            </Text>
          )}

          {/* Special Tags */}
          {specialNeeds && (
            <Tag size="sm" colorScheme="orange" variant="outline">
              <TagLeftIcon as={FaAward} />
              <TagLabel>Cần chăm sóc đặc biệt</TagLabel>
            </Tag>
          )}

          {/* New content */}
          {weight && (
            <Text fontSize="sm">
              Cân nặng: {weight} kg
            </Text>
          )}
          
          {height && (
            <Text fontSize="sm">
              Chiều cao: {height} cm
            </Text>
          )}
          
          {reproductiveStatus && (
            <Tag size="sm" colorScheme={reproductiveStatus === 'neutered' ? 'green' : 'yellow'}>
              {reproductiveStatus === 'neutered' ? 'Đã triệt sản' : 'Chưa triệt sản'}
            </Tag>
          )}
          
          {vaccinationStatus.length > 0 && (
            <Tag size="sm" colorScheme="blue">
              Đã tiêm chủng: {vaccinationStatus.length} mũi
            </Tag>
          )}
        </VStack>
      </CardBody>

      <CardFooter p={4} pt={0}>
        <Button
          w="full"
          colorScheme="blue"
          variant="solid"
          onClick={handleCardClick}
          leftIcon={<Icon as={FaEye} />}
          _hover={{
            transform: 'translateY(-1px)',
            shadow: 'md',
          }}
          transition="all 0.2s"
          borderRadius="lg"
          isDisabled={!onClick || typeof onClick !== 'function'}
        >
          Xem chi tiết
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PetCard;