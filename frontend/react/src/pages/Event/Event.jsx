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
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import './Event.css';

// Import các components dùng chung
import { ContentCard, TagList } from '../../components/common';
import { fDate } from '../../utils/format-time';
import { eventsMock } from '../../mocks';

const Event = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredEvent, setFeaturedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // Trong thực tế, bạn sẽ gọi API thực sự
        // const response = await api.get('/events');
        // setEvents(response.data);
        
        // Sử dụng dữ liệu giả từ mock
        setTimeout(() => {
          // Tìm sự kiện nổi bật
          const featured = eventsMock.find(event => event.isFeatured);
          if (featured) {
            setFeaturedEvent(featured);
            setEvents(eventsMock.filter(event => event.id !== featured.id));
          } else {
            setEvents(eventsMock);
          }
          
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => 
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

  return (
    <Box className="event-page">
      <Container maxWidth="lg">
        {/* Header */}
        <Box textAlign="center" mb={6} className="event-header">
          <Typography variant="h3" component="h1" className="event-title" gutterBottom>
            Sự kiện
          </Typography>
          <Typography 
            variant="body1" 
            className="event-subtitle"
            sx={{ 
              maxWidth: '700px', 
              mx: 'auto',
              px: { xs: 2, md: 0 }
            }}
          >
            Tham gia các sự kiện về thú cưng để gặp gỡ những người yêu thú cưng khác và học hỏi thêm về cách chăm sóc thú cưng của bạn.
          </Typography>
        </Box>

        {/* Search and Create */}
        <Box 
          display="flex" 
          flexDirection={{ xs: 'column', sm: 'row' }} 
          justifyContent="space-between" 
          alignItems={{ xs: 'stretch', sm: 'center' }} 
          mb={4}
          gap={2}
        >
          <Paper
            component="form"
            sx={{ 
              p: '2px 4px', 
              display: 'flex', 
              alignItems: 'center', 
              width: { xs: '100%', sm: '60%' },
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
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
            sx={{ 
              height: '48px', 
              borderRadius: '8px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            Tạo sự kiện mới
          </Button>
        </Box>

        {/* Featured Event */}
        {featuredEvent && (
          <Box mb={6}>
            <Typography variant="h5" component="h2" fontWeight="600" mb={3}>
              Sự kiện nổi bật
            </Typography>
            <Card className="featured-event-card">
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <CardMedia
                    component="img"
                    height="300"
                    image={featuredEvent.image}
                    alt={featuredEvent.title}
                    className="featured-event-image"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box display="flex" flexDirection="column" height="100%" p={3}>
                    <Box mb={2}>
                      {featuredEvent.tags.map((tag) => (
                        <Chip 
                          key={tag} 
                          label={tag} 
                          size="small" 
                          sx={{ mr: 1, mb: 1, bgcolor: '#e3f2fd' }} 
                        />
                      ))}
                    </Box>
                    <Typography variant="h4" component="h3" fontWeight="700" mb={2}>
                      {featuredEvent.title}
                    </Typography>
                    <Box display="flex" alignItems="center" mb={2}>
                      <CalendarIcon fontSize="small" sx={{ color: '#666', mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {fDate(featuredEvent.date)}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mb={3}>
                      <LocationIcon fontSize="small" sx={{ color: '#666', mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {featuredEvent.location}
                      </Typography>
                    </Box>
                    <Typography variant="body1" mb={3} sx={{ flexGrow: 1 }}>
                      {featuredEvent.description}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      endIcon={<ArrowForwardIcon />}
                      component={Link}
                      to={`/event/${featuredEvent.id}`}
                      sx={{ 
                        alignSelf: 'flex-start',
                        borderRadius: '8px',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                      }}
                    >
                      Xem chi tiết
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Box>
        )}

        {/* Events List */}
        <Box mb={4}>
          <Typography variant="h5" component="h2" fontWeight="600" mb={3}>
            Tất cả sự kiện
          </Typography>
          {loading ? (
            <Grid container spacing={3}>
              {[...Array(3)].map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card className="event-card skeleton">
                    <Box sx={{ height: 200, bgcolor: '#f0f0f0' }} />
                    <CardContent>
                      <Box sx={{ height: 24, width: '80%', bgcolor: '#f0f0f0', mb: 1 }} />
                      <Box sx={{ height: 16, width: '60%', bgcolor: '#f0f0f0', mb: 2 }} />
                      <Box sx={{ height: 16, width: '90%', bgcolor: '#f0f0f0', mb: 1 }} />
                      <Box sx={{ height: 16, width: '80%', bgcolor: '#f0f0f0' }} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : displayedEvents.length > 0 ? (
            <Grid container spacing={3}>
              {displayedEvents.map((event) => (
                <Grid item xs={12} sm={6} md={4} key={event.id}>
                  <Card className="event-card">
                    <CardMedia
                      component="img"
                      height="200"
                      image={event.image}
                      alt={event.title}
                      className="event-card-media"
                    />
                    <CardContent className="event-card-content">
                      <Box mb={1}>
                        {event.tags.slice(0, 2).map((tag) => (
                          <Chip 
                            key={tag} 
                            label={tag} 
                            size="small" 
                            sx={{ mr: 1, mb: 1, bgcolor: '#e3f2fd' }} 
                          />
                        ))}
                      </Box>
                      <Typography variant="h6" component="h3" className="event-card-title" gutterBottom>
                        {event.title}
                      </Typography>
                      <Box display="flex" alignItems="center" mb={1}>
                        <CalendarIcon fontSize="small" sx={{ color: '#666', mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {fDate(event.date)}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" mb={2}>
                        <LocationIcon fontSize="small" sx={{ color: '#666', mr: 1 }} />
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {event.location}
                        </Typography>
                      </Box>
                      <Typography variant="body2" className="event-card-description">
                        {event.description}
                      </Typography>
                    </CardContent>
                    <CardActions className="event-card-actions">
                      <Button 
                        component={Link} 
                        to={`/event/${event.id}`}
                        color="primary"
                        endIcon={<ArrowForwardIcon />}
                        className="event-details-btn"
                      >
                        Xem chi tiết
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box textAlign="center" py={5}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Không tìm thấy sự kiện nào
              </Typography>
              <Typography variant="body1" color="textSecondary" mb={3}>
                Hãy thử tìm kiếm với từ khóa khác hoặc tạo sự kiện mới
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleCreateEvent}
              >
                Tạo sự kiện mới
              </Button>
            </Box>
          )}
        </Box>

        {/* Pagination */}
        {!loading && filteredEvents.length > 0 && (
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination 
              count={pageCount} 
              page={page} 
              onChange={handlePageChange} 
              color="primary"
              size={isMobile ? "small" : "medium"}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Event;