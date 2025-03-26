import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Divider, 
  IconButton,
  Button,  // Add this import
  Avatar    // Add this import
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';  // Add this import
import { vi } from 'date-fns/locale';  // Add this import
import { useAuth } from '../../contexts/AuthContext';

// Import các components dùng chung
import { 
  LikeButton, 
  CommentForm, 
  CommentList, 
  ShareButton, 
  TagList,
  ImageOptimizer,
  ActionMenu
} from '../../components/common';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchPostDetails = async () => {
      setLoading(true);
      try {
        // Trong thực tế, bạn sẽ gọi API thực sự
        // const response = await api.get(`/forum/posts/${id}`);
        // setPost(response.data);
        
        // Dữ liệu mẫu
        setTimeout(() => {
          const mockPost = {
            id: parseInt(id),
            title: 'Kinh nghiệm chăm sóc chó con mới sinh',
            content: 'Chia sẻ một số kinh nghiệm khi chăm sóc chó con mới sinh...\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.',
            author: 'Nguyễn Văn A',
            authorAvatar: 'https://i.pravatar.cc/150?img=1',
            authorId: 'user1',
            date: '2023-11-10T08:30:00',
            tags: ['chó', 'chăm sóc', 'kinh nghiệm'],
            image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
          };
          setPost(mockPost);
          setLikeCount(15);
          
          // Mock comments
          setComments([
            {
              id: 1,
              author: 'Trần Thị B',
              avatar: 'https://i.pravatar.cc/150?img=5',
              content: 'Cảm ơn bạn đã chia sẻ kinh nghiệm hữu ích!',
              createdAt: '2023-11-10T10:15:00',
              userId: 'user2'
            },
            {
              id: 2,
              author: 'Lê Văn C',
              avatar: 'https://i.pravatar.cc/150?img=8',
              content: 'Tôi cũng đang nuôi chó con, bài viết rất bổ ích.',
              createdAt: '2023-11-11T14:20:00',
              userId: 'user3'
            }
          ]);
          
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching post details:', error);
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [id]);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleCommentSubmit = (commentText) => {
    const newComment = {
      id: Date.now(),
      author: user?.name || 'Người dùng ẩn danh',
      avatar: user?.avatar || 'https://i.pravatar.cc/150?img=8',
      content: commentText,
      createdAt: new Date().toISOString(),
      userId: user?.id || 'anonymous'
    };
    
    setComments([newComment, ...comments]);
  };

  const handleDeleteComment = (commentId) => {
    setComments(comments.filter(comment => comment.id !== commentId));
  };

  const handleEditComment = (comment) => {
    // Xử lý chỉnh sửa comment
    console.log('Edit comment:', comment);
  };

  const handleEditPost = () => {
    // Xử lý chỉnh sửa bài viết
    console.log('Edit post:', post);
  };

  const handleDeletePost = () => {
    // Xử lý xóa bài viết
    console.log('Delete post:', post);
    navigate('/forum');
  };

  const handleReportPost = () => {
    // Xử lý báo cáo bài viết
    console.log('Report post:', post);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <Typography>Đang tải...</Typography>
        </Box>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h6">Không tìm thấy bài viết</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/forum')}
            sx={{ mt: 2 }}
          >
            Quay lại diễn đàn
          </Button>
        </Box>
      </Container>
    );
  }

  const isOwner = user?.id === post.authorId;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => navigate('/forum')} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
              {post.title}
            </Typography>
          </Box>
          
          <ActionMenu
            onEdit={isOwner ? handleEditPost : null}
            onDelete={isOwner ? handleDeletePost : null}
            onReport={!isOwner ? handleReportPost : null}
            isOwner={isOwner}
          />
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src={post.authorAvatar} alt={post.author} sx={{ width: 40, height: 40, mr: 1 }} />
            <Box>
              <Typography variant="subtitle1">{post.author}</Typography>
              <Typography variant="caption" color="text.secondary">
                {format(new Date(post.date), 'dd/MM/yyyy HH:mm', { locale: vi })}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        {post.image && (
          <Box sx={{ mb: 3 }}>
            <ImageOptimizer 
              src={post.image} 
              alt={post.title} 
              width="100%" 
              height="auto" 
            />
          </Box>
        )}
        
        <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-line' }}>
          {post.content}
        </Typography>
        
        <TagList tags={post.tags} sx={{ mb: 3 }} />
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <LikeButton 
            liked={liked} 
            likeCount={likeCount} 
            onLike={handleLike} 
          />
          <ShareButton 
            url={window.location.href} 
            title={post.title} 
          />
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Typography variant="h6" gutterBottom>
          Bình luận ({comments.length})
        </Typography>
        
        <CommentForm 
          onSubmit={handleCommentSubmit} 
          userAvatar={user?.avatar} 
        />
        
        <CommentList 
          comments={comments} 
          currentUserId={user?.id} 
          onDelete={handleDeleteComment}
          onEdit={handleEditComment}
        />
      </Paper>
    </Container>
  );
};

export default PostDetail;