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
  Snackbar,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import { Delete as DeleteIcon, Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import axios from 'axios';
import { fDate, fDateTime } from '../../../utils/format-time';

const postTypes = [
  { label: 'Bài viết', value: 'ForumPost' },
  { label: 'Sự kiện', value: 'EventPost' },
  { label: 'Câu hỏi', value: 'Question' },
  { label: 'Tìm thú đi lạc', value: 'FindLostPetPost' }
];

const ForumPostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [currentPostType, setCurrentPostType] = useState(postTypes[0].value);

  useEffect(() => {
    fetchPosts();
  }, [currentPostType, page, rowsPerPage]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/admin/forum-posts', {
        params: {
          postType: currentPostType,
          page: page + 1,
          limit: rowsPerPage
        }
      });
      const postsData = Array.isArray(response.data) ? response.data : [];
      setPosts(postsData);
    } catch (error) {
      showSnackbar('Lỗi khi tải dữ liệu bài viết', 'error');
      setPosts([]);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDeleteDialog = (post) => {
    setSelectedPost(post);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedPost(null);
  };

  const handleOpenApproveDialog = (post) => {
    setSelectedPost(post);
    setOpenApproveDialog(true);
  };

  const handleCloseApproveDialog = () => {
    setOpenApproveDialog(false);
    setSelectedPost(null);
  };

  const handleDeletePost = async () => {
    try {
      await axios.delete(`/api/admin/forum-posts/${selectedPost.id}`);
      setPosts(posts.filter(post => post.id !== selectedPost.id));
      showSnackbar('Xóa bài viết thành công');
      handleCloseDeleteDialog();
    } catch (error) {
      showSnackbar('Lỗi khi xóa bài viết', 'error');
    }
  };

  const handleApproveEvent = async (approved) => {
    try {
      await axios.post(`/api/admin/forum-posts/${selectedPost.id}/approve`, { approved });
      fetchPosts();
      showSnackbar(approved ? 'Đã phê duyệt sự kiện' : 'Đã từ chối sự kiện');
      handleCloseApproveDialog();
    } catch (error) {
      showSnackbar('Lỗi khi phê duyệt sự kiện', 'error');
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
      pending: { label: 'Chờ duyệt', color: 'warning' },
      approved: { label: 'Đã duyệt', color: 'success' },
      rejected: { label: 'Đã từ chối', color: 'error' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <Chip label={config.label} color={config.color} />;
  };

  // Tính toán dữ liệu cho phân trang
  const paginatedPosts = Array.isArray(posts) ? posts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Quản lý bài viết diễn đàn</Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentPostType} onChange={(e, v) => setCurrentPostType(v)}>
          {postTypes.map(pt => (
            <Tab key={pt.value} label={pt.label} value={pt.value} />
          ))}
        </Tabs>
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
              {paginatedPosts.map((post) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={post.id}>
                  <TableCell>{post.id}</TableCell>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>{post.location}</TableCell>
                  <TableCell>{fDateTime(post.startDate)}</TableCell>
                  <TableCell>{fDateTime(post.endDate)}</TableCell>
                  <TableCell>{getStatusChip(post.status)}</TableCell>
                  <TableCell>{fDate(post.createdAt)}</TableCell>
                  <TableCell>
                    {currentPostType === 'EventPost' && post.status === 'pending' && (
                      <>
                        <IconButton 
                          color="success" 
                          onClick={() => handleOpenApproveDialog(post)}
                        >
                          <CheckIcon />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => handleApproveEvent(false)}
                        >
                          <CloseIcon />
                        </IconButton>
                      </>
                    )}
                    <IconButton 
                      color="error" 
                      onClick={() => handleOpenDeleteDialog(post)}
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
          count={posts.length}
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

      {/* Dialog xóa bài viết */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa bài viết "{selectedPost?.title}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
          <Button onClick={handleDeletePost} color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog phê duyệt sự kiện */}
      <Dialog
        open={openApproveDialog}
        onClose={handleCloseApproveDialog}
      >
        <DialogTitle>Xác nhận phê duyệt</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn phê duyệt sự kiện "{selectedPost?.title}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseApproveDialog}>Hủy</Button>
          <Button onClick={() => handleApproveEvent(true)} color="success">
            Phê duyệt
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

export default ForumPostManagement;