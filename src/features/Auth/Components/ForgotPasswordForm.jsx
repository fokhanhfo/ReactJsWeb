'use client';

import styled from '@emotion/styled';
import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowBack, Email } from '@mui/icons-material';
import { Avatar, Box, Button, Dialog, DialogContent, DialogTitle, Typography, Grid } from '@mui/material';
import InputField from 'components/form-controls/InputForm';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import * as yup from 'yup';

ForgotPasswordForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  onBack: PropTypes.func,
  isLoading: PropTypes.bool,
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

function ForgotPasswordForm(props) {
  const { open, onClose, isLoading } = props;

  const schema = yup
    .object({
      email: yup.string().required('Bắt buộc').email('Email không hợp lệ'),
    })
    .required();

  const form = useForm({
    defaultValues: {
      email: '',
    },
    resolver: yupResolver(schema),
  });

  const errorMessage = useSelector((state) => state.user.error?.message || '');
  const successMessage = useSelector((state) => state.user.success?.message || '');

  const handleSubmit = async (value) => {
    const { onSubmit } = props;
    if (onSubmit) {
      await onSubmit(value);
    }
  };

  const handleBack = () => {
    const { onBack } = props;
    if (onBack) {
      onBack();
    }
    onClose(); // đóng dialog
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="center">
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <Email />
          </Avatar>
        </Box>
        <Typography component="h3" variant="h6" textAlign="center" fontWeight="600" mt={1}>
          Quên Mật Khẩu
        </Typography>
        <Typography variant="body2" textAlign="center" color="text.secondary">
          Nhập email của bạn để nhận mã xác thực
        </Typography>
      </DialogTitle>

      <DialogContent>
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
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
              <InputField name="email" label="Email" form={form} type="email" />
            </Grid>
          </Grid>

          <StyledButton disabled={isLoading} type="submit" fullWidth variant="contained">
            {isLoading ? 'Đang gửi...' : 'Gửi mã xác thực'}
          </StyledButton>
        </form>

        <BackButton fullWidth variant="text" startIcon={<ArrowBack />} onClick={handleBack}>
          Quay lại đăng nhập
        </BackButton>
      </DialogContent>
    </Dialog>
  );
}

export default ForgotPasswordForm;
