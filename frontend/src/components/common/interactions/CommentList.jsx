import React, { useState } from 'react';
import {
  VStack,
  Box,
  Text,
  Avatar,
  HStack,
  IconButton,
  Button,
  useColorModeValue,
  Collapse,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Flex,
  Spinner,
  Image,
  Textarea
} from '@chakra-ui/react';
import {
  FiMessageCircle,
  FiEdit,
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
  FiCheck,
  FiX
} from 'react-icons/fi';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

// Cấu hình dayjs
dayjs.extend(relativeTime);
dayjs.locale('vi');

const CommentItem = ({
  comment,
  onReply,
  onEdit,
  onDelete,
  currentUserId,
  depth = 0,
  maxDepth = 3
}) => {
  const [showReplies, setShowReplies] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const cancelRef = React.useRef();

  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const isOwner = currentUserId === comment.authorId;
  const canReply = depth < maxDepth;
  const hasReplies = comment.replies && comment.replies.length > 0;

  const formatTime = (timestamp) => {
    const date = dayjs(timestamp);
    const now = dayjs();
    const diffInHours = now.diff(date, 'hour');
    
    return diffInHours < 24 ? date.fromNow() : date.format('DD/MM/YYYY HH:mm');
  };

  const handleDelete = async () => {
    await onDelete?.(comment.id);
    onDeleteClose();
  };

  const handleEdit = async () => {
    if (isEditing) {
      await onEdit?.(comment.id, editContent);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  return (
    <Box>
      <Box
        bg={bgColor}
        borderRadius="lg"
        p={4}
        ml={depth * 8}
        border="1px"
        borderColor={borderColor}
        mb={2}
      >
        <Flex gap={3}>
          <Avatar
            size="sm"
            src={comment.authorAvatar}
            name={comment.author}
          />
          
          <Box flex={1}>
            {/* Comment Header */}
            <HStack mb={2} justify="space-between">
              <HStack>
                <Text fontWeight="bold">{comment.author}</Text>
                <Text fontSize="sm" color={textColor}>
                  {formatTime(comment.timestamp)}
                </Text>
                {comment.isEdited && (
                  <Text fontSize="xs" color={textColor}>(đã chỉnh sửa)</Text>
                )}
              </HStack>

              {/* Action Buttons */}
              {isOwner && !isEditing && (
                <HStack>
                  <IconButton
                    icon={<FiEdit />}
                    size="sm"
                    variant="ghost"
                    onClick={handleEdit}
                    aria-label="Chỉnh sửa"
                  />
                  <IconButton
                    icon={<FiTrash2 />}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={onDeleteOpen}
                    aria-label="Xóa"
                  />
                </HStack>
              )}
            </HStack>

            {/* Comment Content */}
            {isEditing ? (
              <Box mb={3}>
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  mb={2}
                />
                <HStack>
                  <IconButton
                    icon={<FiCheck />}
                    size="sm"
                    colorScheme="green"
                    onClick={handleEdit}
                    aria-label="Lưu"
                  />
                  <IconButton
                    icon={<FiX />}
                    size="sm"
                    colorScheme="red"
                    onClick={handleCancelEdit}
                    aria-label="Hủy"
                  />
                </HStack>
              </Box>
            ) : (
              <Text mb={3}>{comment.content}</Text>
            )}

            {/* Attachments */}
            {comment.attachments && comment.attachments.length > 0 && (
              <Box mb={3}>
                {comment.attachments.map((attachment, index) => (
                  attachment.type?.startsWith('image/') ? (
                    <Image
                      key={index}
                      src={attachment.url}
                      alt={attachment.name}
                      maxH="200px"
                      borderRadius="md"
                      mb={2}
                    />
                  ) : null
                ))}
              </Box>
            )}

            {/* Action Buttons */}
            <HStack>
              {canReply && !isEditing && (
                <Button
                  size="sm"
                  leftIcon={<FiMessageCircle />}
                  variant="ghost"
                  onClick={() => onReply?.(comment.id)}
                >
                  Trả lời
                </Button>
              )}

              {hasReplies && !isEditing && (
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={showReplies ? <FiChevronUp /> : <FiChevronDown />}
                  onClick={() => setShowReplies(!showReplies)}
                >
                  {showReplies ? 'Ẩn' : 'Xem'} {comment.replies.length} phản hồi
                </Button>
              )}
            </HStack>
          </Box>
        </Flex>
      </Box>

      {/* Nested Replies */}
      {hasReplies && (
        <Collapse in={showReplies}>
          <VStack align="stretch" spacing={2} mt={2}>
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
                currentUserId={currentUserId}
                depth={depth + 1}
                maxDepth={maxDepth}
              />
            ))}
          </VStack>
        </Collapse>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Xóa bình luận</AlertDialogHeader>
            <AlertDialogBody>
              Bạn có chắc chắn muốn xóa bình luận này không?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Hủy
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Xóa
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

const CommentList = ({
  comments = [],
  currentUserId,
  onReply,
  onEdit,
  onDelete,
  loading = false,
  maxDepth = 3
}) => {
  if (loading) {
    return (
      <Box textAlign="center" py={4}>
        <Spinner />
      </Box>
    );
  }

  if (comments.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Text color="gray.500">Chưa có bình luận nào</Text>
      </Box>
    );
  }

  return (
    <VStack align="stretch" spacing={4}>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onReply={onReply}
          onEdit={onEdit}
          onDelete={onDelete}
          currentUserId={currentUserId}
          maxDepth={maxDepth}
        />
      ))}
    </VStack>
  );
};

CommentList.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    authorId: PropTypes.string.isRequired,
    authorAvatar: PropTypes.string,
    content: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    isEdited: PropTypes.bool,
    replies: PropTypes.array,
    attachments: PropTypes.arrayOf(PropTypes.shape({
      url: PropTypes.string.isRequired,
      name: PropTypes.string,
      type: PropTypes.string
    }))
  })),
  currentUserId: PropTypes.string,
  onReply: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  loading: PropTypes.bool,
  maxDepth: PropTypes.number
};

CommentItem.propTypes = {
  comment: PropTypes.object.isRequired,
  onReply: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  currentUserId: PropTypes.string,
  depth: PropTypes.number,
  maxDepth: PropTypes.number
};

export default CommentList;