import React, { useState, useCallback, useMemo } from 'react';
import { Container, Box, Typography, Tabs, Tab, useTheme, useMediaQuery, Paper } from '@mui/material';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import VideoList from './components/VideoList';
import ResourceLibrary from './components/ResourceLibrary';
import './PetGuide.css';

const PetGuide = () => {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Sample video data - in a real app, this would come from an API
  const videoData = useMemo(() => [
    {
      id: 1,
      title: 'Cách huấn luyện chó cơ bản cho người mới bắt đầu',
      thumbnail: 'https://i.ytimg.com/vi/1ypyzSHJK-o/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=1ypyzSHJK-o',
      duration: '15:30',
      category: 'dog-training'
    },
    {
      id: 2,
      title: 'Chăm sóc mèo con trong tháng đầu tiên',
      thumbnail: 'https://i.ytimg.com/vi/KHmIVS0IWPk/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=KHmIVS0IWPk',
      duration: '12:45',
      category: 'cat-care'
    },
    {
      id: 3,
      title: 'Dấu hiệu nhận biết thú cưng bị bệnh',
      thumbnail: 'https://i.ytimg.com/vi/YMvS4zpH3ZM/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=YMvS4zpH3ZM',
      duration: '18:20',
      category: 'health'
    },
    {
      id: 4,
      title: 'Cách tắm cho chó đúng cách',
      thumbnail: 'https://i.ytimg.com/vi/EPcim_LoZrk/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=EPcim_LoZrk',
      duration: '10:15',
      category: 'dog-care'
    },
    {
      id: 5,
      title: 'Dinh dưỡng cho thú cưng theo từng giai đoạn',
      thumbnail: 'https://i.ytimg.com/vi/QYlYuqMn_yA/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=QYlYuqMn_yA',
      duration: '22:30',
      category: 'nutrition'
    },
    {
      id: 6,
      title: 'Cách huấn luyện mèo đi vệ sinh đúng chỗ',
      thumbnail: 'https://i.ytimg.com/vi/P0t3EcGiqUM/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=P0t3EcGiqUM',
      duration: '08:45',
      category: 'cat-training'
    }
  ], []);

  // Sample resource data
  const resourceData = useMemo(() => [
    {
      id: 1,
      title: 'Cẩm nang chăm sóc chó con',
      type: 'pdf',
      thumbnail: '/images/resources/puppy-care.jpg',
      url: '/resources/puppy-care-guide.pdf',
      category: 'dog-care'
    },
    {
      id: 2,
      title: 'Hướng dẫn dinh dưỡng cho mèo',
      type: 'doc',
      thumbnail: '/images/resources/cat-nutrition.jpg',
      url: '/resources/cat-nutrition-guide.doc',
      category: 'cat-care'
    },
    {
      id: 3,
      title: 'Các bệnh thường gặp ở thú cưng và cách phòng tránh',
      type: 'article',
      thumbnail: '/images/resources/pet-health.jpg',
      url: '/blog/pet-common-diseases',
      category: 'health'
    },
    {
      id: 4,
      title: 'Lịch tiêm phòng cho chó mèo',
      type: 'pdf',
      thumbnail: '/images/resources/vaccination.jpg',
      url: '/resources/vaccination-schedule.pdf',
      category: 'health'
    },
    {
      id: 5,
      title: 'Kỹ thuật huấn luyện thú cưng nâng cao',
      type: 'article',
      thumbnail: '/images/resources/training.jpg',
      url: '/blog/advanced-pet-training',
      category: 'training'
    },
    {
      id: 6,
      title: 'Sổ tay thú y cơ bản',
      type: 'pdf',
      thumbnail: '/images/resources/vet-handbook.jpg',
      url: '/resources/basic-veterinary-handbook.pdf',
      category: 'health'
    }
  ], []);

  const handleTabChange = useCallback((event, newValue) => {
    setActiveTab(newValue);
  }, []);

  return (
    <Container maxWidth="xl" className="pet-guide-container">
      <Box className="pet-guide-header">
        <Typography variant="h3" component="h1" className="page-title">
          Hướng dẫn chăm sóc thú cưng
        </Typography>
        <Typography variant="subtitle1" className="page-subtitle">
          Khám phá các hướng dẫn, video và tài liệu để chăm sóc thú cưng của bạn tốt nhất
        </Typography>
      </Box>

      <Paper elevation={3} className="content-wrapper">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant={isMobile ? "fullWidth" : "standard"}
          centered
          className="guide-tabs"
        >
          <Tab 
            icon={<VideoLibraryIcon />} 
            label="Video hướng dẫn" 
            className="guide-tab"
          />
          <Tab 
            icon={<MenuBookIcon />} 
            label="Tài liệu & Bài đọc" 
            className="guide-tab"
          />
        </Tabs>

        <Box className="tab-content">
          {activeTab === 0 && (
            <VideoList videos={videoData} />
          )}
          {activeTab === 1 && (
            <ResourceLibrary resources={resourceData} />
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default PetGuide;