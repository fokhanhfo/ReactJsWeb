import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Container,
  Fade,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { loginWindow, logout } from 'features/Auth/userSlice';
import { useClearCartMutation } from 'features/Cart/cartApi';
import { AddBoxOutlined, KeyboardArrowDown, ShoppingCart } from '@mui/icons-material';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import CartFeature from 'features/Cart';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

NavWeb.propTypes = {
  listCategory: PropTypes.array.isRequired,
};

function NavWeb({ listCategory }) {
  const cartQuery = useSelector((state) => state.cartApi.queries['getCart(undefined)']);
  const currentUser = useSelector((state) => state.user.current);

  const dispatch = useDispatch();
  const [clearCart] = useClearCartMutation();

  const navigate = useNavigate();

  // State cho menu danh mục
  const [menuCategoryAnchor, setMenuCategoryAnchor] = useState(null);
  const menuCategoryOpen = Boolean(menuCategoryAnchor);

  // State cho menu tài khoản
  const [accountMenuAnchor, setAccountMenuAnchor] = useState(null);
  const accountMenuOpen = Boolean(accountMenuAnchor);

  const handleClickOpen = () => {
    dispatch(loginWindow());
  };

  const handleCategoryToggle = (event) => {
    setMenuCategoryAnchor(event.currentTarget);
  };

  const handleCloseCategoryMenu = () => {
    setMenuCategoryAnchor(null);
  };

  const handleClickAccountMenu = (event) => {
    setAccountMenuAnchor(event.currentTarget);
  };

  const handleCloseAccountMenu = () => {
    setAccountMenuAnchor(null);
  };

  const handleLogout = async () => {
    dispatch(logout());
    await clearCart();
    handleCloseAccountMenu();
  };

  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpen(open);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const searchQuery = event.target.searchInput.value; // Lấy giá trị input
    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Container
        maxWidth={false}
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          maxWidth: '1400px',
          padding: '5px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {/* Logo và thanh tìm kiếm */}
          <Box display="flex" alignItems="center" gap={3}>
            <Link className="navLink" to="/" style={{ textDecoration: 'none' }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: '#333',
                  '&:hover': { color: '#007bff' }, // Hiệu ứng hover
                }}
              >
                SHOPKHANH
              </Typography>
            </Link>
            <form onSubmit={handleSearch} style={{ width: '300px' }}>
              <TextField
                fullWidth
                name="searchInput"
                placeholder="Search for products..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#888' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  backgroundColor: '#fff',
                  borderRadius: '4px',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#ddd',
                    },
                    '&:hover fieldset': {
                      borderColor: '#007bff',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#007bff',
                    },
                  },
                }}
              />
            </form>
          </Box>

          {/* Giỏ hàng và tài khoản */}
          <Box display="flex" alignItems="center" gap={3}>
            {/* Giỏ hàng */}
            <Box display="flex" alignItems="center">
              <IconButton
                onClick={toggleDrawer(true)}
                className="icon_cart"
                sx={{
                  color: '#333',
                  '&:hover': { color: '#007bff' }, // Hiệu ứng hover
                }}
              >
                <ShoppingCart />
                <Typography
                  variant="caption"
                  sx={{
                    marginLeft: '4px',
                    fontWeight: 'bold',
                    color: '#007bff',
                  }}
                >
                  {cartQuery?.data?.data?.length || ''}
                </Typography>
              </IconButton>
              <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                <CartFeature setOpen={setOpen}></CartFeature>
              </Drawer>
            </Box>

            {/* Hiển thị login/register nếu chưa đăng nhập */}
            {!currentUser || !currentUser.jti ? (
              <Box display="flex" gap={1}>
                <Button variant="outlined" color="primary" onClick={handleClickOpen} sx={{ textTransform: 'none' }}>
                  Login
                </Button>
                <Button variant="contained" color="primary" onClick={handleClickOpen} sx={{ textTransform: 'none' }}>
                  Register
                </Button>
              </Box>
            ) : (
              // Hiển thị avatar nếu đã đăng nhập
              <IconButton
                onClick={handleClickAccountMenu}
                sx={{
                  '&:hover': { backgroundColor: '#f0f0f0' },
                }}
              >
                <Avatar />
              </IconButton>
            )}

            {/* Menu tài khoản */}
            {currentUser && currentUser.jti && (
              <Menu
                anchorEl={accountMenuAnchor}
                open={accountMenuOpen}
                onClose={handleCloseAccountMenu}
                MenuListProps={{ onMouseLeave: handleCloseAccountMenu }}
              >
                <MenuItem onClick={handleCloseAccountMenu}>Profile</MenuItem>
                <MenuItem onClick={handleCloseAccountMenu}>My account</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            )}
          </Box>
        </Box>
      </Container>
      <Divider />
      <Container
        maxWidth={false}
        sx={{
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          maxWidth: '1400px',
          padding: '5px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {/* Danh mục và liên kết */}
          <Box width="70%" display="flex" alignItems="center" gap={3}>
            {/* Danh mục */}
            <Box>
              <Button
                sx={{
                  backgroundColor: '#d51243',
                  padding: '8px 16px',
                  color: 'white',
                  fontWeight: 'bold',
                  '&:hover': { color: 'white', backgroundColor: 'black' }, // Hiệu ứng hover
                }}
                startIcon={<MenuIcon />}
                onClick={handleCategoryToggle}
              >
                <Typography variant="body1">DANH MỤC</Typography>
              </Button>
              <Menu
                anchorEl={menuCategoryAnchor}
                open={menuCategoryOpen}
                onClose={handleCloseCategoryMenu}
                MenuListProps={{ onMouseLeave: handleCloseCategoryMenu }}
                sx={{
                  '& .MuiPaper-root': {
                    borderRadius: '8px', // Bo góc menu
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Đổ bóng
                    padding: '8px 0', // Khoảng cách bên trong menu
                  },
                  '& .MuiMenuItem-root': {
                    padding: '12px 16px', // Tăng khoảng cách padding
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px', // Khoảng cách giữa biểu tượng và text
                    fontSize: '0.875rem', // Kích thước chữ
                    fontWeight: '500', // Độ đậm chữ
                    color: '#333', // Màu chữ mặc định
                    '&:hover': {
                      backgroundColor: '#f9f9f9', // Màu nền khi hover
                      color: '#007bff', // Màu chữ khi hover
                    },
                  },
                }}
              >
                {listCategory.map((item) => (
                  <MenuItem
                    key={item.id}
                    component={Link}
                    to={`/products?category=${encodeURIComponent(JSON.stringify(item))}`}
                    onClick={handleCloseCategoryMenu}
                  >
                    {/* Biểu tượng danh mục (nếu có) */}
                    <Box
                      sx={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        color: '#007bff',
                      }}
                    >
                      {item.icon || item.name.charAt(0).toUpperCase()} {/* Hiển thị biểu tượng hoặc chữ cái đầu */}
                    </Box>
                    {item.name}
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* Các liên kết */}
            <NavLink
              className={({ isActive }) => (isActive ? 'active-link' : 'navLink')}
              to="/"
              style={{ textDecoration: 'none' }}
            >
              <Typography
                sx={{
                  color: '#333',
                  fontWeight: 'bold',
                  '&:hover': { color: '#007bff' }, // Hiệu ứng hover
                }}
              >
                HOME
              </Typography>
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? 'active-link' : 'navLink')}
              to="/newproduct"
              style={{ textDecoration: 'none' }}
            >
              <Typography
                sx={{
                  color: '#333',
                  fontWeight: 'bold',
                  '&:hover': { color: '#007bff' }, // Hiệu ứng hover
                }}
              >
                NEW ARRIVALS
              </Typography>
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? 'active-link' : 'navLink')}
              to="/products"
              style={{ textDecoration: 'none' }}
            >
              <Typography
                sx={{
                  color: '#333',
                  fontWeight: 'bold',
                  '&:hover': { color: '#007bff' }, // Hiệu ứng hover
                }}
              >
                PRODUCT
              </Typography>
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? 'active-link' : 'navLink')}
              to="/user/bill/all"
              style={{ textDecoration: 'none' }}
            >
              <Typography
                sx={{
                  color: '#333',
                  fontWeight: 'bold',
                  '&:hover': { color: '#007bff' }, // Hiệu ứng hover
                }}
              >
                BILL
              </Typography>
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? 'active-link' : 'navLink')}
              to="/contact"
              style={{ textDecoration: 'none' }}
            >
              <Typography
                sx={{
                  color: '#333',
                  fontWeight: 'bold',
                  '&:hover': { color: '#007bff' }, // Hiệu ứng hover
                }}
              >
                CONTACT
              </Typography>
            </NavLink>
          </Box>

          {/* Thông tin liên hệ */}
          <Box width="30%" display="flex" justifyContent="flex-end" alignItems="center" gap={3}>
            <Box display="flex" alignItems="center" gap={1}>
              <LocalPhoneIcon sx={{ color: '#007bff' }} /> {/* Biểu tượng điện thoại */}
              <Typography
                sx={{
                  color: '#333',
                  fontWeight: 'bold',
                }}
              >
                0977477636
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <LocationOnIcon sx={{ color: '#007bff' }} /> {/* Biểu tượng vị trí */}
              <Typography
                sx={{
                  color: '#333',
                  fontWeight: 'bold',
                }}
              >
                Hà Nội
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default NavWeb;
