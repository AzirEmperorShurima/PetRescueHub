import React from 'react';
import { Container, Grid, Typography, Box, Button, Card, CardMedia, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import { CalendarMonth, LocationOn, People } from '@mui/icons-material';
import { events } from '../../../mocks';
import './DonationEventSection.css';

// Dữ liệu mẫu cho chiến dịch quyên góp
const donationCampaigns = [
  {
    id: 1,
    title: 'Hỗ trợ thú cưng bị bỏ rơi',
    description: 'Giúp chúng tôi cung cấp thức ăn, chỗ ở và chăm sóc y tế cho những thú cưng bị bỏ rơi',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    goal: 50000000,
    current: 32500000,
    daysLeft: 15
  },
  {
    id: 2,
    title: 'Xây dựng khu cứu hộ mới',
    description: 'Hỗ trợ chúng tôi xây dựng khu cứu hộ mới với nhiều không gian hơn cho thú cưng',
    image: 'https://images.unsplash.com/photo-1551730459-92db2a308d6a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    goal: 200000000,
    current: 87500000,
    daysLeft: 45
  }
];

const DonationEventSection = () => {
  // Lấy 3 sự kiện sắp tới
  const upcomingEvents = events
    .filter(event => new Date(event.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  // Tính phần trăm tiến độ
  const calculateProgress = (current, goal) => {
    return Math.min(Math.round((current / goal) * 100), 100);
  };

  // Format số tiền
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
      .format(amount)
      .replace('₫', 'VNĐ');
  };

  return (
    <section className="donation-event-section">
      <Container maxWidth="lg">
        <Box className="section-header">
          <Typography variant="h2" className="section-title animate-fadeIn">
            Quyên góp & Sự kiện
          </Typography>
          <Typography variant="subtitle1" className="section-subtitle animate-fadeIn">
            Kết nối những trái tim yêu động vật – Cứu hộ, Nhận nuôi, Chung tay vì động vật
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Donation Campaigns */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" className="subsection-title animate-slideInLeft">
              Chiến dịch Quyên góp
            </Typography>
            
            <Box className="donation-campaigns animate-slideInLeft">
              {donationCampaigns.map((campaign) => (
                <Card key={campaign.id} className="donation-campaign-card">
                  <CardMedia
                    component="img"
                    height="200"
                    image={campaign.image}
                    alt={campaign.title}
                    className="donation-campaign-image"
                  />
                  <CardContent className="donation-campaign-content">
                    <Typography variant="h6" className="donation-campaign-title">
                      {campaign.title}
                    </Typography>
                    <Typography variant="body2" className="donation-campaign-description">
                      {campaign.description}
                    </Typography>
                    
                    <Box className="donation-progress-container">
                      <Box className="donation-progress-info">
                        <Typography variant="body2" className="donation-raised">
                          Đã quyên góp: {formatCurrency(campaign.current)}
                        </Typography>
                        <Typography variant="body2" className="donation-goal">
                          Mục tiêu: {formatCurrency(campaign.goal)}
                        </Typography>
                      </Box>
                      
                      <Box className="donation-progress-bar-container">
                        <Box 
                          className="donation-progress-bar" 
                          sx={{ width: `${calculateProgress(campaign.current, campaign.goal)}%` }}
                        />
                      </Box>
                      
                      <Box className="donation-progress-footer">
                        <Typography variant="body2" className="donation-days-left">
                          Còn {campaign.daysLeft} ngày
                        </Typography>
                        <Typography variant="body2" className="donation-percentage">
                          {calculateProgress(campaign.current, campaign.goal)}%
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Button 
                      component={Link} 
                      to="/donate" 
                      variant="contained" 
                      color="primary" 
                      className="donate-now-btn"
                    >
                      Quyên góp ngay
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Grid>
          
          {/* Events */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" className="subsection-title animate-slideInRight">
              Lịch Sự kiện
            </Typography>
            
            <Box className="events-list animate-slideInRight">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="event-card">
                  <Grid container>
                    <Grid item xs={4}>
                      <CardMedia
                        component="img"
                        height="100%"
                        image={event.imageUrl}
                        alt={event.title}
                        className="event-image"
                      />
                    </Grid>
                    <Grid item xs={8}>
                      <CardContent className="event-content">
                        <Typography variant="h6" className="event-title">
                          {event.title}
                        </Typography>
                        
                        <Box className="event-info">
                          <Box className="event-info-item">
                            <CalendarMonth fontSize="small" />
                            <Typography variant="body2">{formatDate(event.date)}</Typography>
                          </Box>
                          
                          <Box className="event-info-item">
                            <LocationOn fontSize="small" />
                            <Typography variant="body2">{event.location}</Typography>
                          </Box>
                          
                          <Box className="event-info-item">
                            <People fontSize="small" />
                            <Typography variant="body2">{event.participants} người tham gia</Typography>
                          </Box>
                        </Box>
                        
                        <Button 
                          component={Link} 
                          to={`/event/${event.id}`} 
                          variant="outlined" 
                          color="primary" 
                          className="view-event-btn"
                        >
                          Xem chi tiết
                        </Button>
                      </CardContent>
                    </Grid>
                  </Grid>
                </Card>
              ))}
              
              <Box className="view-all-events">
                <Button 
                  component={Link} 
                  to="/event" 
                  variant="contained" 
                  color="primary" 
                  className="view-all-btn"
                >
                  Xem tất cả sự kiện
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        {/* Call-to-Action */}
        <Box className="home-cta-container animate-fadeIn">
          <Typography variant="h4" className="cta-title">
            Hãy chung tay vì những người bạn bốn chân
          </Typography>
          <Box className="cta-buttons">
            <Button 
              component={Link} 
              to="/rescue" 
              variant="contained" 
              color="primary" 
              className="cta-button rescue-btn"
            >
              Gửi yêu cầu cứu hộ
            </Button>
            <Button 
              component={Link} 
              to="/volunteer" 
              variant="outlined" 
              color="primary" 
              className="cta-button volunteer-btn"
            >
              Chia sẻ yêu thương
            </Button>
          </Box>
        </Box>
      </Container>
    </section>
  );
};

export default DonationEventSection;