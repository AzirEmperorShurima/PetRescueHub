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
  Chip
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
      console.log('API users response:', response.data);
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
      await axios.delete(`/api/admin/users/${selectedUser._id || selectedUser.id}`);
      setUsers(users.filter(user => user._id !== selectedUser._id && user.id !== selectedUser.id));
      showSnackbar('Xóa người dùng thành công');
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting user:', error);
      showSnackbar('Lỗi khi xóa người dùng', 'error');
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
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Quản lý người dùng</Typography>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>Avatar</TableCell>
                <TableCell>Họ tên</TableCell>
                <TableCell>Giới tính</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Địa chỉ</TableCell>
                <TableCell>Vai trò</TableCell>
                <TableCell>Trạng thái hoạt động</TableCell>
                <TableCell>Trạng thái TNV</TableCell>
                <TableCell>Yêu cầu TNV</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow hover key={user._id || user.id}>
                  <TableCell>
                    <img
                      src={user.avatar}
                      alt="avatar"
                      width={36}
                      height={36}
                      style={{ borderRadius: 18, objectFit: 'cover' }}
                      onError={e => { e.target.src = 'https://ui-avatars.com/api/?name=' + (user.fullname || user.username); }}
                    />
                  </TableCell>
                  <TableCell>{user.fullname}</TableCell>
                  <TableCell>{user.gender}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{Array.isArray(user.phonenumber) ? user.phonenumber.join(', ') : user.phonenumber}</TableCell>
                  <TableCell>{user.address}</TableCell>
                  <TableCell>
                    {Array.isArray(user.roles)
                      ? user.roles.map(r => r.name).join(', ')
                      : user.roles}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.isActive ? 'Hoạt động' : 'Khoá'}
                      color={user.isActive ? 'success' : 'error'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip label={user.volunteerStatus || 'none'} color={user.volunteerStatus === 'approved' ? 'success' : user.volunteerStatus === 'pending' ? 'warning' : user.volunteerStatus === 'rejected' ? 'error' : 'default'} />
                  </TableCell>
                  <TableCell>
                    <Chip label={user.volunteerRequestStatus || 'none'} color={user.volunteerRequestStatus === 'pending' ? 'warning' : user.volunteerRequestStatus === 'approved' ? 'success' : user.volunteerRequestStatus === 'rejected' ? 'error' : 'default'} />
                  </TableCell>
                  <TableCell>{fDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => handleOpenDeleteDialog(user)}>
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

export default UserManagement;