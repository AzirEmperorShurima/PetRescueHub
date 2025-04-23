import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Box, Chip, Button } from '@mui/material';
import { CalendarToday, LocationOn, People } from '@mui/icons-material';
import PropTypes from 'prop-types';
import './EventCard.css';

const EventCard = ({ event }) => {
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  return (
    <Card className="event-card">
      <CardMedia
        component="img"
        height="200"
        image={event.imageUrl}
        alt={event.title}
        className="event-card-media"
      />
      <CardContent className="event-card-content">
        <Typography variant="h6" component="h2" className="event-card-title">
          {event.title}
        </Typography>
        
        <Box display="flex" alignItems="center" mt={1} mb={1}>
          <CalendarToday fontSize="small" color="primary" />
          <Typography variant="body2" color="textSecondary" ml={1}>
            {formatDate(event.date)}
          </Typography>
        </Box>
        
        <Box display="flex" alignItems="center" mb={1}>
          <LocationOn fontSize="small" color="primary" />
          <Typography variant="body2" color="textSecondary" ml={1}>
            {event.location}
          </Typography>
        </Box>
        
        <Box display="flex" alignItems="center" mb={2}>
          <People fontSize="small" color="primary" />
          <Typography variant="body2" color="textSecondary" ml={1}>
            {event.participants} người tham gia
          </Typography>
        </Box>
        
        <Typography variant="body2" color="textSecondary" className="event-card-description">
          {event.description.length > 120 
            ? `${event.description.substring(0, 120)}...` 
            : event.description}
        </Typography>
        
        <Box mt={2} mb={1} display="flex" flexWrap="wrap" gap={0.5}>
          {event.tags.map((tag, index) => (
            <Chip 
              key={index} 
              label={tag} 
              size="small" 
              className="event-tag-chip" 
            />
          ))}
        </Box>
        
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button 
            component={Link} 
            to={`/event/${event.id}`} 
            variant="outlined" 
            color="primary" 
            size="small"
          >
            Chi tiết
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            size="small"
          >
            Tham gia
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

EventCard.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    date: PropTypes.instanceOf(Date).isRequired,
    imageUrl: PropTypes.string.isRequired,
    participants: PropTypes.number.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    organizer: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired
  }).isRequired
};

export default EventCard;