import React from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  Tabs, 
  Tab, 
  Avatar,
  IconButton
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// Import các logo thanh toán - sử dụng URL trực tiếp thay vì file local
const momoLogo = 'https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png';
const vnpayLogo = 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png';
const zalopayLogo = 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png';
const bankLogo = 'https://cdn-icons-png.flaticon.com/512/2830/2830284.png';

const PaymentMethods = ({ activeTab, handleChangeTab, qrCodes, accountDetails, handleCopy }) => {
  return (
    <Box id="payment-methods" className="payment-methods-section">
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
            <BankTransferTab 
              accountDetails={accountDetails} 
              qrCode={qrCodes.bank} 
              handleCopy={handleCopy} 
            />
          )}
          
          {activeTab === 1 && (
            <PaymentAppTab 
              appName="Momo" 
              qrCode={qrCodes.momo} 
            />
          )}
          
          {activeTab === 2 && (
            <PaymentAppTab 
              appName="VNPay" 
              qrCode={qrCodes.vnpay} 
            />
          )}
          
          {activeTab === 3 && (
            <PaymentAppTab 
              appName="ZaloPay" 
              qrCode={qrCodes.zalopay} 
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

// Component cho tab chuyển khoản ngân hàng
const BankTransferTab = ({ accountDetails, qrCode, handleCopy }) => (
  <Grid container spacing={3} alignItems="flex-start">
    <Grid item xs={12} md={8}>
      <Box className="bank-details">
        <Typography variant="h6" className="instruction-title">Thông tin chuyển khoản</Typography>
        <Box className="bank-detail-item">
          <Typography variant="body1" className="bank-detail-label">Ngân hàng: </Typography>
          <Typography variant="body1" className="bank-detail-value">{accountDetails.bank}</Typography>
          <IconButton size="small" onClick={() => handleCopy(accountDetails.bank)}>
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box className="bank-detail-item">
          <Typography variant="body1" className="bank-detail-label">Số tài khoản: </Typography>
          <Typography variant="body1" className="bank-detail-value">{accountDetails.accountNumber}</Typography>
          <IconButton size="small" onClick={() => handleCopy(accountDetails.accountNumber)}>
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box className="bank-detail-item">
          <Typography variant="body1" className="bank-detail-label">Tên tài khoản: </Typography>
          <Typography variant="body1" className="bank-detail-value account-name">{accountDetails.accountName}</Typography>
          <IconButton size="small" onClick={() => handleCopy(accountDetails.accountName)}>
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box className="bank-detail-item">
          <Typography variant="body1" className="bank-detail-label">Nội dung: </Typography>
          <Typography variant="body1" className="bank-detail-value">{accountDetails.content}</Typography>
          <IconButton size="small" onClick={() => handleCopy(accountDetails.content)}>
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Grid>
    <Grid item xs={12} md={4}>
      <Box className="qr-code-container">
        <Box className="qr-code-wrapper">
          <img src={qrCode} alt="QR Code Chuyển khoản" className="qr-code" />
        </Box>
        <Typography variant="body2" className="qr-code-caption">
          Quét mã QR để chuyển khoản
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

// Component cho tab ứng dụng thanh toán
const PaymentAppTab = ({ appName, qrCode }) => (
  <Grid container spacing={3} alignItems="flex-start">
    <Grid item xs={12} md={8}>
      <Box className="payment-instructions">
        <Typography variant="h6" className="instruction-title">Hướng dẫn thanh toán qua {appName}</Typography>
        <ol className="instruction-steps">
          <li>Mở ứng dụng {appName} trên điện thoại</li>
          <li>Chọn "Quét mã QR"</li>
          <li>Quét mã QR bên cạnh</li>
          <li>Nhập số tiền bạn muốn quyên góp</li>
          <li>Nhập nội dung: "Ủng hộ [Tên của bạn]"</li>
          <li>Xác nhận thanh toán</li>
        </ol>
      </Box>
    </Grid>
    <Grid item xs={12} md={4}>
      <Box className="qr-code-container">
        <Box className="qr-code-wrapper">
          <img src={qrCode} alt={`QR Code ${appName}`} className="qr-code" />
        </Box>
        <Typography variant="body2" className="qr-code-caption">
          Quét mã QR bằng ứng dụng {appName}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

export default PaymentMethods;