import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Button, 
  Divider,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAdopt } from '../../components/hooks/useAdopt';
import PetFilters from '../../features/Adopt/components/PetFilters';
import PetCard from '../../features/Adopt/components/PetCard';
import PetSkeleton from '../../features/Adopt/components/PetSkeleton';
import './Adopt.css';

const Adopt = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Sử dụng custom hook
  const {
    pets,
    loading,
    searchTerm,
    filters,
    sortBy,
    handleSearchChange,
    handleFilterChange,
    handleSortChange,
    resetFilters
  } = useAdopt();

  const handlePetClick = (petId) => {
    navigate(`/adopt/${petId}`);
  };

  return (
    <Box className="adopt-page">
      <Container maxWidth="lg">
        <Box className="adopt-header" textAlign="center" mb={4}>
          <Typography variant="h3" component="h1" gutterBottom>
            Nhận nuôi thú cưng
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            Tìm kiếm người bạn đồng hành mới cho cuộc sống của bạn
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          {/* Sidebar with filters */}
          <Grid item xs={12} md={3}>
            <PetFilters 
              filters={filters}
              searchTerm={searchTerm}
              sortBy={sortBy}
              onSearchChange={handleSearchChange}
              onFilterChange={handleFilterChange}
              onSortChange={handleSortChange}
              onResetFilters={resetFilters}
            />
          </Grid>
          
          {/* Main content with pet cards */}
          <Grid item xs={12} md={9}>
            {loading ? (
              <Grid container spacing={3}>
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item}>
                    <PetSkeleton />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h6">
                    {pets.length} thú cưng đang tìm nhà
                  </Typography>
                </Box>
                
                {pets.length > 0 ? (
                  <Grid container spacing={3}>
                    {pets.map((pet) => (
                      <Grid item xs={12} sm={6} md={4} key={pet.id}>
                        <PetCard 
                          pet={pet} 
                          onClick={() => handlePetClick(pet.id)} 
                        />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box textAlign="center" py={5}>
                    <Typography variant="h6" gutterBottom>
                      Không tìm thấy thú cưng nào phù hợp với tìm kiếm của bạn
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={resetFilters}
                      sx={{ mt: 2 }}
                    >
                      Xóa bộ lọc
                    </Button>
                  </Box>
                )}
              </>
            )}
          </Grid>
        </Grid>
        
        {/* Adoption process section */}
        <Box className="adoption-process" mt={8} mb={5}>
          <Typography variant="h4" textAlign="center" gutterBottom>
            Quy trình nhận nuôi
          </Typography>
          <Divider sx={{ mb: 4 }} />
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card elevation={2} sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image="/images/adopt-step1.jpg"
                  alt="Bước 1"
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    1. Tìm kiếm và liên hệ
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tìm kiếm thú cưng phù hợp với bạn và liên hệ với chúng tôi để đặt lịch gặp mặt.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card elevation={2} sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image="/images/adopt-step2.jpg"
                  alt="Bước 2"
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    2. Phỏng vấn và thăm nhà
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Chúng tôi sẽ phỏng vấn và kiểm tra môi trường sống để đảm bảo thú cưng sẽ có một ngôi nhà phù hợp.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card elevation={2} sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image="/images/adopt-step3.jpg"
                  alt="Bước 3"
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    3. Hoàn tất thủ tục
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ký kết giấy tờ nhận nuôi, đóng phí nhận nuôi và đón thú cưng về nhà mới.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Adopt;
