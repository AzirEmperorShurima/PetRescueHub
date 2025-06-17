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
  Chip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Container
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import api from '../../../utils/axios';

const RescueManagement = () => {
  const [rescues, setRescues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentRescue, setCurrentRescue] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
    failed: 0
  });

  useEffect(() => {
    console.log('Component RescueManagement mounted');
    fetchRescues();
  }, []);

  const fetchRescues = async () => {
    setLoading(true);
    try {
      console.log('Bắt đầu fetch dữ liệu cứu hộ...');
      
      // Gọi API lấy danh sách cứu hộ
      const rescuesResponse = await api.get('/admin/rescue-missions/');
      console.log('Response từ API rescue-missions:', rescuesResponse.data);
      
      // Gọi API lấy thống kê theo trạng thái
      const statsResponse = await api.get('/admin/rescue-missions/stats/status');
      console.log('Response từ API stats/status:', statsResponse.data);

      // Xử lý dữ liệu cứu hộ
      const rescuesData = rescuesResponse.data.missions || rescuesResponse.data.stats || [];
      console.log('Dữ liệu cứu hộ sau khi xử lý:', rescuesData);
      
      setRescues(rescuesData);
      
      // Xử lý dữ liệu thống kê
      const statsData = statsResponse.data.stats || [];
      console.log('Dữ liệu thống kê gốc:', statsData);

      // Tính toán stats từ dữ liệu
      const stats = {
        total: rescuesData.length,
        inProgress: rescuesData.filter(r => r.status === 'in_progress').length,
        completed: rescuesData.filter(r => r.status === 'completed').length,
        failed: rescuesData.filter(r => r.status === 'failed').length
      };
      console.log('Stats sau khi xử lý:', stats);
      
      setStats(stats);
    } catch (error) {
      console.error('Lỗi khi fetch dữ liệu cứu hộ:', error);
      console.error('Chi tiết lỗi:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  // Lọc dữ liệu theo trạng thái
  const filteredRescues = filterStatus === 'all' 
    ? rescues 
    : rescues.filter(rescue => rescue.status === filterStatus);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (rescue = null) => {
    setCurrentRescue(rescue);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentRescue(null);
  };

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
    setPage(0);
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'in_progress':
        return <Chip label="Đang diễn ra" color="primary" />;
      case 'completed':
        return <Chip label="Hoàn thành" color="success" />;
      case 'failed':
        return <Chip label="Không hoàn thành" color="error" />;
      default:
        return <Chip label="Không xác định" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatLocation = (location) => {
    if (!location) return 'Không có';
    
    // Nếu location là object GeoJSON
    if (typeof location === 'object' && location.coordinates) {
      const [longitude, latitude] = location.coordinates;
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    }
    
    // Nếu location là string
    return location;
  };

  const formatVolunteers = (volunteers) => {
    if (!volunteers || !Array.isArray(volunteers)) return 'Không có';
    return volunteers.map(v => v.fullname).join(', ');
  };

  // Thêm hàm xử lý chi tiết cứu hộ
  const handleViewDetails = async (rescueId) => {
    try {
      console.log('Đang fetch chi tiết cứu hộ với ID:', rescueId);
      const response = await api.get(`/admin/rescue-missions/${rescueId}`);
      console.log('Chi tiết cứu hộ:', response.data);
      handleOpenDialog(response.data);
    } catch (error) {
      console.error('Lỗi khi fetch chi tiết cứu hộ:', error);
      console.error('Chi tiết lỗi:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    }
  };

  // Thêm hàm xử lý hủy cứu hộ
  const handleCancelRescue = async (rescueId) => {
    try {
      console.log('Đang hủy cứu hộ với ID:', rescueId);
      const response = await api.post(`/admin/rescue-missions/${rescueId}/cancel`);
      console.log('Kết quả hủy cứu hộ:', response.data);
      // Refresh lại danh sách sau khi hủy
      fetchRescues();
    } catch (error) {
      console.error('Lỗi khi hủy cứu hộ:', error);
      console.error('Chi tiết lỗi:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    }
  };

  // Thêm hàm xử lý khóa/mở khóa cứu hộ
  const handleToggleLock = async (rescueId) => {
    try {
      console.log('Đang toggle lock cứu hộ với ID:', rescueId);
      const response = await api.post(`/admin/rescue-missions/${rescueId}/toggle-lock`);
      console.log('Kết quả toggle lock:', response.data);
      // Refresh lại danh sách sau khi toggle
      fetchRescues();
    } catch (error) {
      console.error('Lỗi khi toggle lock cứu hộ:', error);
      console.error('Chi tiết lỗi:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    }
  };

  return (
    <Container maxWidth={false} disableGutters sx={{ px: { xs: 0.5, sm: 2, md: 0.1 }, py: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Quản lý cứu hộ
      </Typography>

      {/* Thống kê */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#f5f5f5' }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Tổng số ca cứu hộ
              </Typography>
              <Typography variant="h3" component="div" sx={{ mt: 2, color: '#333' }}>
                {stats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#e3f2fd' }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Đang diễn ra
              </Typography>
              <Typography variant="h3" component="div" sx={{ mt: 2, color: '#1976d2' }}>
                {stats.inProgress}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#e8f5e9' }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Hoàn thành
              </Typography>
              <Typography variant="h3" component="div" sx={{ mt: 2, color: '#2e7d32' }}>
                {stats.completed}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#ffebee' }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Không hoàn thành
              </Typography>
              <Typography variant="h3" component="div" sx={{ mt: 2, color: '#c62828' }}>
                {stats.failed}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Công cụ */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="status-filter-label">Lọc theo trạng thái</InputLabel>
          <Select
            labelId="status-filter-label"
            value={filterStatus}
            label="Lọc theo trạng thái"
            onChange={handleFilterChange}
            startAdornment={<FilterIcon sx={{ mr: 1, color: 'action.active' }} />}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="in_progress">Đang diễn ra</MenuItem>
            <MenuItem value="completed">Hoàn thành</MenuItem>
            <MenuItem value="failed">Không hoàn thành</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Bảng dữ liệu */}
      <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 2 }}>
        <TableContainer sx={{ maxHeight: { xs: 400, md: 650 }, minHeight: 350, overflowX: 'auto' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 120 }}>ID</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 120 }}>Người yêu cầu</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 120 }}>Địa điểm</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 120 }}>Tình nguyện viên được chọn</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 120 }}>Tình nguyện viên nhận nhiệm vụ</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 140 }}>Thời gian bắt đầu</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 140 }}>Thời gian kết thúc</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 100 }}>Trạng thái</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 100 }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRescues
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((rescue) => (
                  <TableRow key={rescue._id}>
                    <TableCell>{rescue.missionId}</TableCell>
                    <TableCell>{rescue.requester?.fullname || 'Không có'}</TableCell>
                    <TableCell>{formatLocation(rescue.location)}</TableCell>
                    <TableCell>{formatVolunteers(rescue.selectedVolunteers)}</TableCell>
                    <TableCell>{rescue.acceptedVolunteer?.fullname || 'Chưa có'}</TableCell>
                    <TableCell>{formatDate(rescue.startedAt)}</TableCell>
                    <TableCell>{rescue.endedAt ? formatDate(rescue.endedAt) : 'Chưa kết thúc'}</TableCell>
                    <TableCell>{getStatusChip(rescue.status)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Xem chi tiết">
                          <IconButton onClick={() => handleViewDetails(rescue._id)}>
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Hủy cứu hộ">
                          <IconButton 
                            onClick={() => handleCancelRescue(rescue._id)}
                            disabled={rescue.status === 'completed' || rescue.status === 'failed' || rescue.status === 'cancelled'}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={rescue.isLocked ? "Mở khóa" : "Khóa"}>
                          <IconButton onClick={() => handleToggleLock(rescue._id)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRescues.length}
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

      {/* Dialog chi tiết cứu hộ */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Chi tiết ca cứu hộ
        </DialogTitle>
        <DialogContent>
          {currentRescue && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">{currentRescue.title}</Typography>
              
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Thông tin cơ bản</Typography>
                  <Typography><strong>Địa điểm:</strong> {currentRescue.location}</Typography>
                  <Typography><strong>Loại động vật:</strong> {
                    currentRescue.animalType === 'dog' ? 'Chó' :
                    currentRescue.animalType === 'cat' ? 'Mèo' :
                    currentRescue.animalType === 'bird' ? 'Chim' :
                    currentRescue.animalType === 'snake' ? 'Rắn' :
                    currentRescue.animalType
                  }</Typography>
                  <Typography><strong>Mức độ ưu tiên:</strong> {
                    currentRescue.priority === 'high' ? 'Cao' :
                    currentRescue.priority === 'medium' ? 'Trung bình' :
                    currentRescue.priority === 'low' ? 'Thấp' :
                    currentRescue.priority
                  }</Typography>
                  <Typography><strong>Trạng thái:</strong> {
                    currentRescue.status === 'in_progress' ? 'Đang diễn ra' :
                    currentRescue.status === 'completed' ? 'Hoàn thành' :
                    currentRescue.status === 'failed' ? 'Không hoàn thành' :
                    currentRescue.status
                  }</Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Thông tin thời gian</Typography>
                  <Typography><strong>Người báo cáo:</strong> {currentRescue.reportedBy}</Typography>
                  <Typography><strong>Thời gian báo cáo:</strong> {formatDate(currentRescue.reportedAt)}</Typography>
                  <Typography><strong>Người được giao:</strong> {currentRescue.assignedTo}</Typography>
                  {currentRescue.status === 'completed' && (
                    <Typography><strong>Thời gian hoàn thành:</strong> {formatDate(currentRescue.completedAt)}</Typography>
                  )}
                  {currentRescue.status === 'failed' && (
                    <Typography><strong>Lý do không hoàn thành:</strong> {currentRescue.failureReason}</Typography>
                  )}
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Mô tả</Typography>
                  <Typography paragraph>{currentRescue.description}</Typography>
                </Grid>
                
                {currentRescue.images && currentRescue.images.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Hình ảnh</Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
                      {currentRescue.images.map((image, index) => (
                        <Box
                          key={index}
                          component="img"
                          src={image}
                          alt={`Hình ảnh ${index + 1}`}
                          sx={{
                            width: 150,
                            height: 150,
                            objectFit: 'cover',
                            borderRadius: 1
                          }}
                        />
                      ))}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RescueManagement;