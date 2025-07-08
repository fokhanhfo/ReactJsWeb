import React from 'react';
import { Box, Typography, TextField, Button, Grid, Container, Paper, IconButton } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import ExploreIcon from '@mui/icons-material/Explore';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  fullName: yup.string().required('Vui lòng nhập họ và tên'),
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  phone: yup.string().matches(/^[0-9]{9,15}$/, 'Số điện thoại không hợp lệ'),
  subject: yup.string(),
  message: yup.string().required('Vui lòng nhập nội dung'),
});

function AlbumFeature() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log('Dữ liệu gửi cho admin:', data);

    // Reset form sau khi gửi thành công
    reset();
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Grid container spacing={4}>
        {/* Left Section */}
        <Grid item xs={12} md={5}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              height: '100%',
              border: '1px solid #eee',
              borderRadius: 1,
            }}
          >
            <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
              LIÊN HỆ
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 4 }}>
              <LocationOnIcon sx={{ color: 'success.main', mr: 2, mt: 0.5 }} />
              <Typography variant="body1" color="text.secondary">
                <a
                  href="https://www.google.com/maps/place/Shop+Ho%C3%A0ng+H%E1%BA%A3i/@20.9239125,105.7012006,17z/data=!3m1!4b1!4m6!3m5!1s0x31344d9c251a4597:0xbd9e54a0390bf57b!8m2!3d20.9239075!4d105.7037755!16s%2Fg%2F11hf7zyk_c?hl=vi&entry=ttu"
                  target="_blank"
                  rel="noopener"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  26 Hòa Sơn, TT. Chúc Sơn, Chương Mỹ, Hà Nội
                  <br />
                  Việt Nam
                </a>
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 3 }}>
              <PhoneIcon sx={{ color: 'success.main', mr: 2, mt: 0.5 }} />
              <Typography variant="body1" color="text.secondary">
                0977.477.636
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 3 }}>
              <AccessTimeIcon sx={{ color: 'success.main', mr: 2, mt: 0.5 }} />
              <Box>
                <Typography variant="body1" color="text.secondary">
                  Giờ mở cửa:
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  9 giờ sáng – 10 giờ tối, mở cửa 7 ngày trong tuần
                </Typography>
              </Box>
            </Box>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<HeadsetMicIcon />}
              sx={{
                mt: 4,
                py: 1.5,
                borderColor: '#ddd',
                color: 'text.primary',
                '&:hover': {
                  borderColor: '#ccc',
                  backgroundColor: '#f9f9f9',
                },
              }}
            >
              Hỗ trợ qua điện thoại
            </Button>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<ExploreIcon />}
              sx={{
                mt: 2,
                py: 1.5,
                borderColor: '#ddd',
                color: 'text.primary',
                '&:hover': {
                  borderColor: '#ccc',
                  backgroundColor: '#f9f9f9',
                },
              }}
            >
              Xem chỉ đường
            </Button>
          </Paper>
        </Grid>

        {/* Right Section - Form */}
        <Grid item xs={12} md={7}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
              Gửi tin nhắn cho chúng tôi
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Chúng tôi sẽ phản hồi trong vòng 24 giờ{' '}
            </Typography>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  variant="outlined"
                  {...register('fullName')}
                  error={!!errors.fullName}
                  helperText={errors.fullName?.message}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Địa chỉ email"
                  variant="outlined"
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  variant="outlined"
                  {...register('phone')}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Chủ đề"
                  variant="outlined"
                  {...register('subject')}
                  error={!!errors.subject}
                  helperText={errors.subject?.message}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nhập nội dung"
                  variant="outlined"
                  multiline
                  rows={8}
                  {...register('message')}
                  error={!!errors.message}
                  helperText={errors.message?.message}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  py: 1.5,
                  px: 3,
                  backgroundColor: '#d81b60',
                  '&:hover': {
                    backgroundColor: '#c2185b',
                  },
                }}
              >
                Gửi Yêu Cầu
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Scroll to top button */}
      <Box sx={{ position: 'fixed', bottom: 20, right: 20 }}>
        <IconButton
          onClick={scrollToTop}
          sx={{
            backgroundColor: '#d81b60',
            color: 'white',
            '&:hover': {
              backgroundColor: '#c2185b',
            },
          }}
        >
          <ArrowUpwardIcon />
        </IconButton>
      </Box>
    </Container>
  );
}

export default AlbumFeature;
