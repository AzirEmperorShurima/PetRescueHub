import React, { useState, useEffect } from 'react';
import { 
  Box,
  Container, 
  Text,
  Heading,
  Input,
  Textarea,
  Button, 
  Flex,
  Grid,
  GridItem,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
  Checkbox,
  Divider,
  Avatar,
  Card,
  CardBody,
  Stack,
  FormControl,
  FormLabel,
  Image,
  IconButton,
} from '@chakra-ui/react';
import { 
  FiMapPin,
  FiNavigation,
  FiSend,
} from 'react-icons/fi';
import { FaPaw, FaImage, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/contexts/AuthContext';
import axios from 'axios';
import './Rescue.css';
import ImageUploader from '../../components/common/ImageUploader/ImageUploader';

const Rescue = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [volunteers, setVolunteers] = useState([]);
  const [loadingVolunteers, setLoadingVolunteers] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    fullname: user?.fullname || '',
    phone: user?.phone || '',
    notes: '',
    petDetails: '', // Thêm trường mô tả chi tiết về thú cưng
    radius: 1, // Bán kính mặc định 1km
    location: {
      type: 'Point',
      coordinates: [0, 0] // [longitude, latitude]
    },
    isGuest: !user?.id,
    status: 'pending',
    autoAssignVolunteer: true, // Mặc định tự động chọn tình nguyện viên
    selectedVolunteers: [], // Danh sách tình nguyện viên được chọn
    images: [] // Thêm mảng để lưu trữ hình ảnh
  });

  // State để lưu trữ preview của ảnh
  const [imagePreview, setImagePreview] = useState([]);

  // Lấy vị trí hiện tại của người dùng
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Lỗi",
        description: "Trình duyệt của bạn không hỗ trợ định vị",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        setFormData({
          ...formData,
          location: {
            type: 'Point',
            coordinates: [longitude, latitude]
          }
        });
        setLocationLoading(false);
        toast({
          title: "Thành công",
          description: "Đã lấy vị trí hiện tại thành công",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        
        // Tìm tình nguyện viên gần đó khi có vị trí
        if (longitude !== 0 && latitude !== 0) {
          findNearbyVolunteers(longitude, latitude, formData.radius);
        }
      },
      (error) => {
        console.error('Lỗi khi lấy vị trí:', error);
        setLocationLoading(false);
        toast({
          title: "Lỗi",
          description: "Không thể lấy vị trí hiện tại. Vui lòng thử lại.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    );
  };

  // Tìm tình nguyện viên gần đó
  // const findNearbyVolunteers = async (longitude, latitude, radius) => {
  //   setLoadingVolunteers(true);
  //   try {
  //     // Gọi API để tìm tình nguyện viên gần đó
  //     const response = await axios.get('/api/volunteers/nearby', {
  //       params: {
  //         longitude,
  //         latitude,
  //         radius
  //       }
  //     });
      
  //     setVolunteers(response.data.volunteers || []);
  //   } catch (error) {
  //     console.error('Lỗi khi tìm tình nguyện viên:', error);
  //     toast({
  //       title: "Cảnh báo",
  //       description: "Không thể tìm tình nguyện viên gần đó",
  //       status: "warning",
  //       duration: 5000,
  //       isClosable: true,
  //     });
  //   } finally {
  //     setLoadingVolunteers(false);
  //   }
  // };

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Xử lý thay đổi bán kính
  const handleRadiusChange = (value) => {
    setFormData({
      ...formData,
      radius: value
    });
    
    // Cập nhật danh sách tình nguyện viên khi thay đổi bán kính
    if (formData.location.coordinates[0] !== 0 && formData.location.coordinates[1] !== 0) {
      findNearbyVolunteers(
        formData.location.coordinates[0],
        formData.location.coordinates[1],
        value
      );
    }
  };

  // Xử lý thay đổi checkbox tự động chọn tình nguyện viên
  const handleAutoAssignChange = (e) => {
    setFormData({
      ...formData,
      autoAssignVolunteer: e.target.checked
    });
  };

  // Xử lý chọn tình nguyện viên
  const handleVolunteerSelection = (volunteerId) => {
    const selectedVolunteers = [...formData.selectedVolunteers];
    const index = selectedVolunteers.indexOf(volunteerId);
    
    if (index === -1) {
      selectedVolunteers.push(volunteerId);
    } else {
      selectedVolunteers.splice(index, 1);
    }
    
    setFormData({
      ...formData,
      selectedVolunteers
    });
  };

  // Xử lý tải ảnh lên
  const handleImageUpload = (files) => {
    // Tạo preview cho các ảnh mới
    const newImagePreviews = files.map(file => URL.createObjectURL(file));
    
    // Cập nhật state
    setFormData({
      ...formData,
      images: [...formData.images, ...files]
    });
    setImagePreview([...imagePreview, ...newImagePreviews]);
  };

  // Xử lý xóa ảnh
  const handleRemoveImage = (index) => {
    const updatedImages = [...formData.images];
    const updatedPreviews = [...imagePreview];
    
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    
    setFormData({
      ...formData,
      images: updatedImages
    });
    setImagePreview(updatedPreviews);
  };

  // Xử lý gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Tạo FormData để gửi cả dữ liệu và hình ảnh
      const rescueFormData = new FormData();
      
      // Thêm các trường dữ liệu vào FormData
      Object.keys(formData).forEach(key => {
        if (key !== 'images' && key !== 'location' && key !== 'selectedVolunteers') {
          rescueFormData.append(key, formData[key]);
        }
      });
      
      // Thêm vị trí
      rescueFormData.append('longitude', formData.location.coordinates[0]);
      rescueFormData.append('latitude', formData.location.coordinates[1]);
      
      // Thêm danh sách tình nguyện viên được chọn
      formData.selectedVolunteers.forEach(volunteerId => {
        rescueFormData.append('selectedVolunteers[]', volunteerId);
      });
      
      // Thêm hình ảnh
      formData.images.forEach(image => {
        rescueFormData.append('images', image);
      });
      
      // Gửi yêu cầu cứu hộ
      const response = await axios.post('/api/rescues', rescueFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Hiển thị thông báo thành công
      toast({
        title: "Thành công",
        description: "Yêu cầu cứu hộ đã được gửi thành công!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      // Chuyển hướng đến trang chi tiết cứu hộ
      navigate(`/rescues/${response.data.id}`);
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu cứu hộ:', error);
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể gửi yêu cầu cứu hộ. Vui lòng thử lại.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    throw new Error("Test ErrorBoundary");
  }, []);

  return (
    <Container maxW="container.lg" py={8}>
      <Heading as="h1" mb={6} textAlign="center">
        Yêu cầu cứu hộ thú cưng
      </Heading>
      
      <form onSubmit={handleSubmit}>
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
          {/* Thông tin người yêu cầu */}
          <GridItem colSpan={{ base: 1, md: 1 }}>
            <Card mb={6}>
              <CardBody>
                <Heading as="h2" size="md" mb={4}>
                  <Flex alignItems="center">
                    <Box mr={2}><FiMapPin /></Box>
                    Thông tin liên hệ
                  </Flex>
                </Heading>
                
                <Stack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Họ và tên</FormLabel>
                    <Input
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleInputChange}
                      placeholder="Nhập họ và tên của bạn"
                    />
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>Số điện thoại</FormLabel>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Nhập số điện thoại của bạn"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Ghi chú</FormLabel>
                    <Textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Thông tin thêm về tình huống cứu hộ"
                      rows={4}
                    />
                  </FormControl>
                </Stack>
              </CardBody>
            </Card>
            
            {/* Thông tin thú cưng */}
            <Card mb={6}>
              <CardBody>
                <Heading as="h2" size="md" mb={4}>
                  <Flex alignItems="center">
                    <Box mr={2}><FaPaw /></Box>
                    Thông tin thú cưng
                  </Flex>
                </Heading>
                
                <FormControl isRequired mb={4}>
                  <FormLabel>Chi tiết về thú cưng</FormLabel>
                  <Textarea
                    name="petDetails"
                    value={formData.petDetails}
                    onChange={handleInputChange}
                    placeholder="Mô tả chi tiết về thú cưng cần cứu hộ (loài, màu sắc, tình trạng...)"
                    rows={4}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Hình ảnh thú cưng (nếu có)</FormLabel>
                  <Box mb={4}>
                    <ImageUploader onUpload={handleImageUpload} />
                  </Box>
                  
                  {imagePreview.length > 0 && (
                    <Grid templateColumns="repeat(3, 1fr)" gap={2} mt={2}>
                      {imagePreview.map((src, index) => (
                        <Box key={index} position="relative">
                          <Image src={src} alt={`Pet image ${index + 1}`} borderRadius="md" />
                          <IconButton
                            icon={<FaTrash />}
                            size="sm"
                            colorScheme="red"
                            aria-label="Remove image"
                            position="absolute"
                            top="2px"
                            right="2px"
                            onClick={() => handleRemoveImage(index)}
                          />
                        </Box>
                      ))}
                    </Grid>
                  )}
                </FormControl>
              </CardBody>
            </Card>
          </GridItem>
          
          {/* Vị trí và tình nguyện viên */}
          <GridItem colSpan={{ base: 1, md: 1 }}>
            <Card mb={6}>
              <CardBody>
                <Heading as="h2" size="md" mb={4}>
                  <Flex alignItems="center">
                    <Box mr={2}><FiMapPin /></Box>
                    Vị trí cứu hộ
                  </Flex>
                </Heading>
                
                <Button
                  leftIcon={<FiNavigation />}
                  colorScheme="blue"
                  onClick={getCurrentLocation}
                  isLoading={locationLoading}
                  loadingText="Đang lấy vị trí..."
                  mb={4}
                  width="full"
                >
                  Lấy vị trí hiện tại
                </Button>
                
                {formData.location.coordinates[0] !== 0 && formData.location.coordinates[1] !== 0 && (
                  <Alert status="success" mb={4}>
                    <AlertIcon />
                    Đã lấy vị trí thành công! Tọa độ: {formData.location.coordinates[1].toFixed(6)}, {formData.location.coordinates[0].toFixed(6)}
                  </Alert>
                )}
                
                <FormControl mb={4}>
                  <FormLabel>Bán kính tìm kiếm tình nguyện viên (km): {formData.radius}</FormLabel>
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={formData.radius}
                    onChange={handleRadiusChange}
                  >
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb boxSize={6} />
                  </Slider>
                </FormControl>
                
                <Checkbox
                  isChecked={formData.autoAssignVolunteer}
                  onChange={handleAutoAssignChange}
                  mb={4}
                >
                  Tự động chọn tình nguyện viên gần nhất
                </Checkbox>
                
                {!formData.autoAssignVolunteer && (
                  <Box mt={4}>
                    <Heading as="h3" size="sm" mb={2}>
                      Chọn tình nguyện viên:
                    </Heading>
                    
                    {loadingVolunteers ? (
                      <Flex justify="center" my={4}>
                        <Spinner />
                      </Flex>
                    ) : volunteers.length > 0 ? (
                      <Stack spacing={2}>
                        {volunteers.map(volunteer => (
                          <Flex
                            key={volunteer.id}
                            p={2}
                            borderWidth="1px"
                            borderRadius="md"
                            alignItems="center"
                            onClick={() => handleVolunteerSelection(volunteer.id)}
                            cursor="pointer"
                            bg={formData.selectedVolunteers.includes(volunteer.id) ? "blue.50" : "white"}
                            borderColor={formData.selectedVolunteers.includes(volunteer.id) ? "blue.500" : "gray.200"}
                          >
                            <Checkbox
                              isChecked={formData.selectedVolunteers.includes(volunteer.id)}
                              onChange={() => {}}
                              mr={2}
                            />
                            <Avatar size="sm" src={volunteer.avatar} name={volunteer.name} mr={2} />
                            <Box>
                              <Text fontWeight="bold">{volunteer.name}</Text>
                              <Text fontSize="sm">{volunteer.distance.toFixed(2)} km</Text>
                            </Box>
                          </Flex>
                        ))}
                      </Stack>
                    ) : (
                      <Alert status="info">
                        <AlertIcon />
                        Không tìm thấy tình nguyện viên trong khu vực. Hãy tăng bán kính tìm kiếm.
                      </Alert>
                    )}
                  </Box>
                )}
              </CardBody>
            </Card>
            
            <Button
              type="submit"
              colorScheme="green"
              size="lg"
              width="full"
              leftIcon={<FiSend />}
              isLoading={loading}
              loadingText="Đang gửi..."
              mt={4}
            >
              Gửi yêu cầu cứu hộ
            </Button>
          </GridItem>
        </Grid>
      </form>
    </Container>
  );
};

export default Rescue;