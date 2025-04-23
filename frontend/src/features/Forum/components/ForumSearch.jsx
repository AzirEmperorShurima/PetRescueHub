import React from 'react';
import { 
  Box, 
  TextField, 
  InputAdornment, 
  Button, 
  IconButton, 
  Menu, 
  MenuItem,
  Typography // Add Typography import
} from '@mui/material';
import { 
  Search as SearchIcon, 
  FilterList as FilterIcon 
} from '@mui/icons-material';
import PropTypes from 'prop-types';

const ForumSearch = ({ 
  searchTerm, 
  onSearchChange, 
  filterAnchorEl, 
  onFilterClick, 
  onFilterClose, 
  onSortChange, 
  onCategoryChange, 
  sortBy, 
  categoryFilter, 
  categories,
  displayStyle = 'horizontal'
}) => {
  if (displayStyle === 'horizontal') {
    return (
      <Box display="flex" alignItems="center" mb={3}>
        <TextField
          placeholder="Tìm kiếm trong diễn đàn..."
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={onSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="outlined"
          color="primary"
          startIcon={<FilterIcon />}
          onClick={onFilterClick}
          sx={{ ml: 1, whiteSpace: 'nowrap' }}
        >
          Lọc
        </Button>
        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={onFilterClose}
        >
          <MenuItem disabled>
            <Typography variant="subtitle2">Sắp xếp theo</Typography>
          </MenuItem>
          <MenuItem onClick={() => onSortChange('newest')}>
            Mới nhất
          </MenuItem>
          <MenuItem onClick={() => onSortChange('oldest')}>
            Cũ nhất
          </MenuItem>
          <MenuItem onClick={() => onSortChange('mostLiked')}>
            Nhiều lượt thích nhất
          </MenuItem>
          <MenuItem onClick={() => onSortChange('mostCommented')}>
            Nhiều bình luận nhất
          </MenuItem>
          <MenuItem onClick={() => onSortChange('mostViewed')}>
            Nhiều lượt xem nhất
          </MenuItem>
        </Menu>
      </Box>
    );
  }

  return (
    <Box mb={3}>
      <TextField
        placeholder="Tìm kiếm..."
        variant="outlined"
        size="small"
        fullWidth
        value={searchTerm}
        onChange={onSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton size="small" onClick={onFilterClick}>
                <FilterIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={onFilterClose}
      >
        <MenuItem disabled>
          <Typography variant="subtitle2">Sắp xếp theo</Typography>
        </MenuItem>
        <MenuItem 
          onClick={() => onSortChange('newest')}
          selected={sortBy === 'newest'}
        >
          Mới nhất
        </MenuItem>
        <MenuItem 
          onClick={() => onSortChange('oldest')}
          selected={sortBy === 'oldest'}
        >
          Cũ nhất
        </MenuItem>
        <MenuItem 
          onClick={() => onSortChange('mostLiked')}
          selected={sortBy === 'mostLiked'}
        >
          Nhiều lượt thích nhất
        </MenuItem>
        <MenuItem 
          onClick={() => onSortChange('mostCommented')}
          selected={sortBy === 'mostCommented'}
        >
          Nhiều bình luận nhất
        </MenuItem>
        <MenuItem 
          onClick={() => onSortChange('mostViewed')}
          selected={sortBy === 'mostViewed'}
        >
          Nhiều lượt xem nhất
        </MenuItem>
      </Menu>
    </Box>
  );
};

ForumSearch.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  filterAnchorEl: PropTypes.object,
  onFilterClick: PropTypes.func.isRequired,
  onFilterClose: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  categoryFilter: PropTypes.string.isRequired,
  categories: PropTypes.array.isRequired,
  displayStyle: PropTypes.oneOf(['horizontal', 'vertical'])
};

export default ForumSearch;