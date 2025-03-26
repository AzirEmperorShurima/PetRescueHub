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
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';
import { fDate } from '../../../utils/format-time'; // Đã cập nhật đường dẫn import

const PetManagement = () => {
  const [pets, setPets] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'dog',
    breed: '',
    age: '',
    description: '',
    imageUrl: '',
    status: 'available'
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      // Trong thực tế, bạn sẽ gọi API thực sự
      // const response = await axios.get('/api/admin/pets');
      // setPets(response.data);
      
      // Dữ liệu mẫu
      setPets([
        { 
          id: 1, 
          name: 'Buddy', 
          type: 'dog', 
          breed: 'Golden Retriever', 
          age: '2 tuổi', 
          description: 'Chó Golden Retriever thân thiện.', 
          imageUrl: 'https://images.pexels.com/photos/825949/pexels-photo-825949.jpeg',
          status: 'available',
          createdAt: new Date()
        },
        { 
          id: 2, 
          name: 'Whiskers', 
          type: 'cat', 
          breed: 'Xiêm', 
          age: '1 tuổi', 
          description: 'Mèo Xiêm đáng yêu.', 
          imageUrl: 'https://images.pexels.com/photos/4587993/pexels-photo-4587993.jpeg',
          status: 'adopted',
          createdAt: new Date(Date.now() - 86400000)
        },
      ]);
    } catch (error) {
      console.error('Error fetching pets:', error);
      showSnackbar('Lỗi khi tải dữ liệu thú cưng', 'error');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDeleteDialog = (pet) => {
    setSelectedPet(pet);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedPet(null);
  };

  const handleOpenEditDialog = (pet) => {
    setSelectedPet(pet);
    setFormData({
      name: pet.name,
      type: pet.type,
      breed: pet.breed,
      age: pet.age,
      description: pet.description,
      imageUrl: pet.imageUrl,
      status: pet.status
    });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedPet(null);
    setFormData({
      name: '',
      type: 'dog',
      breed: '',
      age: '',
      description: '',
      imageUrl: '',
      status: 'available'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDeletePet = async () => {
    try {
      // Trong thực tế, bạn sẽ gọi API thực sự
      // await axios.delete(`/api/admin/pets/${selectedPet.id}`);
      
      // Cập nhật state
      setPets(pets.filter(pet => pet.id !== selectedPet.id));
      showSnackbar('Xóa thú cưng thành công');
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting pet:', error);
      showSnackbar('Lỗi khi xóa thú cưng', 'error');
    }
  };

  const handleUpdatePet = async () => {
    try {
      // Trong thực tế, bạn sẽ gọi API thực sự
      // const response = await axios.put(`/api/admin/pets/${selectedPet?.id}`, formData);
      
      if (selectedPet) {
        // Cập nhật thú cưng hiện có
        setPets(pets.map(pet => 
          pet.id === selectedPet.id ? { ...pet, ...formData } : pet
        ));
        showSnackbar('Cập nhật thú cưng thành công');
      } else {
        // Thêm thú cưng mới
        const newPet = {
          id: pets.length + 1,
          ...formData,
          createdAt: new Date()
        };
        setPets([...pets, newPet]);
        showSnackbar('Thêm thú cưng mới thành công');
      }
      
      handleCloseEditDialog();
    } catch (error) {
      console.error('Error updating pet:', error);
      showSnackbar('Lỗi khi cập nhật thú cưng', 'error');
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
        <Typography variant="h4">Quản lý thú cưng</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedPet(null);
            setFormData({
              name: '',
              type: 'dog',
              breed: '',
              age: '',
              description: '',
              imageUrl: '',
              status: 'available'
            });
            setOpenEditDialog(true);
          }}
        >
          Thêm thú cưng
        </Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tên</TableCell>
                <TableCell>Loại</TableCell>
                <TableCell>Giống</TableCell>
                <TableCell>Tuổi</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pets
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((pet) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={pet.id}>
                    <TableCell>{pet.id}</TableCell>
                    <TableCell>{pet.name}</TableCell>
                    <TableCell>{pet.type === 'dog' ? 'Chó' : 'Mèo'}</TableCell>
                    <TableCell>{pet.breed}</TableCell>
                    <TableCell>{pet.age}</TableCell>
                    <TableCell>
                      {pet.status === 'available' ? 'Có sẵn' : 'Đã nhận nuôi'}
                    </TableCell>
                    <TableCell>{fDate(pet.createdAt)}</TableCell>
                    <TableCell>
                      <IconButton 
                        color="primary" 
                        onClick={() => handleOpenEditDialog(pet)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleOpenDeleteDialog(pet)}
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
          count={pets.length}
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

      {/* Dialog xóa thú cưng */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa thú cưng {selectedPet?.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
          <Button onClick={handleDeletePet} color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog thêm/sửa thú cưng */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {selectedPet ? 'Cập nhật thú cưng' : 'Thêm thú cưng mới'}
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
          <FormControl fullWidth margin="dense">
            <InputLabel id="pet-type-label">Loại</InputLabel>
            <Select
              labelId="pet-type-label"
              name="type"
              value={formData.type}
              label="Loại"
              onChange={handleInputChange}
            >
              <MenuItem value="dog">Chó</MenuItem>
              <MenuItem value="cat">Mèo</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="breed"
            label="Giống"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.breed}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="age"
            label="Tuổi"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.age}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Mô tả"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={formData.description}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="imageUrl"
            label="URL hình ảnh"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.imageUrl}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="pet-status-label">Trạng thái</InputLabel>
            <Select
              labelId="pet-status-label"
              name="status"
              value={formData.status}
              label="Trạng thái"
              onChange={handleInputChange}
            >
              <MenuItem value="available">Có sẵn</MenuItem>
              <MenuItem value="adopted">Đã nhận nuôi</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Hủy</Button>
          <Button onClick={handleUpdatePet} color="primary">
            {selectedPet ? 'Cập nhật' : 'Thêm'}
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

export default PetManagement;