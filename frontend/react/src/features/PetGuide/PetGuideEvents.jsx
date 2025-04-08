import React, { useState } from 'react';
import { 
  Container, Typography, Box, TextField, InputAdornment, 
  Tabs, Tab, Card, CardMedia, CardContent, Button, 
  Chip, Grid, Pagination, Paper
} from '@mui/material';
import { 
  Search as SearchIcon, 
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  ArrowForward as ArrowForwardIcon,
  Pets as PetsIcon
} from '@mui/icons-material';
import './petguide-events.css';

const PetGuideEvents = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Sample event data
  const events = [
    {
      id: 1,
      title: "Hội thảo chăm sóc thú cưng mới",
      date: "15/06/2023",
      location: "Hà Nội",
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b",
      category: "Chăm sóc chó",
      excerpt: "Tìm hiểu các mẹo chăm sóc thú cưng mới nhất từ các chuyên gia hàng đầu."
    },
    {
      id: 2,
      title: "Ngày hội nhận nuôi mèo",
      date: "22/06/2023",
      location: "TP. Hồ Chí Minh",
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
      category: "Cứu hộ mèo",
      excerpt: "Cơ hội nhận nuôi những chú mèo đáng yêu đã được giải cứu và chăm sóc sức khỏe."
    },
    {
      id: 3,
      title: "Triển lãm thú cưng kỳ lạ",
      date: "30/06/2023",
      location: "Đà Nẵng",
      image: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca",
      category: "Thú cưng kỳ lạ",
      excerpt: "Khám phá thế giới của những loài thú cưng độc đáo và hiếm có."
    },
    {
      id: 4,
      title: "Khóa học sơ cứu cho thú cưng",
      date: "05/07/2023",
      location: "Hà Nội",
      image: "https://images.unsplash.com/photo-1581888227599-779811939961",
      category: "Chăm sóc khẩn cấp",
      excerpt: "Học cách xử lý các tình huống khẩn cấp để bảo vệ thú cưng của bạn."
    },
    {
      id: 5,
      title: "Hội chợ từ thiện vì thú cưng",
      date: "12/07/2023",
      location: "Cần Thơ",
      image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e",
      category: "Cứu hộ mèo",
      excerpt: "Tham gia quyên góp và mua sắm để hỗ trợ các tổ chức cứu hộ thú cưng."
    },
    {
      id: 6,
      title: "Tư vấn dinh dưỡng cho thú cưng",
      date: "18/07/2023",
      location: "TP. Hồ Chí Minh",
      image: "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e",
      category: "Chăm sóc chó",
      excerpt: "Gặp gỡ các chuyên gia dinh dưỡng để tìm hiểu chế độ ăn tốt nhất cho thú cưng."
    }
  ];

  // Filter events based on search query and active tab
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 0) return matchesSearch;
    if (activeTab === 1) return matchesSearch && event.category === "Chăm sóc chó";
    if (activeTab === 2) return matchesSearch && event.category === "Cứu hộ mèo";
    if (activeTab === 3) return matchesSearch && event.category === "Thú cưng kỳ lạ";
    if (activeTab === 4) return matchesSearch && event.category === "Chăm sóc khẩn cấp";
    
    return matchesSearch;
  });

  // Pagination logic
  const eventsPerPage = 6;
  const pageCount = Math.ceil(filteredEvents.length / eventsPerPage);
  const displayedEvents = filteredEvents.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
  );

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Featured events (upcoming soon)
  const featuredEvents = events.slice(0, 3);

  return (
    <div className="pet-events-container">
      <Container className="pet-events-content">
        {/* Header Section */}
        <Box className="pet-events-header">
          <Typography variant="h1" className="pet-events-main-title">
            Sự Kiện Thú Cưng
          </Typography>
          <Typography variant="h5" className="pet-events-subtitle">
            Khám phá các sự kiện, hội thảo và hoạt động liên quan đến thú cưng gần bạn
          </Typography>
        </Box>

        {/* Search and Filter Section */}
        <Box className="pet-events-filter-section">
          <Box className="pet-events-search-box">
            <SearchIcon className="search-icon" />
            <TextField
              className="pet-events-search-input"
              placeholder="Tìm kiếm sự kiện..."
              variant="standard"
              fullWidth
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                disableUnderline: true,
              }}
            />
          </Box>

          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            className="pet-events-tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Tất cả" className={`pet-events-tab ${activeTab === 0 ? 'active' : ''}`} />
            <Tab label="Chăm sóc chó" className={`pet-events-tab ${activeTab === 1 ? 'active' : ''}`} />
            <Tab label="Cứu hộ mèo" className={`pet-events-tab ${activeTab === 2 ? 'active' : ''}`} />
            <Tab label="Thú cưng kỳ lạ" className={`pet-events-tab ${activeTab === 3 ? 'active' : ''}`} />
            <Tab label="Chăm sóc khẩn cấp" className={`pet-events-tab ${activeTab === 4 ? 'active' : ''}`} />
          </Tabs>
        </Box>

        {/* Featured Events Section */}
        <Box className="featured-events-section">
          <Typography variant="h2" className="section-title">
            Sự Kiện Sắp Diễn Ra
          </Typography>
          
          <Grid container spacing={4} className="featured-events-grid">
            {featuredEvents.map((event) => (
              <Grid item xs={12} md={4} key={event.id}>
                <Card className="featured-event-card">
                  <Box className="featured-event-date-badge">
                    <CalendarIcon />
                    <Typography>{event.date}</Typography>
                  </Box>
                  <CardMedia
                    component="div"
                    className="featured-event-media"
                    style={{ backgroundImage: `url(${event.image})` }}
                  />
                  <CardContent className="featured-event-content">
                    <Chip 
                      label={event.category} 
                      className="event-category-chip" 
                      size="small" 
                    />
                    <Typography variant="h5" className="featured-event-title">
                      {event.title}
                    </Typography>
                    <Box className="featured-event-details">
                      <Box className="event-detail">
                        <CalendarIcon />
                        <Typography>{event.date}</Typography>
                      </Box>
                      <Box className="event-detail">
                        <LocationIcon />
                        <Typography>{event.location}</Typography>
                      </Box>
                    </Box>
                    <Typography className="featured-event-excerpt">
                      {event.excerpt}
                    </Typography>
                    <Button 
                      variant="contained" 
                      className="register-event-btn"
                      endIcon={<ArrowForwardIcon />}
                    >
                      Đăng ký tham gia
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* All Events Section */}
        <Box className="all-events-section">
          <Typography variant="h2" className="section-title">
            Tất Cả Sự Kiện
          </Typography>
          
          {displayedEvents.length > 0 ? (
            <>
              <Grid container spacing={4} className="events-grid">
                {displayedEvents.map((event) => (
                  <Grid item xs={12} sm={6} md={4} key={event.id}>
                    <Card className="event-card">
                      <CardMedia
                        component="div"
                        className="event-card-media"
                        style={{ backgroundImage: `url(${event.image})` }}
                      >
                        <Chip 
                          label={event.category} 
                          className="event-category-chip" 
                          size="small" 
                        />
                      </CardMedia>
                      <CardContent className="event-card-content">
                        <Typography variant="h5" className="event-card-title">
                          {event.title}
                        </Typography>
                        <Box className="event-card-details">
                          <Box className="event-detail">
                            <CalendarIcon />
                            <Typography>{event.date}</Typography>
                          </Box>
                          <Box className="event-detail">
                            <LocationIcon />
                            <Typography>{event.location}</Typography>
                          </Box>
                        </Box>
                        <Typography className="event-card-excerpt">
                          {event.excerpt}
                        </Typography>
                        <Box className="event-card-footer">
                          <Button 
                            className="event-details-btn"
                            endIcon={<ArrowForwardIcon />}
                          >
                            Chi tiết
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              
              {/* Pagination */}
              {pageCount > 1 && (
                <Box className="pet-events-pagination-container">
                  <Pagination 
                    count={pageCount} 
                    page={currentPage}
                    onChange={handlePageChange}
                    className="pet-events-pagination"
                    color="primary"
                  />
                </Box>
              )}
            </>
          ) : (
            <Paper className="no-events-message">
              <PetsIcon className="no-events-icon" />
              <Typography variant="h6">
                Không tìm thấy sự kiện nào phù hợp với tìm kiếm của bạn
              </Typography>
              <Button 
                variant="outlined" 
                onClick={() => {
                  setSearchQuery('');
                  setActiveTab(0);
                }}
              >
                Xem tất cả sự kiện
              </Button>
            </Paper>
          )}
        </Box>

        {/* Newsletter Section */}
        <Box className="pet-events-newsletter">
          <Box className="newsletter-content">
            <Typography variant="h3" className="newsletter-title">
              Nhận thông báo về sự kiện mới
            </Typography>
            <Typography className="newsletter-description">
              Đăng ký để nhận thông báo về các sự kiện thú cưng mới nhất trong khu vực của bạn
            </Typography>
            <Box className="newsletter-form">
              <input 
                type="email" 
                placeholder="Email của bạn" 
                className="newsletter-input" 
              />
              <Button variant="contained" className="newsletter-button">
                Đăng ký
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default PetGuideEvents;