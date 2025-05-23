import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Textarea,
  Button,
  Avatar,
  Flex,
  HStack,
  VStack,
  Text,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  Progress,
  Alert,
  AlertIcon,
  Badge,
  useColorModeValue,
  useToast,
  Collapse,
  Divider
} from '@chakra-ui/react';
import {
  FiSend,
  FiSmile,
  FiImage,
  FiPaperclip,
  FiX,
  FiEye,
  FiEyeOff,
  FiAtSign
} from 'react-icons/fi';
import { FaMarkdown } from 'react-icons/fa';
import PropTypes from 'prop-types';

const CommentForm = ({
  onSubmit,
  placeholder = 'Viết bình luận...',
  buttonText = 'Gửi',
  userAvatar,
  userName,
  maxLength = 500,
  minLength = 1,
  allowMarkdown = false,
  allowMentions = false,
  allowAttachments = false,
  allowEmoji = false,
  showPreview = false,
  isLoading = false,
  isReply = false,
  replyTo = null,
  onCancel,
  initialValue = '',
  autoFocus = false,
  disabled = false
}) => {
  const [comment, setComment] = useState(initialValue);
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [mentions, setMentions] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState([]);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const toast = useToast();

  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const focusBorderColor = useColorModeValue('blue.500', 'blue.300');
  const textColor = useColorModeValue('gray.800', 'white');
  const placeholderColor = useColorModeValue('gray.400', 'gray.500');

  // Validation
  const validateComment = useCallback(() => {
    const newErrors = [];
    
    if (comment.trim().length < minLength) {
      newErrors.push(`Bình luận phải có ít nhất ${minLength} ký tự`);
    }
    
    if (comment.length > maxLength) {
      newErrors.push(`Bình luận không được vượt quá ${maxLength} ký tự`);
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  }, [comment, minLength, maxLength]);

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateComment() || disabled) return;
    
    if (comment.trim()) {
      try {
        await onSubmit({
          content: comment.trim(),
          attachments,
          mentions,
          isReply,
          replyTo
        });
        
        // Reset form
        setComment('');
        setAttachments([]);
        setMentions([]);
        setErrors([]);
        
        toast({
          title: 'Thành công!',
          description: isReply ? 'Đã gửi phản hồi' : 'Đã gửi bình luận',
          status: 'success',
          duration: 2000,
        });
        
      } catch (error) {
        toast({
          title: 'Lỗi!',
          description: error.message || 'Không thể gửi bình luận',
          status: 'error',
          duration: 3000,
        });
      }
    }
  };

  // Handle file attachment
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type
    }));
    
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  // Remove attachment
  const removeAttachment = (id) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  // Handle drag and drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (!allowAttachments) return;
    
    const files = Array.from(e.dataTransfer.files);
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type
    }));
    
    setAttachments(prev => [...prev, ...newAttachments]);
  }, [allowAttachments]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    if (allowAttachments) {
      setIsDragging(true);
    }
  }, [allowAttachments]);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Insert emoji
  const insertEmoji = (emoji) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = comment.substring(0, start) + emoji + comment.substring(end);
    setComment(newValue);
    
    // Focus back to textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };

  // Insert mention
  const insertMention = (username) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const mention = `@${username} `;
    const newValue = comment.substring(0, start) + mention + comment.substring(end);
    setComment(newValue);
    
    setMentions(prev => [...prev, username]);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + mention.length, start + mention.length);
    }, 0);
  };

  const remainingChars = maxLength - comment.length;
  const isNearLimit = remainingChars < 50;
  const isOverLimit = remainingChars < 0;

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      bg={bgColor}
      p={4}
      borderRadius="lg"
      border="1px"
      borderColor={isDragging ? focusBorderColor : borderColor}
      shadow={isDragging ? 'md' : 'sm'}
      transition="all 0.2s"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {/* Reply indicator */}
      {isReply && replyTo && (
        <Flex justify="space-between" align="center" mb={3} p={2} bg="blue.50" borderRadius="md">
          <Text fontSize="sm" color="blue.600">
            Đang trả lời <Text as="span" fontWeight="bold">@{replyTo}</Text>
          </Text>
          {onCancel && (
            <IconButton
              icon={<FiX />}
              size="sm"
              variant="ghost"
              onClick={onCancel}
              aria-label="Hủy trả lời"
            />
          )}
        </Flex>
      )}

      {/* Error messages */}
      {errors.length > 0 && (
        <Alert status="error" mb={3} borderRadius="md">
          <AlertIcon />
          <VStack align="start" spacing={1}>
            {errors.map((error, index) => (
              <Text key={index} fontSize="sm">{error}</Text>
            ))}
          </VStack>
        </Alert>
      )}

      <Flex gap={3} align="flex-start">
        {/* User Avatar */}
        {userAvatar && (
          <Avatar
            size="sm"
            src={userAvatar}
            name={userName}
            loading="lazy"
          />
        )}

        <VStack flex={1} spacing={3}>
          {/* Main textarea */}
          <Box w="full" position="relative">
            <Textarea
              ref={textareaRef}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={placeholder}
              resize="vertical"
              minH="100px"
              maxH="200px"
              borderColor={isOverLimit ? 'red.300' : borderColor}
              focusBorderColor={isOverLimit ? 'red.500' : focusBorderColor}
              _placeholder={{ color: placeholderColor }}
              disabled={disabled || isLoading}
              autoFocus={autoFocus}
              onBlur={validateComment}
            />
            
            {/* Character counter */}
            <Flex justify="space-between" align="center" mt={1}>
              <Text fontSize="xs" color="gray.500">
                {comment.length}/{maxLength}
              </Text>
              {isNearLimit && (
                <Text 
                  fontSize="xs" 
                  color={isOverLimit ? 'red.500' : 'orange.500'}
                  fontWeight="medium"
                >
                  {isOverLimit ? 'Vượt quá giới hạn' : `Còn ${remainingChars} ký tự`}
                </Text>
              )}
            </Flex>
            
            {/* Progress bar for character limit */}
            {comment.length > 0 && (
              <Progress
                value={(comment.length / maxLength) * 100}
                size="xs"
                colorScheme={isOverLimit ? 'red' : isNearLimit ? 'orange' : 'blue'}
                mt={1}
              />
            )}
          </Box>

          {/* Attachments */}
          {attachments.length > 0 && (
            <VStack w="full" spacing={2}>
              <Divider />
              <Text fontSize="sm" fontWeight="medium" alignSelf="start">
                Tệp đính kèm ({attachments.length})
              </Text>
              {attachments.map((attachment) => (
                <Flex
                  key={attachment.id}
                  w="full"
                  p={2}
                  bg="gray.50"
                  borderRadius="md"
                  justify="space-between"
                  align="center"
                >
                  <HStack>
                    <FiPaperclip />
                    <Text fontSize="sm">{attachment.name}</Text>
                    <Badge size="sm">{(attachment.size / 1024).toFixed(1)}KB</Badge>
                  </HStack>
                  <IconButton
                    icon={<FiX />}
                    size="xs"
                    variant="ghost"
                    onClick={() => removeAttachment(attachment.id)}
                    aria-label="Xóa tệp"
                  />
                </Flex>
              ))}
            </VStack>
          )}

          {/* Markdown preview */}
          {allowMarkdown && showMarkdownPreview && comment && (
            <Collapse in={showMarkdownPreview}>
              <Box
                w="full"
                p={3}
                bg="gray.50"
                borderRadius="md"
                border="1px"
                borderColor="gray.200"
              >
                <Text fontSize="sm" fontWeight="medium" mb={2}>Preview:</Text>
                <Text fontSize="sm" whiteSpace="pre-wrap">
                  {comment}
                </Text>
              </Box>
            </Collapse>
          )}

          {/* Action buttons */}
          <Flex w="full" justify="space-between" align="center">
            <HStack spacing={2}>
              {/* Emoji picker */}
              {allowEmoji && (
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<FiSmile />}
                    size="sm"
                    variant="ghost"
                    aria-label="Chọn emoji"
                  />
                  <MenuList>
                    {['😀', '😍', '🤔', '👍', '👎', '❤️', '😢', '😂'].map(emoji => (
                      <MenuItem
                        key={emoji}
                        onClick={() => insertEmoji(emoji)}
                        fontSize="lg"
                      >
                        {emoji}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              )}

              {/* File attachment */}
              {allowAttachments && (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    multiple
                    hidden
                  />
                  <Tooltip label="Đính kèm tệp">
                    <IconButton
                      icon={<FiPaperclip />}
                      size="sm"
                      variant="ghost"
                      onClick={() => fileInputRef.current?.click()}
                      aria-label="Đính kèm tệp"
                    />
                  </Tooltip>
                </>
              )}

              {/* Markdown preview toggle */}
              {allowMarkdown && (
                <Tooltip label={showMarkdownPreview ? 'Ẩn preview' : 'Hiện preview'}>
                  <IconButton
                    icon={showMarkdownPreview ? <FiEyeOff /> : <FiEye />}
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowMarkdownPreview(!showMarkdownPreview)}
                    aria-label="Toggle preview"
                  />
                </Tooltip>
              )}

              {/* Mention button */}
              {allowMentions && (
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<FiAtSign />}
                    size="sm"
                    variant="ghost"
                    aria-label="Nhắc đến ai đó"
                  />
                  <MenuList>
                    <MenuItem onClick={() => insertMention('user1')}>
                      @user1
                    </MenuItem>
                    <MenuItem onClick={() => insertMention('admin')}>
                      @admin
                    </MenuItem>
                  </MenuList>
                </Menu>
              )}
            </HStack>

            {/* Submit button */}
            <Button
              type="submit"
              colorScheme="blue"
              size="sm"
              rightIcon={<FiSend />}
              isLoading={isLoading}
              loadingText="Đang gửi..."
              disabled={!comment.trim() || isOverLimit || disabled}
            >
              {buttonText}
            </Button>
          </Flex>
        </VStack>
      </Flex>

      {/* Drag and drop overlay */}
      {isDragging && allowAttachments && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blue.50"
          borderRadius="lg"
          border="2px dashed"
          borderColor="blue.300"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={10}
        >
          <VStack>
            <FiImage size={32} color="var(--chakra-colors-blue-500)" />
            <Text color="blue.600" fontWeight="medium">
              Thả tệp vào đây để đính kèm
            </Text>
          </VStack>
        </Box>
      )}
    </Box>
  );
};

CommentForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  buttonText: PropTypes.string,
  userAvatar: PropTypes.string,
  userName: PropTypes.string,
  maxLength: PropTypes.number,
  minLength: PropTypes.number,
  allowMarkdown: PropTypes.bool,
  allowMentions: PropTypes.bool,
  allowAttachments: PropTypes.bool,
  allowEmoji: PropTypes.bool,
  showPreview: PropTypes.bool,
  isLoading: PropTypes.bool,
  isReply: PropTypes.bool,
  replyTo: PropTypes.string,
  onCancel: PropTypes.func,
  initialValue: PropTypes.string,
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool
};

export default CommentForm;