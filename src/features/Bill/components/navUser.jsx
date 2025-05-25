import React from 'react';
import { Box, Avatar, Typography, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { NavLink } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LockIcon from '@mui/icons-material/Lock';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RedeemIcon from '@mui/icons-material/Redeem';
import StarIcon from '@mui/icons-material/Star';

function NavUser() {
  const menuItems = [
    { label: 'Hồ Sơ', icon: <AccountCircleIcon />, path: './profile' },
    { label: 'Ngân Hàng', icon: <CreditCardIcon />, path: './bank' },
    { label: 'Địa Chỉ', icon: <LocationOnIcon />, path: './address' },
    { label: 'Đổi Mật Khẩu', icon: <LockIcon />, path: './change-password' },
    { label: 'Cài Đặt Thông Báo', icon: <NotificationsIcon />, path: './notifications' },
    { label: 'Đơn Mua', icon: <ShoppingCartIcon />, path: './bill/all' },
    { label: 'Kho Voucher', icon: <RedeemIcon />, path: './vouchers' },
    { label: 'Shopee Xu', icon: <StarIcon />, path: './shopee-xu' },
  ];

  return (
    <Box sx={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      {/* User Info */}
      <Box sx={{ display: 'flex', alignItems: 'center', padding: '16px', borderBottom: '1px solid #ddd' }}>
        <Avatar sx={{ width: 48, height: 48 }} />
        <Box ml={2}>
          <Typography fontWeight="bold">khanhkomonny</Typography>
          <NavLink to="/edit-profile" style={{ textDecoration: 'none', color: '#007bff', fontSize: '0.875rem' }}>
            Sửa Hồ Sơ
          </NavLink>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <List>
        {menuItems.map((item, index) => (
          <NavLink key={index} to={item.path} style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <ListItemButton
                sx={{
                  padding: '12px 16px',
                  borderLeft: isActive ? '4px solid #007bff' : '4px solid transparent',
                  backgroundColor: isActive ? '#e6f7ff' : 'transparent',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#007bff' : '#555' }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ fontWeight: isActive ? 'bold' : 'normal', color: isActive ? '#007bff' : '#555' }}>
                      {item.label}
                    </Typography>
                  }
                />
              </ListItemButton>
            )}
          </NavLink>
        ))}
      </List>
    </Box>
  );
}

export default NavUser;
