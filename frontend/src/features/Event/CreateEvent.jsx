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
  TagCloseButton,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Divider,
  useColorModeValue,
  VStack,
  HStack,
  extendTheme,
  ChakraProvider,
  Wrap,
  WrapItem,
  useToast,
  Spinner,
  Center
} from '@chakra-ui/react';
import { FiArrowLeft, FiCalendar, FiMapPin, FiPlus, FiX } from 'react-icons/fi';
import { GiPawPrint } from 'react-icons/gi';
import { FaDog, FaCat } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import ImageUploader from '../../components/common/ImageUploader/ImageUploader';
import forumService from '../../services/forum.service';

// Danh sách thẻ có sẵn
const availableTags = [
  'nhận nuôi', 'chó', 'mèo', 'hội thảo', 'chăm sóc', 'khám sức khỏe',
  'miễn phí', 'cuộc thi', 'giải thưởng', 'huấn luyện', 'workshop',
  'triển lãm', 'sản phẩm', 'từ thiện', 'quyên góp'
];

// Danh sách gợi ý tag cho sự kiện
const eventTagSuggestions = [
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
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  const [currentTag, setCurrentTag] = useState('');
  const [tags, setTags] = useState([]);

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
    const newDate = newValue ? new Date(newValue) : null;
    
    // Validation cho thời gian
    if (name === 'startDate' && newDate) {
      // Không cho phép chọn thời gian trong quá khứ
      if (newDate < new Date()) {
        toast({
          title: 'Thời gian không hợp lệ',
          description: 'Thời gian bắt đầu không thể là thời gian trong quá khứ',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      
      // Nếu đã có thời gian kết thúc, kiểm tra xem thời gian bắt đầu có trước thời gian kết thúc không
      if (formData.endDate && newDate >= formData.endDate) {
        toast({
          title: 'Thời gian không hợp lệ',
          description: 'Thời gian bắt đầu phải trước thời gian kết thúc',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    }
    
    if (name === 'endDate' && newDate) {
      // Kiểm tra xem thời gian kết thúc có sau thời gian bắt đầu không
      if (formData.startDate && newDate <= formData.startDate) {
        toast({
          title: 'Thời gian không hợp lệ',
          description: 'Thời gian kết thúc phải sau thời gian bắt đầu',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    }

    setFormData({
      ...formData,
      [name]: newDate
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;

    // Validation checks
    if (!formData.title.trim()) {
      toast({
        title: 'Thiếu tiêu đề',
        description: 'Vui lòng nhập tiêu đề sự kiện',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      hasError = true;
    }
    if (!formData.description.trim()) {
      toast({
        title: 'Thiếu mô tả',
        description: 'Vui lòng nhập mô tả sự kiện',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      hasError = true;
    }
    if (!formData.location.trim()) {
      toast({
        title: 'Thiếu địa điểm',
        description: 'Vui lòng nhập địa điểm tổ chức',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      hasError = true;
    }
    if (!formData.startDate) {
      toast({
        title: 'Thiếu thời gian bắt đầu',
        description: 'Vui lòng chọn thời gian bắt đầu',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      hasError = true;
    }
    if (!formData.endDate) {
      toast({
        title: 'Thiếu thời gian kết thúc',
        description: 'Vui lòng chọn thời gian kết thúc',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      hasError = true;
    }

    // Kiểm tra thời gian hợp lệ
    if (formData.startDate && formData.endDate) {
      if (formData.startDate >= formData.endDate) {
        toast({
          title: 'Thời gian không hợp lệ',
          description: 'Thời gian bắt đầu phải trước thời gian kết thúc',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        hasError = true;
      }

      // Kiểm tra khoảng thời gian tối thiểu (ví dụ: 30 phút)
      const minDuration = 30 * 60 * 1000; // 30 phút tính bằng milliseconds
      if (formData.endDate - formData.startDate < minDuration) {
        toast({
          title: 'Thời gian không hợp lệ',
          description: 'Sự kiện phải kéo dài ít nhất 30 phút',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        hasError = true;
      }

      // Kiểm tra khoảng thời gian tối đa (ví dụ: 7 ngày)
      const maxDuration = 7 * 24 * 60 * 60 * 1000; // 7 ngày tính bằng milliseconds
      if (formData.endDate - formData.startDate > maxDuration) {
        toast({
          title: 'Thời gian không hợp lệ',
          description: 'Sự kiện không thể kéo dài quá 7 ngày',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        hasError = true;
      }
    }

    if (hasError) return;

    try {
      setIsSubmitting(true); // Bắt đầu loading
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('content', formData.description);
      submitData.append('location', formData.location);
      submitData.append('startDate', formData.startDate ? new Date(formData.startDate).toISOString() : '');
      submitData.append('endDate', formData.endDate ? new Date(formData.endDate).toISOString() : '');
      submitData.append('postType', 'EventPost');
      tags.forEach(tag => submitData.append('tags', tag));
      if (formData.images?.length > 0) {
        formData.images.forEach(img => submitData.append('images', img));
      }

      const response = await forumService.createNewPostWithImage(submitData);
      if (response?.success) {
        toast({
          title: 'Tạo sự kiện thành công',
          description: 'Sự kiện đã gửi, chờ admin phê duyệt!',
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
        setTimeout(() => {
          navigate('/event');
        }, 1200);
      } else {
        throw new Error(response?.message || 'Lỗi không xác định');
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Đã xảy ra lỗi khi tạo sự kiện. Vui lòng thử lại sau.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false); // Kết thúc loading
    }
  };

  const handleAddTag = (tagValue) => {
    if (!tagValue || !tagValue.trim()) return;
    
    let trimmedTag = tagValue.trim();
    trimmedTag = trimmedTag.replace(/^#+/, '');
    
    if (!trimmedTag) return;
    
    const normalizedTag = `#${trimmedTag}`;
    
    if (tags.includes(normalizedTag)) {
      toast({
        title: 'Tag đã tồn tại',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    
    setTags([...tags, normalizedTag]);
    setCurrentTag('');
  };

  const handleRemoveTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleSuggestionClick = (suggestion) => {
    handleAddTag(suggestion);
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(currentTag);
    }
  };

  // Lọc gợi ý tag dựa trên input hiện tại
  const filteredSuggestions = eventTagSuggestions.filter(
    suggestion => 
      !tags.includes(`#${suggestion}`) && 
      suggestion.toLowerCase().includes(currentTag.toLowerCase())
  );

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
                  <FormLabel display="flex" alignItems="center" color="black" fontWeight="bold" fontSize="md" mb={1}>
                    <HStack spacing={2}>
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
                    width="100%"
                    minW="350px"
                    fontSize="md"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel display="flex" alignItems="center" color="black" fontWeight="bold" fontSize="md" mb={1}>
                    <HStack spacing={2}>
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
                    fontSize="md"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel display="flex" alignItems="center" color="black" fontWeight="bold" fontSize="md" mb={1}>
                    <HStack spacing={2}>
                      <FiCalendar />
                      <Text>Thời gian bắt đầu</Text>
                    </HStack>
                  </FormLabel>
                  <Input
                    type="datetime-local"
                    value={formData.startDate ? dayjs(formData.startDate).format('YYYY-MM-DDTHH:mm') : ''}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : null;
                      handleDateChange('startDate')(date);
                    }}
                    size="lg"
                    borderRadius="md"
                    fontSize="md"
                    min={dayjs().format('YYYY-MM-DDTHH:mm')}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel display="flex" alignItems="center" color="black" fontWeight="bold" fontSize="md" mb={1}>
                    <HStack spacing={2}>
                      <FiCalendar />
                      <Text>Thời gian kết thúc</Text>
                    </HStack>
                  </FormLabel>
                  <Input
                    type="datetime-local"
                    value={formData.endDate ? dayjs(formData.endDate).format('YYYY-MM-DDTHH:mm') : ''}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : null;
                      handleDateChange('endDate')(date);
                    }}
                    size="lg"
                    borderRadius="md"
                    fontSize="md"
                    min={formData.startDate ? dayjs(formData.startDate).add(30, 'minute').format('YYYY-MM-DDTHH:mm') : dayjs().format('YYYY-MM-DDTHH:mm')}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel display="flex" alignItems="center" color="black" fontWeight="bold" fontSize="md" mb={1}>
                    <HStack spacing={2}>
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
                      fontSize="md"
                    />
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <FormLabel display="flex" alignItems="center" color="black" fontWeight="bold" fontSize="md" mb={1}>
                    <HStack spacing={2}>
                      <FaDog />
                      <Text>Thẻ</Text>
                    </HStack>
                  </FormLabel>
                  <VStack align="stretch" spacing={3}>
                    {tags.length > 0 && (
                      <Wrap>
                        {tags.map((tag, index) => (
                          <WrapItem key={index}>
                            <Tag size="md" colorScheme="teal" variant="solid">
                              <TagLabel>{tag}</TagLabel>
                              <TagCloseButton onClick={() => handleRemoveTag(index)} />
                            </Tag>
                          </WrapItem>
                        ))}
                      </Wrap>
                    )}
                    {tags.length < 5 && (
                      <InputGroup>
                        <Input
                          value={currentTag}
                          onChange={(e) => setCurrentTag(e.target.value)}
                          onKeyPress={handleTagKeyPress}
                          placeholder="Nhập thẻ và nhấn Enter"
                          size="lg"
                        />
                        {currentTag && (
                          <InputRightElement>
                            <Button
                              size="sm"
                              onClick={() => handleAddTag(currentTag)}
                              variant="ghost"
                            >
                              Thêm
                            </Button>
                          </InputRightElement>
                        )}
                      </InputGroup>
                    )}
                    
                    {/* Tag Suggestions */}
                    {currentTag && filteredSuggestions.length > 0 && (
                      <Box
                        border="1px"
                        borderColor={borderColor}
                        borderRadius="md"
                        p={3}
                        maxH="120px"
                        overflowY="auto"
                      >
                        <Text fontSize="sm" color="gray.600" mb={2}>
                          Gợi ý:
                        </Text>
                        <Wrap>
                          {filteredSuggestions.slice(0, 10).map((suggestion, index) => (
                            <WrapItem key={index}>
                              <Tag
                                size="sm"
                                variant="outline"
                                cursor="pointer"
                                onClick={() => handleSuggestionClick(suggestion)}
                                _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                              >
                                {suggestion}
                              </Tag>
                            </WrapItem>
                          ))}
                        </Wrap>
                      </Box>
                    )}
                  </VStack>
                </FormControl>
              </SimpleGrid>

              <FormControl mt={6}>
                <FormLabel display="flex" alignItems="center" color="black" fontWeight="bold" fontSize="md" mb={1}>
                  <Text>Hình ảnh sự kiện</Text>
                </FormLabel>
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

              <Flex justify="space-between" w="full" mt={6}>
                <Button
                  variant="outline"
                  colorScheme="gray"
                  leftIcon={<FiArrowLeft />}
                  onClick={() => navigate('/event')}
                  size="lg"
                  _hover={{ bg: 'gray.100', transform: 'scale(1.05)' }}
                  transition="all 0.2s"
                  isDisabled={isSubmitting}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  colorScheme="teal"
                  leftIcon={isSubmitting ? <Spinner size="sm" /> : <FiPlus />}
                  size="lg"
                  _hover={{ transform: 'scale(1.05)', transition: 'all 0.2s' }}
                  isLoading={isSubmitting}
                  loadingText="Đang tạo sự kiện..."
                  isDisabled={isSubmitting}
                >
                  {isSubmitting ? 'Đang tạo sự kiện...' : 'Tạo sự kiện'}
                </Button>
              </Flex>
            </VStack>
          </form>

          {/* Loading Overlay */}
          {isSubmitting && (
            <Center
              position="fixed"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="rgba(0, 0, 0, 0.5)"
              zIndex={9999}
            >
              <VStack spacing={4} bg="white" p={8} borderRadius="lg" boxShadow="xl">
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="teal.500"
                  size="xl"
                />
                <Text fontSize="lg" fontWeight="medium" color="gray.600">
                  Đang tạo sự kiện...
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Vui lòng đợi trong giây lát
                </Text>
              </VStack>
            </Center>
          )}
        </Box>
      </Container>
    </ChakraProvider>
  );
};

export default CreateEvent;