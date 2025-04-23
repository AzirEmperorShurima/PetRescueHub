import React from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Button, 
  Divider, 
  IconButton
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  CalendarMonth as CalendarIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { fDate, fDateTime } from '../../utils/format-time';
import { useAuth } from '../../components/contexts/AuthContext';

// Import custom hook
import { useEventDetail } from '../../components/hooks/useEventDetail';

// Import components
import CommentForm from '../../components/common/interactions/CommentForm';
import CommentList from '../../components/common/interactions/CommentList';
import LikeButton from '../../components/common/interactions/LikeButton';
import ShareButton from '../../components/common/interactions/ShareButton';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Sử dụng custom hook
  const { 
    event, 
    loading, 
    liked, 
    likeCount, 
    comments, 
    handleLike, 
    handleCommentSubmit 
  } = useEventDetail(id);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography>Đang tải thông tin sự kiện...</Typography>
        </Box>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography>Không tìm thấy sự kiện</Typography>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/events')}
          >
            Quay lại danh sách sự kiện
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/events')}
          sx={{ mb: 2 }}
        >
          Quay lại danh sách sự kiện
        </Button>
        
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          {/* Event header */}
          <Typography variant="h4" component="h1" gutterBottom>
            {event.title}
          </Typography>
          
          {/* Event metadata */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarIcon sx={{ mr: 1 }} />
              <Typography variant="body2">
                {fDateTime(event.startDate)} - {fDateTime(event.endDate)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationIcon sx={{ mr: 1 }} />
              <Typography variant="body2">{event.location}</Typography>
            </Box>
          </Box>
          
          {/* Event image */}
          {event.imageUrl && (
            <Box sx={{ mb: 3 }}>
              <img 
                src={event.imageUrl} 
                alt={event.title} 
                style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '4px' }} 
              />
            </Box>
          )}
          
          {/* Event description */}
          <Typography variant="body1" paragraph>
            {event.description}
          </Typography>
          
          {/* Event interactions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <LikeButton 
                liked={liked} 
                likeCount={likeCount} 
                onLike={handleLike} 
              />
              <ShareButton url={window.location.href} title={event.title} />
            </Box>
            
            {event.status === 'upcoming' && (
              <Button variant="contained" color="primary">
                Đăng ký tham gia
              </Button>
            )}
          </Box>
        </Paper>
        
        {/* Comments section */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Bình luận ({comments.length})
          </Typography>
          
          {user ? (
            <CommentForm onSubmit={handleCommentSubmit} />
          ) : (
            <Typography variant="body2" sx={{ mb: 2 }}>
              Vui lòng <Button onClick={() => navigate('/auth/login')}>đăng nhập</Button> để bình luận
            </Typography>
          )}
          
          <Divider sx={{ my: 3 }} />
          
          <CommentList comments={comments} />
        </Paper>
      </Box>
    </Container>
  );
};

export default EventDetail;