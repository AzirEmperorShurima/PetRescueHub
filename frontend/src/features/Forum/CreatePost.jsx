import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useRef, useEffect } from 'react'; // Thêm useRef và useEffect
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
import { useToast, Progress } from '@chakra-ui/react';
import { ArrowBackIcon, CloseIcon } from '@chakra-ui/icons';
import forumService from '../../services/forum.service';
import ImageUploader from '../../components/common/ImageUploader/ImageUploader';
import './ForumForms.css';

// Configuration object for post type-specific text
const postTypeConfig = {
  Question: {
    formTitle: 'Đặt câu hỏi mới',
    titleLabel: 'Tiêu đề câu hỏi',
    contentLabel: 'Nội dung câu hỏi',
    contentPlaceholder: 'Mô tả chi tiết câu hỏi của bạn...',
    submitText: ['Đang đăng...', 'Đặt câu hỏi'],
    redirectPath: '/forum?tab=1', // Tab câu hỏi
    successMessage: 'Câu hỏi đã được đăng thành công',
    dbPostType: 'Question' // Type sẽ được gửi lên database
  },
  EventPost: {
    formTitle: 'Tạo sự kiện mới',
    titleLabel: 'Tên sự kiện',
    contentLabel: 'Mô tả sự kiện',
    contentPlaceholder: 'Mô tả chi tiết về sự kiện (thời gian, địa điểm, hoạt động...)',
    submitText: ['Đang tạo...', 'Tạo sự kiện'],
    redirectPath: '/forum?tab=3', // Tab sự kiện
    successMessage: 'Sự kiện đã được tạo thành công',
    dbPostType: 'EventPost' // Type sẽ được gửi lên database
  },
  FindLostPetPost: {
    formTitle: 'Đăng tin tìm thú cưng',
    titleLabel: 'Tiêu đề tin tìm thú cưng',
    contentLabel: 'Thông tin chi tiết',
    contentPlaceholder: 'Mô tả chi tiết về thú cưng (đặc điểm, nơi mất tích, thông tin liên hệ...)',
    submitText: ['Đang đăng...', 'Đăng tin'],
    redirectPath: '/forum?tab=2', // Tab tìm thú cưng
    successMessage: 'Tin tìm thú cưng đã được đăng thành công',
    dbPostType: 'FindLostPetPost' // Type sẽ được gửi lên database
  },
  ForumPost: {
    formTitle: 'Tạo bài viết mới',
    titleLabel: 'Tiêu đề bài viết',
    contentLabel: 'Nội dung bài viết',
    contentPlaceholder: 'Chia sẻ kinh nghiệm, câu chuyện của bạn về thú cưng...',
    submitText: ['Đang tạo...', 'Tạo bài viết'],
    redirectPath: '/forum?tab=0', // Tab bài viết
    successMessage: 'Bài viết đã được tạo thành công',
    dbPostType: 'ForumPost' // Type sẽ được gửi lên database
  }
};

