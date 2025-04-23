import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Chip,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Snackbar,
  Alert
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';
import { fDate, fDateTime } from '../../../utils/format-time';
import DataTable from '../../../components/common/DataTable';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    imageUrl: '',
    status: 'upcoming'
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      // Trong thực tế, bạn sẽ gọi API thực sự
      // const response = await axios.get('/api/admin/events');
      // setEvents(response.data);
      
      // Dữ liệu mẫu
      setEvents([
        { 
          id: 1, 
          title: 'Ngày hội nhận nuôi thú cưng', 
          description: 'Sự kiện nhận nuôi thú cưng lớn nhất năm 2023.', 
          location: 'Công viên Lê Văn Tám, TP.HCM', 
          startDate: new Date(2023, 11, 15, 8, 0), 
          endDate: new Date(2023, 11, 15, 17, 0), 
          imageUrl: 'https://example.com/event1.jpg',
          status: 'upcoming',
          createdAt: new Date()
        },
        { 
          id: 2, 
          title: 'Hội thảo chăm sóc thú cưng', 
          description: 'Hội thảo chia sẻ kiến thức về chăm sóc thú cưng.', 
          location: 'Trung tâm hội nghị XYZ, Hà Nội', 
          startDate: new Date(2023, 10, 10, 9, 0), 
          endDate: new Date(2023, 10, 10, 16, 0), 
          imageUrl: 'https://example.com/event2.jpg',
          status: 'completed',
          createdAt: new Date(Date.now() - 86400000)
        },
      ]);
    } catch (error) {
      console.error('Error fetching events:', error);
      showSnackbar('Lỗi khi tải dữ liệu sự kiện', 'error');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDeleteDialog = (event) => {
    setSelectedEvent(event);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedEvent(null);
  };

  const handleOpenEditDialog = (event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      location: event.location,
      startDate: event.startDate.toISOString().slice(0, 16),
      endDate: event.endDate.toISOString().slice(0, 16),
      imageUrl: event.imageUrl,
      status: event.status
    });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedEvent(null);
    setFormData({
      title: '',
      description: '',
      location: '',
      startDate: '',
      endDate: '',
      imageUrl: '',
      status: 'upcoming'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDeleteEvent = async () => {
    try {
      // Trong thực tế, bạn sẽ gọi API thực sự
      // await axios.delete(`/api/admin/events/${selectedEvent.id}`);
      
      // Cập nhật state
      setEvents(events.filter(event => event.id !== selectedEvent.id));
      showSnackbar('Xóa sự kiện thành công');
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting event:', error);
      showSnackbar('Lỗi khi xóa sự kiện', 'error');
    }
  };

  const handleUpdateEvent = async () => {
    try {
      // Trong thực tế, bạn sẽ gọi API thực sự
      // const response = await axios.put(`/api/admin/events/${selectedEvent?.id}`, formData);
      
      if (selectedEvent) {
        // Cập nhật sự kiện hiện có
        setEvents(events.map(event => 
          event.id === selectedEvent.id ? { 
            ...event, 
            ...formData,
            startDate: new Date(formData.startDate),
            endDate: new Date(formData.endDate)
          } : event
        ));
        showSnackbar('Cập nhật sự kiện thành công');
      } else {
        // Thêm sự kiện mới
        const newEvent = {
          id: events.length + 1,
          ...formData,
          startDate: new Date(formData.startDate),
          endDate: new Date(formData.endDate),
          createdAt: new Date()
        };
        setEvents([...events, newEvent]);
        showSnackbar('Thêm sự kiện mới thành công');
      }
      
      handleCloseEditDialog();
    } catch (error) {
      console.error('Error updating event:', error);
      showSnackbar('Lỗi khi cập nhật sự kiện', 'error');
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
        <Typography variant="h4">Quản lý sự kiện</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedEvent(null);
            setFormData({
              title: '',
              description: '',
              location: '',
              startDate: '',
              endDate: '',
              imageUrl: '',
              status: 'upcoming'
            });
            setOpenEditDialog(true);
          }}
        >
          Thêm sự kiện
        </Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tiêu đề</TableCell>
                <TableCell>Địa điểm</TableCell>
                <TableCell>Thời gian bắt đầu</TableCell>
                <TableCell>Thời gian kết thúc</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((event) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={event.id}>
                    <TableCell>{event.id}</TableCell>
                    <TableCell>{event.title}</TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>{fDateTime(event.startDate)}</TableCell>
                    <TableCell>{fDateTime(event.endDate)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={event.status === 'upcoming' ? 'Sắp diễn ra' : 'Đã kết thúc'} 
                        color={event.status === 'upcoming' ? 'primary' : 'default'}
                      />
                    </TableCell>
                    <TableCell>{fDate(event.createdAt)}</TableCell>
                    <TableCell>
                      <IconButton 
                        color="primary" 
                        onClick={() => handleOpenEditDialog(event)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleOpenDeleteDialog(event)}
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
          count={events.length}
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

      {/* Dialog xóa sự kiện */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa sự kiện "{selectedEvent?.title}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
          <Button onClick={handleDeleteEvent} color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog thêm/sửa sự kiện */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {selectedEvent ? 'Cập nhật sự kiện' : 'Thêm sự kiện mới'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="title"
            label="Tiêu đề"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.title}
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
            name="location"
            label="Địa điểm"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.location}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="startDate"
            label="Thời gian bắt đầu"
            type="datetime-local"
            fullWidth
            variant="outlined"
            value={formData.startDate}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            name="endDate"
            label="Thời gian kết thúc"
            type="datetime-local"
            fullWidth
            variant="outlined"
            value={formData.endDate}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
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
            <option value="upcoming">Sắp diễn ra</option>
            <option value="completed">Đã kết thúc</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Hủy</Button>
          <Button onClick={handleUpdateEvent} color="primary">
            {selectedEvent ? 'Cập nhật' : 'Thêm'}
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

export default EventManagement;