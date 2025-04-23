import React, { useState, useCallback, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  TextField, 
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardMedia,
  CardContent,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { Link } from 'react-router-dom';
import './VideoList.css';

const VideoList = ({ videos }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((e) => {
    setCategoryFilter(e.target.value);
  }, []);

  const filteredVideos = useMemo(() => {
    return videos.filter(video => {
      const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === '' || video.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [videos, searchTerm, categoryFilter]);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(videos.map(video => video.category))];
    return uniqueCategories.map(category => {
      const formattedCategory = category.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      
      return { value: category, label: formattedCategory };
    });
  }, [videos]);

  return (
    <Box className="video-list-container">
      <Box className="video-filters">
        <TextField
          placeholder="Tìm kiếm video..."
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          className="search-field"
        />
        
        <FormControl variant="outlined" className="category-filter">
          <InputLabel>Danh mục</InputLabel>
          <Select
            value={categoryFilter}
            onChange={handleCategoryChange}
            label="Danh mục"
          >
            <MenuItem value="">Tất cả</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.value} value={category.value}>
                {category.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {filteredVideos.length > 0 ? (
        <Grid container spacing={3} className="videos-grid">
          {filteredVideos.map((video) => (
            <Grid item xs={12} sm={6} md={4} key={video.id}>
              <Card className="video-card">
                <Link to={`/listVideo/${video.id}`} className="video-link">
                  <Box className="video-thumbnail-container">
                    <CardMedia
                      component="img"
                      image={video.thumbnail || 'https://source.unsplash.com/random/300x200/?pet'}
                      alt={video.title}
                      className="video-thumbnail"
                    />
                    <Box className="play-icon-overlay">
                      <PlayCircleOutlineIcon className="play-icon" />
                    </Box>
                    <Chip 
                      label={video.duration} 
                      size="small" 
                      className="duration-chip" 
                    />
                  </Box>
                  <CardContent className="video-content">
                    <Typography variant="h6" className="video-title">
                      {video.title}
                    </Typography>
                    <Chip 
                      label={categories.find(cat => cat.value === video.category)?.label || video.category} 
                      size="small" 
                      className="video-category-chip" 
                    />
                  </CardContent>
                </Link>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box className="no-videos">
          <Typography variant="h6">
            Không tìm thấy video phù hợp
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Hãy thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default VideoList;
