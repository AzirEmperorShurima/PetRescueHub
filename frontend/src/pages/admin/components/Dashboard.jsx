import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Card,
  CardContent,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  People as PeopleIcon,
  Pets as PetsIcon,
  VolunteerActivism as VolunteerIcon,
  Article as ArticleIcon,
  TrendingUp as TrendingUpIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler
} from 'chart.js';
import axios from 'axios';

// Đăng ký các components của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPets: 0,
    totalVolunteers: 0,
    totalPosts: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log('Đang tải dữ liệu dashboard...');
      const [usersRes, petsRes, volunteersRes, postsRes, activitiesRes] = await Promise.all([
        axios.get('/api/users/count'),
        axios.get('/api/pets/count'),
        axios.get('/api/volunteers/count'),
        axios.get('/api/posts/count'),
        // axios.get('/api/activities/recent')
      ]);

      console.log('Dữ liệu nhận được:', {
        users: usersRes.data,
        pets: petsRes.data,
        volunteers: volunteersRes.data,
        posts: postsRes.data,
        activities: activitiesRes.data
      });

      setStats({
        totalUsers: usersRes.data.count || 0,
        totalPets: petsRes.data.count || 0,
        totalVolunteers: volunteersRes.data.count || 0,
        totalPosts: postsRes.data.count || 0
      });
      setRecentActivities(activitiesRes.data || []);

      // Chuẩn bị dữ liệu cho biểu đồ
      const labels = ['Người dùng', 'Thú cưng', 'Tình nguyện viên', 'Bài viết'];
      const data = [
        usersRes.data.count || 0,
        petsRes.data.count || 0,
        volunteersRes.data.count || 0,
        postsRes.data.count || 0
      ];

      setChartData({
        labels,
        datasets: [
          {
            label: 'Thống kê tổng quan',
            data,
            backgroundColor: [
              'rgba(54, 162, 235, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(153, 102, 255, 0.6)'
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
          }
        ]
      });
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu dashboard:', error);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%', bgcolor: 'background.paper' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: `${color}.light`, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Thống kê tổng quan' }
    },
    scales: { y: { beginAtZero: true } }
  };

  // Xử lý recentActivities để đảm bảo nó luôn là một mảng
  const processedActivities = useMemo(() => {
    if (!recentActivities) return [];
    return Array.isArray(recentActivities) ? recentActivities : [];
  }, [recentActivities]);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {/* Thống kê */}
        <Grid item xs={12} md={3}>
          <StatCard
            title="Tổng người dùng"
            value={stats.totalUsers}
            icon={<PeopleIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Tổng thú cưng"
            value={stats.totalPets}
            icon={<PetsIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Tổng tình nguyện viên"
            value={stats.totalVolunteers}
            icon={<VolunteerIcon />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Tổng bài viết"
            value={stats.totalPosts}
            icon={<ArticleIcon />}
            color="info"
          />
        </Grid>

        {/* Biểu đồ */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Biểu đồ thống kê
              </Typography>
              <Box sx={{ height: 400 }}>
                <Bar data={chartData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Biểu đồ tròn */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Phân bố
              </Typography>
              <Box sx={{ height: 400 }}>
                <Doughnut data={chartData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Hoạt động gần đây */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Hoạt động gần đây</Typography>
                <Tooltip title="Xem thêm">
                  <IconButton size="small">
                    <MoreVertIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <List>
                {processedActivities.map((activity, index) => (
                  <React.Fragment key={activity._id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                          <TrendingUpIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={activity.description}
                        secondary={new Date(activity.createdAt).toLocaleString()}
                      />
                    </ListItem>
                    {index < processedActivities.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Thống kê tăng trưởng */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Thống kê tăng trưởng
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Người dùng mới
                  </Typography>
                  <Typography variant="h6">+{Math.floor(stats.totalUsers * 0.1)}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Thú cưng mới
                  </Typography>
                  <Typography variant="h6">+{Math.floor(stats.totalPets * 0.15)}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Tình nguyện viên mới
                  </Typography>
                  <Typography variant="h6">+{Math.floor(stats.totalVolunteers * 0.2)}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Bài viết mới
                  </Typography>
                  <Typography variant="h6">+{Math.floor(stats.totalPosts * 0.25)}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;