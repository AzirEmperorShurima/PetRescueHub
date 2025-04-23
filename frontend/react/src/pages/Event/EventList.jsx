import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, Pagination } from '@mui/material';
import EventCard from './componet/EventCard';
import { events } from '../../mocks';
import './Event.css';

const EventList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const eventsPerPage = 9;

  useEffect(() => {
    // Sắp xếp sự kiện theo ngày (gần nhất trước)
    const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
    setFilteredEvents(sortedEvents);
  }, []);

  // Tính toán sự kiện hiển thị trên trang hiện tại
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    // Cuộn lên đầu trang khi chuyển trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container maxWidth="lg" className="event-list-container">
      <Typography variant="h4" component="h1" gutterBottom align="center" className="event-list-title">
        Sự kiện sắp diễn ra
      </Typography>
      
      <Typography variant="body1" paragraph align="center" className="event-list-subtitle">
        Tham gia các sự kiện của chúng tôi để gặp gỡ cộng đồng yêu thú cưng
      </Typography>
      
      <Box my={4}>
        <Grid container spacing={3}>
          {currentEvents.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <EventCard event={event} />
            </Grid>
          ))}
        </Grid>
      </Box>
      
      {/* Hiển thị thông tin về số lượng sự kiện */}
      <Box display="flex" justifyContent="center" mb={2}>
        <Typography variant="body2" color="textSecondary">
          Hiển thị {indexOfFirstEvent + 1}-{Math.min(indexOfLastEvent, filteredEvents.length)} trong tổng số {filteredEvents.length} sự kiện
        </Typography>
      </Box>
      
      {/* Phân trang */}
      <Box display="flex" justifyContent="center" mb={4}>
        <Pagination 
          count={totalPages} 
          page={currentPage} 
          onChange={handlePageChange} 
          color="primary" 
          size="large"
        />
      </Box>
    </Container>
  );
};

export default EventList;