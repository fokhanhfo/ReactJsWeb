'use client';

import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Typography,
  Button,
  Box,
  IconButton,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

OtpInputDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  onResend: PropTypes.func,
  email: PropTypes.string,
  isLoading: PropTypes.bool,
  isResendLoading: PropTypes.bool, // Thêm prop cho resend loading
};

function OtpInputDialog({ open, onClose, onSubmit, onResend, email, isLoading = false, isResendLoading = false }) {
  const countdownRef = useRef(null);
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const inputRefs = useRef([]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [canResend, setCanResend] = useState(false);

  // Kiểm tra có loading nào đang chạy không
  const isAnyLoading = isLoading || isResendLoading;

  useEffect(() => {
    if (open) {
      setOtp(new Array(6).fill(''));
      startCountdown(); // Bắt đầu đếm ngược khi mở
    }

    return () => {
      clearInterval(countdownRef.current); // Dọn dẹp khi đóng
    };
  }, [open]);

  const handleChange = (value, index) => {
    // Không cho nhập khi đang loading
    if (isAnyLoading) return;

    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    // Auto submit khi nhập đủ 6 số và không đang loading
    if (newOtp.every((digit) => digit !== '') && onSubmit && !isLoading) {
      onSubmit(newOtp.join(''));
    }
  };

  const handleKeyDown = (e, index) => {
    // Không cho xóa khi đang loading
    if (isAnyLoading) return;

    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResend = () => {
    if (onResend && !isResendLoading) {
      onResend(email);
      setOtp(new Array(6).fill(''));
      startCountdown();
    }
  };

  const startCountdown = () => {
    setCanResend(false);
    setTimeLeft(120);

    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    countdownRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleManualSubmit = () => {
    const otpValue = otp.join('');
    if (otpValue.length === 6 && onSubmit && !isLoading) {
      onSubmit(otpValue);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleDialogClose = (event, reason) => {
    // Không cho đóng khi đang loading
    if (isAnyLoading) return;

    if (reason !== 'backdropClick') {
      onClose?.();
    }
  };

  const handleCloseClick = () => {
    // Không cho đóng khi đang loading
    if (!isAnyLoading) {
      onClose?.();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      disableEscapeKeyDown={isAnyLoading} // Không cho ESC khi loading
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Xác minh OTP
        <IconButton
          aria-label="close"
          onClick={handleCloseClick}
          disabled={isAnyLoading} // Disable close button khi loading
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
        <Typography gutterBottom>Vui lòng nhập mã xác nhận gồm 6 số đã gửi đến email của bạn.</Typography>

        {/* Hiển thị loading state */}
        {isLoading && (
          <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
            <CircularProgress size={20} sx={{ mr: 1 }} />
            <Typography variant="body2" color="primary">
              Đang xác thực OTP...
            </Typography>
          </Box>
        )}

        <Stack direction="row" spacing={1} justifyContent="center" mt={2}>
          {otp.map((digit, index) => (
            <TextField
              key={index}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              disabled={isAnyLoading} // Disable inputs khi loading
              inputProps={{
                maxLength: 1,
                style: {
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  width: '3rem',
                  height: '3rem',
                },
              }}
              inputRef={(el) => (inputRefs.current[index] = el)}
              sx={{
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: isAnyLoading ? '#999' : 'inherit',
                },
              }}
            />
          ))}
        </Stack>

        <Box mt={2} textAlign="center">
          {!canResend ? (
            <Typography variant="body2" color="text.secondary">
              Gửi lại mã sau: {formatTime(timeLeft)}
            </Typography>
          ) : (
            <Button
              variant="outlined"
              onClick={handleResend}
              disabled={isResendLoading}
              startIcon={isResendLoading ? <CircularProgress size={16} /> : null}
            >
              {isResendLoading ? 'Đang gửi...' : 'Gửi lại mã OTP'}
            </Button>
          )}
        </Box>

        {/* Thêm nút submit manual nếu cần */}
        {otp.every((digit) => digit !== '') && (
          <Box mt={2} textAlign="center">
            <Button
              variant="contained"
              onClick={handleManualSubmit}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={16} /> : null}
              fullWidth
            >
              {isLoading ? 'Đang xác thực...' : 'Xác thực OTP'}
            </Button>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleCloseClick}
          color="secondary"
          disabled={isAnyLoading} // Disable cancel khi loading
        >
          Hủy
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default OtpInputDialog;
