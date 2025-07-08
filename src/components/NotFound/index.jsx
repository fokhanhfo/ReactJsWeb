'use client';
import { Box, Typography, Button, Container, Paper, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Material Icons
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function NotFound(props) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: isMobile ? 3 : 6,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            maxWidth: 600,
            border: '1px solid rgba(0, 0, 0, 0.08)',
            animation: 'fadeIn 0.6s ease-out',
            '@keyframes fadeIn': {
              '0%': {
                opacity: 0,
                transform: 'translateY(20px)',
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0)',
              },
            },
          }}
        >
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontWeight: 900,
              fontSize: isMobile ? '5rem' : '8rem',
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              letterSpacing: '-0.05em',
              lineHeight: 1,
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.05)' },
                '100%': { transform: 'scale(1)' },
              },
            }}
          >
            404
          </Typography>

          <SentimentDissatisfiedIcon
            sx={{
              fontSize: isMobile ? 60 : 80,
              color: 'text.secondary',
              mb: 2,
              animation: 'bounce 2s infinite',
              '@keyframes bounce': {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-10px)' },
              },
            }}
          />

          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 1,
              color: 'text.primary',
            }}
          >
            Trang không tìm thấy
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mb: 4,
              maxWidth: 450,
              mx: 'auto',
              fontSize: isMobile ? '1rem' : '1.1rem',
            }}
          >
            Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: 2,
              justifyContent: 'center',
              mt: 2,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<HomeIcon />}
              onClick={handleGoHome}
              sx={{
                px: 3,
                py: 1,
                borderRadius: 2,
                fontWeight: 600,
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              Về trang chủ
            </Button>

            <Button
              variant="outlined"
              color="primary"
              size="large"
              startIcon={<ArrowBackIcon />}
              onClick={handleGoBack}
              sx={{
                px: 3,
                py: 1,
                borderRadius: 2,
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              Quay lại
            </Button>
          </Box>
        </Paper>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 4, opacity: 0.7 }}>
          Nếu bạn tin rằng đây là lỗi, vui lòng liên hệ với chúng tôi.
        </Typography>
      </Box>
    </Container>
  );
}

NotFound.propTypes = {};

export default NotFound;
