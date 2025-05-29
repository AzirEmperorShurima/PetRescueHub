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
import { Visibility as VisibilityIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { fDate, fDateTime } from '../../../utils/format-time';

const DonationManagement = () => {
  const [donations, setDonations] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      // Trong thực tế, bạn sẽ gọi API thực sự
      // const response = await axios.get('/api/admin/donations');
      // setDonations(response.data);
      
      // Dữ liệu mẫu
      setDonations([
        { 
          id: 1, 
          donorName: 'Nguyễn Văn A', 
          email: 'nguyenvana@example.com', 
          amount: 1000000, 
          paymentMethod: 'Chuyển khoản ngân hàng', 
          message: 'Ủng hộ cho các bé mèo bị bỏ rơi.',
          status: 'completed',
          createdAt: new Date()
        },
        { 
          id: 2, 
          donorName: 'Trần Thị B', 
          email: 'tranthib@example.com', 
          amount: 500000, 
          paymentMethod: 'Ví điện tử MoMo', 
          message: 'Mong các bé thú cưng sẽ tìm được gia đình mới.',
          status: 'completed',
          createdAt: new Date(Date.now() - 86400000)
        },
        { 
          id: 3, 
          donorName: 'Lê Văn C', 
          email: 'levanc@example.com', 
          amount: 2000000, 
          paymentMethod: 'Thẻ tín dụng', 
          message: 'Ủng hộ cho hoạt động cứu hộ thú cưng.',
          status: 'pending',
          createdAt: new Date(Date.now() - 172800000)
        },
      ]);
    } catch (error) {
      console.error('Error fetching donations:', error);
      showSnackbar('Lỗi khi tải dữ liệu quyên góp', 'error');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDeleteDialog = (donation) => {
    setSelectedDonation(donation);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedDonation(null);
  };

  const handleOpenViewDialog = (donation) => {
    setSelectedDonation(donation);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedDonation(null);
  };

  const handleDeleteDonation = async () => {
    try {
      // Trong thực tế, bạn sẽ gọi API thực sự
      // await axios.delete(`/api/admin/donations/${selectedDonation.id}`);
      
      // Cập nhật state
      setDonations(donations.filter(donation => donation.id !== selectedDonation.id));
      showSnackbar('Xóa thông tin quyên góp thành công');
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting donation:', error);
      showSnackbar('Lỗi khi xóa thông tin quyên góp', 'error');
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

  // Trong phần render của component DonationManagement
  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý quyên góp
      </Typography>
      
      {/* Thêm thống kê tổng số tiền quyên góp */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, bgcolor: '#f8f9fa' }}>
        <Typography variant="h6" gutterBottom>
          Tổng quan
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box>
            <Typography variant="body1" color="text.secondary">
              Tổng số người quyên góp
            </Typography>
            <Typography variant="h5">
              {donations.length} người
            </Typography>
          </Box>
          <Box>
            <Typography variant="body1" color="text.secondary">
              Tổng số tiền quyên góp
            </Typography>
            <Typography variant="h5">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                donations.reduce((sum, donation) => sum + donation.amount, 0)
              )}
            </Typography>
          </Box>
        </Box>
      </Paper>
      
      <Paper elevation={3} sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Người quyên góp</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Số tiền</TableCell>
                <TableCell>Phương thức</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày quyên góp</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {donations
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell>{donation.id}</TableCell>
                    <TableCell>{donation.donorName}</TableCell>
                    <TableCell>{donation.email}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(donation.amount)}
                    </TableCell>
                    <TableCell>{donation.paymentMethod}</TableCell>
                    <TableCell>
                      <Chip 
                        label={donation.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'} 
                        color={donation.status === 'completed' ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{fDate(donation.createdAt)}</TableCell>
                    <TableCell align="center">
                      <IconButton 
                        color="primary" 
                        onClick={() => handleOpenViewDialog(donation)}
                        size="small"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleOpenDeleteDialog(donation)}
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
          count={donations.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Rows per page:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
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
      
      {/* Dialog xóa thông tin quyên góp */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa thông tin quyên góp của {selectedDonation?.donorName}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
          <Button onClick={handleDeleteDonation} color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xem chi tiết quyên góp */}
      <Dialog
        open={openViewDialog}
        onClose={handleCloseViewDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Chi tiết quyên góp</DialogTitle>
        <DialogContent>
          {selectedDonation && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                <strong>Người quyên góp:</strong> {selectedDonation.donorName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Email:</strong> {selectedDonation.email}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Số tiền:</strong> {selectedDonation.amount.toLocaleString()} VND
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Phương thức thanh toán:</strong> {selectedDonation.paymentMethod}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Trạng thái:</strong> {selectedDonation.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Thời gian:</strong> {fDateTime(selectedDonation.createdAt)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Lời nhắn:</strong>
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mt: 1, bgcolor: '#f5f5f5' }}>
                <Typography variant="body2">
                  {selectedDonation.message || 'Không có lời nhắn'}
                </Typography>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Đóng</Button>
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

export default DonationManagement;