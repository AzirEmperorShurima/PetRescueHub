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
  VStack,
  HStack,
  extendTheme,
  ChakraProvider
} from '@chakra-ui/react';
import { FiArrowLeft, FiCalendar, FiMapPin, FiPlus, FiX } from 'react-icons/fi';
import { GiPawPrint } from 'react-icons/gi';
import { FaDog, FaCat } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import DateTimePicker from 'react-datetime-picker';
import CreatableSelect from 'react-select/creatable';
import ImageUploader from '../../components/common/ImageUploader/ImageUploader';

// Danh sách thẻ có sẵn
const availableTags = [
  'nhận nuôi', 'chó', 'mèo', 'hội thảo', 'chăm sóc', 'khám sức khỏe',
  'miễn phí', 'cuộc thi', 'giải thưởng', 'huấn luyện', 'workshop',
  'triển lãm', 'sản phẩm', 'từ thiện', 'quyên góp'
];

// Component ImageUploader cải tiến
const ImageUploaderComponent = ({ images, previews, onUpload, onRemove, maxImages, label, required, acceptTypes }) => {
  const handleFiles = (e) => {
    const files = Array.from(e.target.files).slice(0, maxImages - images.length);
    onUpload(files);
  };

  return (
    <VStack align="start" spacing={4}>
      <FormLabel fontWeight="medium" color="gray.600">{label}</FormLabel>
      <Input
        type="file"
        accept={acceptTypes}
        multiple
        onChange={handleFiles}
        display="none"
        id="image-upload"
      />
      <Button
        as="label"
        htmlFor="image-upload"
        colorScheme="teal"
        variant="outline"
        leftIcon={<FiPlus />}
        cursor="pointer"
        _hover={{ bg: 'teal.50', transform: 'scale(1.02)' }}
        transition="all 0.2s"
        isDisabled={images.length >= maxImages}
      >
        Tải lên hình ảnh ({images.length}/{maxImages})
      </Button>
      <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4} w="full">
        {previews.map((preview, index) => (
          <Box key={index} position="relative" borderRadius="md" overflow="hidden" boxShadow="sm">
            <img src={preview} alt="Preview" style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
            <IconButton
              icon={<FiX />}
              size="xs"
              colorScheme="red"
              position="absolute"
              top={1}
              right={1}
              onClick={() => onRemove(index)}
              aria-label="Xóa hình ảnh"
            />
          </Box>
        ))}
      </SimpleGrid>
    </VStack>
  );
};

