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

  // Xử lý lỗi tải ảnh
  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/300x200?text=Image+Error';
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
      <Box sx={{ position: 'relative', paddingTop: '75%', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          image={pet.image || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={pet.name}
          onError={handleImageError}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        <Chip
          label={getStatusText(pet.status)}
          color={getStatusColor(pet.status)}
          size="small"
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 1
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {pet.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <GenderIcon fontSize="small" color={pet.gender === 'male' ? 'primary' : 'secondary'} />
          <Typography variant="body2" sx={{ ml: 1 }}>
            {pet.gender === 'male' ? 'Đực' : 'Cái'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <CakeIcon fontSize="small" />
          <Typography variant="body2" sx={{ ml: 1 }}>
            {pet.age}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <PetsIcon fontSize="small" />
          <Typography variant="body2" sx={{ ml: 1 }}>
            {pet.breed}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 2,
            display: '-webkit-box',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {pet.description}
        </Typography>
      </CardContent>

      <CardActions>
        <Button
          size="small"
          variant="contained"
          fullWidth
          onClick={() => onClick(pet)}
        >
          Xem chi tiết
        </Button>
      </CardActions>
    </Card>
  );
};

export default PetCard;