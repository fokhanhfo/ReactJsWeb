import React from 'react';
import { Box, Typography, Grid, TextField, Button, IconButton, Container } from '@mui/material';
import { Facebook, Twitter, YouTube, Instagram } from '@mui/icons-material';

const Footer = () => {
  return (
    <Container maxWidth={false} sx={{ maxWidth: '1400px', padding: '0 20px' }}>
      <Box sx={{ padding: '40px 20px' }}>
        <Grid container spacing={4}>
          {/* Logo và Mô tả */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Hoàng Hải
            </Typography>
            <Typography variant="body2" sx={{ marginTop: '10px', color: '#666' }}>
              Hoàng Hải - Thời trang phong cách, chất lượng cao. Mang đến sự tự tin và đẳng cấp cho mọi khách hàng.
            </Typography>
          </Grid>

          {/* Thông tin */}
          <Grid item xs={12} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
              Thông tin
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', marginBottom: '5px' }}>
              Dịch vụ khách hàng
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', marginBottom: '5px' }}>
              Câu hỏi thường gặp
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', marginBottom: '5px' }}>
              Tra cứu đơn hàng
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', marginBottom: '5px' }}>
              Liên hệ
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Tin tức & sự kiện
            </Typography>
          </Grid>

          {/* Tài khoản của tôi */}
          <Grid item xs={12} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
              Tài khoản
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', marginBottom: '5px' }}>
              Thông tin giao hàng
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', marginBottom: '5px' }}>
              Chính sách bảo mật
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', marginBottom: '5px' }}>
              Khuyến mãi
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', marginBottom: '5px' }}>
              Hỗ trợ khách hàng
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Điều khoản sử dụng
            </Typography>
          </Grid>

          {/* Mạng xã hội */}
          <Grid item xs={12} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
              Kết nối với chúng tôi
            </Typography>
            <a
              href="https://www.facebook.com/profile.php?id=100076397190388&locale=vi_VN"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconButton>
                <Facebook sx={{ color: '#1877F2' }} />
              </IconButton>
            </a>
            <IconButton>
              <YouTube sx={{ color: '#FF0000' }} />
            </IconButton>
            <IconButton>
              <Instagram sx={{ color: '#C13584' }} />
            </IconButton>
          </Grid>

          {/* Đăng ký nhận tin */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
              Liên hệ
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', marginBottom: '5px' }}>
              Địa chỉ: 26 Hòa Sơn, TT. Chúc Sơn, Chương Mỹ, Hà Nội
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', marginBottom: '5px' }}>
              Điện thoại: 0977.477.636
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', marginBottom: '5px' }}>
              Email: hoanghaifashion@gmail.com
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Giờ mở cửa: 9:00 - 21:00 (T2 - CN)
            </Typography>
          </Grid>
        </Grid>

        {/* Footer dưới cùng */}
        <Box
          sx={{
            marginTop: '40px',
            borderTop: '1px solid #ddd',
            paddingTop: '20px',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" sx={{ color: '#666' }}>
            © 2025 <strong>Hoàng Hải</strong>. Tất cả các quyền được bảo lưu. Phát triển bởi AliThemes.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Footer;
