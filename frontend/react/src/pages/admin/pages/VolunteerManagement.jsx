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
  TextField,
  IconButton,
  Snackbar,
  Alert,
  Chip
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';
import { fDate } from '../../../utils/format-time'; // Đã cập nhật đường dẫn import

const VolunteerManagement = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    skills: '',
    availability: '',
    status: 'active'
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      // Trong thực tế, bạn sẽ gọi API thực sự
      // const response = await axios.get('/api/admin/volunteers');
      // setVolunteers(response.data);
      
      // Dữ liệu mẫu
      setVolunteers([
        { 
          id: 1, 
          name: 'Nguyễn Văn A', 
          email: 'nguyenvana@example.com', 
          phone: '0901234567', 
          skills: 'Chăm sóc thú cưng, Sơ cứu', 
          availability: 'Cuối tuần',
          status: 'active',
          createdAt: new Date()
        },
        { 
          id: 2, 
          name: 'Trần Thị B', 
          email: 'tranthib@example.com', 
          phone: '0901234568', 
          skills: 'Huấn luyện chó, Chụp ảnh', 
          availability: 'Thứ 2-4 buổi tối',
          status: 'inactive',
          createdAt: new Date(Date.now() - 86400000)
        },
      ]);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      showSnackbar('Lỗi khi tải dữ liệu tình nguyện viên', 'error');
    }
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

  const handleOpenEditDialog = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setFormData({
      name: volunteer.name,
      email: volunteer.email,
      phone: volunteer.phone,
      skills: volunteer.skills,
      availability: volunteer.availability,
      status: volunteer.status
    });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedVolunteer(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      skills: '',
      availability: '',
      status: 'active'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDeleteVolunteer = async () => {
    try {
      // Trong thực tế, bạn sẽ gọi API thực sự
      // await axios.delete(`/api/admin/volunteers/${selectedVolunteer.id}`);
      
      // Cập nhật state
      setVolunteers(volunteers.filter(volunteer => volunteer.id !== selectedVolunteer.id));
      showSnackbar('Xóa tình nguyện viên thành công');
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting volunteer:', error);
      showSnackbar('Lỗi khi xóa tình nguyện viên', 'error');
    }
  };

  const handleUpdateVolunteer = async () => {
    try {
      // Trong thực tế, bạn sẽ gọi API thực sự
      // const response = await axios.put(`/api/admin/volunteers/${selectedVolunteer?.id}`, formData);
      
      if (selectedVolunteer) {
        // Cập nhật tình nguyện viên hiện có
        setVolunteers(volunteers.map(volunteer => 
          volunteer.id === selectedVolunteer.id ? { ...volunteer, ...formData } : volunteer
        ));
        showSnackbar('Cập nhật tình nguyện viên thành công');
      } else {
        // Thêm tình nguyện viên mới
        const newVolunteer = {
          id: volunteers.length + 1,
          ...formData,
          createdAt: new Date()
        };
        setVolunteers([...volunteers, newVolunteer]);
        showSnackbar('Thêm tình nguyện viên mới thành công');
      }
      
      handleCloseEditDialog();
    } catch (error) {
      console.error('Error updating volunteer:', error);
      showSnackbar('Lỗi khi cập nhật tình nguyện viên', 'error');
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
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedVolunteer(null);
            setFormData({
              name: '',
              email: '',
              phone: '',
              skills: '',
              availability: '',
              status: 'active'
            });
            setOpenEditDialog(true);
          }}
        >
          Thêm tình nguyện viên
        </Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tên</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Kỹ năng</TableCell>
                <TableCell>Lịch rảnh</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {volunteers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((volunteer) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={volunteer.id}>
                    <TableCell>{volunteer.id}</TableCell>
                    <TableCell>{volunteer.name}</TableCell>
                    <TableCell>{volunteer.email}</TableCell>
                    <TableCell>{volunteer.phone}</TableCell>
                    <TableCell>{volunteer.skills}</TableCell>
                    <TableCell>{volunteer.availability}</TableCell>
                    <TableCell>
                      <Chip 
                        label={volunteer.status === 'active' ? 'Hoạt động' : 'Không hoạt động'} 
                        color={volunteer.status === 'active' ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell>{fDate(volunteer.createdAt)}</TableCell>
                    <TableCell>
                      <IconButton 
                        color="primary" 
                        onClick={() => handleOpenEditDialog(volunteer)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleOpenDeleteDialog(volunteer)}
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
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={volunteers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
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
            Bạn có chắc chắn muốn xóa tình nguyện viên {selectedVolunteer?.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
          <Button onClick={handleDeleteVolunteer} color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog thêm/sửa tình nguyện viên */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {selectedVolunteer ? 'Cập nhật tình nguyện viên' : 'Thêm tình nguyện viên mới'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Tên"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={formData.email}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="phone"
            label="Số điện thoại"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.phone}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="skills"
            label="Kỹ năng"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.skills}
            onChange={handleInputChange}
            helperText="Nhập các kỹ năng, phân cách bằng dấu phẩy"
          />
          <TextField
            margin="dense"
            name="availability"
            label="Lịch rảnh"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.availability}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="status"
            label="Trạng thái"
            select
            fullWidth
            variant="outlined"
            value={formData.status}
            onChange={handleInputChange}
            SelectProps={{
              native: true,
            }}
          >
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Hủy</Button>
          <Button onClick={handleUpdateVolunteer} color="primary">
            {selectedVolunteer ? 'Cập nhật' : 'Thêm'}
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