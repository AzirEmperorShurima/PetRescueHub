import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Button, Snackbar, Alert
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
      const response = await axios.get('/admin/reports');
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

  const handleOpenDetailDialog = async (report) => {
    try {
      const response = await axios.get(`/admin/reports/details/${report.id}`);
      setSelectedReport(response.data);
      setOpenDetailDialog(true);
    } catch (error) {
      setSnackbar({ open: true, message: 'Lỗi khi lấy chi tiết báo cáo', severity: 'error' });
    }
  };

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
    setSelectedReport(null);
  };

  const handleUpdateReport = async (id, updateData) => {
    try {
      await axios.put(`/admin/reports/${id}`, updateData);
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
    <Box>
      <Typography variant="h4" mb={3}>Quản lý báo cáo</Typography>
      <Paper>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Loại</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.id}</TableCell>
                  <TableCell>{report.type}</TableCell>
                  <TableCell>
                    <Chip label={report.status} color={report.status === 'resolved' ? 'success' : 'warning'} />
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
                <div><b>ID:</b> {selectedReport.id}</div>
                <div><b>Loại:</b> {selectedReport.type}</div>
                <div><b>Trạng thái:</b> {selectedReport.status}</div>
                <div><b>Nội dung:</b> {selectedReport.content}</div>
                {/* Thêm các trường khác nếu cần */}
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailDialog}>Đóng</Button>
          {selectedReport && selectedReport.status !== 'resolved' && (
            <Button
              color="success"
              onClick={() => handleUpdateReport(selectedReport.id, { status: 'resolved' })}
            >
              Đánh dấu đã xử lý
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
    </Box>
  );
};

export default ReportManagement; 