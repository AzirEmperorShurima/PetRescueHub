import React from 'react';
import { Box, Typography, Avatar, IconButton } from '@mui/material';
import { ThumbUp, Reply, MoreVert } from '@mui/icons-material';
import PropTypes from 'prop-types';
import './CommentList.css';

const CommentList = ({ comments, onLike, onReply }) => {
  return (
    // Thay đổi className từ styles.commentList sang "comment-list"
    <Box className="comment-list">
      {comments.map((comment) => (
        // Thay đổi className từ styles.commentItem sang "comment-item"
        <Box key={comment.id} className="comment-item">
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Avatar src={comment.authorAvatar} alt={comment.author} />
            <Box sx={{ flex: 1 }}>
              {/* Thay đổi className từ styles.commentHeader sang "comment-header" */}
              <Box className="comment-header">
                {/* Thay đổi className từ styles.authorName sang "author-name" */}
                <Typography className="author-name">{comment.author}</Typography>
                {/* Thay đổi className từ styles.timestamp sang "timestamp" */}
                <Typography className="timestamp">
                  {new Date(comment.timestamp).toLocaleString()}
                </Typography>
              </Box>
              {/* Thay đổi className từ styles.commentContent sang "comment-content" */}
              <Typography className="comment-content">{comment.content}</Typography>
              {/* Thay đổi className từ styles.actionButtons sang "action-buttons" */}
              <Box className="action-buttons" sx={{ mt: 1 }}>
                <IconButton size="small" onClick={() => onLike(comment.id)}>
                  <ThumbUp fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => onReply(comment.id)}>
                  <Reply fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

CommentList.propTypes = {
  comments: PropTypes.array.isRequired,
  onLike: PropTypes.func,
  onReply: PropTypes.func
};

CommentList.defaultProps = {
  onLike: () => {},
  onReply: () => {}
};

export default CommentList;