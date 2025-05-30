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
  FaBirthdayCake , 
  FaUser, 
  FaAward, 
  FaEye, 
  FaMapMarkerAlt,
  FaPaw 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const DEFAULT_PET_IMAGE = 'https://khoinguonsangtao.vn/wp-content/uploads/2022/08/anh-meo-cam-phong-lon-meme-meo-cosplay-hoang-thuong.jpg';

const PetCard = ({ 
  pet = {}, 
  onClick = () => {}, 
  onFavorite, 
  isFavorited = false,
  isListView = false
}) => {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  
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
      'available': 'teal',
      'pending': 'orange',
      'adopted': 'red'
    };
    return statusMap[status] || 'gray';
  };

  // Reproductive status tag config
  const getReproductiveStatusInfo = (status) => {
    return {
      text: status === 'neutered' ? 'Đã triệt sản' : 'Chưa triệt sản',
      colorScheme: status === 'neutered' ? 'purple' : 'red'
    };
  };

  // Vaccination status tag config
  const getVaccinationStatusInfo = (count) => {
    return {
      text: `Đã tiêm chủng: ${count} mũi`,
      colorScheme: 'blue'
    };
  };

  // Available status tag config
  const getAvailableStatusInfo = () => {
    return {
      text: 'Sẵn sàng nhận nuôi',
      colorScheme: 'green',
      icon: FaPaw
    };
  };

  // Special needs tag config
  const getSpecialNeedsInfo = () => {
    return {
      text: 'Cần chăm sóc đặc biệt',
      colorScheme: 'orange',
      icon: FaAward
    };
  };

  // Common status tag component
  const StatusTag = ({ info, icon }) => (
    <Tag size="sm" colorScheme={info.colorScheme}>
      {icon && <TagLeftIcon as={icon} />}
      <TagLabel>{info.text}</TagLabel>
    </Tag>
  );

  // Common info tags component
  const InfoTags = ({ isCompact = false }) => (
    <VStack align="stretch" spacing={2}>
      {!isCompact && (
        <>
          {weight && <Text fontSize="sm">Cân nặng: {weight} kg</Text>}
          {height && <Text fontSize="sm">Chiều cao: {height} cm</Text>}
        </>
      )}
      {isCompact && (
        <HStack spacing={4} fontSize="sm" color={textColor}>
          {weight && <Text>Cân nặng: {weight} kg</Text>}
          {height && <Text>Chiều cao: {height} cm</Text>}
        </HStack>
      )}
      <VStack align="stretch" spacing={2}>
        {reproductiveStatus && (
          <StatusTag info={getReproductiveStatusInfo(reproductiveStatus)} />
        )}
        {vaccinationStatus.length > 0 && (
          <StatusTag info={getVaccinationStatusInfo(vaccinationStatus.length)} />
        )}
        {status === 'available' && (
          <StatusTag info={getAvailableStatusInfo()} icon={FaPaw} />
        )}
        {specialNeeds && (
          <StatusTag info={getSpecialNeedsInfo()} icon={FaAward} />
        )}
      </VStack>
    </VStack>
  );

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
    return genderMap[gender] || { icon: '❓', color: 'gray', text: 'Chưa rõ giới tính' };
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
      navigate(`/adopt/${pet.id}`);
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

  return (
    <Card
      bg={cardBg}
      borderColor={borderColor}
      borderWidth="1px"
      shadow="md"
      borderRadius="xl"
      overflow="hidden"
      h={isListView ? "250px" : "650"}
      w="100%"
      display="flex"
      flexDirection={isListView ? "row" : "column"}
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
      <Box 
        position="relative" 
        w={isListView ? "40%" : "100%"} 
        h={isListView ? "full" : "250px"}
        bg="gray.100"
        flexShrink={0}
      >
        <Box position="relative" h="100%" w="100%">
          <Image
            src={imageError ? DEFAULT_PET_IMAGE : (image || DEFAULT_PET_IMAGE)}
            alt={`Ảnh của ${name}`}
            objectFit="cover"
            w="100%"
            h="100%"
            onError={handleImageError}
            fallbackSrc={DEFAULT_PET_IMAGE}
            loading="lazy"
          />

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
      </Box>

      <Box flex="1" display="flex" flexDirection="column" w="100%">
        <CardBody p={isListView ? 4 : 5}>
          <VStack spacing={isListView ? 2 : 3} align="stretch">
            {/* Pet Name and Type */}
            <HStack justify="space-between" align="center">
              <Box>
                <Text
                  fontSize={isListView ? "lg" : "xl"}
                  fontWeight="bold"
                  color={headingColor}
                  noOfLines={1}
                  title={name}
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
            </HStack>

            {/* Pet Details Tags */}
            <Flex wrap="wrap" gap={2}>
              {/* Gender Tag */}
              <Tag size="sm" colorScheme={genderInfo.color} variant="subtle">
                <TagLabel>{genderInfo.icon} {genderInfo.text}</TagLabel>
              </Tag>

              {/* Age Tag */}
              {age && (
                <Tag size="sm" colorScheme="purple" variant="subtle">
                  <TagLeftIcon as={FaBirthdayCake} />
                  <TagLabel>{age} tuổi</TagLabel>
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
                noOfLines={isListView ? 2 : 3}
                lineHeight="1.4"
                title={description}
              >
                {description}
              </Text>
            )}

            {/* Info Tags Section */}
            <InfoTags isCompact={isListView} />
          </VStack>
        </CardBody>

        <CardFooter p={isListView ? 3 : 4} pt={0}>
          <Button
            w="full"
            colorScheme="blue"
            variant="solid"
            onClick={handleCardClick}
            leftIcon={<Icon as={FaEye} />}
            size={isListView ? "sm" : "md"}
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
      </Box>
    </Card>
  );
};

export default PetCard;