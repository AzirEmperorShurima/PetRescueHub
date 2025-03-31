import React from 'react';
import { Card, CardContent, CardActions, Skeleton, Box } from '@mui/material';

const PetSkeleton = () => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Skeleton variant="rectangular" height={200} animation="wave" />
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Skeleton variant="text" width="60%" height={32} animation="wave" />
          <Skeleton variant="rounded" width="30%" height={24} animation="wave" />
        </Box>
        
        <Skeleton variant="text" width="40%" height={20} animation="wave" />
        
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Skeleton variant="rounded" width={80} height={32} animation="wave" />
          <Skeleton variant="rounded" width={80} height={32} animation="wave" />
          <Skeleton variant="rounded" width={80} height={32} animation="wave" />
        </Box>
        
        <Box sx={{ mt: 2 }}>
          <Skeleton variant="text" animation="wave" />
          <Skeleton variant="text" animation="wave" />
          <Skeleton variant="text" width="80%" animation="wave" />
        </Box>
      </CardContent>
      
      <CardActions>
        <Skeleton variant="rectangular" height={36} width="100%" animation="wave" />
      </CardActions>
    </Card>
  );
};

export default PetSkeleton;