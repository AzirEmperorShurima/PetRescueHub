import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Text,
  Avatar,
  IconButton,
  HStack,
  VStack,
  Flex,
  Badge,
  Button,
  Collapse,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Divider,
  Tooltip,
  useToast,
  Input,
  Select,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Textarea,
  Image,
  Tag,
  TagLabel,
  Progress,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Switch,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper
} from '@chakra-ui/react';
import {
  FiThumbsUp,
  FiMessageCircle,
  FiMoreHorizontal,
  FiEdit,
  FiTrash2,
  FiFlag,
  FiShare2,
  FiHeart,
  FiSearch,
  FiFilter,
  FiTrendingUp,
  FiClock,
  FiUsers,
  FiEye,
  FiBookmark,
  FiPin,
  FiMinus,
  FiPlus,
  FiRefreshCw,
  FiSettings,
  FiImage,
  FiLink,
  FiCopy,
  FiCheck,
  FiX,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import PropTypes from 'prop-types';

// Configure dayjs
dayjs.extend(relativeTime);
dayjs.locale('vi');

// Enhanced Comment Item Component
const EnhancedCommentItem = ({ 
  comment, 
  onLike, 
  onReply, 
  onEdit, 
  onDelete, 
  onReport,
  onShare,
  onPin,
  onBookmark,
  currentUserId,
  depth = 0,
  maxDepth = 3,
  showModerationTools = false,
  enableRichContent = true,
  compactMode = false,
  highlightedCommentId = null
}) => {
  const [showReplies, setShowReplies] = useState(false);
  const [isLiked, setIsLiked] = useState(comment.isLiked || false);
  const [isBookmarked, setIsBookmarked] = useState(comment.isBookmarked || false);
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showFullContent, setShowFullContent] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const authorColor = useColorModeValue('gray.800', 'white');
  const highlightBg = useColorModeValue('blue.50', 'blue.900');
  const pinnedBg = useColorModeValue('yellow.50', 'yellow.900');

  const isOwner = currentUserId === comment.authorId;
  const canReply = depth < maxDepth;
  const isHighlighted = highlightedCommentId === comment.id;
  const isPinned = comment.isPinned;
  const isLongContent = comment.content && comment.content.length > 200;

  // Enhanced like handler with optimistic updates
  const handleLike = useCallback(async () => {
    const originalState = { isLiked, likeCount };
    
    try {
      const newLikeState = !isLiked;
      setIsLiked(newLikeState);
      setLikeCount(prev => newLikeState ? prev + 1 : prev - 1);
      
      if (onLike) {
        await onLike(comment.id, newLikeState);
      }
      
      // Show success feedback
      if (newLikeState) {
        toast({
          title: '👍 Đã thích!',
          status: 'success',
          duration: 1000,
          position: 'top',
        });
      }
    } catch (error) {
      // Revert optimistic updates
      setIsLiked(originalState.isLiked);
      setLikeCount(originalState.likeCount);
      
      toast({
        title: 'Lỗi',
        description: 'Không thể thực hiện hành động này',
        status: 'error',
        duration: 2000,
      });
    }
  }, [isLiked, likeCount, onLike, comment.id, toast]);

  // Enhanced bookmark handler
  const handleBookmark = useCallback(async () => {
    try {
      const newBookmarkState = !isBookmarked;
      setIsBookmarked(newBookmarkState);
      
      if (onBookmark) {
        await onBookmark(comment.id, newBookmarkState);
      }
      
      toast({
        title: newBookmarkState ? '🔖 Đã lưu' : 'Đã bỏ lưu',
        status: 'success',
        duration: 1000,
        position: 'top',
      });
    } catch (error) {
      setIsBookmarked(!isBookmarked);
      toast({
        title: 'Lỗi',
        description: 'Không thể lưu bình luận',
        status: 'error',
        duration: 2000,
      });
    }
  }, [isBookmarked, onBookmark, comment.id, toast]);

  // Enhanced edit handler
  const handleEdit = useCallback(async () => {
    if (isEditing) {
      try {
        await onEdit?.(comment.id, editContent);
        setIsEditing(false);
        toast({
          title: '✅ Đã cập nhật',
          status: 'success',
          duration: 2000,
        });
      } catch (error) {
        toast({
          title: 'Lỗi',
          description: 'Không thể cập nhật bình luận',
          status: 'error',
          duration: 2000,
        });
      }
    } else {
      setIsEditing(true);
      setEditContent(comment.content);
    }
  }, [isEditing, editContent, onEdit, comment.id, comment.content, toast]);

  // Enhanced delete handler
  const handleDelete = useCallback(async () => {
    try {
      await onDelete?.(comment.id);
      onDeleteClose();
      toast({
        title: '🗑️ Đã xóa bình luận',
        status: 'info',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa bình luận',
        status: 'error',
        duration: 2000,
      });
    }
  }, [onDelete, comment.id, onDeleteClose, toast]);

  // Format time with multiple options
  const formatTime = useCallback((timestamp) => {
    try {
      dayjs.extend(relativeTime);
      dayjs.locale('vi');
      const date = dayjs(timestamp);
      const now = dayjs();
      const diffInHours = now.diff(date, 'hour');
      
      if (diffInHours < 24) {
        return date.fromNow();
      } else {
        return date.format('DD/MM/YYYY HH:mm');
      }
    } catch {
      return dayjs(timestamp).format('DD/MM/YYYY HH:mm');
    }
  }, []);

  // Parse content for mentions, links, hashtags
  const parseContent = useCallback((content) => {
    if (!enableRichContent) return content;
    
    return content
      .replace(/@(\w+)/g, '<span style="color: #3182ce; font-weight: 600;">@$1</span>')
      .replace(/#(\w+)/g, '<span style="color: #38a169; font-weight: 600;">#$1</span>')
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" style="color: #3182ce; text-decoration: underline;">$1</a>');
  }, [enableRichContent]);

  const displayContent = useMemo(() => {
    const content = comment.content || '';
    if (!isLongContent || showFullContent) {
      return parseContent(content);
    }
    return parseContent(content.substring(0, 200) + '...');
  }, [comment.content, isLongContent, showFullContent, parseContent]);

  return (
    <>
      <Box
        bg={isHighlighted ? highlightBg : isPinned ? pinnedBg : bgColor}
        borderRadius="lg"
        p={compactMode ? 3 : 4}
        ml={depth * (compactMode ? 4 : 6)}
        mb={compactMode ? 2 : 3}
        border="2px"
        borderColor={isHighlighted ? 'blue.300' : isPinned ? 'yellow.300' : borderColor}
        transition="all 0.3s ease"
        position="relative"
        _hover={{
          boxShadow: 'lg',
          transform: 'translateY(-2px)',
          borderColor: 'blue.400'
        }}
      >
        {/* Pin indicator */}
        {isPinned && (
          <Box
            position="absolute"
            top={2}
            right={2}
            bg="yellow.400"
            color="white"
            borderRadius="full"
            p={1}
          >
            <FiPin size={12} />
          </Box>
        )}

        <Flex gap={3}>
          <Avatar
            size={compactMode ? "xs" : "sm"}
            src={comment.authorAvatar}
            name={comment.author}
            loading="lazy"
          />
          
          <Box flex={1}>
            {/* Enhanced Comment Header */}
            <Flex justify="space-between" align="center" mb={2}>
              <HStack spacing={2} flexWrap="wrap">
                <Text 
                  fontWeight="bold" 
                  color={authorColor} 
                  fontSize={compactMode ? "xs" : "sm"}
                >
                  {comment.author}
                </Text>
                
                {comment.isVerified && (
                  <Badge colorScheme="blue" size="sm">
                    ✓ Xác minh
                  </Badge>
                )}
                
                {comment.isModerator && (
                  <Badge colorScheme="purple" size="sm">
                    🛡️ Mod
                  </Badge>
                )}
                
                {isOwner && (
                  <Badge colorScheme="green" size="sm">
                    Bạn
                  </Badge>
                )}

                {comment.isEdited && (
                  <Tooltip label="Đã chỉnh sửa">
                    <Badge colorScheme="gray" size="sm">
                      Đã sửa
                    </Badge>
                  </Tooltip>
                )}
                
                <Text fontSize="xs" color={textColor}>
                  {formatTime(comment.timestamp)}
                </Text>

                {/* Engagement stats */}
                {comment.viewCount && (
                  <HStack spacing={1}>
                    <FiEye size={12} />
                    <Text fontSize="xs" color={textColor}>
                      {comment.viewCount}
                    </Text>
                  </HStack>
                )}
              </HStack>

              {/* Enhanced Actions Menu */}
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<FiMoreHorizontal />}
                  size="sm"
                  variant="ghost"
                  aria-label="Thêm tùy chọn"
                />
                <MenuList>
                  {isOwner && (
                    <>
                      <MenuItem 
                        icon={<FiEdit />} 
                        onClick={handleEdit}
                      >
                        {isEditing ? 'Lưu chỉnh sửa' : 'Chỉnh sửa'}
                      </MenuItem>
                      <MenuItem 
                        icon={<FiTrash2 />} 
                        onClick={onDeleteOpen}
                        color="red.500"
                      >
                        Xóa
                      </MenuItem>
                    </>
                  )}

                  {showModerationTools && (
                    <>
                      <MenuItem 
                        icon={<FiPin />} 
                        onClick={() => onPin?.(comment.id)}
                      >
                        {isPinned ? 'Bỏ ghim' : 'Ghim bình luận'}
                      </MenuItem>
                      <Divider />
                    </>
                  )}
                  
                  <MenuItem 
                    icon={<FiBookmark />} 
                    onClick={handleBookmark}
                    color={isBookmarked ? 'blue.500' : undefined}
                  >
                    {isBookmarked ? 'Bỏ lưu' : 'Lưu bình luận'}
                  </MenuItem>
                  
                  <MenuItem 
                    icon={<FiShare2 />} 
                    onClick={() => onShare?.(comment.id)}
                  >
                    Chia sẻ
                  </MenuItem>

                  <MenuItem 
                    icon={<FiCopy />} 
                    onClick={() => {
                      navigator.clipboard.writeText(comment.content);
                      toast({
                        title: 'Đã sao chép',
                        status: 'success',
                        duration: 1000,
                      });
                    }}
                  >
                    Sao chép
                  </MenuItem>
                  
                  {!isOwner && (
                    <>
                      <Divider />
                      <MenuItem 
                        icon={<FiFlag />} 
                        onClick={() => onReport?.(comment.id)}
                        color="orange.500"
                      >
                        Báo cáo
                      </MenuItem>
                    </>
                  )}
                </MenuList>
              </Menu>
            </Flex>

            {/* Enhanced Comment Content */}
            {isEditing ? (
              <VStack spacing={2} mb={3}>
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Chỉnh sửa bình luận..."
                  minH="100px"
                />
                <HStack>
                  <Button size="sm" colorScheme="blue" onClick={handleEdit}>
                    Lưu
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => {
                      setIsEditing(false);
                      setEditContent(comment.content);
                    }}
                  >
                    Hủy
                  </Button>
                </HStack>
              </VStack>
            ) : (
              <Box mb={3}>
                <Text 
                  lineHeight="tall"
                  dangerouslySetInnerHTML={{ __html: displayContent }}
                />
                
                {isLongContent && (
                  <Button
                    size="sm"
                    variant="link"
                    onClick={() => setShowFullContent(!showFullContent)}
                    mt={1}
                  >
                    {showFullContent ? 'Thu gọn' : 'Xem thêm'}
                  </Button>
                )}

                {/* Attachments */}
                {comment.attachments && comment.attachments.length > 0 && (
                  <VStack spacing={2} mt={3} align="start">
                    {comment.attachments.map((attachment, index) => (
                      <Box key={index} maxW="300px">
                        {attachment.type?.startsWith('image/') ? (
                          <Image
                            src={attachment.url}
                            alt={attachment.name}
                            borderRadius="md"
                            maxH="200px"
                            objectFit="cover"
                            onError={() => setImageError(true)}
                            fallback={
                              <Box 
                                w="200px" 
                                h="100px" 
                                bg="gray.100" 
                                borderRadius="md"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                              >
                                <Text fontSize="sm" color="gray.500">
                                  Không thể tải ảnh
                                </Text>
                              </Box>
                            }
                          />
                        ) : (
                          <HStack
                            p={2}
                            bg="gray.50"
                            borderRadius="md"
                            border="1px"
                            borderColor="gray.200"
                          >
                            <FiLink />
                            <Text fontSize="sm" isTruncated>
                              {attachment.name}
                            </Text>
                          </HStack>
                        )}
                      </Box>
                    ))}
                  </VStack>
                )}

                {/* Tags/Hashtags */}
                {comment.tags && comment.tags.length > 0 && (
                  <HStack spacing={1} mt={2} flexWrap="wrap">
                    {comment.tags.map((tag, index) => (
                      <Tag key={index} size="sm" colorScheme="blue">
                        <TagLabel>#{tag}</TagLabel>
                      </Tag>
                    ))}
                  </HStack>
                )}
              </Box>
            )}

            {/* Enhanced Comment Actions */}
            <HStack spacing={4} flexWrap="wrap">
              <Tooltip label={isLiked ? 'Bỏ thích' : 'Thích'}>
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<FiThumbsUp />}
                  onClick={handleLike}
                  colorScheme={isLiked ? 'blue' : 'gray'}
                  color={isLiked ? 'blue.500' : textColor}
                  _hover={{
                    transform: 'scale(1.05)',
                    transition: 'transform 0.2s'
                  }}
                >
                  {likeCount > 0 && likeCount}
                </Button>
              </Tooltip>

              {/* Dislike button */}
              {comment.dislikeCount !== undefined && (
                <Tooltip label="Không thích">
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<FiMinus />}
                    color={textColor}
                  >
                    {comment.dislikeCount > 0 && comment.dislikeCount}
                  </Button>
                </Tooltip>
              )}

              {canReply && (
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<FiMessageCircle />}
                  onClick={() => onReply?.(comment.id)}
                  color={textColor}
                >
                  Trả lời
                </Button>
              )}

              {comment.replies && comment.replies.length > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={showReplies ? <FiChevronUp /> : <FiChevronDown />}
                  onClick={() => setShowReplies(!showReplies)}
                  color={textColor}
                >
                  {showReplies ? 'Ẩn' : 'Xem'} {comment.replies.length} phản hồi
                </Button>
              )}

              {/* Quick reactions */}
              {comment.reactions && (
                <HStack spacing={1}>
                  {Object.entries(comment.reactions).map(([emoji, count]) => (
                    <Button
                      key={emoji}
                      size="xs"
                      variant="outline"
                      borderRadius="full"
                    >
                      {emoji} {count}
                    </Button>
                  ))}
                </HStack>
              )}
            </HStack>
          </Box>
        </Flex>

        {/* Enhanced Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <Collapse in={showReplies} animateOpacity>
            <Box mt={4}>
              <Divider mb={4} />
              {comment.replies.map((reply) => (
                <EnhancedCommentItem
                  key={reply.id}
                  comment={reply}
                  onLike={onLike}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onReport={onReport}
                  onShare={onShare}
                  onPin={onPin}
                  onBookmark={onBookmark}
                  currentUserId={currentUserId}
                  depth={depth + 1}
                  maxDepth={maxDepth}
                  showModerationTools={showModerationTools}
                  enableRichContent={enableRichContent}
                  compactMode={compactMode}
                  highlightedCommentId={highlightedCommentId}
                />
              ))}
            </Box>
          </Collapse>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Xóa bình luận
            </AlertDialogHeader>
            <AlertDialogBody>
              Bạn có chắc chắn muốn xóa bình luận này không? 
              Hành động này không thể hoàn tác.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onDeleteClose}>
                Hủy
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Xóa
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

// Enhanced Comment List with Advanced Features
const CommentList = ({ 
  comments = [], 
  onLike, 
  onReply, 
  onEdit,
  onDelete,
  onReport,
  onShare,
  onPin,
  onBookmark,
  currentUserId,
  isLoading = false,
  emptyMessage = "Chưa có bình luận nào",
  maxDepth = 3,
  sortBy = 'newest',
  showModerationTools = false,
  enableRichContent = true,
  enableSearch = true,
  enableFilters = true,
  enableSettings = true,
  highlightedCommentId = null,
  totalCount = 0,
  hasMore = false,
  onLoadMore,
  isLoadingMore = false
}) => {
  const [sortedComments, setSortedComments] = useState(comments);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [compactMode, setCompactMode] = useState(false);
  const [viewMode, setViewMode] = useState('default'); // default, tree, compact
  const [selectedTab, setSelectedTab] = useState(0);
  
  const { isOpen: isSettingsOpen, onOpen: onSettingsOpen, onClose: onSettingsClose } = useDisclosure();

  // Filter and sort comments
  const processedComments = useMemo(() => {
    let filtered = [...comments];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(comment => 
        comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    switch (filterBy) {
      case 'pinned':
        filtered = filtered.filter(comment => comment.isPinned);
        break;
      case 'liked':
        filtered = filtered.filter(comment => comment.isLiked);
        break;
      case 'replies':
        filtered = filtered.filter(comment => comment.replies && comment.replies.length > 0);
        break;
      case 'images':
        filtered = filtered.filter(comment => 
          comment.attachments && 
          comment.attachments.some(att => att.type?.startsWith('image/'))
        );
        break;
      default:
        break;
    }

    // Sort comments
    const sorted = filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.timestamp) - new Date(b.timestamp);
        case 'popular':
          return (b.likeCount || 0) - (a.likeCount || 0);
        case 'replies':
          return (b.replies?.length || 0) - (a.replies?.length || 0);
        case 'newest':
        default:
          return new Date(b.timestamp) - new Date(a.timestamp);
      }
    });

    return sorted;
  }, [comments, searchTerm, filterBy, sortBy]);

  // Loading skeleton
  const LoadingSkeleton = () => (
    <VStack spacing={4} p={4}>
      {[...Array(3)].map((_, i) => (
        <Box key={i} w="full" p={4} bg="white" borderRadius="lg" border="1px" borderColor="gray.200">
          <Flex gap={3}>
            <SkeletonCircle size="10" />
            <Box flex={1}>
              <Skeleton height="4" mb={2} />
              <SkeletonText mt="4" noOfLines={3} spacing="4" />
              <Skeleton height="8" mt={3} width="200px" />
            </Box>
          </Flex>
        </Box>
      ))}
    </VStack>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <VStack spacing={4} align="stretch">
      {/* Header with stats and controls */}
      <Flex justify="space-between" align="center" p={4} bg="white" borderRadius="lg" shadow="sm">
        <VStack align="start" spacing={1}>
          <Text fontSize="lg" fontWeight="bold">
            Bình luận ({totalCount})
          </Text>
          <Text fontSize="sm" color="gray.500">
            {processedComments.length} bình luận hiển thị
          </Text>
        </VStack>

        <HStack spacing={2}>
          {enableSettings && (
            <IconButton
              icon={<FiSettings />}
              size="sm"
              variant="ghost"
              onClick={onSettingsOpen}
              aria-label="Cài đặt"
            />
          )}
          
          <Button
            leftIcon={<FiRefreshCw />}
            size="sm"
            variant="ghost"
            onClick={() => window.location.reload()}
          >
            Làm mới
          </Button>
        </HStack>
      </Flex>

      {/* Search and Filter Controls */}
      {(enableSearch || enableFilters) && (
        <Box p={4} bg="white" borderRadius="lg" shadow="sm">
          <Flex gap={4} align="end" flexWrap="wrap">
            {enableSearch && (
              <Box flex={1} minW="200px">
                <Input
                  placeholder="Tìm kiếm bình luận..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<FiSearch />}
                />
              </Box>
            )}

            {enableFilters && (
              <>
                <Select
                  placeholder="Sắp xếp theo"
                  value={sortBy}
                  onChange={(e) => {
                    // This would need to be handled by parent component
                  }}
                  maxW="150px"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                  <option value="popular">Phổ biến</option>
                  <option value="replies">Nhiều phản hồi</option>
                </Select>

                <Select
                  placeholder="Lọc theo"
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  maxW="150px"
                >
                  <option value="all">Tất cả</option>
                  <option value="pinned">Đã ghim</option>
                  <option value="liked">Đã thích</option>
                  <option value="replies">Có phản hồi</option>
                  <option value="images">Có hình ảnh</option>
                </Select>
              </>
            )}
          </Flex>
        </Box>
      )}

      {/* Comment Tabs */}
      <Tabs index={selectedTab} onChange={setSelectedTab}>
        <TabList>
          <Tab>
            <HStack>
              <FiMessageCircle />
              <Text>Tất cả</Text>
            </HStack>
          </Tab>
          <Tab>
            <HStack>
              <FiTrendingUp />
              <Text>Phổ biến</Text>
            </HStack>
          </Tab>
          <Tab>
            <HStack>
              <FiPin />
              <Text>Đã ghim</Text>
            </HStack>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            {/* All Comments */}
            {processedComments.length === 0 ? (
              <Box
                textAlign="center"
                py={12}
                color="gray.500"
                bg="gray.50"
                borderRadius="lg"
              >
                <VStack spacing={3}>
                  <FiMessageCircle size={48} />
                  <Text fontSize="lg" fontWeight="medium">
                    {searchTerm || filterBy !== 'all' ? 'Không tìm thấy bình luận nào' : emptyMessage}
                  </Text>
                  {searchTerm && (
                    <Button
                      size="sm"
                      variant="link"
                      onClick={() => {
                        setSearchTerm('');
                        setFilterBy('all');
                      }}
                    >
                      Xóa bộ lọc
                    </Button>
                  )}
                </VStack>
              </Box>
            ) : (
              <VStack spacing={0} align="stretch">
                {processedComments.map((comment) => (
                  <EnhancedCommentItem
                    key={comment.id}
                    comment={comment}
                    onLike={onLike}
                    onReply={onReply}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onReport={onReport}
                    onShare={onShare}
                    onPin={onPin}
                    onBookmark={onBookmark}
                    currentUserId={currentUserId}
                    maxDepth={maxDepth}
                    showModerationTools={showModerationTools}
                    enableRichContent={enableRichContent}
                    compactMode={compactMode}
                    highlightedCommentId={highlightedCommentId}
                  />
                ))}

                {/* Load More Button */}
                {hasMore && (
                  <Center py={6}>
                    <Button
                      onClick={onLoadMore}
                      isLoading={isLoadingMore}
                      loadingText="Đang tải..."
                      leftIcon={<FiPlus />}
                      variant="outline"
                      size="lg"
                    >
                      Tải thêm bình luận
                    </Button>
                  </Center>
                )}
              </VStack>
            )}
          </TabPanel>

          <TabPanel p={0}>
            {/* Popular Comments */}
            <VStack spacing={0} align="stretch">
              {processedComments
                .filter(comment => (comment.likeCount || 0) > 0)
                .sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
                .map((comment) => (
                  <EnhancedCommentItem
                    key={comment.id}
                    comment={comment}
                    onLike={onLike}
                    onReply={onReply}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onReport={onReport}
                    onShare={onShare}
                    onPin={onPin}
                    onBookmark={onBookmark}
                    currentUserId={currentUserId}
                    maxDepth={maxDepth}
                    showModerationTools={showModerationTools}
                    enableRichContent={enableRichContent}
                    compactMode={compactMode}
                    highlightedCommentId={highlightedCommentId}
                  />
                ))}
            </VStack>
          </TabPanel>

          <TabPanel p={0}>
            {/* Pinned Comments */}
            <VStack spacing={0} align="stretch">
              {processedComments
                .filter(comment => comment.isPinned)
                .map((comment) => (
                  <EnhancedCommentItem
                    key={comment.id}
                    comment={comment}
                    onLike={onLike}
                    onReply={onReply}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onReport={onReport}
                    onShare={onShare}
                    onPin={onPin}
                    onBookmark={onBookmark}
                    currentUserId={currentUserId}
                    maxDepth={maxDepth}
                    showModerationTools={showModerationTools}
                    enableRichContent={enableRichContent}
                    compactMode={compactMode}
                    highlightedCommentId={highlightedCommentId}
                  />
                ))}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Settings Modal */}
      <Modal isOpen={isSettingsOpen} onClose={onSettingsClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cài đặt hiển thị</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={6} align="stretch">
              <FormControl display="flex" alignItems="center" justifyContent="space-between">
                <FormLabel mb={0}>Chế độ thu gọn</FormLabel>
                <Switch
                  isChecked={compactMode}
                  onChange={(e) => setCompactMode(e.target.checked)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Độ sâu tối đa của phản hồi</FormLabel>
                <NumberInput
                  value={maxDepth}
                  min={1}
                  max={10}
                  onChange={(valueString) => {
                    // This would need to be handled by parent component
                  }}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl display="flex" alignItems="center" justifyContent="space-between">
                <FormLabel mb={0}>Hiển thị nội dung rich text</FormLabel>
                <Switch
                  isChecked={enableRichContent}
                  onChange={(e) => {
                    // This would need to be handled by parent component
                  }}
                />
              </FormControl>

              <FormControl display="flex" alignItems="center" justifyContent="space-between">
                <FormLabel mb={0}>Hiển thị công cụ quản trị</FormLabel>
                <Switch
                  isChecked={showModerationTools}
                  onChange={(e) => {
                    // This would need to be handled by parent component
                  }}
                />
              </FormControl>

              <Divider />

              <VStack align="start" spacing={2}>
                <Text fontWeight="medium">Thống kê</Text>
                <HStack justify="space-between" w="full">
                  <Text fontSize="sm" color="gray.600">Tổng số bình luận:</Text>
                  <Badge>{totalCount}</Badge>
                </HStack>
                <HStack justify="space-between" w="full">
                  <Text fontSize="sm" color="gray.600">Bình luận được ghim:</Text>
                  <Badge colorScheme="yellow">
                    {comments.filter(c => c.isPinned).length}
                  </Badge>
                </HStack>
                <HStack justify="space-between" w="full">
                  <Text fontSize="sm" color="gray.600">Bình luận có hình ảnh:</Text>
                  <Badge colorScheme="green">
                    {comments.filter(c => c.attachments?.some(a => a.type?.startsWith('image/'))).length}
                  </Badge>
                </HStack>
              </VStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Floating Action Button for mobile */}
      <Box
        position="fixed"
        bottom={4}
        right={4}
        zIndex={1000}
        display={{ base: 'block', md: 'none' }}
      >
        <IconButton
          icon={<FiMessageCircle />}
          colorScheme="blue"
          size="lg"
          borderRadius="full"
          shadow="lg"
          onClick={() => {
            // Scroll to comment form or open comment modal
            const commentForm = document.getElementById('comment-form');
            if (commentForm) {
              commentForm.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          aria-label="Viết bình luận"
        />
      </Box>
    </VStack>
  );
};

// PropTypes for the enhanced components
CommentList.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    author: PropTypes.string.isRequired,
    authorId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    authorAvatar: PropTypes.string,
    content: PropTypes.string.isRequired,
    timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
    likeCount: PropTypes.number,
    dislikeCount: PropTypes.number,
    viewCount: PropTypes.number,
    isLiked: PropTypes.bool,
    isBookmarked: PropTypes.bool,
    isVerified: PropTypes.bool,
    isModerator: PropTypes.bool,
    isPinned: PropTypes.bool,
    isEdited: PropTypes.bool,
    replies: PropTypes.array,
    attachments: PropTypes.arrayOf(PropTypes.shape({
      url: PropTypes.string.isRequired,
      name: PropTypes.string,
      type: PropTypes.string,
      size: PropTypes.number
    })),
    tags: PropTypes.arrayOf(PropTypes.string),
    reactions: PropTypes.object
  })).isRequired,
  onLike: PropTypes.func,
  onReply: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onReport: PropTypes.func,
  onShare: PropTypes.func,
  onPin: PropTypes.func,
  onBookmark: PropTypes.func,
  currentUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isLoading: PropTypes.bool,
  emptyMessage: PropTypes.string,
  maxDepth: PropTypes.number,
  sortBy: PropTypes.oneOf(['newest', 'oldest', 'popular', 'replies']),
  showModerationTools: PropTypes.bool,
  enableRichContent: PropTypes.bool,
  enableSearch: PropTypes.bool,
  enableFilters: PropTypes.bool,
  enableSettings: PropTypes.bool,
  highlightedCommentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  totalCount: PropTypes.number,
  hasMore: PropTypes.bool,
  onLoadMore: PropTypes.func,
  isLoadingMore: PropTypes.bool
};

EnhancedCommentItem.propTypes = {
  comment: PropTypes.object.isRequired,
  onLike: PropTypes.func,
  onReply: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onReport: PropTypes.func,
  onShare: PropTypes.func,
  onPin: PropTypes.func,
  onBookmark: PropTypes.func,
  currentUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  depth: PropTypes.number,
  maxDepth: PropTypes.number,
  showModerationTools: PropTypes.bool,
  enableRichContent: PropTypes.bool,
  compactMode: PropTypes.bool,
  highlightedCommentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default CommentList;