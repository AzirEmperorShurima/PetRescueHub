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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Snackbar,
  Alert,
  Chip,
  Avatar,
  Tabs,
  Tab
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { fDate } from '../../../utils/format-time';
import axios from '../../../utils/axios';
import UserManagement from './UserManagement';

const VolunteerManagement = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalVolunteers, setTotalVolunteers] = useState(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
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

  const handleOpenDeleteDialog = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedVolunteer(null);
  };

  const handleDeleteVolunteer = async () => {
    try {
      await axios.delete(`/admin/v1/volunteers/${selectedVolunteer._id}`);
      setVolunteers(volunteers.filter(volunteer => volunteer._id !== selectedVolunteer._id));
      setTotalVolunteers(totalVolunteers - 1);
      showSnackbar('Xóa tình nguyện viên thành công');
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting volunteer:', error);
      showSnackbar('Lỗi khi xóa tình nguyện viên', 'error');
    }
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
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Quản lý tình nguyện viên</Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="Tất cả tình nguyện viên" />
          <Tab label="Đơn chờ duyệt" />
        </Tabs>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Avatar</TableCell>
                <TableCell>Họ tên</TableCell>
                <TableCell>Giới tính</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Địa chỉ</TableCell>
                <TableCell>Trạng thái tình nguyện</TableCell>
                <TableCell>Trạng thái yêu cầu</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedVolunteers.map((volunteer) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={volunteer._id}>
                  <TableCell>{volunteer._id}</TableCell>
                  <TableCell>
                    <Avatar src={volunteer.avatar} alt={volunteer.fullname} />
                  </TableCell>
                  <TableCell>{volunteer.fullname}</TableCell>
                  <TableCell>{volunteer.gender}</TableCell>
                  <TableCell>{volunteer.email}</TableCell>
                  <TableCell>{volunteer.phonenumber?.[0]}</TableCell>
                  <TableCell>{volunteer.address}</TableCell>
                  <TableCell>
                    <Chip 
                      label={volunteer.volunteerStatus} 
                      color={volunteer.volunteerStatus === 'ready' ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={volunteer.volunteerRequestStatus} 
                      color={
                        volunteer.volunteerRequestStatus === 'approved' ? 'success' :
                        volunteer.volunteerRequestStatus === 'pending' ? 'warning' :
                        'error'
                      }
                    />
                  </TableCell>
                  <TableCell>{fDate(volunteer.createdAt)}</TableCell>
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
                    <IconButton 
                      color="error" 
                      onClick={() => handleOpenDeleteDialog(volunteer)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
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

      {/* Dialog xóa tình nguyện viên */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa tình nguyện viên {selectedVolunteer?.fullname}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
          <Button onClick={handleDeleteVolunteer} color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

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
    </Box>
  );
};

export default VolunteerManagement;