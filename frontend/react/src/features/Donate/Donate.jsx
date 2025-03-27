import React from 'react';
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
  Fade
} from '@mui/material';
import './Donate.css';
// Using a dynamic QR code service
const Donate = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Use a placeholder QR code from an external source
  const placeholderQrCode = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://hanoipetadoption.com/donate';
  
  return (
    <Fade in={true} timeout={800}>
      <Container maxWidth="lg" className="donate-container">
        <Box className="donate-header">
          <Typography variant="h2" component="h1" className="donate-title">
            Tôi Muốn Ủng Hộ
          </Typography>
        </Box>
        
        <Grid container spacing={4} className="donate-content">
          <Grid item xs={12} md={7}>
            <Card elevation={0} className="donation-info-card">
              <CardContent>
                <Typography variant="body1" paragraph className="donation-text">
                  Mọi hoạt động cứu hộ của Hanoi Pet Adoption hoàn toàn dựa trên các khoản quyên góp từ cộng đồng.
                  Chi phí hàng tháng của nhóm bao gồm tiền thuê nhà, tiền viện phí, thức ăn, điện, nước, thuốc men và
                  đồ dùng, bỉm tã, lương hỗ trợ các bạn tnv đơn dẹp... Nhóm rất cần sự giúp đỡ của các bạn để có thể
                  duy trì nhà chung cũng như đội cứu hộ.
                </Typography>
                
                <Typography variant="body1" paragraph className="donation-highlight">
                  Chỉ cần có định 50k - 100k hàng tháng là các bạn đã giúp đỡ được cho nhóm và các bé rất nhiều!
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
            <Card elevation={3} className="donation-qr-card">
              <CardContent>
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
                    <Typography variant="body2" className="donation-method-item">
                      Ngân hàng: Vietcombank
                    </Typography>
                    <Typography variant="body2" className="donation-method-item">
                      Số tài khoản: 1234567890
                    </Typography>
                    <Typography variant="body2" className="donation-method-item">
                      Chủ tài khoản: Hanoi Pet Adoption
                    </Typography>
                    <Typography variant="body2" className="donation-method-item">
                      Nội dung: Ủng hộ [Tên của bạn]
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Fade>
  );
};

export default Donate;