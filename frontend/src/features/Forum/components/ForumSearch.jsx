import React from 'react';
import { 
  Box, 
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Button, 
  IconButton, 
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Text,
  HStack,
  useColorModeValue
} from '@chakra-ui/react';
import { 
  FaSearch, 
  FaFilter 
} from 'react-icons/fa';
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
  // Color mode values
  const inputBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const menuBg = useColorModeValue('white', 'gray.800');
  const selectedBg = useColorModeValue('blue.50', 'blue.900');
  const selectedColor = useColorModeValue('blue.600', 'blue.200');

  const FilterMenu = () => (
    <Menu onClose={onFilterClose}>
      <MenuButton
        as={displayStyle === 'horizontal' ? Button : IconButton}
        variant={displayStyle === 'horizontal' ? 'outline' : 'ghost'}
        colorScheme="blue"
        size="sm"
        leftIcon={displayStyle === 'horizontal' ? <FaFilter /> : undefined}
        icon={displayStyle === 'vertical' ? <FaFilter /> : undefined}
        onClick={onFilterClick}
      >
        {displayStyle === 'horizontal' ? 'Lọc' : undefined}
      </MenuButton>
      <MenuList bg={menuBg} borderColor={borderColor}>
        <MenuItem isDisabled _hover={{}}>
          <Text fontSize="sm" fontWeight="semibold" color="gray.500">
            Sắp xếp theo
          </Text>
        </MenuItem>
        <MenuDivider />
        <MenuItem 
          onClick={() => onSortChange('newest')}
          bg={sortBy === 'newest' ? selectedBg : 'transparent'}
          color={sortBy === 'newest' ? selectedColor : 'inherit'}
          _hover={{ bg: sortBy === 'newest' ? selectedBg : 'gray.100' }}
        >
          Mới nhất
        </MenuItem>
        <MenuItem 
          onClick={() => onSortChange('oldest')}
          bg={sortBy === 'oldest' ? selectedBg : 'transparent'}
          color={sortBy === 'oldest' ? selectedColor : 'inherit'}
          _hover={{ bg: sortBy === 'oldest' ? selectedBg : 'gray.100' }}
        >
          Cũ nhất
        </MenuItem>
        <MenuItem 
          onClick={() => onSortChange('mostLiked')}
          bg={sortBy === 'mostLiked' ? selectedBg : 'transparent'}
          color={sortBy === 'mostLiked' ? selectedColor : 'inherit'}
          _hover={{ bg: sortBy === 'mostLiked' ? selectedBg : 'gray.100' }}
        >
          Nhiều lượt thích nhất
        </MenuItem>
        <MenuItem 
          onClick={() => onSortChange('mostCommented')}
          bg={sortBy === 'mostCommented' ? selectedBg : 'transparent'}
          color={sortBy === 'mostCommented' ? selectedColor : 'inherit'}
          _hover={{ bg: sortBy === 'mostCommented' ? selectedBg : 'gray.100' }}
        >
          Nhiều bình luận nhất
        </MenuItem>
      </MenuList>
    </Menu>
  );

  if (displayStyle === 'horizontal') {
    return (
      <HStack spacing={3} mb={6} w="100%">
        <InputGroup size="md" flex="1">
          <InputLeftElement pointerEvents="none">
            <FaSearch color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Tìm kiếm trong diễn đàn..."
            value={searchTerm}
            onChange={onSearchChange}
            bg={inputBg}
            borderColor={borderColor}
            _hover={{ borderColor: 'blue.300' }}
            _focus={{ 
              borderColor: 'blue.500', 
              boxShadow: '0 0 0 1px blue.500' 
            }}
          />
        </InputGroup>
        <FilterMenu />
      </HStack>
    );
  }

  return (
    <Box mb={6}>
      <InputGroup size="md" mb={4}>
        <InputLeftElement pointerEvents="none">
          <FaSearch color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={onSearchChange}
          bg={inputBg}
          borderColor={borderColor}
          _hover={{ borderColor: 'blue.300' }}
          _focus={{ 
            borderColor: 'blue.500', 
            boxShadow: '0 0 0 1px blue.500' 
          }}
        />
        <InputRightElement>
          <FilterMenu />
        </InputRightElement>
      </InputGroup>
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