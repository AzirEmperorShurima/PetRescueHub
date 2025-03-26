import React from 'react';
import { Box, Skeleton, Card, CardContent, CardActions } from '@mui/material';

const ForumSkeleton = () => {
  return (
    <Box>
      {[1, 2, 3].map((item) => (
        <Card key={item} sx={{ mb: 2 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={1}>
              <Skeleton variant="circular" width={40} height={40} />
              <Box ml={1} flex={1}>
                <Skeleton variant="text" width={120} />
                <Skeleton variant="text" width={80} />
              </Box>
            </Box>
            <Skeleton variant="text" height={32} />
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="rectangular" height={200} sx={{ mt: 2, mb: 2 }} />
            <Box display="flex" gap={1} mt={2}>
              <Skeleton variant="rounded" width={60} height={24} />
              <Skeleton variant="rounded" width={80} height={24} />
              <Skeleton variant="rounded" width={70} height={24} />
            </Box>
          </CardContent>
          <CardActions>
            <Box display="flex" width="100%" justifyContent="space-between">
              <Box display="flex" gap={2}>
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="circular" width={24} height={24} />
              </Box>
              <Box display="flex" gap={1}>
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="circular" width={24} height={24} />
              </Box>
            </Box>
          </CardActions>
        </Card>
      ))}
    </Box>
  );
};

export default ForumSkeleton;