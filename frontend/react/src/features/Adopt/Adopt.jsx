import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Button, 
  Divider,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import { Link } from 'react-router-dom';

// Import các components dùng chung
import { ContentCard, SearchBar, TagList } from '../../components/common';

const Adopt = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    age: '',
    gender: ''
  });

  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      try {
        // Trong thực tế, bạn sẽ gọi API thực sự
        // const response = await api.get('/pets');
        // setPets(response.data);
        
        // Dữ liệu mẫu
        setTimeout(() => {
          setPets([
            { 
              id: 1, 
              name: 'Buddy', 
              type: 'dog',
              breed: 'Golden Retriever',
              age: '2 tuổi', 
              gender: 'male',
              description: 'Chó Golden Retriever thân thiện, năng động và rất thích chơi đùa với trẻ em.', 
              image: 'https://images.pexels.com/photos/825949/pexels-photo-825949.jpeg',
              tags: ['chó', 'Golden Retriever', 'thân thiện']
            },
            { 
              id: 2, 
              name: 'Whiskers', 
              type: 'cat',
              breed: 'Xiêm',
              age: '1 tuổi', 
              gender: 'female',
              description: 'Mèo Xiêm đáng yêu, điềm tĩnh và rất sạch sẽ.', 
              image: 'https://images.pexels.com/photos/4587993/pexels-photo-4587993.jpeg',
              tags: ['mèo', 'Xiêm', 'điềm tĩnh']
            },
            // ... thêm dữ liệu mẫu khác
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching pets:', error);
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      age: '',
      gender: ''
    });
    setSearchTerm('');
    setPage(1);
  };

  // Lọc dữ liệu theo từ khóa tìm kiếm và bộ lọc
  const filteredPets = pets.filter(pet => {
    const matchesSearch = 
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filters.type ? pet.type === filters.type : true;
    const matchesAge = filters.age ? pet.age.includes(filters.age) : true;
    const matchesGender = filters.gender ? pet.gender === filters.gender : true;
    
    return matchesSearch && matchesType && matchesAge && matchesGender;
  });

  // Tính toán dữ liệu hiển thị trên trang hiện tại
  const petsPerPage = 6;
  const startIndex = (page - 1) * petsPerPage;
  const displayedPets = filteredPets.slice(startIndex, startIndex + petsPerPage);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
          Nhận nuôi thú cưng
        </Typography>
        <Typography variant="body1">
          Tìm kiếm người bạn đồng hành mới cho gia đình bạn. Tất cả các thú cưng đều đã được tiêm phòng và kiểm tra sức khỏe.
        </Typography>
      </Box>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <SearchBar 
            placeholder="Tìm kiếm thú cưng..." 
            onSearch={handleSearch}
            initialValue={searchTerm}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Loại</InputLabel>
              <Select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                label="Loại"
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="dog">Chó</MenuItem>
                <MenuItem value="cat">Mèo</MenuItem>
                <MenuItem value="other">Khác</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Tuổi</InputLabel>
              <Select
                name="age"
                value={filters.age}
                onChange={handleFilterChange}
                label="Tuổi"
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="0">Dưới 1 tuổi</MenuItem>
                <MenuItem value="1">1-3 tuổi</MenuItem>
                <MenuItem value="3">Trên 3 tuổi</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Giới tính</InputLabel>
              <Select
                name="gender"
                value={filters.gender}
                onChange={handleFilterChange}
                label="Giới tính"
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="male">Đực</MenuItem>
                <MenuItem value="female">Cái</MenuItem>
              </Select>
            </FormControl>
            
            <Button 
              variant="outlined" 
              onClick={clearFilters}
              disabled={!searchTerm && !filters.type && !filters.age && !filters.gender}
            >
              Xóa bộ lọc
            </Button>
          </Box>
        </Grid>
      </Grid>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <Typography>Đang tải...</Typography>
        </Box>
      ) : filteredPets.length === 0 ? (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h6">Không tìm thấy thú cưng nào</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={clearFilters}
            sx={{ mt: 2 }}
          >
            Xóa bộ lọc
          </Button>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {displayedPets.map((pet) => (
              <Grid item xs={12} sm={6} md={4} key={pet.id}>
                <ContentCard
                  title={pet.name}
                  content={pet.description}
                  image={pet.image}
                  tags={pet.tags}
                  sx={{ height: '100%' }}
                >
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <span style={{ fontWeight: 'bold', marginRight: '8px' }}>Loại:</span> 
                      {pet.type === 'dog' ? 'Chó' : pet.type === 'cat' ? 'Mèo' : 'Khác'}
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <span style={{ fontWeight: 'bold', marginRight: '8px' }}>Giống:</span> {pet.breed}
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <span style={{ fontWeight: 'bold', marginRight: '8px' }}>Tuổi:</span> {pet.age}
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <span style={{ fontWeight: 'bold', marginRight: '8px' }}>Giới tính:</span> 
                      {pet.gender === 'male' ? 'Đực' : 'Cái'}
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Link to={`/adopt/${pet.id}`} style={{ textDecoration: 'none' }}>
                      <Button variant="contained" color="primary" fullWidth>
                        Nhận nuôi
                      </Button>
                    </Link>
                  </Box>
                </ContentCard>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination 
              count={Math.ceil(filteredPets.length / petsPerPage)} 
              page={page} 
              onChange={handlePageChange} 
              color="primary" 
            />
          </Box>
        </>
      )}
    </Container>
  );
};

export default Adopt;