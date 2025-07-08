import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  Container,
} from '@mui/material';
import { useGetMyInfoMutation, useGetMyInfoQuery, useUpdateUserMutation } from 'hookApi/userApi';
import Loading from 'components/Loading';
import { useSnackbar } from 'notistack';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function Profile() {
  const [fullName, setFullName] = React.useState('');
  const [gender, setGender] = React.useState('');
  const [birthday, setBirthday] = React.useState(null);
  const [file, setFile] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { data, error, isLoading } = useGetMyInfoQuery();
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [phoneDialogOpen, setPhoneDialogOpen] = useState(false);
  const [initialValues, setInitialValues] = useState(null);
  const [updateUser, { isLoading: isLodingUpdate, isSuccess, error: errorUpdate }] = useUpdateUserMutation();

  useEffect(() => {
    if (error) {
      const message = error?.data?.status || error?.error || 'An unknown error occurred';
      enqueueSnackbar(message, { variant: 'error' });
    }
  }, [error, enqueueSnackbar]);

  const myInfo = data?.data;

  useEffect(() => {
    if (myInfo) {
      setFullName(myInfo.fullName || '');
      setGender(myInfo.gender !== undefined ? myInfo.gender : null);
      setBirthday(myInfo.birthday ? dayjs(myInfo.birthday) : null);

      setInitialValues({
        fullName: myInfo.fullName || '',
        gender: myInfo.gender !== undefined ? myInfo.gender : null,
        birthday: myInfo.birthday ? dayjs(myInfo.birthday) : null,
      });
    }
  }, [myInfo]);

  if (isLoading) {
    return <Loading />;
  }

  const isFormChanged = () => {
    if (!initialValues) return false;

    return (
      fullName !== initialValues.fullName ||
      gender !== initialValues.gender ||
      (birthday && !birthday.isSame(initialValues.birthday, 'day')) ||
      file !== null
    );
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const onSubmitForm = async () => {
    setIsSubmitting(true);
    try {
      const updatedValues = {
        id: myInfo?.id,
        fullName,
        gender: gender === 'true' ? true : gender === 'false' ? false : null,
        birthday: birthday ? birthday.format('YYYY-MM-DD') : null,
        typeLogin: myInfo?.typeLogin || 0,
        roles: myInfo?.roles || [],
      };

      const formData = new FormData();
      formData.append('userRequest', new Blob([JSON.stringify(updatedValues)], { type: 'application/json' }));
      if (file) {
        formData.append('file', file);
      }

      await updateUser(formData).unwrap(); // hoặc gọi API update phù hợp
      enqueueSnackbar('Cập nhật thành công', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error?.data?.message || 'Cập nhật thất bại', { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const maskEmail = (email) => {
    if (!email) return '';
    const [user, domain] = email.split('@');
    const maskedUser = user.length <= 3 ? '*'.repeat(user.length) : user.slice(0, 3) + '*'.repeat(user.length - 3);
    return `${maskedUser}@${domain}`;
  };

  const maskPhone = (phone) => {
    if (!phone) return '';
    const lastTwo = phone.slice(-2);
    const masked = '*'.repeat(phone.length - 2) + lastTwo;
    return masked;
  };

  return (
    <Container maxWidth={false}>
      <Box
        sx={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
      >
        {/* Tiêu đề */}
        <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: '16px' }}>
          Hồ Sơ Của Tôi
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '24px' }}>
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </Typography>
        <Grid container spacing={4}>
          {/* Form bên trái */}
          <Grid item xs={12} md={8}>
            <Box component="form">
              <Box sx={{ marginBottom: '16px' }}>
                <Typography variant="body2" fontWeight="bold" sx={{ marginBottom: '8px' }}>
                  Tên đăng nhập
                </Typography>
                <TextField
                  fullWidth
                  disabled
                  value={myInfo?.username}
                  variant="outlined"
                  size="small"
                  sx={{ backgroundColor: '#f5f5f5' }}
                />
              </Box>

              <Box sx={{ marginBottom: '16px' }}>
                <Typography variant="body2" fontWeight="bold" sx={{ marginBottom: '8px' }}>
                  Tên
                </Typography>
                <TextField
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  fullWidth
                  placeholder="Nhập tên của bạn"
                  variant="outlined"
                  size="small"
                />
              </Box>

              <Box sx={{ marginBottom: '16px' }}>
                <Typography variant="body2" fontWeight="bold" sx={{ marginBottom: '8px' }}>
                  Email
                </Typography>
                <TextField
                  fullWidth
                  disabled
                  value={maskEmail(myInfo?.email)}
                  variant="outlined"
                  size="small"
                  sx={{ backgroundColor: '#f5f5f5' }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: '#007bff', cursor: 'pointer', marginTop: '8px', display: 'inline-block' }}
                  onClick={() => setEmailDialogOpen(true)}
                >
                  Thay Đổi
                </Typography>
              </Box>

              <Box sx={{ marginBottom: '16px' }}>
                <Typography variant="body2" fontWeight="bold" sx={{ marginBottom: '8px' }}>
                  Số điện thoại
                </Typography>
                <TextField
                  fullWidth
                  disabled
                  value={maskPhone(myInfo?.phone)}
                  variant="outlined"
                  size="small"
                  sx={{ backgroundColor: '#f5f5f5' }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: '#007bff', cursor: 'pointer', marginTop: '8px', display: 'inline-block' }}
                  onClick={() => setPhoneDialogOpen(true)}
                >
                  Thay Đổi
                </Typography>
              </Box>

              <Box sx={{ marginBottom: '16px' }}>
                <Typography variant="body2" fontWeight="bold" sx={{ marginBottom: '8px' }}>
                  Giới tính
                </Typography>
                <RadioGroup
                  value={String(gender)}
                  onChange={(e) => {
                    const value = e.target.value;
                    setGender(value === 'true' ? true : value === 'false' ? false : null);
                  }}
                  row
                >
                  <FormControlLabel value="true" control={<Radio />} label="Nam" />
                  <FormControlLabel value="false" control={<Radio />} label="Nữ" />
                  <FormControlLabel value="null" control={<Radio />} label="Khác" />
                </RadioGroup>
              </Box>

              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
                <DatePicker
                  label="Ngày sinh"
                  value={birthday}
                  onChange={(newValue) => setBirthday(newValue)}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                    },
                  }}
                />
              </LocalizationProvider>

              <Button
                variant="contained"
                color="error"
                sx={{ marginTop: '16px' }}
                onClick={onSubmitForm}
                disabled={isSubmitting || !isFormChanged()}
              >
                {isSubmitting ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </Box>
          </Grid>

          {/* Avatar bên phải */}
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar
                src={file ? URL.createObjectURL(file) : myInfo?.userImage?.userImage}
                sx={{ width: 120, height: 120, margin: '0 auto', marginBottom: '16px' }}
              />
              <Button variant="outlined" component="label">
                Chọn Ảnh
                <input hidden accept="image/*" type="file" onChange={handleFileChange} />
              </Button>
              <Typography variant="body2" color="text.secondary" sx={{ marginTop: '8px' }}>
                Dung lượng file tối đa 1 MB
                <br />
                Định dạng: .JPEG, .PNG
              </Typography>
            </Box>
          </Grid>
        </Grid>
        {/* <ChangeEmailDialog
        open={emailDialogOpen}
        onClose={() => setEmailDialogOpen(false)}
        currentEmail={myInfo?.email}
      />

      <ChangePhoneDialog
        open={phoneDialogOpen}
        onClose={() => setPhoneDialogOpen(false)}
        currentPhone={myInfo?.phone}
      /> */}
      </Box>
    </Container>
  );
}

export default Profile;
