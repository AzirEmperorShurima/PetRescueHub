import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
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
import './ForumForms.css';

// Define the component before any potential exports
// Change the default value from 'Post' to 'ForumPost'
const CreatePost = ({ postType = 'ForumPost', onClose }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tagSuggestions, setTagSuggestions] = useState([
    'golden retriever', 'husky', 'corgi', 'poodle', 'chihuahua',
    'mèo anh lông ngắn', 'mèo ba tư', 'mèo munchkin', 'mèo ragdoll',
    'chăm sóc', 'huấn luyện', 'dinh dưỡng', 'sức khỏe', 'tiêm phòng',
    'cứu hộ', 'nhận nuôi', 'thức ăn', 'đồ chơi', 'phụ kiện'
  ]);

  // Color mode values
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  // Xác định tiêu đề form dựa trên postType
  // Update the getFormTitle function to use 'ForumPost' instead of default case
  const getFormTitle = () => {
    switch(postType) {
      case 'Question':
        return 'Đặt câu hỏi mới';
      case 'EventPost':
        return 'Tạo sự kiện mới';
      case 'FindLostPetPost':
        return 'Đăng tin tìm thú cưng';
      case 'ForumPost':
      default:
        return 'Tạo bài viết mới';
    }
  };

  // Xác định placeholder và label dựa trên postType
  const getContentPlaceholder = () => {
    switch(postType) {
      case 'Question':
        return 'Mô tả chi tiết câu hỏi của bạn...';
      case 'EventPost':
        return 'Mô tả chi tiết về sự kiện (thời gian, địa điểm, hoạt động...)';
      case 'FindLostPetPost':
        return 'Mô tả chi tiết về thú cưng (đặc điểm, nơi mất tích, thông tin liên hệ...)';
      case 'ForumPost':
      default:
        return 'Chia sẻ kinh nghiệm, câu chuyện của bạn về thú cưng...';
    }
  };

  const getTitleLabel = () => {
    switch(postType) {
      case 'Question':
        return 'Tiêu đề câu hỏi';
      case 'EventPost':
        return 'Tên sự kiện';
      case 'FindLostPetPost':
        return 'Tiêu đề tin tìm thú cưng';
      case 'ForumPost':
      default:
        return 'Tiêu đề bài viết';
    }
  };

  const getContentLabel = () => {
    switch(postType) {
      case 'Question':
        return 'Nội dung câu hỏi';
      case 'EventPost':
        return 'Mô tả sự kiện';
      case 'FindLostPetPost':
        return 'Thông tin chi tiết';
      case 'ForumPost':
      default:
        return 'Nội dung bài viết';
    }
  };

  const getSubmitButtonText = () => {
    switch(postType) {
      case 'Question':
        return loading ? 'Đang đăng...' : 'Đặt câu hỏi';
      case 'EventPost':
        return loading ? 'Đang tạo...' : 'Tạo sự kiện';
      case 'FindLostPetPost':
        return loading ? 'Đang đăng...' : 'Đăng tin';
      case 'ForumPost':
      default:
        return loading ? 'Đang tạo...' : 'Tạo bài viết';
    }
  };
  
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
      setError('Vui lòng nhập tiêu đề bài viết');
      return;
    }
    
    if (!content.trim()) {
      setError('Vui lòng nhập nội dung bài viết');
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
      
      // Thay vì gửi JSON string, gửi từng tag riêng lẻ
      if (tags && tags.length > 0) {
        tags.forEach(tag => formData.append('tags', tag));
        console.log('Tags:', tags);
      }
      
      formData.append('postType', postType); // Sử dụng postType từ props
      console.log('Loại bài viết:', postType);
      
      // Thêm tất cả các hình ảnh vào formData
      if (images && images.length > 0) {
        images.forEach((image, index) => {
          formData.append('imgUrl', image);
        });
        console.log('Số lượng hình ảnh:', images.length);
        
        // Kiểm tra nội dung của FormData
        console.log('FormData entries:');
        for (let pair of formData.entries()) {
          console.log(pair[0] + ': ' + pair[1]);
        }
        
        console.log('Gọi API tạo bài viết mới với hình ảnh...');
        const response = await forumService.createNewPostWithImage(formData);
        
        console.log('Kết quả API:', response);
        
        if (response && response.success) {
          if (onClose) {
            onClose();
          } else {
            navigate('/forum');
          }
        } else {
          setError(response?.message || 'Đã xảy ra lỗi khi tạo bài viết');
        }
      } else {
        // Nếu không có hình ảnh, tạo đối tượng dữ liệu thông thường
        const postData = {
          title,
          content,
          tags: tags.length > 0 ? tags : [],
          postType: postType
        };
        
        console.log('Gọi API tạo bài viết mới không có hình ảnh...');
        const response = await forumService.createNewPost(postData);
        
        console.log('Kết quả API:', response);
        
        if (response && response.success) {
          if (onClose) {
            onClose();
          } else {
            navigate('/forum');
          }
        } else {
          setError(response?.message || 'Đã xảy ra lỗi khi tạo bài viết');
        }
      }
    } catch (error) {
      console.error('Chi tiết lỗi khi tạo bài viết:', error.response || error);
      setError('Đã xảy ra lỗi khi tạo bài viết. Vui lòng thử lại sau.');
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
                {getFormTitle()}
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
                <FormLabel>{getTitleLabel()}</FormLabel>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={`Nhập ${getTitleLabel().toLowerCase()}...`}
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
                  Thẻ giúp người dùng tìm kiếm bài viết của bạn dễ dàng hơn
                </FormHelperText>
              </FormControl>
              
              {/* Content Textarea */}
              <FormControl isRequired>
                <FormLabel>{getContentLabel()}</FormLabel>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={getContentPlaceholder()}
                  rows={10}
                  resize="vertical"
                />
              </FormControl>
              
              {/* Image Uploader */}
              <FormControl>
                <FormLabel>Hình ảnh bài viết</FormLabel>
                <Box className="forum-image-uploader">
                  <ImageUploader
                    images={images}
                    previews={imagePreviews}
                    onUpload={handleImageUpload}
                    onRemove={handleRemoveImage}
                    maxImages={5}
                    label="Hình ảnh bài viết"
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
                  loadingText={getSubmitButtonText()}
                  spinner={<Spinner size="sm" />}
                >
                  {getSubmitButtonText()}
                </Button>
              </HStack>
            </VStack>
          </Box>
        </CardBody>
      </Card>
    </Container>
  );
};

// Define propTypes after the component definition
CreatePost.propTypes = {
  postType: PropTypes.string,
  onClose: PropTypes.func
};

// Export the component at the end
export default CreatePost;