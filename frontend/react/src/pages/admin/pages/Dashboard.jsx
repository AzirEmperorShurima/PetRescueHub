import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent, CardHeader } from '@mui/material';
// import axios from 'axios';
import { fDateTime } from '../../../utils/format-time'; // Updated import path to .js file

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPets: 0,
    totalVolunteers: 0,
    totalDonations: 0,
    recentActivities: [],
    donationsCount: 0  // Add this new property to track number of donors
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Trong thực tế, bạn sẽ gọi API thực sự
        // const response = await axios.get('/api/admin/dashboard');
        // setStats(response.data);
        
        // Dữ liệu mẫu
        setStats({
          totalUsers: 120,
          totalPets: 45,
          totalVolunteers: 30,
          totalDonations: 15000000,
          donationsCount: 25,  // Add this to represent number of donors
          recentActivities: [
            { id: 1, type: 'user_register', user: 'Nguyễn Văn A', timestamp: new Date() },
            { id: 2, type: 'pet_adopted', pet: 'Buddy', user: 'Trần Thị B', timestamp: new Date(Date.now() - 86400000) },
            { id: 3, type: 'donation', amount: 1000000, user: 'Lê Văn C', timestamp: new Date(Date.now() - 172800000) },
          ]
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const getActivityText = (activity) => {
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
  };

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