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
  Tab,
  Container,
  Menu,
  MenuItem,
  Badge
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  Check as CheckIcon, 
  Close as CloseIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
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
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPostForMenu, setSelectedPostForMenu] = useState(null);
  const [pendingEventsCount, setPendingEventsCount] = useState(0);
  const [eventParticipants, setEventParticipants] = useState({});

  useEffect(() => {
    fetchPosts();
  }, [currentPostType, page, rowsPerPage]);

  useEffect(() => {
    if (currentPostType === 'EventPost') {
      const count = posts.filter(post => post.approvalStatus === 'pending').length;
      setPendingEventsCount(count);
    } else {
      setPendingEventsCount(0);
    }
  }, [posts, currentPostType]);

  useEffect(() => {
    if (currentPostType === 'EventPost') {
      fetchEventParticipants();
    }
  }, [currentPostType, posts]);

  const fetchPosts = async () => {
    try {
      let response;
      if (currentPostType === 'EventPost') {
        response = await axios.get('/api/admin/managent/events/event-list');
        if (response.data && Array.isArray(response.data.events)) {
          setPosts(response.data.events);
          return;
        }
      } else {
        response = await axios.get('/api/forum/GET/posts', {
          params: {
            postType: currentPostType,
            search: "",
            page: page + 1,
            limit: rowsPerPage
          }
        });
        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          setPosts(response.data.data);
          return;
        }
      }
      setPosts([]);
    } catch (error) {
      setPosts([]);
    }
  };

  const fetchEventParticipants = async () => {
    try {
      const response = await axios.get('/api/admin/managent/events/event-list');
      if (response.data && Array.isArray(response.data.events)) {
        const participantsMap = {};
        response.data.events.forEach(event => {
          participantsMap[event._id] = event.participants?.length || 0;
        });
        setEventParticipants(participantsMap);
      } else {
        setEventParticipants({});
      }
    } catch (error) {
      setEventParticipants({});
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
    console.log('Opening approve dialog for post:', post);
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
    if (!selectedPost?._id) {
      showSnackbar('Không tìm thấy sự kiện để phê duyệt', 'error');
      return;
    }

    try {
      const url = approved
        ? '/api/admin/managent/events/action/approved'
        : '/api/admin/managent/events/action/rejected';

      const response = await axios.post(url, { eventId: selectedPost._id });

      // Nếu response trả về status 200 và có success hoặc message thành công thì coi là thành công
      if (response.status === 200 && (response.data?.success || response.data?.message === 'Event approved successfully')) {
        setPosts(posts.map(post =>
          post._id === selectedPost._id
            ? { ...post, approvalStatus: approved ? 'approved' : 'rejected' }
            : post
        ));
        await fetchEventParticipants();
        showSnackbar(approved ? 'Đã phê duyệt sự kiện' : 'Đã từ chối sự kiện', 'success');
        handleCloseApproveDialog(); // Đóng popup phê duyệt
      } else {
        showSnackbar('Lỗi khi phê duyệt sự kiện: ' + (response.data?.message || 'Không xác định'), 'error');
      }
    } catch (error) {
      showSnackbar('Lỗi khi phê duyệt sự kiện: ' + (error.response?.data?.message || error.message), 'error');
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
      rejected: { label: 'Đã từ chối', color: 'error' },
      public: { label: 'Công khai', color: 'success' },
      private: { label: 'Riêng tư', color: 'default' },
      hidden: { label: 'Ẩn', color: 'default' }
    };
    const config = statusConfig[status] || { label: status, color: 'default' };
    return <Chip label={config.label} color={config.color} />;
  };

  // Tính toán dữ liệu cho phân trang
  const paginatedPosts = Array.isArray(posts) ? posts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : [];

  const handleOpenMenu = (event, post) => {
    setAnchorEl(event.currentTarget);
    setSelectedPostForMenu(post);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedPostForMenu(null);
  };

  const handleToggleVisibility = async () => {
    try {
      const newStatus = selectedPostForMenu.postStatus === 'hidden' ? 'public' : 'hidden';
      await axios.put(`/api/admin/forum-posts/${selectedPostForMenu._id}/status`, {
        status: newStatus
      });
      showSnackbar(`Đã ${newStatus === 'hidden' ? 'ẩn' : 'hiện'} bài viết`);
      fetchPosts();
      handleCloseMenu();
    } catch (error) {
      console.error('Error toggling post visibility:', error);
      showSnackbar('Lỗi khi thay đổi trạng thái bài viết', 'error');
    }
  };

  // Thêm hàm kiểm tra trạng thái sự kiện
  const checkEventStatus = (post) => {
    const status = post.approvalStatus;
    return status === 'pending';
  };

  return (
    <Container maxWidth={false} disableGutters sx={{ px: { xs: 0.5, sm: 2, md: 0.1 }, py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Quản lý bài viết diễn đàn</Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentPostType} onChange={(e, v) => setCurrentPostType(v)}>
          {postTypes.map(pt => (
            <Tab 
              key={pt.value} 
              label={
                pt.value === 'EventPost' && pendingEventsCount > 0 ? (
                  <Badge badgeContent={pendingEventsCount} color="error">
                    {pt.label}
                  </Badge>
                ) : pt.label
              } 
              value={pt.value} 
            />
          ))}
        </Tabs>
      </Box>

      {currentPostType === 'EventPost' && pendingEventsCount > 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Có {pendingEventsCount} sự kiện mới cần được phê duyệt
        </Alert>
      )}

      <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 2 }}>
        <TableContainer sx={{ maxHeight: { xs: 400, md: 650 }, minHeight: 350, overflowX: 'auto' }}>
          <Table stickyHeader aria-label="sticky table" size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 120 }}>ID</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 120 }}>Tiêu đề</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 120 }}>Tác giả</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 120 }}>Tags</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 100 }}>Trạng thái</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 120 }}>Ngày tạo</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 100 }}>Loại bài</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 160, display: { xs: 'none', md: 'table-cell' } }}>Nội dung</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 120, display: { xs: 'none', md: 'table-cell' } }}>Violate Tags</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Violation Details</TableCell>
                {currentPostType === 'EventPost' && (
                  <>
                    <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 120, display: { xs: 'none', md: 'table-cell' } }}>Địa điểm</TableCell>
                    <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 160, display: { xs: 'none', md: 'table-cell' } }}>Thời gian bắt đầu</TableCell>
                    <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 160, display: { xs: 'none', md: 'table-cell' } }}>Thời gian kết thúc</TableCell>
                    <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 100 }}>Số người tham gia</TableCell>
                    <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 100 }}>Phê duyệt</TableCell>
                  </>
                )}
                <TableCell sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center', minWidth: 80 }}>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedPosts.map((post) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={post._id}>
                  <TableCell sx={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post._id}</TableCell>
                  <TableCell sx={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</TableCell>
                  <TableCell sx={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.author?.username}</TableCell>
                  <TableCell sx={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {Array.isArray(post.tags) ? post.tags.join(', ') : ''}
                  </TableCell>
                  <TableCell>{getStatusChip(post.approvalStatus)}</TableCell>
                  <TableCell>{fDate(post.createdAt)}</TableCell>
                  <TableCell>{post.postType}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {post.content}
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {Array.isArray(post.violate_tags) ? post.violate_tags.join(', ') : ''}
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {Array.isArray(post.violationDetails) && post.violationDetails.length > 0 ? (
                      <ul style={{ margin: 0, paddingLeft: 16 }}>
                        {post.violationDetails.map((v, idx) => (
                          <li key={idx}>
                            {v.tag}: {v.reason} {v.triggerPhrase ? `(${v.triggerPhrase})` : ''}
                          </li>
                        ))}
                      </ul>
                    ) : ''}
                  </TableCell>
                  {currentPostType === 'EventPost' && (
                    <>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {post.eventLocation}
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                        {post.eventStartDate ? fDateTime(post.eventStartDate) : ''}
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                        {post.eventEndDate ? fDateTime(post.eventEndDate) : ''}
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={`${eventParticipants[post._id] || 0} người`}
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{getStatusChip(post.approvalStatus)}</TableCell>
                    </>
                  )}
                  <TableCell>
                    {currentPostType === 'EventPost' && post.approvalStatus === 'pending' && (
                      <>
                        <IconButton 
                          color="success" 
                          onClick={() => handleOpenApproveDialog(post)}
                          size="small"
                          title="Phê duyệt sự kiện"
                        >
                          <CheckIcon />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => handleApproveEvent(false)}
                          size="small"
                          title="Từ chối sự kiện"
                        >
                          <CloseIcon />
                        </IconButton>
                      </>
                    )}
                    <IconButton
                      onClick={(e) => handleOpenMenu(e, post)}
                      size="small"
                    >
                      <MoreVertIcon />
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

      {/* Menu cho các hành động */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleToggleVisibility}>
          {selectedPostForMenu?.postStatus === 'hidden' ? (
            <>
              <VisibilityIcon sx={{ mr: 1 }} /> Hiện bài viết
            </>
          ) : (
            <>
              <VisibilityOffIcon sx={{ mr: 1 }} /> Ẩn bài viết
            </>
          )}
        </MenuItem>
        <MenuItem onClick={() => {
          handleOpenDeleteDialog(selectedPostForMenu);
          handleCloseMenu();
        }}>
          <DeleteIcon sx={{ mr: 1 }} /> Xóa bài viết
        </MenuItem>
      </Menu>

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
            {selectedPost && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2">Thông tin sự kiện:</Typography>
                <Typography variant="body2">Địa điểm: {selectedPost.eventLocation}</Typography>
                <Typography variant="body2">Thời gian bắt đầu: {fDateTime(selectedPost.eventStartDate)}</Typography>
                <Typography variant="body2">Thời gian kết thúc: {fDateTime(selectedPost.eventEndDate)}</Typography>
                <Typography variant="body2">Số người tham gia: {eventParticipants[selectedPost._id] || 0}</Typography>
              </Box>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseApproveDialog}>Hủy</Button>
          <Button onClick={() => handleApproveEvent(false)} color="error">
            Từ chối
          </Button>
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
    </Container>
  );
};

export default ForumPostManagement;