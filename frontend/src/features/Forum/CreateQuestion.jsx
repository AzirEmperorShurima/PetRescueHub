import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Heading,
  Text,
  Input,
  Button,
  Card,
  CardBody,
  Tag,
  TagLabel,
  TagCloseButton,
  IconButton,
  VStack,
  HStack,
  Alert,
  AlertIcon,
  Spinner,
  Divider,
  FormControl,
  FormLabel,
  FormHelperText,
  Textarea,
  Wrap,
  WrapItem,
  Flex,
  useColorModeValue,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react';
import {
  ArrowBackIcon,
  CloseIcon
} from '@chakra-ui/icons';
import forumService from '../../services/forum.service';
import ImageUploader from '../../components/common/ImageUploader/ImageUploader';
import './ForumForms.css'; // Cập nhật import

const CreateQuestion = ({ onClose }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tagSuggestions] = useState([
    'golden retriever', 'husky', 'corgi', 'poodle', 'chihuahua',
    'mèo anh lông ngắn', 'mèo ba tư', 'mèo munchkin', 'mèo ragdoll',
    'chăm sóc', 'huấn luyện', 'dinh dưỡng', 'sức khỏe', 'tiêm phòng',
    'cứu hộ', 'nhận nuôi', 'thức ăn', 'đồ chơi', 'phụ kiện'
  ]);

  // Color mode values
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleImageUpload = (files) => {
    // Tạo URL preview cho các file ảnh
    const newPreviews = files.map(file => URL.createObjectURL(file));
    
    setImages([...images, ...files]);
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };
  
  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleAddTag = (tagValue) => {
    const trimmedTag = tagValue.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag]);
      setCurrentTag('');
    }
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(currentTag);
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleSuggestionClick = (suggestion) => {
    handleAddTag(suggestion);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề câu hỏi');
      return;
    }
    
    if (!content.trim()) {
      setError('Vui lòng nhập nội dung câu hỏi');
      return;
    }
    
    if (tags.length > 5) {
      setError('Vui lòng chọn tối đa 5 thẻ');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      
      console.log('Tiêu đề:', title);
      console.log('Nội dung:', content);
      
      if (tags && tags.length > 0) {
        tags.forEach(tag => formData.append('tags', tag));
        console.log('Tags:', tags);
      }
      
      formData.append('postType', 'Question'); // Đặt loại là Question
      console.log('Loại bài viết:', 'Question');
      
      let response;
      
      if (images && images.length > 0) {
        images.forEach(image => formData.append('imgUrl', image));
        console.log('Số lượng hình ảnh:', images.length);
        
        // Kiểm tra nội dung của FormData
        console.log('FormData entries:');
        for (let pair of formData.entries()) {
          console.log(pair[0] + ': ' + pair[1]);
        }
        
        console.log('Gọi API tạo câu hỏi mới với hình ảnh...');
        response = await forumService.createNewPostWithImage(formData);
      } else {
        const questionData = {
          title,
          content,
          tags: tags.length > 0 ? tags : [],
          postType: 'Question'
        };
        
        console.log('Gọi API tạo câu hỏi mới không có hình ảnh...');
        response = await forumService.createNewPost(questionData);
      }
      
      console.log('Kết quả API:', response);
      
      if (response && response.success) {
        if (onClose) {
          onClose();
        } else {
          navigate('/forum');
        }
      } else {
        setError(response?.message || 'Đã xảy ra lỗi khi tạo câu hỏi');
      }
    } catch (error) {
      console.error('Chi tiết lỗi khi tạo câu hỏi:', error.response || error);
      setError('Đã xảy ra lỗi khi tạo câu hỏi. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const filteredSuggestions = tagSuggestions.filter(
    suggestion => 
      !tags.includes(suggestion) && 
      suggestion.toLowerCase().includes(currentTag.toLowerCase())
  );

  return (
    <Container maxW="container.md" py={6}>
      <Card bg={bg} shadow="sm" borderRadius="lg">
        <CardBody p={6}>
          <Flex align="center" justify="space-between" mb={6}>
            <HStack>
              {onClose ? (
                <IconButton
                  icon={<CloseIcon />}
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                />
              ) : (
                <IconButton
                  icon={<ArrowBackIcon />}
                  onClick={() => navigate('/forum')}
                  variant="ghost"
                  size="sm"
                />
              )}
              <Heading size="lg" fontWeight="bold">
                Đặt câu hỏi mới
              </Heading>
            </HStack>
          </Flex>
          
          <Divider mb={6} />
          
          {error && (
            <Alert status="error" mb={6} borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}
          
          <Box as="form" onSubmit={handleSubmit}>
            <VStack spacing={6} align="stretch">
              {/* Title Input */}
              <FormControl isRequired>
                <FormLabel>Tiêu đề câu hỏi</FormLabel>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nhập tiêu đề câu hỏi của bạn..."
                />
              </FormControl>
              
              {/* Tags Input */}
              <FormControl>
                <FormLabel>Thẻ (tối đa 5 thẻ)</FormLabel>
                <VStack align="stretch" spacing={3}>
                  {/* Current Tags */}
                  {tags.length > 0 && (
                    <Wrap>
                      {tags.map((tag, index) => (
                        <WrapItem key={index}>
                          <Tag size="md" colorScheme="blue" variant="solid">
                            <TagLabel>{tag}</TagLabel>
                            <TagCloseButton onClick={() => handleRemoveTag(index)} />
                          </Tag>
                        </WrapItem>
                      ))}
                    </Wrap>
                  )}
                  
                  {/* Tag Input */}
                  {tags.length < 5 && (
                    <InputGroup>
                      <Input
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyPress={handleTagKeyPress}
                        placeholder="Nhập thẻ và nhấn Enter"
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
                <FormHelperText>
                  Thẻ giúp người dùng tìm kiếm câu hỏi của bạn dễ dàng hơn
                </FormHelperText>
              </FormControl>
              
              {/* Content Textarea */}
              <FormControl isRequired>
                <FormLabel>Nội dung câu hỏi</FormLabel>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Mô tả chi tiết câu hỏi của bạn..."
                  rows={10}
                  resize="vertical"
                />
              </FormControl>
              
              {/* Image Uploader */}
              <FormControl>
                <FormLabel>Hình ảnh (không bắt buộc)</FormLabel>
                <Box className="forum-image-uploader">
                  <ImageUploader
                    images={images}
                    previews={imagePreviews}
                    onUpload={handleImageUpload}
                    onRemove={handleRemoveImage}
                    maxImages={3}
                    label="Hình ảnh (không bắt buộc)"
                    required={false}
                    acceptTypes="image/*"
                  />
                </Box>
              </FormControl>
              
              {/* Action Buttons */}
              <HStack justify="flex-end" spacing={4}>
                <Button
                  variant="outline"
                  onClick={onClose || (() => navigate('/forum'))}
                  isDisabled={loading}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={loading}
                  loadingText="Đang tạo..."
                  spinner={<Spinner size="sm" />}
                >
                  Đặt câu hỏi
                </Button>
              </HStack>
            </VStack>
          </Box>
        </CardBody>
      </Card>
    </Container>
  );
};

export default CreateQuestion;