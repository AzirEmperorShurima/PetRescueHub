import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Card, 
  CardContent,
  Divider,
  useTheme,
  useMediaQuery,
  Stack,
  Fade,
  Tooltip,
  IconButton,
  Snackbar,
  Alert,
  Button,
  Tabs,
  Tab,
  Avatar
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PetsIcon from '@mui/icons-material/Pets';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import { motion } from 'framer-motion';
import './Donate.css';

// Import các logo thanh toán - sử dụng URL trực tiếp thay vì file local
const momoLogo = 'https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png';
const vnpayLogo = 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png';
const zalopayLogo = 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png';
const bankLogo = 'https://cdn-icons-png.flaticon.com/512/2830/2830284.png';

const Donate = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // QR code từ các dịch vụ thanh toán
  const qrCodes = {
    bank: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://hanoipetadoption.com/donate/bank',
    momo: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://hanoipetadoption.com/donate/momo',
    vnpay: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://hanoipetadoption.com/donate/vnpay',
    zalopay: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://hanoipetadoption.com/donate/zalopay'
  };
  
  // Thông tin tài khoản ngân hàng
  const accountDetails = {
    bank: "Vietcombank",
    accountNumber: "1234567890",
    accountName: "PetRescueHub",
    content: "Ủng hộ [Tên của bạn]"
  };

  // Hình ảnh động vật cần giúp đỡ
  const rescueImages = [
    "https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  ];

  // Thống kê về cứu hộ
  const rescueStats = [
    { label: "Thú cưng đã cứu", value: "1,250+", icon: <PetsIcon /> },
    { label: "Nhà mới đã tìm", value: "980+", icon: <FavoriteIcon /> },
    { label: "Nhà tài trợ", value: "3,500+", icon: <VolunteerActivismIcon /> }
  ];
  
  // Xử lý sao chép thông tin
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Xử lý chuyển tab
  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Hiệu ứng chuyển đổi hình ảnh
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % rescueImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [rescueImages.length]);
  
  // Animation variants cho framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <Container maxWidth={false} className="donate-container" sx={{ px: { xs: 2, sm: 3, md: 5 }, maxWidth: '1600px', mx: 'auto' }}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="donate-content-wrapper"
      >
        <motion.div variants={itemVariants} className="donate-header">
          <Typography variant="h2" component="h1" className="donate-title">
            Chia Sẻ Yêu Thương
          </Typography>
        </motion.div>
        
        <Grid container spacing={4} className="donate-content">
          {/* Phần thông tin quyên góp */}
          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <Card elevation={0} className="donation-info-card">
                <CardContent>
                  <Typography variant="body1" paragraph className="donation-text">
                    PetRescueHub là nơi đem đến hy vọng và sự sống mới cho những người bạn nhỏ vô gia cư, mọi hoạt động của chúng tôi đều phụ thuộc hoàn toàn vào tấm lòng vàng từ cộng đồng. Mỗi tháng, nhóm phải đối mặt với những chi phí không nhỏ, bao gồm tiền thuê nhà, viện phí, thức ăn, điện, nước, thuốc men, cùng các vật dụng thiết yếu như bỉm, tã và đồ dùng.
                  </Typography>
                  
                  <Typography variant="body1" paragraph className="donation-highlight" sx={{ 
                    fontWeight: 'bold', 
                    fontSize: '1.2rem', 
                    color: '#e91e63',
                    textAlign: 'center',
                    padding: '15px',
                    borderLeft: '4px solid #e91e63',
                    backgroundColor: 'rgba(233, 30, 99, 0.05)',
                    borderRadius: '0 8px 8px 0'
                  }}>
                    Hãy giúp chúng tôi lan tỏa lòng yêu thương, vì một thế giới mà không ai bị bỏ rơi.
                  </Typography>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="body1" paragraph className="donation-text">
                    Chi phí sẽ được chia đều cho các bé khác còn nằm viện và gây dựng nhà chung. Ngoài ra Nhóm cũng
                    tiếp nhận quyên góp bằng hiện vật như:
                  </Typography>
                  
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
                    {['Quần áo cũ', 'Bỉm', 'Găng tay y tế', 'Thức ăn', 'Cát vệ sinh'].map((item) => (
                      <Box key={item} className="donation-tag">
                        {item}
                      </Box>
                    ))}
                  </Stack>
                  
                  {/* Thống kê cứu hộ */}
                  <Box className="rescue-stats-container">
                    <Grid container spacing={2}>
                      {rescueStats.map((stat, index) => (
                        <Grid item xs={4} key={index}>
                          <motion.div 
                            className="rescue-stat-item"
                            whileHover={{ y: -5, scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <Box className="rescue-stat-icon">{stat.icon}</Box>
                            <Typography variant="h4" className="rescue-stat-value">{stat.value}</Typography>
                            <Typography variant="body2" className="rescue-stat-label">{stat.label}</Typography>
                          </motion.div>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                  
                  <Box className="donation-note-container">
                    <Typography variant="body2" className="donation-note">
                      *Lưu ý: nhóm không dùng zalo và KHÔNG BAO GIỜ yêu cầu Mạnh Thường Quân cung cấp thông tin thẻ
                      hoặc mã OTP
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          
          {/* Phần hình ảnh động vật */}
          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <Card elevation={0} className="animal-showcase-card">
                <CardContent sx={{ p: 0 }}>
                  <Box className="animal-image-container">
                    {rescueImages.map((img, index) => (
                      <Box 
                        key={index}
                        className={`animal-image ${index === currentImageIndex ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${img})` }}
                      >
                        <Box className="animal-image-overlay">
                          <Typography variant="h5" className="animal-image-caption">
                            {index === 0 ? "Mỗi sinh mạng đều đáng quý" : 
                             index === 1 ? "Chúng tôi cần sự giúp đỡ của bạn" : 
                             "Hãy chung tay vì những người bạn bé nhỏ"}
                          </Typography>
                          <Button 
                            variant="contained" 
                            color="primary" 
                            className="donate-now-btn"
                            onClick={() => document.getElementById('payment-methods').scrollIntoView({ behavior: 'smooth' })}
                          >
                            Quyên góp ngay
                          </Button>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                  
                  <Box className="image-indicators">
                    {rescueImages.map((_, index) => (
                      <Box 
                        key={index} 
                        className={`image-indicator ${index === currentImageIndex ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="donation-quote-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Typography 
                variant="h6" 
                component="p" 
                className="donation-quote"
              >
                <span className="highlight-text">Mỗi đóng góp</span> của bạn là một <span className="highlight-text">cơ hội sống mới</span> cho những người bạn bốn chân
              </Typography>
            </motion.div>
          </Grid>
        </Grid>
        
        {/* Phần phương thức thanh toán */}
        <motion.div 
          variants={itemVariants}
          id="payment-methods" 
          className="payment-methods-section"
        >
          <Typography variant="h4" className="payment-section-title">
            Phương thức quyên góp
          </Typography>
          
          <Box sx={{ width: '100%', mt: 3 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleChangeTab} 
              variant="scrollable"
              scrollButtons="auto"
              className="payment-tabs"
            >
              <Tab 
                icon={<Avatar src={bankLogo} className="payment-tab-icon" />} 
                label="Chuyển khoản" 
                className="payment-tab"
              />
              <Tab 
                icon={<Avatar src={momoLogo} className="payment-tab-icon" />} 
                label="Momo" 
                className="payment-tab"
              />
              <Tab 
                icon={<Avatar src={vnpayLogo} className="payment-tab-icon" />} 
                label="VNPay" 
                className="payment-tab"
              />
              <Tab 
                icon={<Avatar src={zalopayLogo} className="payment-tab-icon" />} 
                label="ZaloPay" 
                className="payment-tab"
              />
            </Tabs>
            
            <Box sx={{ mt: 4 }}>
              {activeTab === 0 && (
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Box className="bank-details">
                      <Typography variant="h6" className="instruction-title">Thông tin chuyển khoản</Typography>
                      <Box className="bank-detail-item">
                        <Typography variant="body1" className="bank-detail-label">Ngân hàng:</Typography>
                        <Typography variant="body1" className="bank-detail-value">{accountDetails.bank}</Typography>
                        <IconButton size="small" onClick={() => handleCopy(accountDetails.bank)}>
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Box className="bank-detail-item">
                        <Typography variant="body1" className="bank-detail-label">Số tài khoản:</Typography>
                        <Typography variant="body1" className="bank-detail-value">{accountDetails.accountNumber}</Typography>
                        <IconButton size="small" onClick={() => handleCopy(accountDetails.accountNumber)}>
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Box className="bank-detail-item">
                        <Typography variant="body1" className="bank-detail-label">Tên tài khoản:</Typography>
                        <Typography variant="body1" className="bank-detail-value account-name">{accountDetails.accountName}</Typography>
                        <IconButton size="small" onClick={() => handleCopy(accountDetails.accountName)}>
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Box className="bank-detail-item">
                        <Typography variant="body1" className="bank-detail-label">Nội dung:</Typography>
                        <Typography variant="body1" className="bank-detail-value">{accountDetails.content}</Typography>
                        <IconButton size="small" onClick={() => handleCopy(accountDetails.content)}>
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4} className="qr-code-container">
                    <Box className="qr-code-wrapper">
                      <img src={qrCodes.bank} alt="QR Code Chuyển khoản" className="qr-code" />
                    </Box>
                    <Typography variant="body2" className="qr-code-caption">
                      Quét mã QR để chuyển khoản
                    </Typography>
                  </Grid>
                </Grid>
              )}
            
              
              {activeTab === 1 && (
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Box className="payment-instructions">
                      <Typography variant="h6" className="instruction-title">Hướng dẫn thanh toán qua Momo</Typography>
                      <ol className="instruction-steps">
                        <li>Mở ứng dụng Momo trên điện thoại</li>
                        <li>Chọn "Quét mã QR"</li>
                        <li>Quét mã QR bên cạnh</li>
                        <li>Nhập số tiền bạn muốn quyên góp</li>
                        <li>Nhập nội dung: "Ủng hộ [Tên của bạn]"</li>
                        <li>Xác nhận thanh toán</li>
                      </ol>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4} className="qr-code-container">
                    <Box className="qr-code-wrapper">
                      <img src={qrCodes.momo} alt="QR Code Momo" className="qr-code" />
                    </Box>
                    <Typography variant="body2" className="qr-code-caption">
                      Quét mã QR bằng ứng dụng Momo
                    </Typography>
                  </Grid>
                </Grid>
              )}
              
              {activeTab === 2 && (
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Box className="payment-instructions">
                      <Typography variant="h6" className="instruction-title">Hướng dẫn thanh toán qua VNPay</Typography>
                      <ol className="instruction-steps">
                        <li>Mở ứng dụng VNPay trên điện thoại</li>
                        <li>Chọn "Quét mã QR"</li>
                        <li>Quét mã QR bên cạnh</li>
                        <li>Nhập số tiền bạn muốn quyên góp</li>
                        <li>Nhập nội dung: "Ủng hộ [Tên của bạn]"</li>
                        <li>Xác nhận thanh toán</li>
                      </ol>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4} className="qr-code-container">
                    <img src={qrCodes.vnpay} alt="QR Code VNPay" className="qr-code" />
                    <Typography variant="body2" className="qr-code-caption">
                      Quét mã QR bằng ứng dụng VNPay
                    </Typography>
                  </Grid>
                </Grid>
              )}
              
              {activeTab === 3 && (
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Box className="payment-instructions">
                      <Typography variant="h6" className="instruction-title">Hướng dẫn thanh toán qua ZaloPay</Typography>
                      <ol className="instruction-steps">
                        <li>Mở ứng dụng ZaloPay trên điện thoại</li>
                        <li>Chọn "Quét mã QR"</li>
                        <li>Quét mã QR bên cạnh</li>
                        <li>Nhập số tiền bạn muốn quyên góp</li>
                        <li>Nhập nội dung: "Ủng hộ [Tên của bạn]"</li>
                        <li>Xác nhận thanh toán</li>
                      </ol>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4} className="qr-code-container">
                    <img src={qrCodes.zalopay} alt="QR Code ZaloPay" className="qr-code" />
                    <Typography variant="body2" className="qr-code-caption">
                      Quét mã QR bằng ứng dụng ZaloPay
                    </Typography>
                  </Grid>
                </Grid>
              )}
            </Box>
          </Box>
        </motion.div>
        
        {/* Phần câu chuyện cứu hộ */}
        <motion.div variants={itemVariants} className="rescue-stories-section">
          <Typography variant="h4" className="rescue-section-title">
            Câu chuyện cứu hộ
          </Typography>
          
          <Grid container spacing={3} className="rescue-stories-container">
            <Grid item xs={12} md={4}>
              <motion.div 
                className="rescue-story-card"
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Box className="rescue-story-image" style={{ backgroundImage: `url(${rescueImages[0]})` }} />
                <Box className="rescue-story-content">
                  <Typography variant="h6" className="rescue-story-title">Câu chuyện của Lucky</Typography>
                  <Typography variant="body2" className="rescue-story-excerpt">
                    Lucky được tìm thấy trong tình trạng bị bỏ rơi bên đường. Sau 3 tháng chăm sóc, Lucky đã tìm được gia đình mới...
                  </Typography>
                  <Button variant="outlined" className="read-more-btn">Đọc tiếp</Button>
                </Box>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <motion.div 
                className="rescue-story-card"
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Box className="rescue-story-image" style={{ backgroundImage: `url(${rescueImages[1]})` }} />
                <Box className="rescue-story-content">
                  <Typography variant="h6" className="rescue-story-title">Hành trình của Mèo Mun</Typography>
                  <Typography variant="body2" className="rescue-story-excerpt">
                    Mèo Mun bị bỏ rơi khi chỉ mới 2 tháng tuổi. Nhờ sự giúp đỡ của cộng đồng, Mun đã vượt qua...
                  </Typography>
                  <Button variant="outlined" className="read-more-btn">Đọc tiếp</Button>
                </Box>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <motion.div 
                className="rescue-story-card"
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Box className="rescue-story-image" style={{ backgroundImage: `url(${rescueImages[2]})` }} />
                <Box className="rescue-story-content">
                  <Typography variant="h6" className="rescue-story-title">Phép màu cho Bông</Typography>
                  <Typography variant="body2" className="rescue-story-excerpt">
                    Bông được tìm thấy trong tình trạng bị thương nặng. Sau nhiều tháng điều trị, Bông đã hồi phục...
                  </Typography>
                  <Button variant="outlined" className="read-more-btn">Đọc tiếp</Button>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </motion.div>
      
      <Snackbar open={copySuccess} autoHideDuration={2000} onClose={() => setCopySuccess(false)}>
        <Alert severity="success" sx={{ width: '100%' }}>
          Đã sao chép vào clipboard!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Donate;