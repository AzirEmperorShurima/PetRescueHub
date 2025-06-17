import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Snackbar,
  Alert,
  Chip,
  Avatar,
  Tabs,
  Tab,
  Container
} from '@mui/material';
import { fDate } from '../../../utils/format-time';
import axios from '../../../utils/axios';

const VolunteerManagement = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalVolunteers, setTotalVolunteers] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [currentTab, setCurrentTab] = useState(0);
  const [pendingVolunteers, setPendingVolunteers] = useState([]);

  const displayedVolunteers = currentTab === 1
    ? pendingVolunteers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : volunteers;

  useEffect(() => {
    if (currentTab === 1) {
      fetchPendingVolunteers();
    } else {
      fetchVolunteers();
    }
  }, [page, rowsPerPage, currentTab]);

  const fetchVolunteers = async () => {
    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };

      // Nếu đang ở tab "Đơn chờ duyệt", thêm filter cho trạng thái pending
      if (currentTab === 1) {
        params.volunteerRequestStatus = 'pending';
      }

      const response = await axios.get('/admin/v1/volunteers', { params });
      setVolunteers(response.data.volunteers || []);
      setTotalVolunteers(response.data.totalVolunteers || 0);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      showSnackbar('Lỗi khi tải dữ liệu tình nguyện viên', 'error');
    }
  };

  const fetchPendingVolunteers = async () => {
    try {
      const response = await axios.get('/admin/users');
      console.log('API users in pending response:', response.data);
      const usersData = Array.isArray(response.data.users) ? response.data.users : [];
      const pending = usersData.filter(u => u.volunteerRequestStatus === 'pending');
      setPendingVolunteers(pending);
      setTotalVolunteers(pending.length);
    } catch (error) {
      console.error('Error fetching pending volunteers:', error);
      showSnackbar('Lỗi khi tải đơn chờ duyệt', 'error');
      setPendingVolunteers([]);
      setTotalVolunteers(0);
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setPage(0); // Reset về trang đầu khi chuyển tab
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleApproveVolunteer = async (volunteer) => {
    try {
      await axios.post('/admin/v1/volunteers/requests/accept', { userId: volunteer._id });
      showSnackbar('Đã phê duyệt yêu cầu tình nguyện viên');
      if (currentTab === 1) fetchPendingVolunteers();
      else fetchVolunteers();
    } catch (error) {
      console.error('Error approving volunteer:', error);
      showSnackbar('Lỗi khi phê duyệt yêu cầu tình nguyện viên', 'error');
    }
  };

  const handleRejectVolunteer = async (volunteer) => {
    try {
      await axios.post('/admin/v1/volunteers/requests/reject', { userId: volunteer._id });
      showSnackbar('Đã từ chối yêu cầu tình nguyện viên');
      if (currentTab === 1) fetchPendingVolunteers();
      else fetchVolunteers();
    } catch (error) {
      console.error('Error rejecting volunteer:', error);
      showSnackbar('Lỗi khi từ chối yêu cầu tình nguyện viên', 'error');
    }
  };

  const handleRevokeVolunteer = async (volunteer) => {
    try {
      await axios.put('/admin/v1/volunteers/requests/revoke', { userId: volunteer._id });
      showSnackbar('Đã thu hồi quyền tình nguyện viên');
      fetchVolunteers();
    } catch (error) {
      console.error('Error revoking volunteer:', error);
      showSnackbar('Lỗi khi thu hồi quyền tình nguyện viên', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <Container maxWidth={false} disableGutters sx={{ px: { xs: 0.5, sm: 2, md: 0.1 }, py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Quản lý tình nguyện viên</Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="Tất cả tình nguyện viên" />
          <Tab label="Đơn chờ duyệt" />
        </Tabs>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 2 }}>
        <TableContainer sx={{ maxHeight: { xs: 400, md: 650 }, minHeight: 350, overflowX: 'auto' }}>
          <Table stickyHeader aria-label="sticky table" size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 120 }}>ID</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 80 }}>Avatar</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 120 }}>Họ tên</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 80 }}>Giới tính</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 160, display: { xs: 'none', md: 'table-cell' } }}>Email</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 120, display: { xs: 'none', md: 'table-cell' } }}>Số điện thoại</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 160, display: { xs: 'none', md: 'table-cell' } }}>Địa chỉ</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 120 }}>Trạng thái tình nguyện</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 120, display: { xs: 'none', md: 'table-cell' } }}>Trạng thái yêu cầu</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 120, display: { xs: 'none', md: 'table-cell' } }}>Ngày tạo</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 100 }}>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedVolunteers.map((volunteer) => (
                <TableRow hover key={volunteer._id}>
                  <TableCell sx={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{volunteer._id}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Avatar src={volunteer.avatar} alt={volunteer.fullname} sx={{ width: 32, height: 32 }} />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{volunteer.fullname}</TableCell>
                  <TableCell>{volunteer.gender}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{volunteer.email}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{volunteer.phonenumber?.[0]}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{volunteer.address}</TableCell>
                  <TableCell>
                    <Chip 
                      label={volunteer.volunteerStatus} 
                      color={volunteer.volunteerStatus === 'ready' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    <Chip 
                      label={volunteer.volunteerRequestStatus} 
                      color={
                        volunteer.volunteerRequestStatus === 'approved' ? 'success' :
                        volunteer.volunteerRequestStatus === 'pending' ? 'warning' :
                        'error'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{fDate(volunteer.createdAt)}</TableCell>
                  <TableCell>
                    {currentTab === 1 && volunteer.volunteerRequestStatus === 'pending' && (
                      <>
                        <Button 
                          color="success" 
                          onClick={() => handleApproveVolunteer(volunteer)}
                          size="small"
                          sx={{ mr: 1 }}
                          variant="contained"
                        >
                          Duyệt
                        </Button>
                        <Button 
                          color="error" 
                          onClick={() => handleRejectVolunteer(volunteer)}
                          size="small"
                          sx={{ mr: 1 }}
                          variant="contained"
                        >
                          Từ chối
                        </Button>
                      </>
                    )}
                    {currentTab === 0 && volunteer.volunteerRequestStatus === 'approved' && (
                      <Button
                        color="warning"
                        onClick={() => handleRevokeVolunteer(volunteer)}
                        size="small"
                        sx={{ mr: 1 }}
                        variant="outlined"
                      >
                        Thu hồi quyền tình nguyện
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalVolunteers}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
          sx={{
            '.MuiTablePagination-toolbar': {
              alignItems: 'center',
              '& > p:first-of-type': {
                margin: 0,
              },
            },
            '.MuiTablePagination-selectLabel': {
              margin: 0,
            },
            '.MuiTablePagination-displayedRows': {
              margin: 0,
            },
            '.MuiTablePagination-select': {
              marginRight: 2,
              marginLeft: 1,
            },
            '.MuiTablePagination-actions': {
              marginLeft: 2,
            }
          }}
        />
      </Paper>

      {/* Snackbar thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default VolunteerManagement;