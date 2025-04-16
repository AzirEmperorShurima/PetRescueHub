import React from 'react';
import { 
  Typography, 
  Box, 
  Paper,
  Chip,
  Avatar,
  Button
} from '@mui/material';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import PetsIcon from '@mui/icons-material/Pets';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

// Component hiển thị hoạt động cứu hộ của volunteer
const RescueActivities = ({ rescues = [], user }) => {
  // Nếu không phải volunteer thì không hiển thị
  if (user?.role !== 'volunteer') {
    return null;
  }

  // Nếu không có dữ liệu cứu hộ
  if (!rescues || rescues.length === 0) {
    return (
      <Box>
        <Typography variant="h5" gutterBottom>Hoạt động cứu hộ</Typography>
        <Paper className="empty-rescues" sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            Chưa có hoạt động cứu hộ nào được ghi nhận.
          </Typography>
        </Paper>
      </Box>
    );
  }

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: vi });
    } catch (error) {
      return 'Không rõ ngày';
    }
  };

  // Hiển thị trạng thái cứu hộ
  const getStatusChip = (status) => {
    const statusMap = {
      'pending': { label: 'Đang chờ', color: 'warning' },
      'in_progress': { label: 'Đang thực hiện', color: 'info' },
      'completed': { label: 'Hoàn thành', color: 'success' },
      'cancelled': { label: 'Đã hủy', color: 'error' }
    };

    const statusInfo = statusMap[status] || { label: 'Không xác định', color: 'default' };

    return (
      <Chip 
        label={statusInfo.label} 
        color={statusInfo.color} 
        size="small" 
        variant="outlined"
      />
    );
  };

  return (
    <Box>
      <Typography variant="h5" className="tab-title" gutterBottom>Hoạt động cứu hộ</Typography>
      
      <div className="rescue-activities-container">
        {rescues.map((rescue) => (
          <Paper key={rescue.id} className="rescue-activity-item" elevation={1}>
            <div className="rescue-activity-header">
              <div className="rescue-activity-title-section">
                <VolunteerActivismIcon className="rescue-icon" color="primary" />
                <div>
                  <Typography variant="h6" className="rescue-title">
                    {rescue.title}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                    {getStatusChip(rescue.status)}
                    <Box display="flex" alignItems="center" ml={1}>
                      <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary', fontSize: '0.875rem' }} />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(rescue.reportedAt)}
                      </Typography>
                    </Box>
                  </Box>
                </div>
              </div>
            </div>

            <div className="rescue-activity-content">
              <Typography variant="body1" paragraph>
                {rescue.description}
              </Typography>
              
              {rescue.images && rescue.images.length > 0 && (
                <div className="rescue-images">
                  {rescue.images.map((image, index) => (
                    <img 
                      key={index}
                      src={image} 
                      alt={`Hình ảnh cứu hộ ${index + 1}`} 
                      className="rescue-image" 
                    />
                  ))}
                </div>
              )}
              
              <div className="rescue-details">
                <Box display="flex" alignItems="center" mb={1}>
                  <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {rescue.location}
                  </Typography>
                </Box>
                
                {rescue.assignedTo && (
                  <Box display="flex" alignItems="center" mb={1}>
                    <PetsIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Được giao cho: {rescue.assignedTo}
                    </Typography>
                  </Box>
                )}
                
                {rescue.priority && (
                  <Chip 
                    label={`Mức độ ưu tiên: ${rescue.priority === 'high' ? 'Cao' : rescue.priority === 'medium' ? 'Trung bình' : 'Thấp'}`} 
                    size="small" 
                    variant="outlined"
                    sx={{ mr: 1 }}
                  />
                )}
              </div>
              
              {rescue.resolution && (
                <Box mt={2} p={1.5} bgcolor="#f8f9fa" borderRadius={1}>
                  <Typography variant="subtitle2" gutterBottom>
                    Kết quả cứu hộ:
                  </Typography>
                  <Typography variant="body2">
                    {rescue.resolution}
                  </Typography>
                </Box>
              )}
            </div>
            
            <div className="rescue-activity-actions">
              <Button 
                startIcon={<VisibilityIcon />} 
                variant="outlined"
                size="small"
              >
                Xem chi tiết
              </Button>
            </div>
          </Paper>
        ))}
      </div>
    </Box>
  );
};

export default RescueActivities;