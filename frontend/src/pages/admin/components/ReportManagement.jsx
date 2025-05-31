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
      const response = await axios.get('/api/report/user-reports');
      setReports(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setSnackbar({ open: true, message: 'Lỗi khi tải danh sách báo cáo', severity: 'error' });
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

  const handleUpdateReport = async (id) => {
    try {
      await axios.delete(`/api/report/cancel/${id}`);
      setSnackbar({ open: true, message: 'Cập nhật báo cáo thành công', severity: 'success' });
      fetchReports();
      handleCloseDetailDialog();
    } catch (error) {
      setSnackbar({ open: true, message: 'Lỗi khi cập nhật báo cáo', severity: 'error' });
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
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 120 }}>Loại báo cáo</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 100 }}>Trạng thái</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 140 }}>Ngày tạo</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 100 }}>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedReports.map((report) => (
                <TableRow key={report._id}>
                  <TableCell>{report._id}</TableCell>
                  <TableCell>{report.reportType}</TableCell>
                  <TableCell>
                    <Chip 
                      label={report.status} 
                      color={report.status === 'Reviewed' ? 'success' : 'warning'} 
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
        />
      </Paper>

      {/* Dialog chi tiết báo cáo */}
      <Dialog open={openDetailDialog} onClose={handleCloseDetailDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Chi tiết báo cáo</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedReport && (
              <>
                <div><b>ID:</b> {selectedReport._id}</div>
                <div><b>Loại báo cáo:</b> {selectedReport.reportType}</div>
                <div><b>Trạng thái:</b> {selectedReport.status}</div>
                <div><b>Lý do:</b> {selectedReport.reason}</div>
                <div><b>Chi tiết:</b> {selectedReport.details}</div>
                <div><b>Ngày tạo:</b> {new Date(selectedReport.createdAt).toLocaleString()}</div>
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailDialog}>Đóng</Button>
          {selectedReport && selectedReport.status === 'Pending' && (
            <Button
              color="error"
              onClick={() => handleUpdateReport(selectedReport._id)}
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