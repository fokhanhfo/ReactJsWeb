'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Alert,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import userApi from 'api/userApi';
import { useRequestChangePasswordMutation, useVerifyOtpChangePasswordMutation } from 'hookApi/userApi';

function ChangeEmailDialog({ open, onClose, currentEmail }) {
  const [activeStep, setActiveStep] = useState(0);
  const [newEmail, setNewEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const [requestChangePassword] = useRequestChangePasswordMutation();
  const [verifyOtpChangePassword] = useVerifyOtpChangePasswordMutation();

  const steps = ['Nhập email mới', 'Xác thực OTP'];

  // Countdown timer
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setActiveStep(0);
      setNewEmail('');
      setOtpCode('');
      setCountdown(0);
      setError('');
    }
  }, [open]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendOTP = async () => {
    if (!newEmail || !newEmail.includes('@')) {
      setError('Vui lòng nhập email hợp lệ');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Gọi API gửi OTP
      // await sendEmailOTP({ email: newEmail });

      // Giả lập API call
      await requestChangePassword({
        newEmail: newEmail,
      }).unwrap();
      setActiveStep(1);
      setCountdown(120); // 2 phút
      enqueueSnackbar('Mã OTP đã được gửi đến email mới', { variant: 'success' });
    } catch (error) {
      setError(error?.data?.message || 'Gửi OTP thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      // Gọi API gửi lại OTP
      // await sendEmailOTP({ email: newEmail });

      // Giả lập API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setCountdown(120);
      enqueueSnackbar('Mã OTP mới đã được gửi', { variant: 'success' });
    } catch (error) {
      setError(error?.data?.message || 'Gửi lại OTP thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setError('Vui lòng nhập mã OTP 6 số');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Gọi API xác thực OTP và cập nhật email
      // await verifyEmailOTP({ email: newEmail, otp: otpCode });

      // Giả lập API call
      await verifyOtpChangePassword({
        newEmail: newEmail,
        otp: otpCode,
      }).unwrap();

      enqueueSnackbar('Thay đổi email thành công', { variant: 'success' });
      onClose();
    } catch (error) {
      setError(error?.data?.message || 'Xác thực OTP thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setActiveStep(0);
    setOtpCode('');
    setError('');
  };

  const maskEmail = (email) => {
    if (!email) return '';
    const [user, domain] = email.split('@');
    const maskedUser = user.length <= 3 ? '*'.repeat(user.length) : user.slice(0, 3) + '*'.repeat(user.length - 3);
    return `${maskedUser}@${domain}`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          Thay Đổi Email
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {activeStep === 0 && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Email hiện tại: {maskEmail(currentEmail)}
            </Typography>

            <TextField
              fullWidth
              label="Email mới"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Nhập email mới của bạn"
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
            />

            <Typography variant="body2" color="text.secondary">
              Mã OTP sẽ được gửi đến email mới để xác thực
            </Typography>
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Mã OTP đã được gửi đến: {maskEmail(newEmail)}
            </Typography>

            <TextField
              fullWidth
              label="Mã OTP"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Nhập mã OTP 6 số"
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
              inputProps={{ maxLength: 6 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {countdown > 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Gửi lại mã sau: {formatTime(countdown)}
                </Typography>
              ) : (
                <Button variant="text" onClick={handleResendOTP} disabled={isSubmitting} sx={{ color: '#007bff' }}>
                  Gửi lại mã OTP
                </Button>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Hủy
        </Button>

        {activeStep === 1 && (
          <Button onClick={handleBack} disabled={isSubmitting}>
            Quay lại
          </Button>
        )}

        <Button
          variant="contained"
          color="error"
          onClick={activeStep === 0 ? handleSendOTP : handleVerifyOTP}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Đang xử lý...' : activeStep === 0 ? 'Gửi OTP' : 'Xác nhận'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ChangeEmailDialog;
