import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent, CardHeader } from '@mui/material';
import { fDateTime } from '../../../utils/format-time';
// Import mock data
import { users, pets, volunteers, donations } from '../../../mocks';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPets: 0,
    totalVolunteers: 0,
    totalDonations: 0,
    recentActivities: [],
    donationsCount: 0
  });

  // Sử dụng useCallback để tối ưu hàm fetchDashboardData
  const fetchDashboardData = useCallback(async () => {
    try {
      // Sử dụng mock data thay vì hardcode
      const recentActivities = [
        { id: 1, type: 'user_register', user: users[0].name, timestamp: new Date() },
        { id: 2, type: 'pet_adopted', pet: pets[0].name, user: users[1].name, timestamp: new Date(Date.now() - 86400000) },
        { id: 3, type: 'donation', amount: donations[0].amount, user: users[2].name, timestamp: new Date(Date.now() - 172800000) },
      ];

      setStats({
        totalUsers: users.length,
        totalPets: pets.length,
        totalVolunteers: volunteers.length,
        totalDonations: donations.reduce((sum, donation) => sum + donation.amount, 0),
        donationsCount: donations.length,
        recentActivities
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Sử dụng useMemo để tối ưu hàm getActivityText
  const getActivityText = useCallback((activity) => {
    switch (activity.type) {
      case 'user_register':
        return `${activity.user} đã đăng ký tài khoản`;
      case 'pet_adopted':
        return `${activity.user} đã nhận nuôi ${activity.pet}`;
      case 'donation':
        return `${activity.user} đã quyên góp ${activity.amount.toLocaleString()} VND`;
      default:
        return 'Hoạt động không xác định';
    }
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Tổng quan
      </Typography>
      
      <Grid container spacing={3}>
        {/* Thống kê */}
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#e3f2fd',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Người dùng
            </Typography>
            <Typography variant="h3" component="div">
              {stats.totalUsers}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#e8f5e9',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Thú cưng
            </Typography>
            <Typography variant="h3" component="div">
              {stats.totalPets}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#fff8e1',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Tình nguyện viên
            </Typography>
            <Typography variant="h3" component="div">
              {stats.totalVolunteers}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#fdf2f4',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Tổng người quyên góp
            </Typography>
            <Typography 
              component="p" 
              variant="h3" 
              sx={{ 
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {stats.donationsCount}
            </Typography>
          </Paper>
        </Grid>
        
        {/* Hoạt động gần đây */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Hoạt động gần đây" />
            <CardContent>
              {stats.recentActivities.length > 0 ? (
                stats.recentActivities.map((activity) => (
                  <Box key={activity.id} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
                    <Typography variant="body1">
                      {getActivityText(activity)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {fDateTime(activity.timestamp)}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography>Không có hoạt động nào gần đây</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;