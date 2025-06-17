import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Image,
  Tag,
  TagLabel,
  TagLeftIcon,
  Grid,
  GridItem,
  useColorModeValue,
  Card,
  CardBody,
  Divider,
  Icon,
  SimpleGrid,
  Flex,
  Badge,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Center,
  Spinner,
  useToast,
  Progress,
  Avatar,
  AvatarBadge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Skeleton,
  SkeletonText,
  useBreakpointValue
} from '@chakra-ui/react';
import {
  FaHeart,
  FaBirthdayCake,
  FaUser,
  FaMapMarkerAlt,
  FaPaw,
  FaPhone,
  FaEnvelope,
  FaSyringe,
  FaCalendarAlt,
  FaRuler,
  FaWeight,
  FaMars,
  FaVenus,
  FaQuestionCircle,
  FaChevronLeft,
  FaChevronRight,
  FaArrowLeft,
  FaAward,
  FaShare,
  FaQrcode,
  FaShieldAlt,
  FaHome,
  FaClock,
  FaStar,
  FaCheck,
  FaComment,
  FaBookmark,
  FaRegBookmark
} from 'react-icons/fa';
import { useAdopt } from '../../../components/hooks/useAdopt';

const DEFAULT_PET_IMAGE = 'https://khoinguonsangtao.vn/wp-content/uploads/2022/08/anh-meo-cam-phong-lon-meme-meo-cosplay-hoang-thuong.jpg';

