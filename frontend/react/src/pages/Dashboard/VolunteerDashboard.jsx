import React, { useEffect, useState } from "react";
import axios from '../../utils/axios';  // Thay đổi import này
import { Box, Container, Typography, Card, CardContent, Grid } from '@mui/material';

const VolunteerDashboard = () => {
    const [rescueRequests, setRescueRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRescueRequests = async () => {
            try {
                const response = await axios.get("/api/volunteer/rescue-requests");
                setRescueRequests(response.data);
            } catch (error) {
                console.error("Error fetching rescue requests:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRescueRequests();
    }, []);

    const handleAcceptRequest = async (requestId) => {
        try {
            await axios.post(`/api/volunteer/accept-request/${requestId}`);
            setRescueRequests(rescueRequests.filter(req => req.id !== requestId));
        } catch (error) {
            console.error("Error accepting request:", error);
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Trang tình nguyện viên
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Nhiệm vụ</Typography>
                                {/* Thêm danh sách nhiệm vụ ở đây */}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Lịch làm việc</Typography>
                                {/* Thêm lịch làm việc ở đây */}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default VolunteerDashboard;