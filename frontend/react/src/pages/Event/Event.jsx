import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Button, 
  Divider,
  Pagination,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  Paper,
  InputBase,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Add as AddIcon,
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import './Event.css';

// Import các components dùng chung
import { ContentCard, TagList } from '../../components/common';
import { fDate } from '../../utils/format-time';
// Thay đổi import để sử dụng dữ liệu mock từ file events.js
import { events } from '../../mocks/events';

const Event = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredEvent, setFeaturedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // Sử dụng dữ liệu từ mock events
        setTimeout(() => {
          // Tìm sự kiện nổi bật (sự kiện đầu tiên)
          if (events.length > 0) {
            setFeaturedEvent(events[0]);
            setEventsList(events.slice(1));
          } else {
            setEventsList([]);
          }
          
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = eventsList.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    // Cuộn lên đầu trang khi chuyển trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateEvent = () => {
    navigate('/event/create');
  };

  // Phân trang
  const eventsPerPage = 6;
  const pageCount = Math.ceil(filteredEvents.length / eventsPerPage);
  const displayedEvents = filteredEvents.slice(
    (page - 1) * eventsPerPage,
    page * eventsPerPage
  );

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  return (
    <Box className="event-page">
      <Container maxWidth="lg">
        {/* Header */}
        <Box textAlign="center" mb={6} className="event-header">
          <Typography variant="h3" component="h1" className="event-title" gutterBottom>
            Sự kiện
          </Typography>
          <Typography variant="subtitle1" className="event-subtitle">
            Tham gia các sự kiện của chúng tôi để gặp gỡ cộng đồng yêu thú cưng
          </Typography>
        </Box>

        {/* Search and Create */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2} className="event-actions">
          <Paper
            component="form"
            className="event-search"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: { xs: '100%', sm: 'auto', md: 300 } }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Tìm kiếm sự kiện..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateEvent}
            className="create-event-btn"
          >
            Tạo sự kiện
          </Button>
        </Box>

        {/* Featured Event */}
        {featuredEvent && (
          <Box mb={6}>
            <Typography variant="h5" component="h2" gutterBottom className="section-title no-underline">
              Sự kiện nổi bật
            </Typography>
            <Card className="featured-event-card">
              <Grid container>
                <Grid item xs={12} md={6} className="featured-event-image-container">
                  <CardMedia
                    component="img"
                    height="300"
                    image={featuredEvent.imageUrl}
                    alt={featuredEvent.title}
                    className="featured-event-image"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <CardContent className="featured-event-content">
                    <Typography variant="h5" component="h3" gutterBottom className="featured-event-title">
                      {featuredEvent.title}
                    </Typography>
                    
                    <Box display="flex" alignItems="center" mb={1} className="event-info-item">
                      <CalendarIcon fontSize="small" color="primary" />
                      <Typography variant="body2" color="textSecondary" ml={1}>
                        {formatDate(featuredEvent.date)}
                      </Typography>
                    </Box>
                    
                    <Box display="flex" alignItems="center" mb={1} className="event-info-item">
                      <LocationIcon fontSize="small" color="primary" />
                      <Typography variant="body2" color="textSecondary" ml={1}>
                        {featuredEvent.location}
                      </Typography>
                    </Box>
                    
                    <Box display="flex" alignItems="center" mb={2} className="event-info-item">
                      <PeopleIcon fontSize="small" color="primary" />
                      <Typography variant="body2" color="textSecondary" ml={1}>
                        {featuredEvent.participants} người tham gia
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" paragraph className="featured-event-description">
                      {featuredEvent.description}
                    </Typography>
                    
                    <Box mt={1} mb={2} display="flex" flexWrap="wrap" gap={0.5} className="event-tags">
                      {featuredEvent.tags.map((tag, index) => (
                        <Chip 
                          key={index} 
                          label={tag} 
                          size="small" 
                          className="event-tag-chip" 
                        />
                      ))}
                    </Box>
                    
                    <Box display="flex" gap={2}>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        endIcon={<ArrowForwardIcon />}
                        component={Link}
                        to={`/event/${featuredEvent.id}`}
                        className="event-details-btn"
                      >
                        Xem chi tiết
                      </Button>
                      <Button 
                        variant="outlined" 
                        color="primary"
                        className="event-register-btn"
                      >
                        Tham gia
                      </Button>
                    </Box>
                  </CardContent>
                </Grid>
              </Grid>
            </Card>
          </Box>
        )}

        {/* Event List */}
        <Box mb={4}>
          <Typography variant="h5" component="h2" gutterBottom className="section-title no-underline">
            Tất cả sự kiện
          </Typography>
          
          {loading ? (
            <Box className="event-skeleton-container">
              <Grid container spacing={3}>
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item}>
                    <Card className="event-card skeleton">
                      <Box className="event-card-media-skeleton"></Box>
                      <CardContent>
                        <Box className="skeleton-text-lg"></Box>
                        <Box className="skeleton-text-sm"></Box>
                        <Box className="skeleton-text-sm"></Box>
                        <Box className="skeleton-text-block"></Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : displayedEvents.length > 0 ? (
            <Grid container spacing={3}>
              {displayedEvents.map((event) => (
                <Grid item xs={12} sm={6} md={4} key={event.id}>
                  <Card className="event-card">
                    <div className="event-card-media-container">
                      <CardMedia
                        component="img"
                        height="200"
                        image={event.imageUrl}
                        alt={event.title}
                        className="event-card-media"
                      />
                    </div>
                    <CardContent className="event-card-content">
                      <Typography variant="h6" component="h3" className="event-card-title">
                        {event.title}
                      </Typography>
                      
                      <Box display="flex" alignItems="center" mt={1} mb={1} className="event-info-item">
                        <CalendarIcon fontSize="small" color="primary" />
                        <Typography variant="body2" color="textSecondary" ml={1}>
                          {formatDate(event.date)}
                        </Typography>
                      </Box>
                      
                      <Box display="flex" alignItems="center" mb={1} className="event-info-item">
                        <LocationIcon fontSize="small" color="primary" />
                        <Typography variant="body2" color="textSecondary" ml={1}>
                          {event.location}
                        </Typography>
                      </Box>
                      
                      <Box display="flex" alignItems="center" mb={2} className="event-info-item">
                        <PeopleIcon fontSize="small" color="primary" />
                        <Typography variant="body2" color="textSecondary" ml={1}>
                          {event.participants} người tham gia
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" color="textSecondary" className="event-card-description">
                        {event.description.length > 120 
                          ? `${event.description.substring(0, 120)}...` 
                          : event.description}
                      </Typography>
                      
                      <Box mt={2} mb={1} display="flex" flexWrap="wrap" gap={0.5} className="event-tags">
                        {event.tags.slice(0, 3).map((tag, index) => (
                          <Chip 
                            key={index} 
                            label={tag} 
                            size="small" 
                            className="event-tag-chip" 
                          />
                        ))}
                      </Box>
                    </CardContent>
                    <CardActions className="event-card-actions">
                      <Button 
                        size="small" 
                        color="primary"
                        component={Link}
                        to={`/event/${event.id}`}
                        className="event-details-btn"
                      >
                        Xem chi tiết
                      </Button>
                      <Button 
                        size="small" 
                        variant="outlined"
                        color="primary"
                        className="event-register-btn"
                      >
                        Tham gia
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box className="no-events-message">
              <Typography align="center">Không tìm thấy sự kiện nào phù hợp.</Typography>
            </Box>
          )}
        </Box>

        {/* Pagination */}
        {pageCount > 1 && (
          <Box display="flex" justifyContent="center" mb={4} className="event-pagination">
            <Pagination 
              count={pageCount} 
              page={page} 
              onChange={handlePageChange} 
              color="primary"
              size={isMobile ? "small" : "medium"}
              className="pagination"
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Event;