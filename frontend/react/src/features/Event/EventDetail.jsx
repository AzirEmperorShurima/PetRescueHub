import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Button, 
  Divider, 
  Grid,
  IconButton
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  CalendarMonth as CalendarIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
// Xóa import từ date-fns
// import { format } from 'date-fns';
// import { vi } from 'date-fns/locale';
// Thêm import từ utils/format-time
import { fDate, fDateTime } from '../../utils/format-time';
import { useAuth } from '../../contexts/AuthContext';

// Import các components dùng chung
import { 
  LikeButton, 
  CommentForm, 
  CommentList, 
  ShareButton, 
  TagList,
  ImageOptimizer
} from '../../components/common';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true);
      try {
        // Trong thực tế, bạn sẽ gọi API thực sự
        // const response = await api.get(`/events/${id}`);
        // setEvent(response.data);
        
        // Dữ liệu mẫu
        setTimeout(() => {
          const mockEvent = {
            id: parseInt(id),
            title: 'Ngày hội nhận nuôi thú cưng lần thứ 5',
            date: '2023-11-15',
            startTime: '09:00',
            endTime: '17:00',
            location: 'Công viên Lê Văn Tám, Quận 1, TP.HCM',
            description: 'Gặp gỡ và nhận nuôi các thú cưng đáng yêu từ các trung tâm cứu hộ. Sự kiện này là cơ hội tuyệt vời để tìm kiếm người bạn đồng hành mới cho gia đình bạn. Ngoài ra, còn có các hoạt động tư vấn chăm sóc thú cưng, khám sức khỏe miễn phí và nhiều phần quà hấp dẫn.',
            organizer: 'Trung tâm Bảo trợ Động vật TP.HCM',
            contact: '0123456789',
            email: 'contact@example.com',
            image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            tags: ['nhận nuôi', 'chó', 'mèo']
          };
          setEvent(mockEvent);
          setLikeCount(15);
          
          // Mock comments
          setComments([
            {
              id: 1,
              author: 'Nguyễn Văn A',
              avatar: 'https://i.pravatar.cc/150?img=1',
              content: 'Sự kiện rất ý nghĩa, tôi sẽ tham gia!',
              createdAt: '2023-11-10T08:30:00',
              userId: 'user1'
            },
            {
              id: 2,
              author: 'Trần Thị B',
              avatar: 'https://i.pravatar.cc/150?img=5',
              content: 'Tôi đã tham gia sự kiện năm ngoái, rất tuyệt vời!',
              createdAt: '2023-11-09T14:20:00',
              userId: 'user2'
            }
          ]);
          
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching event details:', error);
        setLoading(false);
      }
    };

    fetchEventDetails();
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

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <Typography>Đang tải...</Typography>
        </Box>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h6">Không tìm thấy sự kiện</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/event')}
            sx={{ mt: 2 }}
          >
            Quay lại danh sách sự kiện
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate('/event')} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
            {event.title}
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Box sx={{ mb: 3 }}>
          <ImageOptimizer 
            src={event.image} 
            alt={event.title} 
            width="100%" 
            height="auto" 
          />
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-line' }}>
              {event.description}
            </Typography>
            
            <TagList tags={event.tags} sx={{ mb: 3 }} />
            
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <LikeButton 
                liked={liked} 
                likeCount={likeCount} 
                onLike={handleLike} 
              />
              <ShareButton 
                url={window.location.href} 
                title={event.title} 
              />
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Bình luận ({comments.length})
            </Typography>
            
            <CommentForm 
              onSubmit={handleCommentSubmit} 
              userAvatar={user?.avatar || 'https://i.pravatar.cc/150?img=8'} 
            />
            
            <CommentList 
              comments={comments} 
              currentUserId={user?.id} 
              onDelete={handleDeleteComment}
              onEdit={handleEditComment}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Thông tin sự kiện
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Ngày
                  </Typography>
                  <Typography variant="body2">
                    {event.date}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Thời gian
                  </Typography>
                  <Typography variant="body2">
                    {event.startTime} - {event.endTime}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Địa điểm
                  </Typography>
                  <Typography variant="body2">
                    {event.location}
                  </Typography>
                </Box>
              </Box>
            </Paper>
            
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Thông tin liên hệ
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Đơn vị tổ chức:</strong> {event.organizer}
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Số điện thoại:</strong> {event.contact}
              </Typography>
              
              <Typography variant="body2">
                <strong>Email:</strong> {event.email}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default EventDetail;