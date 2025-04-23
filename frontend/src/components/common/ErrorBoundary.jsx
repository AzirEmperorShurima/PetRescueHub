import React, { Component } from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Cập nhật state để hiển thị UI fallback
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Ghi log lỗi
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ error, errorInfo });
    
    // Gửi lỗi đến service theo dõi lỗi (nếu có)
    // errorTrackingService.captureException(error, { extra: errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Hiển thị UI khi có lỗi
      return (
        <Container maxWidth="md">
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              mt: 4, 
              textAlign: 'center',
              borderRadius: 2,
              backgroundColor: '#fff8f8'
            }}
          >
            <ErrorOutlineIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom color="error">
              Đã xảy ra lỗi
            </Typography>
            <Typography variant="body1" paragraph>
              Rất tiếc, đã xảy ra lỗi khi tải trang này. Đội ngũ kỹ thuật của chúng tôi đã được thông báo và đang khắc phục.
            </Typography>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box sx={{ mt: 2, mb: 3, textAlign: 'left', p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="error" sx={{ fontFamily: 'monospace' }}>
                  {this.state.error.toString()}
                </Typography>
                {this.state.errorInfo && (
                  <Typography 
                    variant="body2" 
                    component="pre" 
                    sx={{ 
                      mt: 1, 
                      fontSize: '0.8rem', 
                      maxHeight: '200px', 
                      overflow: 'auto',
                      fontFamily: 'monospace'
                    }}
                  >
                    {this.state.errorInfo.componentStack}
                  </Typography>
                )}
              </Box>
            )}
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button variant="contained" color="primary" onClick={this.handleReload}>
                Tải lại trang
              </Button>
              <Button variant="outlined" color="primary" onClick={this.handleGoHome}>
                Về trang chủ
              </Button>
            </Box>
          </Paper>
        </Container>
      );
    }

    // Nếu không có lỗi, hiển thị children bình thường
    return this.props.children;
  }
}

export default ErrorBoundary;