const ImageGallery = ({ images = [] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handlePrevious = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <Box position="relative" width="100%" height="500px" borderRadius="2xl" overflow="hidden" shadow="xl">
        <Image
          src={images[currentImageIndex] || DEFAULT_PET_IMAGE}
          alt="Pet"
          width="100%"
          height="100%"
          objectFit="cover"
          onClick={onOpen}
          cursor="pointer"
          fallbackSrc={DEFAULT_PET_IMAGE}
          transition="transform 0.3s ease"
          _hover={{ transform: "scale(1.02)" }}
        />
        
        {/* Gradient Overlay */}
        <Box
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          height="100px"
          bgGradient="linear(to-t, blackAlpha.800, transparent)"
        />

        {images.length > 1 && (
          <>
            <IconButton
              icon={<FaChevronLeft />}
              position="absolute"
              left="4"
              top="50%"
              transform="translateY(-50%)"
              onClick={handlePrevious}
              colorScheme="whiteAlpha"
              bg="whiteAlpha.300"
              backdropFilter="blur(10px)"
              rounded="full"
              size="lg"
              _hover={{ bg: "whiteAlpha.400" }}
            />
            <IconButton
              icon={<FaChevronRight />}
              position="absolute"
              right="4"
              top="50%"
              transform="translateY(-50%)"
              onClick={handleNext}
              colorScheme="whiteAlpha"
              bg="whiteAlpha.300"
              backdropFilter="blur(10px)"
              rounded="full"
              size="lg"
              _hover={{ bg: "whiteAlpha.400" }}
            />
            
            {/* Image Counter */}
            <Badge
              position="absolute"
              top="4"
              right="4"
              bg="blackAlpha.700"
              color="white"
              borderRadius="full"
              px="3"
              py="1"
              backdropFilter="blur(10px)"
            >
              {currentImageIndex + 1} / {images.length}
            </Badge>

            {/* Image Indicators */}
            <HStack
              position="absolute"
              bottom="4"
              left="50%"
              transform="translateX(-50%)"
              spacing={2}
            >
              {images.map((_, index) => (
                <Box
                  key={index}
                  w={index === currentImageIndex ? "4" : "2"}
                  h="2"
                  borderRadius="full"
                  bg={index === currentImageIndex ? "white" : "whiteAlpha.600"}
                  cursor="pointer"
                  onClick={() => setCurrentImageIndex(index)}
                  transition="all 0.2s"
                />
              ))}
            </HStack>
          </>
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent bg="transparent" shadow="none">
          <ModalCloseButton 
            zIndex="modal" 
            bg="blackAlpha.700" 
            color="white"
            rounded="full"
            _hover={{ bg: "blackAlpha.800" }}
          />
          <ModalBody p={0}>
            <Image
              src={images[currentImageIndex] || DEFAULT_PET_IMAGE}
              alt="Pet"
              width="100%"
              height="auto"
              maxH="90vh"
              objectFit="contain"
              fallbackSrc={DEFAULT_PET_IMAGE}
              borderRadius="xl"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const InfoCard = ({ title, icon, children, colorScheme = "blue" }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Card 
      bg={cardBg} 
      shadow="lg" 
      borderRadius="2xl" 
      border="1px" 
      borderColor={borderColor}
      transition="all 0.3s ease"
      _hover={{ shadow: "xl", transform: "translateY(-2px)" }}
    >
      <CardBody p={6}>
        <VStack align="start" spacing={4}>
          <HStack spacing={3}>
            <Box
              p={2}
              bg={`${colorScheme}.50`}
              borderRadius="lg"
              _dark={{ bg: `${colorScheme}.900` }}
            >
              <Icon as={icon} color={`${colorScheme}.500`} boxSize={6} />
            </Box>
            <Heading size="md" color={`${colorScheme}.600`} _dark={{ color: `${colorScheme}.300` }}>
              {title}
            </Heading>
          </HStack>
          <Box w="full">
            {children}
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );
};

const StatCard = ({ label, value, icon, colorScheme = "blue" }) => {
  return (
    <Stat
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      borderRadius="xl"
      shadow="md"
      border="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      _hover={{ shadow: "lg" }}
      transition="all 0.2s"
    >
      <HStack justify="space-between">
        <Box>
          <StatLabel fontSize="sm" color="gray.500">{label}</StatLabel>
          <StatNumber fontSize="lg" fontWeight="bold">{value}</StatNumber>
        </Box>
        <Icon as={icon} boxSize={8} color={`${colorScheme}.500`} />
      </HStack>
    </Stat>
  );
};

const PetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const { getPetById } = useAdopt();

  const textColor = useColorModeValue('gray.600', 'gray.400');
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardColumns = useBreakpointValue({ base: 1, lg: 2 });

  useEffect(() => {
    let isMounted = true;

    const fetchPetDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const petData = await getPetById(id);
        console.log('PetDetail data:', petData);
        if (isMounted) {
          setPet(petData);
        }
      } catch (error) {
        console.error('Error fetching pet details:', error);
        if (isMounted) {
          setError(error.message || 'Có lỗi xảy ra khi tải thông tin thú cưng');
          toast({
            title: "Lỗi",
            description: error.message || "Không thể tải thông tin thú cưng",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchPetDetail();
    }

    return () => {
      isMounted = false;
    };
  }, [id, toast, getPetById]);

  const handleFavoriteToggle = async () => {
    try {
      setIsFavorited(!isFavorited);
      toast({
        title: isFavorited ? "Đã xóa khỏi danh sách yêu thích" : "Đã thêm vào danh sách yêu thích",
        status: isFavorited ? "info" : "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái yêu thích",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getGenderInfo = (gender) => {
    switch (gender?.toLowerCase()) {
      case 'male':
        return { icon: FaMars, color: 'blue.500', text: 'Đực' };
      case 'female':
        return { icon: FaVenus, color: 'pink.500', text: 'Cái' };
      default:
        return { icon: FaQuestionCircle, color: 'gray.500', text: 'Không xác định' };
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'available': { color: 'green', text: 'Sẵn sàng nhận nuôi', icon: FaCheck },
      'pending': { color: 'orange', text: 'Đang xử lý', icon: FaClock },
      'adopted': { color: 'red', text: 'Đã được nhận nuôi', icon: FaHeart }
    };
    return statusConfig[status] || { color: 'gray', text: 'Không xác định', icon: FaQuestionCircle };
  };

  const getAuthorInfo = (author) => {
    if (!author) return null;
    return {
      name: author.username || 'Chưa có tên',
      avatar: author.avatar || '',
      id: author.id || ''
    };
  };

  if (loading) {
    return (
      <Box bg={bgColor} minH="100vh" py={8}>
        <Container maxW="7xl">
          <Skeleton height="40px" mb={6} />
          <Grid templateColumns={{ base: '1fr', lg: '3fr 2fr' }} gap={8}>
            <GridItem>
              <VStack spacing={6}>
                <Skeleton height="500px" borderRadius="2xl" />
                <Skeleton height="200px" borderRadius="2xl" />
                <Skeleton height="150px" borderRadius="2xl" />
              </VStack>
            </GridItem>
            <GridItem>
              <VStack spacing={6}>
                <Skeleton height="300px" borderRadius="2xl" />
                <Skeleton height="200px" borderRadius="2xl" />
              </VStack>
            </GridItem>
          </Grid>
        </Container>
      </Box>
    );
  }

  if (error || !pet) {
    return (
      <Box bg={bgColor} minH="100vh" py={8}>
        <Container maxW="4xl">
          <Alert status="error" borderRadius="xl" mb={6}>
            <AlertIcon />
            <Box>
              <AlertTitle>Không thể tải thông tin!</AlertTitle>
              <AlertDescription>
                {error || 'Không tìm thấy thông tin thú cưng'}
              </AlertDescription>
            </Box>
          </Alert>
          <Button
            leftIcon={<Icon as={FaArrowLeft} />}
            onClick={() => navigate('/adopt')}
            colorScheme="blue"
            size="lg"
          >
            Quay lại danh sách
          </Button>
        </Container>
      </Box>
    );
  }

  const genderInfo = getGenderInfo(pet.gender);
  const statusInfo = getStatusBadge(pet.status);
  const authorInfo = getAuthorInfo(pet.author);
  const allImages = [pet.image, ...(pet.album || [])].filter(Boolean);

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="6xl" py={4}>
        {/* Breadcrumb */}
        <Breadcrumb mb={6} fontSize="sm">
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate('/')} color="blue.500">
              <Icon as={FaHome} mr={2} />
              Trang chủ
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate('/adopt')} color="blue.500">
              Nhận nuôi
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>{pet.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={10} alignItems="start">
          <GridItem>
            <VStack spacing={6} align="stretch">
              {/* Image Gallery */}
              <Box borderRadius="2xl" overflow="hidden" shadow="xl" mb={2}>
                <ImageGallery images={allImages} />
              </Box>
              {/* Pet Stats */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={2}>
                {pet.age && (
                  <StatCard 
                    label="Tuổi" 
                    value={pet.age} 
                    icon={FaBirthdayCake} 
                    colorScheme="purple" 
                  />
                )}
                {pet.weight && (
                  <StatCard 
                    label="Cân nặng" 
                    value={`${pet.weight} kg`} 
                    icon={FaWeight} 
                    colorScheme="green" 
                  />
                )}
                {pet.height && (
                  <StatCard 
                    label="Chiều cao" 
                    value={`${pet.height} cm`} 
                    icon={FaRuler} 
                    colorScheme="orange" 
                  />
                )}
                <StatCard 
                  label="Giới tính" 
                  value={genderInfo.text} 
                  icon={genderInfo.icon} 
                  colorScheme={genderInfo.color.split('.')[0]} 
                />
              </SimpleGrid>
              {/* Pet Information Tabs */}
              <Tabs variant="enclosed-colored" colorScheme="blue" borderRadius="xl" bg={useColorModeValue('white', 'gray.800')} boxShadow="md" p={4}>
                <TabList mb={4}>
                  <Tab _selected={{ color: 'white', bg: 'blue.400' }}>Thông tin cơ bản</Tab>
                  <Tab _selected={{ color: 'white', bg: 'green.400' }}>Sức khỏe</Tab>
                  <Tab _selected={{ color: 'white', bg: 'purple.400' }}>Mô tả</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel p={0}>
                    <InfoCard title="Thông tin cơ bản" icon={FaPaw} colorScheme="blue">
                      <VStack align="start" spacing={4} w="full">
                        <SimpleGrid columns={2} spacing={4} w="full">
                          <HStack>
                            <Icon as={genderInfo.icon} color={genderInfo.color} />
                            <Text>{genderInfo.text}</Text>
                          </HStack>
                          {pet.breed && (
                            <HStack>
                              <Icon as={FaPaw} color="teal.500" />
                              <Text>{pet.breed}</Text>
                            </HStack>
                          )}
                        </SimpleGrid>
                        <Flex wrap="wrap" gap={3}>
                          <Tag size="lg" colorScheme={pet.reproductiveStatus === 'neutered' ? 'purple' : 'red'}>
                            <TagLeftIcon as={FaSyringe} />
                            <TagLabel>
                              {pet.reproductiveStatus === 'neutered' ? 'Đã triệt sản' : 'Chưa triệt sản'}
                            </TagLabel>
                          </Tag>
                          {pet.specialNeeds && (
                            <Tag size="lg" colorScheme="orange">
                              <TagLeftIcon as={FaAward} />
                              <TagLabel>Cần chăm sóc đặc biệt</TagLabel>
                            </Tag>
                          )}
                          <Tag size="lg" colorScheme={statusInfo.color}>
                            <TagLeftIcon as={statusInfo.icon} />
                            <TagLabel>{statusInfo.text}</TagLabel>
                          </Tag>
                        </Flex>
                        {pet.tags && pet.tags.length > 0 && (
                          <Box w="full">
                            <Text fontSize="sm" fontWeight="medium" mb={2}>Tags:</Text>
                            <Flex wrap="wrap" gap={2}>
                              {pet.tags.map((tag, index) => (
                                <Tag key={index} size="md" colorScheme="blue" variant="subtle">
                                  {tag}
                                </Tag>
                              ))}
                            </Flex>
                          </Box>
                        )}
                      </VStack>
                    </InfoCard>
                  </TabPanel>
                  <TabPanel p={0}>
                    <InfoCard title="Thông tin sức khỏe" icon={FaShieldAlt} colorScheme="green">
                      {pet.vaccinationStatus && pet.vaccinationStatus.length > 0 ? (
                        <VStack align="start" spacing={4} w="full">
                          <HStack>
                            <Icon as={FaSyringe} color="blue.500" />
                            <Text fontWeight="semibold">
                              Đã tiêm chủng: {pet.vaccinationStatus.length} mũi
                            </Text>
                          </HStack>
                          <Box w="full">
                            <Text fontSize="sm" color={textColor} mb={2}>
                              Tiến độ tiêm chủng:
                            </Text>
                            <Progress 
                              value={(pet.vaccinationStatus.length / 5) * 100} 
                              colorScheme="green" 
                              size="lg" 
                              borderRadius="md"
                            />
                          </Box>
                          <VStack align="start" spacing={2} w="full">
                            {pet.vaccinationStatus.map((vaccine, index) => (
                              <HStack 
                                key={index} 
                                p={3} 
                                bg="green.50" 
                                borderRadius="md" 
                                w="full"
                                _dark={{ bg: "green.900" }}
                              >
                                <Icon as={FaCalendarAlt} color="green.500" />
                                <Text fontSize="sm">
                                  {new Date(vaccine.vaccinationDate).toLocaleDateString('vi-VN')}
                                </Text>
                                <Text fontSize="sm" fontWeight="medium">
                                  {vaccine.vaccineName}
                                </Text>
                              </HStack>
                            ))}
                          </VStack>
                        </VStack>
                      ) : (
                        <Alert status="warning" borderRadius="md">
                          <AlertIcon />
                          <AlertDescription>
                            Chưa có thông tin về tình trạng tiêm chủng
                          </AlertDescription>
                        </Alert>
                      )}
                    </InfoCard>
                  </TabPanel>
                  <TabPanel p={0}>
                    <InfoCard title="Mô tả chi tiết" icon={FaStar} colorScheme="purple">
                      <Text whiteSpace="pre-line" lineHeight="1.6">
                        {pet.content || pet.description || "Chưa có mô tả chi tiết về thú cưng này."}
                      </Text>
                    </InfoCard>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </VStack>
          </GridItem>
          <GridItem>
            <VStack spacing={6} position="sticky" top="20px" align="stretch">
              {/* Pet Header Card */}
              <Card w="full" overflow="hidden" variant="elevated" shadow="xl" borderRadius="2xl">
                <CardBody p={6}>
                  <VStack spacing={4} align="stretch">
                    <HStack justify="space-between" align="start">
                      <VStack align="start" spacing={2}>
                        <Heading size="lg" color="blue.600" _dark={{ color: "blue.300" }}>
                          {pet.name}
                        </Heading>
                        {pet.location && (
                          <HStack color={textColor}>
                            <Icon as={FaMapMarkerAlt} color="red.500" />
                            <Text fontSize="sm">{pet.location}</Text>
                          </HStack>
                        )}
                      </VStack>
                      <VStack spacing={2}>
                        <IconButton
                          icon={<FaHeart />}
                          colorScheme={isFavorited ? 'red' : 'gray'}
                          variant={isFavorited ? 'solid' : 'outline'}
                          onClick={handleFavoriteToggle}
                          aria-label="Add to favorites"
                          size="lg"
                          rounded="full"
                        />
                        <IconButton
                          icon={<FaShare />}
                          colorScheme="blue"
                          variant="outline"
                          aria-label="Share"
                          size="lg"
                          rounded="full"
                        />
                      </VStack>
                    </HStack>
                    {pet.breed && (
                      <Badge 
                        colorScheme="blue" 
                        fontSize="md" 
                        px={4} 
                        py={2} 
                        borderRadius="full"
                        textAlign="center"
                      >
                        {pet.breed} {pet.breedName ? `- ${pet.breedName}` : ''}
                      </Badge>
                    )}
                  </VStack>
                </CardBody>
              </Card>
              {/* Author Information */}
              {authorInfo && (
                <InfoCard title="Thông tin người đăng" icon={FaUser} colorScheme="teal">
                  <VStack align="start" spacing={4} w="full">
                    <HStack>
                      <Avatar size="md" src={authorInfo.avatar} name={authorInfo.name} />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="semibold">{authorInfo.name}</Text>
                        <Text fontSize="sm" color={textColor}>Người đăng</Text>
                      </VStack>
                    </HStack>
                    <Button
                      leftIcon={<FaEnvelope />}
                      colorScheme="blue"
                      variant="outline"
                      w="full"
                      size="lg"
                      onClick={() => navigate(`/profile/${authorInfo.id}`)}
                    >
                      Xem trang cá nhân
                    </Button>
                  </VStack>
                </InfoCard>
              )}
              {/* Microchip Info */}
              {pet.microchipId && (
                <InfoCard title="Thông tin định danh" icon={FaQrcode} colorScheme="gray">
                  <HStack justify="space-between" p={4} bg="gray.50" borderRadius="lg" _dark={{ bg: "gray.700" }}>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="sm" color={textColor}>Mã số chip</Text>
                      <Text fontWeight="bold" fontFamily="mono">{pet.microchipId}</Text>
                    </VStack>
                    <Icon as={FaQrcode} boxSize={8} color="gray.500" />
                  </HStack>
                </InfoCard>
              )}
              {/* Post Stats */}
              <InfoCard title="Thống kê" icon={FaStar} colorScheme="purple">
                <SimpleGrid columns={2} spacing={4}>
                  <Stat>
                    <StatLabel>Lượt thích</StatLabel>
                    <StatNumber>{pet.favoriteCount || 0}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Bình luận</StatLabel>
                    <StatNumber>{pet.commentCount || 0}</StatNumber>
                  </Stat>
                </SimpleGrid>
              </InfoCard>
            </VStack>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default PetDetail;