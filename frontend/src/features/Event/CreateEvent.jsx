import React, { useState } from 'react';
import {
  Container,
  Box,
  Heading,
  Text,
  Flex,
  IconButton,
  Button,
  Input,
  Textarea,
  SimpleGrid,
  FormControl,
  FormLabel,
  Select,
  Tag,
  TagLabel,
  InputGroup,
  InputLeftElement,
  Divider,
  useColorModeValue,
  VStack
} from '@chakra-ui/react';
import { 
  FiArrowLeft, 
  FiCalendar, 
  FiMapPin, 
  FiPlus, 
  FiX 
} from 'react-icons/fi';
import { GiPawPrint } from 'react-icons/gi'; // Correct submodule for Game Icons
import { FaDog, FaCat } from 'react-icons/fa'; // Correct submodule for Font Awesome
import { useNavigate } from 'react-router-dom';
import DateTimePicker from 'react-datetime-picker';
import ImageUploader from '../../components/common/ImageUploader/ImageUploader';
import './CreateEvent.css';

const availableTags = [
  'nhận nuôi', 'chó', 'mèo', 'hội thảo', 'chăm sóc', 'khám sức khỏe', 
  'miễn phí', 'cuộc thi', 'giải thưởng', 'huấn luyện', 'workshop', 
  'triển lãm', 'sản phẩm', 'từ thiện', 'quyên góp'
];

const CreateEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startDate: null,
    endDate: null,
    category: '',
    tags: [],
    images: []
  });
  
  const [imagePreviews, setImagePreviews] = useState([]);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const petThemeColor = useColorModeValue('teal.500', 'teal.300');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleTagChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      tags: typeof value === 'string' ? value.split(',') : value,
    });
  };

  const handleDateChange = (name) => (newValue) => {
    setFormData({
      ...formData,
      [name]: newValue
    });
  };

  const handleImageUpload = (files) => {
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setFormData({
      ...formData,
      images: [...formData.images, ...files]
    });
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setFormData({
      ...formData,
      images: newImages
    });
    setImagePreviews(newPreviews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
    alert('Tạo sự kiện thành công!');
    navigate('/event');
  };

  return (
    <Container maxW="container.md" py={6}>
      <Box 
        bg={bgColor} 
        shadow="md" 
        borderRadius="lg" 
        p={6} 
        border="1px" 
        borderColor={borderColor}
        position="relative"
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          bgGradient: `linear(to-r, ${petThemeColor}, teal.300)`,
          borderTopRadius: 'lg'
        }}
      >
        <Flex align="center" mb={4}>
          <IconButton
            icon={<FiArrowLeft />}
            onClick={() => navigate('/event')}
            mr={2}
            variant="ghost"
            aria-label="Quay lại"
          />
          <Heading size="lg" fontWeight="bold" color={petThemeColor}>
            Tạo sự kiện mới
            <Box as={GiPawPrint} display="inline-block" ml={2} color={petThemeColor} />
          </Heading>
        </Flex>

        <Divider mb={6} borderColor={borderColor} />

        <form onSubmit={handleSubmit}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl isRequired>
              <FormLabel display="flex" alignItems="center">
                <Box as={FaDog} mr={2} color={petThemeColor} />
                Tiêu đề sự kiện
              </FormLabel>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Nhập tiêu đề sự kiện"
                variant="outline"
                focusBorderColor={petThemeColor}
                _hover={{ borderColor: petThemeColor }}
              />
            </FormControl>

            <FormControl>
              <FormLabel display="flex" alignItems="center">
                <Box as={FaCat} mr={2} color={petThemeColor} />
                Danh mục
              </FormLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="Chọn danh mục"
                focusBorderColor={petThemeColor}
                _hover={{ borderColor: petThemeColor }}
                isRequired
              >
                <option value="adoption">Nhận nuôi</option>
                <option value="workshop">Hội thảo</option>
                <option value="health">Sức khỏe</option>
                <option value="competition">Cuộc thi</option>
                <option value="charity">Từ thiện</option>
                <option value="other">Khác</option>
              </Select>
            </FormControl>

            <FormControl gridColumn={{ base: 'span 1', md: 'span 2' }} isRequired>
              <FormLabel display="flex" alignItems="center">
                <Box as={GiPawPrint} mr={2} color={petThemeColor} />
                Mô tả
              </FormLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Mô tả sự kiện của bạn"
                rows={4}
                variant="outline"
                focusBorderColor={petThemeColor}
                _hover={{ borderColor: petThemeColor }}
              />
            </FormControl>

            <FormControl gridColumn={{ base: 'span 1', md: 'span 2' }} isRequired>
              <FormLabel display="flex" alignItems="center">
                <Box as={FiMapPin} mr={2} color={petThemeColor} />
                Địa điểm
              </FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <FiMapPin color={textColor} />
                </InputLeftElement>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Nhập địa điểm tổ chức"
                  variant="outline"
                  focusBorderColor={petThemeColor}
                  _hover={{ borderColor: petThemeColor }}
                  pl={10}
                />
              </InputGroup>
            </FormControl>

            <FormControl isRequired>
              <FormLabel display="flex" alignItems="center">
                <Box as={FiCalendar} mr={2} color={petThemeColor} />
                Thời gian bắt đầu
              </FormLabel>
              <Box position="relative">
                <DateTimePicker
                  onChange={handleDateChange('startDate')}
                  value={formData.startDate}
                  format="dd/MM/yyyy HH:mm"
                  calendarIcon={<FiCalendar color={textColor} />}
                  clearIcon={<FiX color={textColor} />}
                  className="custom-datetime-picker"
                />
              </Box>
            </FormControl>

            <FormControl isRequired>
              <FormLabel display="flex" alignItems="center">
                <Box as={FiCalendar} mr={2} color={petThemeColor} />
                Thời gian kết thúc
              </FormLabel>
              <Box position="relative">
                <DateTimePicker
                  onChange={handleDateChange('endDate')}
                  value={formData.endDate}
                  format="dd/MM/yyyy HH:mm"
                  calendarIcon={<FiCalendar color={textColor} />}
                  clearIcon={<FiX color={textColor} />}
                  className="custom-datetime-picker"
                />
              </Box>
            </FormControl>

            <FormControl gridColumn={{ base: 'span 1', md: 'span 2' }}>
              <FormLabel display="flex" alignItems="center">
                <Box as={FaDog} mr={2} color={petThemeColor} />
                Thẻ
              </FormLabel>
              <Select
                multiple
                value={formData.tags}
                onChange={handleTagChange}
                placeholder="Chọn thẻ"
                focusBorderColor={petThemeColor}
                _hover={{ borderColor: petThemeColor }}
                renderValue={(selected) => (
                  <Flex wrap="wrap" gap={1}>
                    {selected.map((value) => (
                      <Tag key={value} size="sm" colorScheme="teal">
                        <TagLabel>{value}</TagLabel>
                      </Tag>
                    ))}
                  </Flex>
                )}
                sx={{ maxHeight: '200px', overflowY: 'auto' }}
              >
                {availableTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </Select>
            </FormControl>

            <Box gridColumn={{ base: 'span 1', md: 'span 2' }} mt={2}>
              <FormControl>
                <FormLabel display="flex" alignItems="center">
                  <Box as={FaCat} mr={2} color={petThemeColor} />
                  Hình ảnh sự kiện
                </FormLabel>
                <ImageUploader
                  images={formData.images}
                  previews={imagePreviews}
                  onUpload={handleImageUpload}
                  onRemove={handleRemoveImage}
                  maxImages={3}
                  label="Hình ảnh sự kiện"
                  required={false}
                  acceptTypes="image/*"
                />
              </FormControl>
            </Box>

            <Flex justify="space-between" mt={4} gridColumn={{ base: 'span 1', md: 'span 2' }}>
              <Button
                variant="outline"
                colorScheme="gray"
                leftIcon={<FiArrowLeft />}
                onClick={() => navigate('/event')}
                _hover={{ bg: 'gray.100' }}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                colorScheme="teal"
                leftIcon={<FiPlus />}
                _hover={{ transform: 'scale(1.05)', transition: 'all 0.2s' }}
              >
                Tạo sự kiện
              </Button>
            </Flex>
          </SimpleGrid>
        </form>
      </Box>
    </Container>
  );
};

export default CreateEvent;