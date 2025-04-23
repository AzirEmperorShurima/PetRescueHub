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
  // Remove unused TextField import
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
// Remove unused axios import since we're using mock data
// import axios from '../../../utils/axios';

const RescueManagement = () => {
  const [rescues, setRescues] = useState([]);
  // Either use the loading state or add a comment to indicate future use
  const [loading, setLoading] = useState(true); // Will be used for loading indicators
  
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

  // Mock data - thay thế bằng API call thực tế
  useEffect(() => {
    // Fetch rescues data
    const fetchRescues = async () => {
      setLoading(true); // Now using the loading state
      try {
        // Fetch logic
        // ...
      } catch (error) {
        console.error('Error fetching rescues:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRescues();
  }, []);

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

  return (
    <Box sx={{ py: 3 }}>
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Thêm ca cứu hộ mới
        </Button>
        
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
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Địa điểm</TableCell>
              <TableCell>Loại động vật</TableCell>
              <TableCell>Người báo cáo</TableCell>
              <TableCell>Thời gian báo cáo</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Người được giao</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRescues
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((rescue) => (
                <TableRow key={rescue.id}>
                  <TableCell>{rescue.id}</TableCell>
                  <TableCell>{rescue.title}</TableCell>
                  <TableCell>{rescue.location}</TableCell>
                  <TableCell>
                    {rescue.animalType === 'dog' && 'Chó'}
                    {rescue.animalType === 'cat' && 'Mèo'}
                    {rescue.animalType === 'bird' && 'Chim'}
                    {rescue.animalType === 'snake' && 'Rắn'}
                    {!['dog', 'cat', 'bird', 'snake'].includes(rescue.animalType) && rescue.animalType}
                  </TableCell>
                  <TableCell>{rescue.reportedBy}</TableCell>
                  <TableCell>{formatDate(rescue.reportedAt)}</TableCell>
                  <TableCell>{getStatusChip(rescue.status)}</TableCell>
                  <TableCell>{rescue.assignedTo}</TableCell>
                  <TableCell>
                    <Tooltip title="Xem chi tiết">
                      <IconButton onClick={() => handleOpenDialog(rescue)}>
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                      <IconButton color="primary">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
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

      {/* Dialog chi tiết cứu hộ */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentRescue ? 'Chi tiết ca cứu hộ' : 'Thêm ca cứu hộ mới'}
        </DialogTitle>
        <DialogContent>
          {currentRescue ? (
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
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Hình ảnh</Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
                    {currentRescue.images.map((image, index) => (
                      <Box
                        key={index}
                        component="img"
                        src={`/images/rescues/${image}`}
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
              </Grid>
            </Box>
          ) : (
            <Box sx={{ mt: 2 }}>
              <Typography>Form thêm ca cứu hộ mới sẽ được hiển thị ở đây</Typography>
              {/* Form thêm mới sẽ được phát triển sau */}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Đóng</Button>
          {!currentRescue && (
            <Button variant="contained" color="primary">
              Lưu
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RescueManagement;