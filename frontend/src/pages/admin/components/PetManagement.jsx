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
import api from '../../../utils/axios';
import { fDate } from '../../../utils/format-time';

const PetManagement = () => {
  const [pets, setPets] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
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
      const response = await api.get('/pet/v1/get-pets/all-pet');
      // console.log(response.data);
      // Lấy đúng mảng thú cưng từ response
      const petsData = Array.isArray(response.data.pets?.data)
        ? response.data.pets.data
        : [];
      setPets(petsData);
    } catch (error) {
      console.error('Error fetching pets:', error);
      showSnackbar('Lỗi khi tải dữ liệu thú cưng', 'error');
      setPets([]);
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

  const handleDeletePet = async () => {
    try {
      // Gọi đúng endpoint và truyền đúng _id
      const response = await api.delete(`/pets/delete/${selectedPet._id}`);
      if (response.data.success || response.status === 200) {
        setPets(pets.filter(pet => pet._id !== selectedPet._id));
        showSnackbar('Xóa thú cưng thành công', 'success');
        handleCloseDeleteDialog();
      } else {
        showSnackbar(response.data.message || 'Không thể xóa thú cưng', 'error');
      }
    } catch (error) {
      console.error('Error deleting pet:', error);
      const errorMessage = error?.response?.data?.message || 'Lỗi khi xóa thú cưng';
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

  const getStatusChip = (status) => {
    const statusConfig = {
      available: { label: 'Có sẵn', color: 'success' },
      adopted: { label: 'Đã nhận nuôi', color: 'default' }
    };
    const config = statusConfig[status] || statusConfig.available;
    return <Chip label={config.label} color={config.color} />;
  };

  // Tính toán dữ liệu cho phân trang
  const paginatedPets = Array.isArray(pets) ? pets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : [];

  return (
    <Container maxWidth={false} disableGutters sx={{ px: { xs: 0.5, sm: 2, md: 0.1 }, py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Quản lý thú cưng</Typography>
      </Box>
      <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 2 }}>
        <TableContainer sx={{ maxHeight: { xs: 400, md: 650 }, minHeight: 350, overflowX: 'auto' }}>
          <Table stickyHeader aria-label="sticky table" size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 120 }}>ID</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 120 }}>Tên</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 100 }}>Loại</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 120 }}>Giống</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 80 }}>Tuổi</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 80 }}>Giới tính</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 100 }}>Trạng thái</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 100 }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedPets.map((pet) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={pet._id}>
                  <TableCell>{pet._id}</TableCell>
                  <TableCell>{pet.name}</TableCell>
                  <TableCell>{pet.type === 'dog' ? 'Chó' : 'Mèo'}</TableCell>
                  <TableCell>{pet.breed}</TableCell>
                  <TableCell>{pet.age}</TableCell>
                  <TableCell>{pet.gender === 'male' ? 'Đực' : 'Cái'}</TableCell>
                  <TableCell>{getStatusChip(pet.status)}</TableCell>
                  <TableCell>
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

export default PetManagement;