// Danh sách gợi ý tag cho từng loại bài viết
const tagSuggestions = {
  Question: [
    'golden retriever', 'husky', 'corgi', 'poodle', 'chihuahua',
    'mèo anh lông ngắn', 'mèo ba tư', 'mèo munchkin', 'mèo ragdoll',
    'chăm sóc', 'huấn luyện', 'dinh dưỡng', 'sức khỏe', 'tiêm phòng',
    'cứu hộ', 'nhận nuôi', 'thức ăn', 'đồ chơi', 'phụ kiện'
  ],
  FindLostPetPost: [
    'chó lạc', 'mèo lạc', 'thú cưng mất tích', 'tìm thấy', 'quận 1', 'quận 2',
    'quận 3', 'quận 4', 'quận 5', 'quận 6', 'quận 7', 'quận 8', 'quận 9',
    'quận 10', 'quận 11', 'quận 12', 'quận Bình Thạnh', 'quận Gò Vấp', 'quận Tân Bình'
  ],
  ForumPost: [
    'chia sẻ', 'kinh nghiệm', 'thú cưng', 'chó', 'mèo', 'chim', 'cá', 'bò sát',
    'thức ăn', 'đồ chơi', 'phụ kiện', 'sức khỏe', 'huấn luyện', 'chăm sóc'
  ],
  EventPost: [
    'nhận nuôi', 'chó', 'mèo', 'hội thảo', 'chăm sóc', 'khám sức khỏe',
    'miễn phí', 'cuộc thi', 'giải thưởng', 'huấn luyện', 'workshop',
    'triển lãm', 'sản phẩm', 'từ thiện', 'quyên góp'
  ]
};

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
  const [uploadProgress, setUploadProgress] = useState(0);
  const toast = useToast();
  const formRef = useRef(null); // Thêm ref cho form

  // Color mode values
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Get configuration for the current postType, default to ForumPost
  const config = postTypeConfig[postType] || postTypeConfig.ForumPost;
  
  // Get tag suggestions for the current postType
  const currentTagSuggestions = tagSuggestions[postType] || [];

  // Cuộn lên đầu trang khi component được mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Hàm cuộn lên đầu trang
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getSubmitButtonText = () => {
    const [loadingText, normalText] = config.submitText;
    return loading ? loadingText : normalText;
  };

  const handleImageUpload = useCallback((files) => {
    try {
      if (files.length + images.length > 5) {
        toast({
          title: 'Vượt quá giới hạn',
          description: 'Bạn chỉ có thể tải lên tối đa 5 hình ảnh',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImages([...images, ...files]);
      setImagePreviews([...imagePreviews, ...newPreviews]);

      toast({
        title: 'Tải ảnh thành công',
        description: 'Đã thêm hình ảnh vào bài viết',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Lỗi tải ảnh',
        description: 'Không thể tải lên hình ảnh. Vui lòng thử lại',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [images, imagePreviews, toast]);

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleAddTag = (tagValue) => {
    // Kiểm tra nếu tag rỗng hoặc chỉ có khoảng trắng
    if (!tagValue || !tagValue.trim()) return;
    
    let trimmedTag = tagValue.trim();
    // Loại bỏ dấu # ở đầu nếu có
    trimmedTag = trimmedTag.replace(/^#+/, '');
    
    // Nếu tag rỗng sau khi xử lý, không thêm vào
    if (!trimmedTag) return;
    
    // Chuẩn hóa tag với dấu # ở đầu
    const normalizedTag = `#${trimmedTag}`;
    
    // Kiểm tra nếu tag đã tồn tại
    if (tags.includes(normalizedTag)) {
      toast({
        title: 'Tag đã tồn tại',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    
    // Thêm tag vào state và reset input
    setTags([...tags, normalizedTag]);
    setCurrentTag('');
  };

  // Thêm useCallback cho các hàm xử lý
  const handleRemoveTag = useCallback((indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  }, [tags]);
  
  const handleSuggestionClick = useCallback((suggestion) => {
    handleAddTag(suggestion);
  }, [handleAddTag]);
  
  const handleTagKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(currentTag);
    }
  }, [currentTag, handleAddTag]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;

    // Validation checks with toast notifications
    if (!title.trim()) {
      toast({
        title: 'Thiếu tiêu đề',
        description: `Vui lòng nhập ${config.titleLabel.toLowerCase()}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      hasError = true;
    }

    if (!content.trim()) {
      toast({
        title: 'Thiếu nội dung',
        description: `Vui lòng nhập ${config.contentLabel.toLowerCase()}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    setError('');
    setUploadProgress(0);
    scrollToTop(); // Cuộn lên đầu trang khi bắt đầu đăng bài

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      
      if (tags?.length > 0) {
        tags.forEach(tag => formData.append('tags', tag));
      }

      // Sử dụng dbPostType từ config để đảm bảo gửi đúng type lên database
      formData.append('postType', config.dbPostType);

      if (images?.length > 0) {
        images.forEach(image => formData.append('images', image));
      }

      // Simulated upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const response = await forumService.createNewPostWithImage(formData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response?.success) {
        toast({
          title: 'Thành công',
          description: config.successMessage || 'Bài viết đã được tạo thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Delay navigation to show success message
        setTimeout(() => {
          if (onClose) {
            onClose();
          } else {
            navigate(config.redirectPath || '/forum');
          }
        }, 1000);
      } else {
        throw new Error(response?.message || 'Lỗi không xác định');
      }
    } catch (error) {
      console.error('Chi tiết lỗi:', error);
      
      toast({
        title: 'Lỗi',
        description: error.message || 'Đã xảy ra lỗi khi tạo bài viết. Vui lòng thử lại sau.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  // Lọc gợi ý tag dựa trên input hiện tại
  const filteredSuggestions = currentTagSuggestions.filter(
    suggestion => 
      !tags.includes(`#${suggestion}`) && 
      suggestion.toLowerCase().includes(currentTag.toLowerCase())
  );

  return (
    <Container maxW="container.md" py={6} ref={formRef}>
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
                {config.formTitle}
              </Heading>
            </HStack>
          </Flex>

          <Divider mb={6} />

          {uploadProgress > 0 && (
            <Box mb={6}>
              <Progress
                value={uploadProgress}
                size="xs"
                colorScheme="blue"
                isAnimated
                hasStripe
              />
            </Box>
          )}

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
                <FormLabel>{config.titleLabel}</FormLabel>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={`Nhập ${config.titleLabel.toLowerCase()}...`}
                />
              </FormControl>

              {/* Tags Input */}
              <FormControl>
                <FormLabel>Nhãn</FormLabel>
                <VStack align="stretch" spacing={3}>
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
                <FormLabel>{config.contentLabel}</FormLabel>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={config.contentPlaceholder}
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

CreatePost.propTypes = {
  postType: PropTypes.oneOf(['ForumPost', 'Question', 'EventPost', 'FindLostPetPost']),
  onClose: PropTypes.func
};

export default CreatePost;