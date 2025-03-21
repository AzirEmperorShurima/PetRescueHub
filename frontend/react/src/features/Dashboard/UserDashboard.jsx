import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Container, Typography, Card, CardContent, Grid } from '@mui/material';

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [adoptionRequests, setAdoptionRequests] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/user/profile");
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchAdoptionRequests = async () => {
      try {
        const response = await axios.get("/api/user/adoption-requests");
        setAdoptionRequests(response.data);
      } catch (error) {
        console.error("Error fetching adoption requests:", error);
      }
    };

    fetchUserData();
    fetchAdoptionRequests();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Trang chủ người dùng
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Danh sách thú cưng cần giúp đỡ</Typography>
                {/* Thêm danh sách thú cưng ở đây */}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Hoạt động gần đây</Typography>
                {/* Thêm hoạt động gần đây ở đây */}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default UserDashboard;