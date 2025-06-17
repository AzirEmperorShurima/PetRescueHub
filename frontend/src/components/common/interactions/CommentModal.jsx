import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Heading,
  Alert,
  AlertIcon,
  Button,
  Text
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import { useNavigate } from 'react-router-dom';

const CommentModal = ({
  isOpen,
  onClose,
  post,
  comments = [],
  currentUser,
  onCommentSubmit,
  onCommentDelete,
  onCommentEdit,
  commentLoading = false
}) => {
  const navigate = useNavigate();

  const goToLogin = () => {
    const currentPath = window.location.pathname;
    navigate('/auth/login', { state: { returnUrl: currentPath } });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="xl" 
      scrollBehavior="inside"
      isCentered
    >
      <ModalOverlay />
      <ModalContent maxH="80vh">
        <ModalHeader>
          <Heading size="md">
            Bình luận ({comments.length})
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack align="stretch" spacing={4}>
            {currentUser ? (
              <CommentForm 
                onSubmit={onCommentSubmit}
                userAvatar={currentUser.avatar}
                userName={currentUser.name}
                placeholder="Viết bình luận của bạn..."
                buttonText="Gửi bình luận"
              />
            ) : (
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <VStack align="start" spacing={2}>
                  <Text>Đăng nhập để bình luận</Text>
                  <Button size="sm" colorScheme="blue" onClick={goToLogin}>
                    Đăng nhập
                  </Button>
                </VStack>
              </Alert>
            )}

            <CommentList
              comments={comments}
              currentUserId={currentUser?.id || currentUser?._id}
              onDelete={onCommentDelete}
              onEdit={onCommentEdit}
              loading={commentLoading}
            />
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

CommentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  post: PropTypes.object,
  comments: PropTypes.array,
  currentUser: PropTypes.object,
  onCommentSubmit: PropTypes.func,
  onCommentDelete: PropTypes.func,
  onCommentEdit: PropTypes.func,
  commentLoading: PropTypes.bool
};

export default CommentModal; 