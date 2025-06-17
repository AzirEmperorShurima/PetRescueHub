import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  Paper, 
  Chip, 
  Divider, 
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import './VideoDetail.css';

const VideoDetail = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // In a real app, this would be an API call
  const fetchVideoData = useCallback(async () => {
    setLoading(true);
    
    // Simulating API call with timeout
    setTimeout(() => {
      // Sample video data
      const videoData = {
        id: parseInt(id),
        title: 'Cách huấn luyện chó cơ bản cho người mới bắt đầu',
        description: 'Trong video này, chúng ta sẽ tìm hiểu về các kỹ thuật huấn luyện chó cơ bản mà bất kỳ chủ nuôi nào cũng nên biết. Từ các lệnh cơ bản như ngồi, nằm, đứng yên đến cách thưởng và khuyến khích đúng cách.',
        url: 'https://www.youtube.com/embed/1ypyzSHJK-o',
        thumbnail: 'https://i.ytimg.com/vi/1ypyzSHJK-o/maxresdefault.jpg',
        duration: '15:30',
        category: 'dog-training',
        publishDate: '2023-05-15',
        views: 12500,
        author: 'Pet Training Pro'
      };
      
      // Sample related videos
      const relatedVideosData = [
        {
          id: 2,
          title: 'Chăm sóc mèo con trong tháng đầu tiên',
          thumbnail: 'https://i.ytimg.com/vi/KHmIVS0IWPk/maxresdefault.jpg',
          duration: '12:45',
          category: 'cat-care'
        },
        {
          id: 3,
          title: 'Dấu hiệu nhận biết thú cưng bị bệnh',
          thumbnail: 'https://i.ytimg.com/vi/YMvS4zpH3ZM/maxresdefault.jpg',
          duration: '18:20',
          category: 'health'
        },
        {
          id: 4,
          title: 'Cách tắm cho chó đúng cách',
          thumbnail: 'https://i.ytimg.com/vi/EPcim_LoZrk/maxresdefault.jpg',
          duration: '10:15',
          category: 'dog-care'
        }
      ];
      
      setVideo(videoData);
      setRelatedVideos(relatedVideosData);
      setLoading(false);
    }, 800); // Simulating network delay
  }, [id]);

  useEffect(() => {
    fetchVideoData();
    // Scroll to top when component mounts or id changes
    window.scrollTo(0, 0);
  }, [fetchVideoData, id]);

  if (loading) {
    return (
      <Container maxWidth="lg" className="video-detail-container">
        <Box className="video-detail-loading">
          <div className="loading-animation"></div>
          <Typography variant="h6">Đang tải video...</Typography>
        </Box>
      </Container>
    );
  }

  if (!video) {
    return (
      <Container maxWidth="lg" className="video-detail-container">
        <Box className="video-not-found">
          <Typography variant="h5">Video không tồn tại</Typography>
          <Button 
            component={Link} 
            to="/pet-guide" 
            variant="contained" 
            startIcon={<ArrowBackIcon />}
          >
            Quay lại danh sách video
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="video-detail-container">
      <Button 
        component={Link} 
        to="/pet-guide" 
        startIcon={<ArrowBackIcon />}
        className="back-button"
      >
        Quay lại danh sách
      </Button>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} className="video-player-wrapper">
            <div className="video-responsive">
              <iframe
                width="853"
                height="480"
                src={video.url}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={video.title}
              />
            </div>
            
            <Box className="video-info">
              <Typography variant="h4" className="video-title">
                {video.title}
              </Typography>
              
              <Box className="video-meta">
                <Chip 
                  label={`${video.views.toLocaleString()} lượt xem`} 
                  size="small" 
                  className="meta-chip views-chip" 
                />
                <Chip 
                  label={`Đăng ngày: ${video.publishDate}`} 
                  size="small" 
                  className="meta-chip date-chip" 
                />
                <Chip 
                  label={video.category.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')} 
                  size="small" 
                  className="meta-chip category-chip" 
                />
              </Box>
              
              <Divider className="video-divider" />
              
              <Box className="author-info">
                <Typography variant="subtitle1" className="author-name">
                  Tác giả: {video.author}
                </Typography>
              </Box>
              
              <Typography variant="body1" className="video-description">
                {video.description}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Box className="related-videos-section">
            <Typography variant="h6" className="related-title">
              Video liên quan
            </Typography>
            
            <Box className="related-videos-list">
              {relatedVideos.map((relatedVideo) => (
                <Card 
                  key={relatedVideo.id} 
                  className="related-video-card"
                  component={Link}
                  to={`/listVideo/${relatedVideo.id}`}
                >
                  <Box className="related-thumbnail-container">
                    <CardMedia
                      component="img"
                      image={relatedVideo.thumbnail}
                      alt={relatedVideo.title}
                      className="related-thumbnail"
                    />
                    <Box className="related-play-overlay">
                      <PlayCircleOutlineIcon className="related-play-icon" />
                    </Box>
                    <Chip 
                      label={relatedVideo.duration} 
                      size="small" 
                      className="related-duration-chip" 
                    />
                  </Box>
                  
                  <CardContent className="related-content">
                    <Typography variant="subtitle1" className="related-video-title">
                      {relatedVideo.title}
                    </Typography>
                    <Chip 
                      label={relatedVideo.category.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')} 
                      size="small" 
                      className="related-category-chip" 
                    />
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default VideoDetail;
