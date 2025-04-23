import React from 'react';
import { 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Button, 
  Chip, 
  Box
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const PetGrid = ({ pets }) => {
  if (!pets || pets.length === 0) {
    return (
      <Box className="empty-pets">
        <Typography variant="h5" gutterBottom>Hồ sơ thú cưng</Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Bạn chưa có hồ sơ thú cưng nào. Hãy thêm thú cưng đầu tiên của bạn!
        </Typography>
        <Button 
          variant="contained" 
          className="add-pet-button"
          startIcon={<AddIcon />}
        >
          Thêm thú cưng
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <div className="tab-header">
        <Typography variant="h5" className="tab-title">Hồ sơ thú cưng</Typography>
        <Button 
          variant="contained" 
          className="add-pet-button"
          startIcon={<AddIcon />}
        >
          Thêm thú cưng
        </Button>
      </div>
      
      <Grid container spacing={3} className="pets-grid">
        {pets.map((pet) => (
          <Grid item xs={12} sm={6} md={4} key={pet.id}>
            <Card className="pet-card">
              <div className="pet-image-container">
                <CardMedia
                  component="img"
                  className="pet-image"
                  image={pet.imageUrl || 'https://source.unsplash.com/random/300x200/?pet'}
                  alt={pet.name}
                />
                <div className="pet-type-badge">
                  <PetsIcon />
                </div>
              </div>
              
              <CardContent className="pet-info">
                <Typography variant="h6" className="pet-name">
                  {pet.name}
                </Typography>
                
                <div className="pet-details-row">
                  <Chip 
                    label={pet.age || '1 tuổi'} 
                    size="small" 
                    className="pet-age-chip" 
                  />
                  <Chip 
                    label={pet.breed || 'Không rõ giống'} 
                    size="small" 
                    className="pet-breed-chip" 
                  />
                </div>
                
                <Typography variant="body2" className="pet-description">
                  {pet.description || 'Một thú cưng đáng yêu đang cần được chăm sóc và yêu thương.'}
                </Typography>
              </CardContent>
              
              <CardActions className="pet-actions">
                <Button 
                  size="small" 
                  variant="outlined" 
                  startIcon={<VisibilityIcon />}
                  className="pet-action-button"
                >
                  Chi tiết
                </Button>
                <Button 
                  size="small" 
                  variant="contained" 
                  startIcon={<EditIcon />}
                  className="pet-action-button edit-profile-button"
                >
                  Chỉnh sửa
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PetGrid;