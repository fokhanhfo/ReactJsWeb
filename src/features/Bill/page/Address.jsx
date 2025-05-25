import React from 'react';
import { Box, Typography, Button, Divider, Grid } from '@mui/material';

function Address() {
  const addresses = [
    {
      id: 1,
      name: 'Hoàng Khánh',
      phone: '+84 333 568 375',
      address: 'Cổng chính xóm dây cổ cây bàng cổ thụ, Xã Đại Yên, Huyện Chương Mỹ, Hà Nội',
      isDefault: true,
    },
    {
      id: 2,
      name: 'Dang Tuan',
      phone: '+84 813 619 807',
      address: 'Nhà C4, Sân Bóng Đại Học Thủy Lợi, Ngõ 95 Chùa Bộc, Phường Trung Liệt, Quận Đống Đa, Hà Nội',
      isDefault: false,
    },
    {
      id: 3,
      name: 'Đặng Hoàng Khánh',
      phone: '+84 333 568 375',
      address: 'Ký Túc Xá Trường Đại Học Công Nghệ GTVT, 278 Lam Sơn, Phường Đồng Tâm, Thành Phố Vĩnh Yên, Vĩnh Phúc',
      isDefault: false,
    },
  ];

  return (
    <Box sx={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      {/* Tiêu đề */}
      <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: '16px' }}>
        Địa chỉ của tôi
      </Typography>

      {/* Nút thêm địa chỉ mới */}
      <Box sx={{ textAlign: 'right', marginBottom: '16px' }}>
        <Button variant="contained" color="error">
          + Thêm địa chỉ mới
        </Button>
      </Box>

      {/* Danh sách địa chỉ */}
      {addresses.map((address) => (
        <Box key={address.id} sx={{ marginBottom: '16px' }}>
          <Typography fontWeight="bold">{address.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {address.phone}
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: '8px' }}>
            {address.address}
          </Typography>
          {address.isDefault && (
            <Typography
              variant="body2"
              sx={{
                display: 'inline-block',
                padding: '2px 8px',
                backgroundColor: '#f5f5f5',
                color: '#ff4d4f',
                borderRadius: '4px',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}
            >
              Mặc định
            </Typography>
          )}
          <Box sx={{ display: 'flex', gap: 2, marginTop: '8px' }}>
            <Button variant="text" sx={{ color: '#007bff', textTransform: 'none' }}>
              Cập nhật
            </Button>
            {!address.isDefault && (
              <Button variant="text" sx={{ color: '#007bff', textTransform: 'none' }}>
                Xóa
              </Button>
            )}
            {!address.isDefault && (
              <Button variant="outlined" sx={{ textTransform: 'none' }}>
                Thiết lập mặc định
              </Button>
            )}
          </Box>
          <Divider sx={{ marginTop: '16px' }} />
        </Box>
      ))}
    </Box>
  );
}

export default Address;
