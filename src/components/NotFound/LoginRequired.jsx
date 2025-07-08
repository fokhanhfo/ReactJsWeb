'use client';
import { Box, Paper, Typography, Button, Container, Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LoginIcon from '@mui/icons-material/Login';
import { useDispatch } from 'react-redux';
import { loginWindow } from 'features/Auth/userSlice';

export default function LoginRequired() {
  const dispatch = useDispatch();
  const handleLoginClick = () => {
    dispatch(loginWindow('login'));
  };

  const handleRegisterClick = () => {
    dispatch(loginWindow('register'));
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f5f5f5',
        }}
      >
        <Paper
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: 400,
            bgcolor: '#ffffff',
            border: '1px solid #e0e0e0',
          }}
        >
          <Avatar
            sx={{
              mb: 2,
              bgcolor: '#000000',
              width: 56,
              height: 56,
            }}
          >
            <LockOutlinedIcon />
          </Avatar>

          <Typography
            component="h1"
            variant="h5"
            sx={{
              color: '#000000',
              mb: 2,
              fontWeight: 500,
            }}
          >
            Chào bạn! 👋
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#666666',
              textAlign: 'center',
              mb: 3,
            }}
          >
            Hãy đăng nhập để khám phá thêm nhiều điều thú vị nhé!
          </Typography>

          <Button
            variant="contained"
            startIcon={<LoginIcon />}
            onClick={handleLoginClick}
            sx={{
              mb: 2,
              bgcolor: '#000000',
              color: '#ffffff',
              '&:hover': {
                bgcolor: '#333333',
              },
            }}
          >
            Bắt đầu thôi!
          </Button>

          <Typography variant="body2" sx={{ color: '#888888' }}>
            Lần đầu ghé thăm?{' '}
            <Button
              onClick={handleRegisterClick}
              variant="text"
              size="small"
              sx={{
                color: '#000000',
                textTransform: 'none',
                p: 0,
                minWidth: 'auto',
              }}
            >
              Tạo tài khoản ngay
            </Button>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
