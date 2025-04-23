import React from 'react';
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
      className="forum-card"
      // sx={{
      //   borderRadius: '12px',
      //   boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      //   transition: 'transform 0.2s, box-shadow 0.2s',
      //   overflow: 'hidden',
      //   '&:hover': {
      //     transform: 'translateY(-2px)',
      //     boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)'
      //   },
      //   cursor: onClick ? 'pointer' : 'default'
      // }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar 
            src={type === 'event' ? item.organizer.avatar : item.author.avatar} 
            alt={type === 'event' ? item.organizer.name : item.author.name} 
            sx={{ width: 40, height: 40 }}
          />
          <Box ml={1.5}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {type === 'event' ? item.organizer.name : item.author.name}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {formatDate(item.createdAt)}
            </Typography>
          </Box>
          {type === 'question' && (
            <>
              <Box flexGrow={1} />
              <Chip 
                size="small" 
                label={item.status === 'open' ? 'Đang mở' : 'Đã trả lời'} 
                color={item.status === 'open' ? 'primary' : 'success'}
                sx={{ 
                  fontWeight: 600,
                  px: 1
                }}
              />
            </>
          )}
        </Box>
        
        <Link to={getDetailUrl()} className="forum-link" onClick={(e) => onClick && e.stopPropagation()}>
          <Typography 
            variant="h6" 
            component="h2" 
            className="forum-title"
            sx={{ 
              fontWeight: 700,
              mb: 1.5,
              transition: 'color 0.2s',
              '&:hover': {
                color: theme.palette.primary.main
              }
            }}
          >
            {item.title}
          </Typography>
        </Link>
        
        <Typography 
          variant="body2" 
          color="textSecondary" 
          className="forum-excerpt"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {item.content.substring(0, 150)}...
        </Typography>
        
        {item.image && (
          <Box 
            mt={2} 
            mb={2} 
            className="forum-image-container"
            sx={{
              width: '100%',
              height: 200,
              overflow: 'hidden',
              borderRadius: '8px',
              '& img': {
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.03)'
                }
              }
            }}
          >
            <img src={item.image} alt={item.title} className="forum-image" />
          </Box>
        )}
        
        <Box mt={2} display="flex" flexWrap="wrap" gap={0.8}>
          {category && (
            <Chip 
              size="small" 
              label={category.name || 'Unknown Category'} 
              className="forum-category-chip"
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                fontWeight: 500
              }}
            />
          )}
          {item.tags && item.tags.slice(0, 2).map((tag, index) => (
            <Chip 
              key={index} 
              size="small" 
              label={tag} 
              variant="outlined" 
              className="forum-tag-chip"
              sx={{ backgroundColor: '#f5f5f5' }}
            />
          ))}
          {item.tags && item.tags.length > 2 && (
            <Chip 
              size="small" 
              label={`+${item.tags.length - 2}`} 
              variant="outlined"
              sx={{ backgroundColor: '#f5f5f5' }}
            />
          )}
        </Box>
      </CardContent>
      
      <CardActions 
        className="forum-card-actions"
        sx={{
          padding: '8px 16px',
          backgroundColor: '#fafafa',
          borderTop: '1px solid #f0f0f0'
        }}
      >
        <Box display="flex" alignItems="center">
          <IconButton 
            size="small" 
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike(item.id, type);
            }}
            color={item.isLiked ? "primary" : "default"}
            sx={{ 
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.1)' }
            }}
          >
            {item.isLiked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
          </IconButton>
          <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>{item.likes}</Typography>
        </Box>
        
        <Box display="flex" alignItems="center" ml={2}>
          <IconButton 
            size="small"
            sx={{ 
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.1)' }
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <CommentIcon fontSize="small" />
          </IconButton>
          <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>{item.comments}</Typography>
        </Box>
        
        <Box display="flex" alignItems="center" ml={2}>
          <IconButton 
            size="small"
            sx={{ 
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.1)' }
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>{item.views}</Typography>
        </Box>
        
        <Box flexGrow={1} />
        
        <IconButton 
          size="small" 
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(item.id, type);
          }}
          color={item.isFavorited ? "primary" : "default"}
          sx={{ 
            transition: 'transform 0.2s',
            '&:hover': { transform: 'scale(1.1)' }
          }}
        >
          {item.isFavorited ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
        </IconButton>
        
        <IconButton 
          size="small"
          sx={{ 
            transition: 'transform 0.2s',
            '&:hover': { transform: 'scale(1.1)' }
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </CardActions>
    </Card>
  );
};

ForumCard.propTypes = {
  item: PropTypes.object.isRequired,
  type: PropTypes.oneOf(['post', 'question', 'event']).isRequired,
  categories: PropTypes.array,
  onToggleLike: PropTypes.func.isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
  onClick: PropTypes.func
};

ForumCard.defaultProps = {
  categories: [],
  onClick: null
};

export default ForumCard;