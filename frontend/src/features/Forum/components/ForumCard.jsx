import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  Box, 
  Avatar, 
  Chip, 
  IconButton,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Favorite as FavoriteIcon, 
  FavoriteBorder as FavoriteBorderIcon,
  Comment as CommentIcon,
  Visibility as VisibilityIcon,
  MoreVert as MoreVertIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon
} from '@mui/icons-material';
import PropTypes from 'prop-types';
import PostSticker from './PostSticker';

// Remove duplicate Card and CardContent imports

const ForumCard = ({ 
  item, 
  type, 
  categories, 
  onToggleLike, 
  onToggleFavorite, 
  formatDate,
  onClick
}) => {
  const theme = useTheme();
  
  // Sử dụng categories được truyền vào hoặc sử dụng categoryObj từ item
  const category = item.categoryObj || (categories && categories.find(cat => cat.id === item.category));
  
  const getDetailUrl = () => {
    switch(type) {
      case 'post':
        return `/forum/post/${item.id}`;
      case 'question':
        return `/forum/question/${item.id}`;
      case 'event':
        return `/event/${item.id}`;
      default:
        return '#';
    }
  };

  return (
    <Card 
      sx={{ 
        mb: 3,
        position: 'relative', // Thêm position relative
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 6,
        }
      }}
      onClick={onClick ? () => onClick(item.id) : undefined}
    >
      <PostSticker type={type} /> {/* Thêm PostSticker component */}
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar 
            src={item.author?.avatar} 
            alt={item.author?.name}
            sx={{ mr: 1 }}
          />
          <Box>
            <Typography variant="subtitle2" component="span">
              {item.author?.name}
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary">
              {formatDate ? formatDate(item.createdAt) : new Date(item.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
          {/* Xóa phần hiển thị category cũ */}
        </Box>
        
        <Link to={getDetailUrl()} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography variant="h6" component="h2" gutterBottom>
            {item.title}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" paragraph>
            {item.content?.substring(0, 150)}
            {item.content?.length > 150 ? '...' : ''}
          </Typography>
        </Link>
        
        {item.image && (
          <Box 
            component="img"
            src={item.image}
            alt={item.title}
            sx={{ 
              width: '100%', 
              borderRadius: 1,
              maxHeight: 450,
              objectFit: 'cover',
              mb: 2
            }}
          />
        )}
        
        {item.tags && item.tags.length > 0 && (
          <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
            {item.tags.map((tag, index) => (
              <Chip 
                key={index} 
                label={tag} 
                size="small" 
                sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                  }
                }} 
              />
            ))}
          </Box>
        )}
      </CardContent>
      
      <CardActions disableSpacing>
        <Box display="flex" width="100%" justifyContent="space-between">
          <Box display="flex">
            <IconButton 
              aria-label="like" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleLike && onToggleLike(item.id);
              }}
              color={item.isLiked ? "primary" : "default"}
            >
              {item.isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              <Typography variant="caption" sx={{ ml: 0.5 }}>
                {item.likes || 0}
              </Typography>
            </IconButton>
            
            <IconButton aria-label="comments">
              <CommentIcon />
              <Typography variant="caption" sx={{ ml: 0.5 }}>
                {item.comments || 0}
              </Typography>
            </IconButton>
            
            <IconButton aria-label="views">
              <VisibilityIcon />
              <Typography variant="caption" sx={{ ml: 0.5 }}>
                {item.views || 0}
              </Typography>
            </IconButton>
          </Box>
          
          <Box display="flex">
            <IconButton 
              aria-label="favorite"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite && onToggleFavorite(item.id);
              }}
              color={item.isFavorited ? "primary" : "default"}
            >
              {item.isFavorited ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </IconButton>
            
            <IconButton aria-label="more options">
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>
      </CardActions>
    </Card>
  );
};

ForumCard.propTypes = {
  item: PropTypes.object.isRequired,
  type: PropTypes.oneOf(['post', 'question', 'event']).isRequired,
  categories: PropTypes.array,
  onToggleLike: PropTypes.func,
  onToggleFavorite: PropTypes.func,
  formatDate: PropTypes.func,
  onClick: PropTypes.func
};

export default memo(ForumCard);