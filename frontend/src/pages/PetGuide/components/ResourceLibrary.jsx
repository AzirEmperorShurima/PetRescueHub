import React, { useState, useMemo, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Chip,
  InputAdornment,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import ArticleIcon from '@mui/icons-material/Article';
import './ResourceLibrary.css';

const ResourceLibrary = ({ resources }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((e) => {
    setCategoryFilter(e.target.value);
  }, []);

  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === '' || resource.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [resources, searchTerm, categoryFilter]);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(resources.map(resource => resource.category))];
    return uniqueCategories.map(category => {
      const formattedCategory = category.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      
      return { value: category, label: formattedCategory };
    });
  }, [resources]);

  const getResourceIcon = useCallback((type) => {
    switch(type) {
      case 'pdf':
        return <PictureAsPdfIcon className="resource-type-icon pdf" />;
      case 'doc':
        return <DescriptionIcon className="resource-type-icon doc" />;
      case 'article':
        return <ArticleIcon className="resource-type-icon article" />;
      default:
        return <ArticleIcon className="resource-type-icon" />;
    }
  }, []);

  return (
    <Box className="resource-library">
      <Box className="resource-filters">
        <TextField
          placeholder="Tìm kiếm tài liệu..."
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

      {filteredResources.length > 0 ? (
        <Grid container spacing={3} className="resources-grid">
          {filteredResources.map((resource) => (
            <Grid item xs={12} sm={6} md={4} key={resource.id}>
              <Card className="resource-card">
                <CardMedia
                  component="img"
                  height="160"
                  image={resource.thumbnail || `https://source.unsplash.com/random/300x200/?${resource.category}`}
                  alt={resource.title}
                  className="resource-thumbnail"
                />
                <Box className="resource-type-badge">
                  {getResourceIcon(resource.type)}
                </Box>
                <CardContent className="resource-content">
                  <Typography variant="h6" className="resource-title">
                    {resource.title}
                  </Typography>
                  <Chip 
                    label={categories.find(cat => cat.value === resource.category)?.label || resource.category} 
                    size="small" 
                    className="resource-category-chip" 
                  />
                  <Box className="resource-actions">
                    <Button 
                      variant="contained" 
                      color="primary" 
                      href={resource.url}
                      target="_blank"
                      className="view-resource-btn"
                    >
                      {resource.type === 'article' ? 'Đọc bài viết' : 'Tải xuống'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box className="no-resources">
          <Typography variant="h6">
            Không tìm thấy tài liệu phù hợp
          </Typography>
          <Button 
            variant="outlined" 
            color="primary"
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('');
            }}
          >
            Xóa bộ lọc
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ResourceLibrary;