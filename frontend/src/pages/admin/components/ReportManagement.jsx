import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Button, Snackbar, Alert, Container
} from '@mui/material';
import { Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import axios from 'axios';

const ReportManagement = () => {
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedReport, setSelectedReport] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      console.log('Đang tải danh sách báo cáo...');
      const response = await axios.get('/api/admin/reports');
      console.log('Dữ liệu báo cáo nhận được:', response.data);
      
      // Kiểm tra và lấy mảng reports từ response
      const reportsData = response.data?.reports || [];
      setReports(Array.isArray(reportsData) ? reportsData : []);
      
      // Log để debug
      console.log('Dữ liệu reports sau khi xử lý:', reportsData);
    } catch (error) {
      console.error('Lỗi khi tải danh sách báo cáo:', error);
      setSnackbar({ 
        open: true, 
        message: 'Lỗi khi tải danh sách báo cáo: ' + (error.response?.data?.message || error.message), 
        severity: 'error' 
      });
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDetailDialog = (report) => {
    setSelectedReport(report);
    setOpenDetailDialog(true);
  };

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
    setSelectedReport(null);
  };

  const handleCancelReport = async (reportId) => {
    try {
      console.log('Đang hủy báo cáo:', reportId);
      await axios.delete(`/api/report/cancel/${reportId}`);
      console.log('Hủy báo cáo thành công');
      setSnackbar({ 
        open: true, 
        message: 'Hủy báo cáo thành công', 
        severity: 'success' 
      });
      fetchReports(); // Tải lại danh sách sau khi hủy
      handleCloseDetailDialog();
    } catch (error) {
      console.error('Lỗi khi hủy báo cáo:', error);
      setSnackbar({ 
        open: true, 
        message: 'Lỗi khi hủy báo cáo: ' + (error.response?.data?.message || error.message), 
        severity: 'error' 
      });
    }
  };

  // Phân trang
  const paginatedReports = reports.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container maxWidth={false} disableGutters sx={{ px: { xs: 0.5, sm: 2, md: 0.1 }, py: 2 }}>
      <Typography variant="h4" mb={3}>Quản lý báo cáo</Typography>
      <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 2 }}>
        <TableContainer sx={{ maxHeight: { xs: 400, md: 650 }, minHeight: 350, overflowX: 'auto' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 120 }}>ID</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 80 }}>Loại báo cáo</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 100 }}>Người báo cáo</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 100 }}>Đối tượng bị báo cáo</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 120 }}>Lý do</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 160, display: { xs: 'none', md: 'table-cell' } }}>Chi tiết</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 100 }}>Trạng thái</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 120, display: { xs: 'none', md: 'table-cell' } }}>Hành động đã thực hiện</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 140 }}>Ngày tạo</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 100 }}>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedReports.map((report) => (
                <TableRow hover key={report._id}>
                  <TableCell sx={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{report._id}</TableCell>
                  <TableCell>
                    <Chip 
                      label={report.reportType} 
                      color={report.reportType === 'User' ? 'primary' : 'secondary'} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <img
                        src={report.reporter?.avatar}
                        alt="reporter"
                        width={32}
                        height={32}
                        style={{ borderRadius: 16, objectFit: 'cover' }}
                        onError={e => { e.target.src = 'https://ui-avatars.com/api/?name=' + (report.reporter?.username || 'User'); }}
                      />
                      <Typography variant="body2" sx={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {report.reporter?.username}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <img
                        src={report.targetId?.avatar}
                        alt="target"
                        width={32}
                        height={32}
                        style={{ borderRadius: 16, objectFit: 'cover' }}
                        onError={e => { e.target.src = 'https://ui-avatars.com/api/?name=' + (report.targetId?.username || 'User'); }}
                      />
                      <Typography variant="body2" sx={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {report.targetId?.username}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{report.reason}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{report.details}</TableCell>
                  <TableCell>
                    <Chip 
                      label={report.status} 
                      color={report.status === 'Reviewed' ? 'success' : 'warning'} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    <Chip 
                      label={report.actionTaken || 'Chưa có'} 
                      color={report.actionTaken === 'None' ? 'default' : 'info'} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{new Date(report.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpenDetailDialog(report)}>
                      <VisibilityIcon />
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
          count={reports.length}
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

      {/* Dialog chi tiết báo cáo */}
      <Dialog open={openDetailDialog} onClose={handleCloseDetailDialog} maxWidth="md" fullWidth>
        <DialogTitle>Chi tiết báo cáo</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedReport && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Thông tin báo cáo</Typography>
                  <Typography variant="body2"><b>ID:</b> {selectedReport._id}</Typography>
                  <Typography variant="body2"><b>Loại báo cáo:</b> {selectedReport.reportType}</Typography>
                  <Typography variant="body2"><b>Trạng thái:</b> {selectedReport.status}</Typography>
                  <Typography variant="body2"><b>Lý do:</b> {selectedReport.reason}</Typography>
                  <Typography variant="body2"><b>Chi tiết:</b> {selectedReport.details}</Typography>
                  <Typography variant="body2"><b>Hành động đã thực hiện:</b> {selectedReport.actionTaken || 'Chưa có'}</Typography>
                  <Typography variant="body2"><b>Ngày tạo:</b> {new Date(selectedReport.createdAt).toLocaleString()}</Typography>
                  <Typography variant="body2"><b>Cập nhật lần cuối:</b> {new Date(selectedReport.updatedAt).toLocaleString()}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Thông tin người báo cáo</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <img
                      src={selectedReport.reporter?.avatar}
                      alt="reporter"
                      width={48}
                      height={48}
                      style={{ borderRadius: 24, objectFit: 'cover' }}
                      onError={e => { e.target.src = 'https://ui-avatars.com/api/?name=' + (selectedReport.reporter?.username || 'User'); }}
                    />
                    <Box>
                      <Typography variant="body2"><b>Username:</b> {selectedReport.reporter?.username}</Typography>
                      <Typography variant="body2"><b>Email:</b> {selectedReport.reporter?.email}</Typography>
                    </Box>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Thông tin đối tượng bị báo cáo</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <img
                      src={selectedReport.targetId?.avatar}
                      alt="target"
                      width={48}
                      height={48}
                      style={{ borderRadius: 24, objectFit: 'cover' }}
                      onError={e => { e.target.src = 'https://ui-avatars.com/api/?name=' + (selectedReport.targetId?.username || 'User'); }}
                    />
                    <Box>
                      <Typography variant="body2"><b>Username:</b> {selectedReport.targetId?.username}</Typography>
                      <Typography variant="body2"><b>Email:</b> {selectedReport.targetId?.email}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailDialog}>Đóng</Button>
          {selectedReport && selectedReport.status === 'Pending' && (
            <Button
              color="error"
              onClick={() => handleCancelReport(selectedReport._id)}
            >
              Hủy báo cáo
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ReportManagement; 