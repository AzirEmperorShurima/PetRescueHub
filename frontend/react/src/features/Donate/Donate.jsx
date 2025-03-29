import React, { useState } from 'react';
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
  Alert
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import './Donate.css';
// Using a dynamic QR code service
const Donate = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Use a placeholder QR code from an external source
  const placeholderQrCode = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://hanoipetadoption.com/donate';
  
  // Bank account details
  const accountDetails = {
    bank: "Vietcombank",
    accountNumber: "1234567890",
    accountName: "PetRescueHub",
    content: "Ủng hộ [Tên của bạn]"
  };
  
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };
  
  return (
    <Fade in={true} timeout={800}>
      <Container maxWidth={false} className="donate-container" sx={{ px: { xs: 2, sm: 3, md: 5 }, maxWidth: '1600px', mx: 'auto' }}>
        <Box className="donate-header" sx={{ width: '100%', mb: 4, textAlign: 'center' }}>
          <Typography variant="h2" component="h1" className="donate-title">
            Chia Sẽ Yêu Thương
          </Typography>
        </Box>
        
        <Grid container spacing={4} className="donate-content">
          <Grid item xs={12} md={7}>
            <Card elevation={0} className="donation-info-card" sx={{ height: '100%' }}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                {/* Content remains the same */}
                <Typography variant="body1" paragraph className="donation-text">
                  PetRescueHub là nơi đem đến hy vọng và sự sống mới cho những người bạn nhỏ vô gia cư, mọi hoạt động của chúng tôi đều phụ thuộc hoàn toàn vào tấm lòng vàng từ cộng đồng. Mỗi tháng, nhóm phải đối mặt với những chi phí không nhỏ, bao gồm tiền thuê nhà, viện phí, thức ăn, điện, nước, thuốc men, cùng các vật dụng thiết yếu như bỉm, tã và đồ dùng. Ngoài ra, chúng tôi còn hỗ trợ một phần lương cho các tình nguyện viên - những người không ngừng cống hiến để giữ gìn môi trường sống sạch sẽ và an toàn cho các bé.
                </Typography>
                
                <Typography variant="body1" paragraph className="donation-text">
                  Chúng tôi kêu gọi sự chung tay của cộng đồng để duy trì "ngôi nhà chung" - nơi đầy ắp yêu thương và hy vọng, cũng như đảm bảo sự hoạt động bền vững cho đội cứu hộ. Hãy là một phần của hành trình nhân ái này, bởi chỉ một hành động nhỏ từ bạn cũng có thể tạo nên sự thay đổi lớn lao trong cuộc sống của những người bạn nhỏ cần được che chở.
                </Typography>
                
                <Typography variant="body1" paragraph className="donation-highlight">
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
                
                <Box className="donation-note-container">
                  <Typography variant="body2" className="donation-note">
                    *Lưu ý: nhóm không dùng zalo và KHÔNG BAO GIỜ yêu cầu Mạnh Thường Quân cung cấp thông tin thẻ
                    hoặc mã OTP
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <Card elevation={3} className="donation-qr-card" sx={{ height: '100%' }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                {/* QR content here */}
                <Box className="donation-qr">
                  <img 
                    src={placeholderQrCode} 
                    alt="QR Code for donation" 
                    className="qr-code" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/250x250?text=QR+Code";
                    }}
                  />
                  <Box className="donation-box">
                    <Typography variant="h6" className="donation-text">DONATION</Typography>
                  </Box>
                  
                  <Box className="donation-methods">
                    <Typography variant="subtitle1" className="donation-method-title">
                      Phương thức thanh toán
                    </Typography>
                    
                    <Box className="donation-method-item">
                      <Typography variant="body2">
                        <img src="https://upload.wikimedia.org/wikipedia/vi/7/7c/Vietcombank_logo.svg" alt="Vietcombank" className="bank-logo" />
                        Ngân hàng:
                      </Typography>
                      <Typography variant="body2">{accountDetails.bank}</Typography>
                    </Box>
                    
                    <Box className="donation-method-item">
                      <Typography variant="body2">Số tài khoản:</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2">{accountDetails.accountNumber}</Typography>
                        <Tooltip title="Sao chép">
                          <IconButton 
                            size="small" 
                            className="copy-button"
                            onClick={() => handleCopy(accountDetails.accountNumber)}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                    
                    <Box className="donation-method-item">
                      <Typography variant="body2">Chủ tài khoản:</Typography>
                      <Typography variant="body2" className="account-name">{accountDetails.accountName}</Typography>
                    </Box>
                    
                    <Box className="donation-method-item">
                      <Typography variant="body2">Nội dung:</Typography>
                      <Typography variant="body2">{accountDetails.content}</Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Snackbar open={copySuccess} autoHideDuration={2000} onClose={() => setCopySuccess(false)}>
          <Alert severity="success" sx={{ width: '100%' }}>
            Đã sao chép thành công!
          </Alert>
        </Snackbar>
      </Container>
    </Fade>
  );
};

export default Donate;