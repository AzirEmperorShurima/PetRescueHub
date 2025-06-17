import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Icon,
  Text,
  HStack,
  Portal,
} from '@chakra-ui/react';
import { 
  FaEllipsisV, 
  FaEdit, 
  FaTrash, 
  FaFlag,
  FaUserSlash 
} from 'react-icons/fa';

const ActionMenu = ({ 
  isOwner = false,
  onEdit,
  onDelete,
  onReportPost,
  onReportUser,
  size = 'md',
  isDisabled = false,
  onOpenCommentModal
}) => {
  // Color mode values
  const menuBg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const dangerColor = useColorModeValue('red.600', 'red.300');
  const iconColor = useColorModeValue('gray.600', 'gray.400');

  const [isCommentModalOpen, setCommentModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedComments, setSelectedComments] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);

  const handleOpenCommentModal = async (post) => {
    setSelectedPost(post);
    setCommentLoading(true);
    setCommentModalOpen(true);
    try {
      const res = await apiService.forum.comments.getAll({ postId: post._id || post.id });
      setSelectedComments(res.data?.data || []);
    } catch (e) {
      setSelectedComments([]);
    }
    setCommentLoading(false);
  };

  const handleCloseCommentModal = () => {
    setCommentModalOpen(false);
    setSelectedPost(null);
    setSelectedComments([]);
  };

  const handleAction = (action) => (e) => {
    e.stopPropagation();
    action();
  };

  return (
    <Menu placement="bottom-end" closeOnSelect isLazy>
      <MenuButton
        as={IconButton}
        icon={<FaEllipsisV />}
        variant="ghost"
        size={size}
        aria-label="More options"
        isDisabled={isDisabled}
        color={iconColor}
        _hover={{ bg: hoverBg }}
        onClick={(e) => e.stopPropagation()}
      />
      <Portal>
        <MenuList
          bg={menuBg}
          borderColor={borderColor}
          boxShadow="lg"
          py={2}
          minW="200px"
          zIndex={9999}
        >
          {isOwner ? (
            // Owner Actions - Only show Edit and Delete
            <>
              {onEdit && (
                <MenuItem
                  onClick={handleAction(onEdit)}
                  _hover={{ bg: hoverBg }}
                  px={4}
                  py={2}
                >
                  <HStack spacing={3}>
                    <Icon as={FaEdit} color="blue.500" />
                    <Text color={textColor}>Cập nhật</Text>
                  </HStack>
                </MenuItem>
              )}
              {onDelete && (
                <MenuItem
                  onClick={handleAction(onDelete)}
                  _hover={{ bg: hoverBg }}
                  px={4}
                  py={2}
                >
                  <HStack spacing={3}>
                    <Icon as={FaTrash} color={dangerColor} />
                    <Text color={dangerColor}>Xóa</Text>
                  </HStack>
                </MenuItem>
              )}
            </>
          ) : (
            // Non-owner Actions - Only show Report options
            <>
              {onReportPost && (
                <MenuItem
                  onClick={handleAction(onReportPost)}
                  _hover={{ bg: hoverBg }}
                  px={4}
                  py={2}
                >
                  <HStack spacing={3}>
                    <Icon as={FaFlag} color="orange.500" />
                    <Text color={textColor}>Báo cáo bài viết</Text>
                  </HStack>
                </MenuItem>
              )}
              {onReportUser && (
                <MenuItem
                  onClick={handleAction(onReportUser)}
                  _hover={{ bg: hoverBg }}
                  px={4}
                  py={2}
                >
                  <HStack spacing={3}>
                    <Icon as={FaUserSlash} color="orange.500" />
                    <Text color={textColor}>Báo cáo người dùng</Text>
                  </HStack>
                </MenuItem>
              )}
            </>
          )}
        </MenuList>
      </Portal>
    </Menu>
  );
};

ActionMenu.propTypes = {
  isOwner: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onReportPost: PropTypes.func,
  onReportUser: PropTypes.func,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
  isDisabled: PropTypes.bool,
  onOpenCommentModal: PropTypes.func
};

export default ActionMenu;