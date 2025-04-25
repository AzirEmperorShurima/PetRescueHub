import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, Button, TextField, Box, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import authService from '../../services/auth.service';
import { useNotification } from '../../components/contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';


const OTPVerification = ({ open, onClose, userId, email, onVerify }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const resendDelay = 60; // 60 seconds

  useEffect(() => {
    if (open && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [open]);

  useEffect(() => {
    let timer;
    if (open && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [countdown, open]);

  const handleChange = (index, value) => {
    if (value.length > 1) {
      value = value.charAt(0);
    }

    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');

    if (!/^\d+$/.test(pastedData)) {
      return;
    }

    const digits = pastedData.slice(0, 6).split('');
    const newOtp = [...otp];

    digits.forEach((digit, index) => {
      if (index < 6) {
        newOtp[index] = digit;
      }
    });

    setOtp(newOtp);

    if (digits.length > 0 && digits.length < 6) {
      inputRefs.current[digits.length].focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setError('Vui lòng nhập đủ 6 chữ số OTP');
      return;
    }

    try {
      // Log thông tin trước khi gọi API
      console.log("Verifying OTP with:", { email, otpCode });
      await onVerify(otpCode);
      // Log response để debug
      let response;
      try {
        response = await onVerify(otpCode);
        console.log("OTP verification response:", response);
      } catch (err) {
        setError(err.message);
        return;
      }

      // Kiểm tra response theo nhiều cách
      const isSuccess =
        response === true ||
        response === 'success' ||
        response?.status === 200 ||
        response?.status === 201 ||
        response?.success === true ||
        (response?.data && (response.data.success === true || response.data.status === 'success'));

      if (isSuccess) {
        showNotification('Xác thực OTP thành công!', 'success');
        onVerify(otpCode)    // emit lên parent để parent xử lý verify+login :contentReference[oaicite:4]{index=4}
          .then(() => onClose())
          .catch(err => setError(err.message));
      } else {
        // Nếu không thành công, hiển thị thông báo lỗi
        const errorMessage =
          response?.message ||
          response?.data?.message ||
          response?.error ||
          response?.data?.error ||
          'Xác thực OTP thất bại';

        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setError(err.message || 'Xác thực OTP thất bại. Vui lòng thử lại.');
    }
  };

  const handleResend = async () => {
    setCountdown(resendDelay);
    setCanResend(false);

    try {
      // Gọi API gửi lại OTP
      const response = await authService.sendOTP(email, 'register');
      if (response.success) {
        showNotification('Mã OTP mới đã được gửi đến email của bạn', 'info');
        setError('');
      } else {
        setError(response.message || 'Không thể gửi lại mã OTP. Vui lòng thử lại sau.');
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
      setError(err.response?.data?.message || 'Không thể gửi lại mã OTP. Vui lòng thử lại sau.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Xác thực OTP
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="body1">
            Chúng tôi đã gửi mã OTP đến email {email}. Vui lòng nhập mã để hoàn tất quá trình.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
          {otp.map((digit, index) => (
            <TextField
              key={index}
              inputRef={(el) => (inputRefs.current[index] = el)}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              variant="outlined"
              inputProps={{
                maxLength: 1,
                style: { textAlign: 'center', fontSize: '1.5rem' },
              }}
              sx={{ width: '3rem', height: '3.5rem' }}
            />
          ))}
        </Box>

        {error && (
          <Typography color="error" sx={{ textAlign: 'center', mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleVerify}
          >
            Xác thực
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2">
              Chưa nhận được mã?
            </Typography>
            {canResend ? (
              <Button
                variant="text"
                color="primary"
                onClick={handleResend}
                sx={{ minWidth: 'auto', p: 0 }}
              >
                Gửi lại
              </Button>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Gửi lại sau {countdown}s
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default OTPVerification;