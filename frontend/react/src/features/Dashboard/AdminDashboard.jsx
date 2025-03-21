import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Container, Typography, Card, CardContent, Grid } from '@mui/material';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("/api/users");
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        const fetchVolunteers = async () => {
            try {
                const response = await axios.get("/api/volunteers");
                setVolunteers(response.data);
            } catch (error) {
                console.error("Error fetching volunteers:", error);
            }
        };

        const fetchData = async () => {
            await fetchUsers();
            await fetchVolunteers();
            setLoading(false);
        };

        fetchData();
    }, []);

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`/api/users/${userId}`);
            setUsers(users.filter(user => user._id !== userId));
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleDeleteVolunteer = async (volunteerId) => {
        try {
            await axios.delete(`/api/volunteers/${volunteerId}`);
            setVolunteers(volunteers.filter(volunteer => volunteer._id !== volunteerId));
        } catch (error) {
            console.error("Error deleting volunteer:", error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Quản lý hệ thống
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Thống kê</Typography>
                                {/* Thêm thống kê ở đây */}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Quản lý người dùng</Typography>
                                <ul>
                                    {users.map(user => (
                                        <li key={user._id}>
                                            {user.name} <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Quản lý thú cưng</Typography>
                                <ul>
                                    {volunteers.map(volunteer => (
                                        <li key={volunteer._id}>
                                            {volunteer.name} <button onClick={() => handleDeleteVolunteer(volunteer._id)}>Delete</button>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default AdminDashboard;