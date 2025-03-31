import React from 'react';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  Button, 
  CardActions 
} from '@mui/material';
import { 
  Pets as PetsIcon, 
  Cake as CakeIcon, 
  Male as MaleIcon, 
  Female as FemaleIcon 
} from '@mui/icons-material';

const PetCard = ({ pet, onClick }) => {
  // Xác định icon giới tính
  const GenderIcon = pet.gender === 'male' ? MaleIcon : FemaleIcon;
  
  // Xác định màu sắc cho trạng thái
  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'pending':
        return 'warning';
      case 'adopted':
        return 'error';
      default:
        return 'default';
    }
  };
  
  // Chuyển đổi trạng thái sang tiếng Việt
  const getStatusText = (status) => {
    switch (status) {
      case 'available':
        return 'Sẵn sàng nhận nuôi';
      case 'pending':
        return 'Đang xử lý';
      case 'adopted':
        return 'Đã được nhận nuôi';
      default:
        return status;
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 6,
        }
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={pet.imageUrl}
        alt={pet.name}
        sx={{ objectFit: 'cover' }}
      />
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" component="div">
            {pet.name}
          </Typography>
          <Chip 
            label={getStatusText(pet.status)} 
            color={getStatusColor(pet.status)} 
            size="small" 
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {pet.breed}
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          <Chip 
            icon={<PetsIcon />} 
            label={pet.type === 'dog' ? 'Chó' : pet.type === 'cat' ? 'Mèo' : pet.type} 
            size="small" 
            variant="outlined" 
          />
          <Chip 
            icon={<CakeIcon />} 
            label={pet.age} 
            size="small" 
            variant="outlined" 
          />
          <Chip 
            icon={<GenderIcon />} 
            label={pet.gender === 'male' ? 'Đực' : 'Cái'} 
            size="small" 
            variant="outlined" 
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, display: '-webkit-box', overflow: 'hidden', textOverflow: 'ellipsis', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
          {pet.description}
        </Typography>
      </CardContent>
      
      <CardActions>
        <Button 
          size="small" 
          color="primary" 
          onClick={onClick}
          fullWidth
          variant="contained"
        >
          Xem chi tiết
        </Button>
      </CardActions>
    </Card>
  );
};

export default PetCard;