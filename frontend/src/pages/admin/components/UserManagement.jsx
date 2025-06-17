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
  Container
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import { fDate } from '../../../utils/format-time';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users');
      // console.log('API users response:', response.data);
      const usersData = Array.isArray(response.data.users) ? response.data.users : [];
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      showSnackbar('Lỗi khi tải dữ liệu người dùng', 'error');
      setUsers([]);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDeleteDialog = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/admin/users`,
        { 
          data: { id_delete: selectedUser._id },
          withCredentials: true 
        }
      );
      console.log('API delete response:', response.data);

      if (response.data.success || response.status === 200) {
        setUsers(users.filter(user => user._id !== selectedUser._id));
        showSnackbar('Xóa người dùng thành công', 'success');
        handleCloseDeleteDialog();
      } else {
        showSnackbar(response.data.message || 'Không thể xóa người dùng', 'error');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      const errorMessage = error?.response?.data?.message || 'Lỗi khi xóa người dùng';
      showSnackbar(errorMessage, 'error');
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

  // Tính toán dữ liệu cho phân trang
  const paginatedUsers = Array.isArray(users) ? users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : [];

  return (
    <Container maxWidth={false} disableGutters sx={{ px: { xs: 0.5, sm: 2, md: 0.1 }, py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Quản lý người dùng</Typography>
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
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 100 }}>Vai trò</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 120 }}>Trạng thái hoạt động</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 120, display: { xs: 'none', md: 'table-cell' } }}>Trạng thái TNV</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 120, display: { xs: 'none', md: 'table-cell' } }}>Yêu cầu TNV</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 120, display: { xs: 'none', md: 'table-cell' } }}>Ngày tạo</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 80 }}>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow hover key={user._id || user.id}>
                  <TableCell sx={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user._id}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <img
                      src={user.avatar}
                      alt="avatar"
                      width={32}
                      height={32}
                      style={{ borderRadius: 16, objectFit: 'cover' }}
                      onError={e => { e.target.src = 'https://ui-avatars.com/api/?name=' + (user.fullname || user.username); }}
                    />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.fullname}</TableCell>
                  <TableCell>{user.gender}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{user.email}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{Array.isArray(user.phonenumber) ? user.phonenumber.join(', ') : user.phonenumber}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.address}</TableCell>
                  <TableCell>{Array.isArray(user.roles) ? user.roles.map(r => r.name).join(', ') : user.roles}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.isActive ? 'Hoạt động' : 'Khoá'}
                      color={user.isActive ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    <Chip label={user.volunteerStatus || 'none'} color={user.volunteerStatus === 'approved' ? 'success' : user.volunteerStatus === 'pending' ? 'warning' : user.volunteerStatus === 'rejected' ? 'error' : 'default'} size="small" />
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    <Chip label={user.volunteerRequestStatus || 'none'} color={user.volunteerRequestStatus === 'pending' ? 'warning' : user.volunteerRequestStatus === 'approved' ? 'success' : user.volunteerRequestStatus === 'rejected' ? 'error' : 'default'} size="small" />
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{fDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => handleOpenDeleteDialog(user)}>
                      <DeleteIcon fontSize="small" />
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
          count={users.length}
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

      {/* Dialog xóa người dùng */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa người dùng {selectedUser?.fullname}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
          <Button onClick={handleDeleteUser} color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity || 'success'} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserManagement;