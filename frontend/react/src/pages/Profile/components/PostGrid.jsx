import React from 'react';
import { 
  Typography, 
  Button, 
  Box
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import ArticleIcon from '@mui/icons-material/Article';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const PostGrid = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return (
      <Box className="empty-posts">
        <Typography variant="h5" gutterBottom>Bài viết</Typography>
        <Typography variant="body1" color="textSecondary">
          Bạn chưa có bài viết nào. Hãy chia sẻ câu chuyện đầu tiên của bạn!
        </Typography>
      </Box>
    );
  }

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: vi });
    } catch (error) {
      return 'Không rõ ngày';
    }
  };

  return (
    <Box>
      <Typography variant="h5" className="tab-title" gutterBottom>Bài viết</Typography>
      
      <div className="activities-timeline">
        {posts.map((post) => (
          <div className="activity-item" key={post.id}>
            <div className="activity-icon-container">
              <ArticleIcon className="activity-icon" />
            </div>
            
            <div className="activity-content">
              <div className="activity-header">
                <Typography variant="h6" className="activity-title">
                  {post.title}
                </Typography>
                <Typography variant="body2" className="activity-date">
                  {formatDate(post.createdAt)}
                </Typography>
              </div>
              
              {post.image && (
                <div className="activity-image-container">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="activity-image" 
                  />
                </div>
              )}
              
              <Typography variant="body1" paragraph>
                {post.content}
              </Typography>
              
              <div className="activity-actions">
                <Button 
                  startIcon={<VisibilityIcon />} 
                  className="activity-action-button"
                >
                  Xem chi tiết
                </Button>
                <Button 
                  startIcon={<FavoriteIcon />} 
                  className="activity-action-button"
                >
                  {post.likes} Thích
                </Button>
                <Button 
                  startIcon={<CommentIcon />} 
                  className="activity-action-button"
                >
                  {post.comments} Bình luận
                </Button>
                <Button 
                  startIcon={<ShareIcon />} 
                  className="activity-action-button"
                >
                  Chia sẻ
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Box>
  );
};

export default PostGrid;