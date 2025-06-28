'use client';

import styled from '@emotion/styled';
import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowBack, Security } from '@mui/icons-material';
import { Avatar, Box, Button, Dialog, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import InputField from 'components/form-controls/InputForm';
import PasswordField from 'components/form-controls/PassworField';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import * as yup from 'yup';

OtpVerificationForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  onBack: PropTypes.func,
  onResendOtp: PropTypes.func,
  email: PropTypes.string,
  isLoading: PropTypes.bool,
  isResendLoading: PropTypes.bool,
};

const StyledButton = styled(Button)`
  margin-top: 10px;
`;

const BackButton = styled(Button)`
  margin-top: 10px;
  color: #666;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const ResendButton = styled(Button)`
  margin-top: 5px;
  color: #1976d2;
  &:hover {
    background-color: #e3f2fd;
  }
`;

function OtpVerificationForm(props) {
  const { open, onClose, isLoading, isResendLoading, email } = props;
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const schema = yup
    .object({
      otp: yup
        .string()
        .required('Bắt buộc')
        .length(6, 'Mã OTP phải có 6 chữ số')
        .matches(/^\d+$/, 'Mã OTP chỉ chứa số'),
      newPassword: yup.string().required('Bắt buộc').min(6, 'Tối thiểu 6 ký tự').max(32, 'Tối đa 32 ký tự'),
      confirmPassword: yup
        .string()
        .required('Bắt buộc')
        .oneOf([yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp'),
    })
    .required();

  const form = useForm({
    defaultValues: {
      otp: '',
      newPassword: '',
      confirmPassword: '',
    },
    resolver: yupResolver(schema),
  });

  const errorMessage = useSelector((state) => state.user.error?.message || '');
  const successMessage = useSelector((state) => state.user.success?.message || '');

  useEffect(() => {
    if (open) {
      setCountdown(120);
      setCanResend(false);
    }
  }, [open]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleSubmit = async (value) => {
    const { onSubmit } = props;
    if (onSubmit) {
      await onSubmit({ ...value, email });
    }
  };

  const handleBack = () => {
    const { onBack } = props;
    if (onBack) {
      onBack();
    }
    if (onClose) onClose();
  };

  const handleResendOtp = async () => {
    const { onResendOtp } = props;
    if (onResendOtp && canResend) {
      await onResendOtp({ email });
      setCountdown(60);
      setCanResend(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="center">
          <Avatar sx={{ bgcolor: 'success.main' }}>
            <Security />
          </Avatar>
        </Box>
        <Typography component="h3" variant="h6" align="center" fontWeight={600} mt={1}>
          Xác Thực OTP
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" align="center" color="text.secondary">
          Mã xác thực đã được gửi đến
        </Typography>
        <Typography variant="body2" align="center" color="primary.main" fontWeight={600} mb={2}>
          {email}
        </Typography>

        {errorMessage && (
          <Typography sx={{ color: 'error.main', textAlign: 'center', mb: 2 }} variant="body2">
            {errorMessage}
          </Typography>
        )}

        {successMessage && (
          <Typography sx={{ color: 'success.main', textAlign: 'center', mb: 2 }} variant="body2">
            {successMessage}
          </Typography>
        )}

        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <InputField name="otp" label="Mã OTP (6 chữ số)" form={form} />
            </Grid>
            <Grid item xs={12}>
              <PasswordField name="newPassword" label="Mật khẩu mới" form={form} />
            </Grid>
            <Grid item xs={12}>
              <PasswordField name="confirmPassword" label="Xác nhận mật khẩu" form={form} />
            </Grid>
          </Grid>
          <StyledButton disabled={isLoading || isResendLoading} type="submit" fullWidth variant="contained">
            {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
          </StyledButton>
        </form>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          {canResend ? (
            <ResendButton variant="text" onClick={handleResendOtp} disabled={isResendLoading}>
              {isResendLoading ? 'Đang gửi lại...' : 'Gửi lại mã OTP'}
            </ResendButton>
          ) : (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Gửi lại mã sau {countdown}s
            </Typography>
          )}
        </Box>

        <BackButton fullWidth variant="text" startIcon={<ArrowBack />} onClick={handleBack}>
          Quay lại
        </BackButton>
      </DialogContent>
    </Dialog>
  );
}

export default OtpVerificationForm;
