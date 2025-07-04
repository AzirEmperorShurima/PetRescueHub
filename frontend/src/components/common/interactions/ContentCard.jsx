import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import PropTypes from 'prop-types';
import TagList from './TagList';
import LazyImage from '../../common/interactions/LazyImage';

const ContentCard = ({ title, content, image, tags, children, sx = {} }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', ...sx }}>
      {image && (
        <Box sx={{ height: '200px', overflow: 'hidden' }}>
          <LazyImage
            src={image}
            alt={title}
            height="200px"
            width="100%"
            effect="fade"
          />
        </Box>
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {content}
        </Typography>
        {tags && tags.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <TagList tags={tags} />
          </Box>
        )}
        {children}
      </CardContent>
    </Card>
  );
};

ContentCard.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  image: PropTypes.string,
  tags: PropTypes.array,
  children: PropTypes.node,
  sx: PropTypes.object
};

export default ContentCard;