// Tùy chỉnh theme
const theme = extendTheme({
  components: {
    Input: {
      baseStyle: {
        field: {
          _hover: { borderColor: 'teal.500' },
          _focus: { borderColor: 'teal.500', boxShadow: '0 0 0 3px rgba(49, 151, 149, 0.2)' }
        }
      }
    },
    Textarea: {
      baseStyle: {
        _hover: { borderColor: 'teal.500' },
        _focus: { borderColor: 'teal.500', boxShadow: '0 0 0 3px rgba(49, 151, 149, 0.2)' }
      }
    },
    Select: {
      baseStyle: {
        field: {
          _hover: { borderColor: 'teal.500' },
          _focus: { borderColor: 'teal.500', boxShadow: '0 0 0 3px rgba(49, 151, 149, 0.2)' }
        }
      }
    }
  }
});

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

  const handleTagChange = (newValue) => {
    setFormData({
      ...formData,
      tags: newValue ? newValue.map(item => item.value) : []
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

  // Tùy chỉnh style cho CreatableSelect
  const selectStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: borderColor,
      borderRadius: '6px',
      minHeight: '40px',
      '&:hover': { borderColor: petThemeColor },
      boxShadow: 'none'
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 1000
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: petThemeColor,
      color: 'white'
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: 'white'
    })
  };

  return (
    <ChakraProvider theme={theme}>
      <Container maxW="container.lg" py={8}>
        <Box
          bg={bgColor}
          shadow="lg"
          borderRadius="xl"
          p={{ base: 4, md: 8 }}
          border="1px"
          borderColor={borderColor}
          position="relative"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            bgGradient: `linear(to-r, ${petThemeColor}, teal.300)`,
            borderTopRadius: 'xl'
          }}
        >
          <Flex align="center" mb={6}>
            <IconButton
              icon={<FiArrowLeft />}
              onClick={() => navigate('/event')}
              mr={3}
              variant="ghost"
              colorScheme="teal"
              size="lg"
              aria-label="Quay lại"
              _hover={{ bg: 'teal.50', transform: 'scale(1.1)' }}
              transition="all 0.2s"
            />
            <Heading size="xl" fontWeight="bold" color={petThemeColor}>
              Tạo sự kiện mới
              <Box as={GiPawPrint} display="inline-block" ml={3} color={petThemeColor} size="1.5em" />
            </Heading>
          </Flex>

          <Divider mb={8} borderColor={borderColor} />

          <form onSubmit={handleSubmit}>
            <VStack spacing={8}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
                <FormControl isRequired>
                  <FormLabel fontWeight="medium" color={textColor}>
                    <HStack>
                      <FaDog />
                      <Text>Tiêu đề sự kiện</Text>
                    </HStack>
                  </FormLabel>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Nhập tiêu đề sự kiện"
                    size="lg"
                    borderRadius="md"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontWeight="medium" color={textColor}>
                    <HStack>
                      <FaCat />
                      <Text>Danh mục</Text>
                    </HStack>
                  </FormLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="Chọn danh mục"
                    size="lg"
                    borderRadius="md"
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
                  <FormLabel fontWeight="medium" color={textColor}>
                    <HStack>
                      <GiPawPrint />
                      <Text>Mô tả</Text>
                    </HStack>
                  </FormLabel>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Mô tả sự kiện của bạn"
                    rows={4}
                    size="lg"
                    borderRadius="md"
                  />
                </FormControl>

                <FormControl gridColumn={{ base: 'span 1', md: 'span 2' }} isRequired>
                  <FormLabel fontWeight="medium" color={textColor}>
                    <HStack>
                      <FiMapPin />
                      <Text>Địa điểm</Text>
                    </HStack>
                  </FormLabel>
                  <InputGroup size="lg">
                    <InputLeftElement pointerEvents="none">
                      <FiMapPin color={textColor} />
                    </InputLeftElement>
                    <Input
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Nhập địa điểm tổ chức"
                      pl={10}
                      borderRadius="md"
                    />
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontWeight="medium" color={textColor}>
                    <HStack>
                      <FiCalendar />
                      <Text>Thời gian bắt đầu</Text>
                    </HStack>
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
                  <FormLabel fontWeight="medium" color={textColor}>
                    <HStack>
                      <FiCalendar />
                      <Text>Thời gian kết thúc</Text>
                    </HStack>
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
                  <FormLabel fontWeight="medium" color={textColor}>
                    <HStack>
                      <FaDog />
                      <Text>Thẻ</Text>
                    </HStack>
                  </FormLabel>
                  <CreatableSelect
                    isMulti
                    value={formData.tags.map(tag => ({ value: tag, label: tag }))}
                    onChange={handleTagChange}
                    options={availableTags.map(tag => ({ value: tag, label: tag }))}
                    placeholder="Chọn hoặc nhập thẻ"
                    styles={selectStyles}
                    formatCreateLabel={(inputValue) => `Tạo thẻ "${inputValue}"`}
                  />
                </FormControl>

                <FormControl gridColumn={{ base: 'span 1', md: 'span 2' }}>
                  <ImageUploaderComponent
                    images={formData.images}
                    previews={imagePreviews}
                    onUpload={handleImageUpload}
                    onRemove={handleRemoveImage}
                    maxImages={3}
                    label="Hình ảnh sự kiện"
                    acceptTypes="image/*"
                  />
                </FormControl>
              </SimpleGrid>

              <Flex justify="space-between" w="full" mt={6}>
                <Button
                  variant="outline"
                  colorScheme="gray"
                  leftIcon={<FiArrowLeft />}
                  onClick={() => navigate('/event')}
                  size="lg"
                  _hover={{ bg: 'gray.100', transform: 'scale(1.05)' }}
                  transition="all 0.2s"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  colorScheme="teal"
                  leftIcon={<FiPlus />}
                  size="lg"
                  _hover={{ transform: 'scale(1.05)', transition: 'all 0.2s' }}
                >
                  Tạo sự kiện
                </Button>
              </Flex>
            </VStack>
          </form>
        </Box>
      </Container>
    </ChakraProvider>
  );
};

export default CreateEvent;