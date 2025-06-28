'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  Container,
  Paper,
  Grid,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Visibility, VisibilityOff, Lock, Email, CheckCircle, ArrowBack } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import {
  useGetMyInfoQuery,
  useRequestChangePasswordMutation,
  useVerifyOtpChangePasswordMutation,
} from 'hookApi/userApi';
import userApi from 'api/userApi';

const ChangePassword = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { enqueueSnackbar } = useSnackbar();

  const { data, error, isLoading } = useGetMyInfoQuery();

  const [requestChangePassword] = useRequestChangePasswordMutation();
  const [verifyOtpChangePassword] = useVerifyOtpChangePasswordMutation();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    otp: '',
  });

  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    otp: '',
  });

  const steps = ['Thay đổi mật khẩu', 'Xác thực OTP', 'Hoàn thành'];

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  };

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleTogglePassword = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    const newErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      otp: '',
    };

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (!validatePassword(formData.newPassword)) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'Mật khẩu mới phải khác mật khẩu hiện tại';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== '');
  };

  const handlePasswordSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      await requestChangePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      }).unwrap();

      enqueueSnackbar('Mã OTP đã được gửi đến email của bạn', { variant: 'success' });
      setActiveStep(1);
    } catch (error) {
      enqueueSnackbar(error?.data?.message || 'Mật khẩu hiện tại không đúng', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (formData.otp.length !== 6) {
      setErrors((prev) => ({ ...prev, otp: 'Vui lòng nhập đầy đủ mã OTP' }));
      return;
    }

    setLoading(true);
    try {
      await verifyOtpChangePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
        otp: formData.otp,
      }).unwrap();
      enqueueSnackbar('Mật khẩu đã được thay đổi thành công!', { variant: 'success' });
      setActiveStep(2);
    } catch (error) {
      enqueueSnackbar(error?.data?.message || 'Mã OTP không đúng hoặc đã hết hạn', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const response = await userApi.resendOtp(data.data.email, 'CHANGE_PASSWORD');
      enqueueSnackbar('Mã OTP mới đã được gửi đến email của bạn', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Không thể gửi lại mã OTP', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setActiveStep(0);
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      otp: '',
    });
    setErrors({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      otp: '',
    });
  };

  const renderPasswordForm = () => (
    <Box component="form" sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Mật khẩu hiện tại"
            type={showPasswords.current ? 'text' : 'password'}
            value={formData.currentPassword}
            onChange={handleInputChange('currentPassword')}
            error={!!errors.currentPassword}
            helperText={errors.currentPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => handleTogglePassword('current')} edge="end">
                    {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Mật khẩu mới"
            type={showPasswords.new ? 'text' : 'password'}
            value={formData.newPassword}
            onChange={handleInputChange('newPassword')}
            error={!!errors.newPassword}
            helperText={errors.newPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => handleTogglePassword('new')} edge="end">
                    {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Xác nhận mật khẩu mới"
            type={showPasswords.confirm ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleInputChange('confirmPassword')}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => handleTogglePassword('confirm')} edge="end">
                    {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Mật khẩu phải có:
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2 }}>
              <Typography component="li" variant="body2" color="text.secondary">
                Ít nhất 8 ký tự
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                Chữ hoa và chữ thường
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                Ít nhất 1 số
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                Ít nhất 1 ký tự đặc biệt
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handlePasswordSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Lock />}
          >
            {loading ? 'Đang xử lý...' : 'Tiếp tục'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );

  const renderOtpForm = () => (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Email sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="body1" color="text.secondary">
              Nhập mã OTP đã được gửi đến email của bạn
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Mã OTP (6 chữ số)"
            value={formData.otp}
            onChange={handleInputChange('otp')}
            error={!!errors.otp}
            helperText={errors.otp}
            inputProps={{
              maxLength: 6,
              style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' },
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleOtpSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <CheckCircle />}
          >
            {loading ? 'Đang xác thực...' : 'Xác thực và thay đổi mật khẩu'}
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ textAlign: 'center' }}>
            <Button variant="text" onClick={handleResendOtp} disabled={loading}>
              Gửi lại mã OTP
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => setActiveStep(0)}
            disabled={loading}
          >
            Quay lại
          </Button>
        </Grid>
      </Grid>
    </Box>
  );

  const renderSuccessForm = () => (
    <Box sx={{ textAlign: 'center', mt: 2 }}>
      <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
      <Typography variant="h5" color="success.main" gutterBottom>
        Thành công!
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Mật khẩu của bạn đã được thay đổi thành công
      </Typography>
      <Button variant="contained" size="large" onClick={resetForm}>
        Thay đổi mật khẩu khác
      </Button>
    </Box>
  );

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Thay đổi mật khẩu
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mt: 3, mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{!isMobile && label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && renderPasswordForm()}
      {activeStep === 1 && renderOtpForm()}
      {activeStep === 2 && renderSuccessForm()}
    </Paper>
  );
};

// PropTypes validation
ChangePassword.propTypes = {
  // Add any props you need here
};

export default ChangePassword;
