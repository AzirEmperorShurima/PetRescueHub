import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button, 
  Divider 
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const PetFilters = ({ 
  filters, 
  searchTerm, 
  sortBy, 
  onSearchChange, 
  onFilterChange, 
  onSortChange, 
  onResetFilters 
}) => {
  return (
    <Paper 
      elevation={1} 
      sx={{ 
        p: 2,
        position: 'sticky',
        top: '80px', // Điều chỉnh giá trị này tùy theo chiều cao của navbar
        maxHeight: 'calc(100vh - 100px)',
        overflowY: 'auto'
      }}
    >
      <Typography variant="h6" gutterBottom>
        Tìm kiếm
      </Typography>
      
      <TextField
        fullWidth
        placeholder="Tìm kiếm thú cưng..."
        value={searchTerm}
        onChange={onSearchChange}
        InputProps={{
          startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
        }}
        variant="outlined"
        size="small"
        sx={{ mb: 3 }}
      />
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="h6" gutterBottom>
        Bộ lọc
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Loại thú cưng</InputLabel>
          <Select
            value={filters.type}
            label="Loại thú cưng"
            onChange={(e) => onFilterChange('type', e.target.value)}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="dog">Chó</MenuItem>
            <MenuItem value="cat">Mèo</MenuItem>
            <MenuItem value="other">Khác</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl fullWidth size="small">
          <InputLabel>Độ tuổi</InputLabel>
          <Select
            value={filters.age}
            label="Độ tuổi"
            onChange={(e) => onFilterChange('age', e.target.value)}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="baby">Sơ sinh (0-6 tháng)</MenuItem>
            <MenuItem value="young">Trẻ (6 tháng - 2 năm)</MenuItem>
            <MenuItem value="adult">Trưởng thành (2-8 năm)</MenuItem>
            <MenuItem value="senior">Già (8+ năm)</MenuItem>
            <MenuItem value="senior">Khác </MenuItem>
          </Select>
        </FormControl>
        
        <FormControl fullWidth size="small">
          <InputLabel>Giới tính</InputLabel>
          <Select
            value={filters.gender}
            label="Giới tính"
            onChange={(e) => onFilterChange('gender', e.target.value)}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="male">Đực</MenuItem>
            <MenuItem value="female">Cái</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl fullWidth size="small">
          <InputLabel>Kích thước</InputLabel>
          <Select
            value={filters.size}
            label="Kích thước"
            onChange={(e) => onFilterChange('size', e.target.value)}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="small">Nhỏ</MenuItem>
            <MenuItem value="medium">Trung bình</MenuItem>
            <MenuItem value="large">Lớn</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="h6" gutterBottom>
        Sắp xếp
      </Typography>
      
      <FormControl fullWidth size="small">
        <InputLabel>Sắp xếp theo</InputLabel>
        <Select
          value={sortBy}
          label="Sắp xếp theo"
          onChange={(e) => onSortChange(e.target.value)}
        >
          <MenuItem value="newest">Mới nhất</MenuItem>
          <MenuItem value="oldest">Cũ nhất</MenuItem>
          <MenuItem value="nameAsc">Tên (A-Z)</MenuItem>
          <MenuItem value="nameDesc">Tên (Z-A)</MenuItem>
        </Select>
      </FormControl>
      
      <Button 
        fullWidth 
        variant="outlined" 
        color="primary" 
        onClick={onResetFilters}
        sx={{ mt: 3 }}
      >
        Xóa bộ lọc
      </Button>
    </Paper>
  );
};

export default PetFilters;