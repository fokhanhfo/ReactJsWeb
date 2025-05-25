import React from 'react';
import { Box, Typography, TextField, Button, Avatar, RadioGroup, FormControlLabel, Radio, Grid } from '@mui/material';

function Profile() {
  return (
    <Box sx={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
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
                value="khanhkomonny"
                variant="outlined"
                size="small"
                sx={{ backgroundColor: '#f5f5f5' }}
              />
            </Box>

            <Box sx={{ marginBottom: '16px' }}>
              <Typography variant="body2" fontWeight="bold" sx={{ marginBottom: '8px' }}>
                Tên
              </Typography>
              <TextField fullWidth placeholder="Nhập tên của bạn" variant="outlined" size="small" />
            </Box>

            <Box sx={{ marginBottom: '16px' }}>
              <Typography variant="body2" fontWeight="bold" sx={{ marginBottom: '8px' }}>
                Email
              </Typography>
              <TextField
                fullWidth
                disabled
                value="kh********@gmail.com"
                variant="outlined"
                size="small"
                sx={{ backgroundColor: '#f5f5f5' }}
              />
              <Typography
                variant="body2"
                sx={{ color: '#007bff', cursor: 'pointer', marginTop: '8px', display: 'inline-block' }}
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
                value="*******75"
                variant="outlined"
                size="small"
                sx={{ backgroundColor: '#f5f5f5' }}
              />
              <Typography
                variant="body2"
                sx={{ color: '#007bff', cursor: 'pointer', marginTop: '8px', display: 'inline-block' }}
              >
                Thay Đổi
              </Typography>
            </Box>

            <Box sx={{ marginBottom: '16px' }}>
              <Typography variant="body2" fontWeight="bold" sx={{ marginBottom: '8px' }}>
                Giới tính
              </Typography>
              <RadioGroup row>
                <FormControlLabel value="male" control={<Radio />} label="Nam" />
                <FormControlLabel value="female" control={<Radio />} label="Nữ" />
                <FormControlLabel value="other" control={<Radio />} label="Khác" />
              </RadioGroup>
            </Box>

            <Box sx={{ marginBottom: '16px' }}>
              <Typography variant="body2" fontWeight="bold" sx={{ marginBottom: '8px' }}>
                Ngày sinh
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField fullWidth placeholder="Ngày" variant="outlined" size="small" />
                </Grid>
                <Grid item xs={4}>
                  <TextField fullWidth placeholder="Tháng" variant="outlined" size="small" />
                </Grid>
                <Grid item xs={4}>
                  <TextField fullWidth placeholder="Năm" variant="outlined" size="small" />
                </Grid>
              </Grid>
            </Box>

            <Button variant="contained" color="error" sx={{ marginTop: '16px' }}>
              Lưu
            </Button>
          </Box>
        </Grid>

        {/* Avatar bên phải */}
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center' }}>
            <Avatar
              src="/path/to/avatar.jpg"
              sx={{ width: 120, height: 120, margin: '0 auto', marginBottom: '16px' }}
            />
            <Button variant="outlined" component="label">
              Chọn Ảnh
              <input hidden accept="image/*" type="file" />
            </Button>
            <Typography variant="body2" color="text.secondary" sx={{ marginTop: '8px' }}>
              Dung lượng file tối đa 1 MB
              <br />
              Định dạng: .JPEG, .PNG
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Profile;
