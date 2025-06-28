import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Collapse,
  ClickAwayListener,
} from '@mui/material';
import {
  ShoppingCart,
  Search as SearchIcon,
  Menu as MenuIcon,
  LocalPhone as LocalPhoneIcon,
  LocationOn as LocationOnIcon,
  ExpandLess,
  ExpandMore,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { loginWindow, logout } from 'features/Auth/userSlice';
import CartFeature from 'features/Cart';
import { useClearCartMutation } from 'hookApi/cartApi';
import { useSnackbar } from 'notistack';
import { useGetMyInfoQuery } from 'hookApi/userApi';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

function NavWeb({ listCategory }) {
  useEffect(() => {
    createChat({
      webhookUrl: 'http://localhost:5678/webhook/f353f777-f06b-4b29-8744-6402ecd529b4/chat',
      webhookConfig: {
        method: 'POST',
        headers: {},
      },
      target: '#n8n-chat',
      mode: 'window',
      chatInputKey: 'chatInput',
      chatSessionKey: 'sessionId',
      loadPreviousSession: true,
      metadata: {},
      showWelcomeScreen: false,
      defaultLanguage: 'vi',
      initialMessages: ['👋 Xin chào!', 'Cửa hàng Hoàng Hải sẵn sàng hỗ trợ bạn.'],
      i18n: {
        vi: {
          title: '👋 Xin chào!',
          subtitle: 'Cửa hàng Hoàng Hải sẵn sàng phục vụ 24/7.',
          footer: '',
          getStarted: 'Bắt đầu trò chuyện',
          inputPlaceholder: 'Nhập tin nhắn...',
        },
      },
    });
  }, []);

  const { data, error, isLoading } = useGetMyInfoQuery();
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  const navigate = useNavigate();

  // State management
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [categoryMenuAnchor, setCategoryMenuAnchor] = useState(null);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [clearCart] = useClearCartMutation();
  const avatarRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  // Mock current user and cart data
  const currentUser = useSelector((state) => state.user.current);
  const cartQuery = useSelector((state) => state.cartApi.queries['getCart(undefined)']);

  // Event handlers
  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleCartToggle = () => {
    setCartDrawerOpen(!cartDrawerOpen);
  };

  const handleCategoryMenuOpen = (event) => {
    setCategoryMenuAnchor(event.currentTarget);
  };

  const handleCategoryMenuClose = () => {
    setCategoryMenuAnchor(null);
  };

  const handleAccountMenuToggle = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchValue.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchValue)}`);
      setSearchValue('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    setMenuOpen(false);
    dispatch(logout());
    enqueueSnackbar('Đăng xuất thành công', { variant: 'success' });
    await clearCart();
  };

  const handleClickOpen = () => {
    dispatch(loginWindow());
  };

  const goToProfile = () => {
    handleMenuClose(); // đóng menu
    navigate('/user/profile'); // điều hướng
  };

  const goToOrders = () => {
    handleMenuClose();
    navigate('/user/bill/all');
  };

  // Navigation links
  const navLinks = [
    { to: '/', label: 'HOME' },
    // { to: '/newproduct', label: 'NEW ARRIVALS' },
    { to: '/ABOUT-US', label: 'ABOUT US' },
    { to: '/products', label: 'PRODUCT' },
    { to: '/user/bill/all', label: 'BILL' },
    { to: '/contact', label: 'CONTACT' },
  ];

  // Desktop Navigation
  const DesktopNav = () => (
    <>
      {/* Top Bar */}
      <Container
        maxWidth={false}
        sx={{
          maxWidth: '1400px',
          py: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          {/* Logo and Search */}
          <Box display="flex" alignItems="center" gap={3} sx={{ minWidth: 0, flex: 1 }}>
            <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
              <img src="/images/logo.png" alt="logo" style={{ height: '56px', maxWidth: '120px' }} />
            </Link>

            <Box
              component="form"
              onSubmit={handleSearch}
              sx={{
                width: isTablet ? '250px' : '350px',
                minWidth: '200px',
              }}
            >
              <TextField
                fullWidth
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search for products..."
                size="small"
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
                    '& fieldset': { borderColor: '#ddd' },
                    '&:hover fieldset': { borderColor: '#007bff' },
                    '&.Mui-focused fieldset': { borderColor: '#007bff' },
                  },
                }}
              />
            </Box>
          </Box>

          {/* Cart and Account */}
          <Box display="flex" alignItems="center" gap={2}>
            {/* Cart */}
            <IconButton
              onClick={handleCartToggle}
              sx={{
                color: '#333',
                '&:hover': { color: '#007bff' },
              }}
            >
              <ShoppingCart />
              <Typography
                variant="caption"
                sx={{
                  ml: 0.5,
                  fontWeight: 'bold',
                  color: '#007bff',
                }}
              >
                {cartQuery?.data?.data?.length || 0}
              </Typography>
            </IconButton>

            {/* Auth Buttons or Avatar */}
            {!currentUser || !currentUser.jti ? (
              <Box display="flex" gap={1}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => dispatch(loginWindow('login'))}
                  sx={{ textTransform: 'none' }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => dispatch(loginWindow('register'))}
                  sx={{ textTransform: 'none' }}
                >
                  Register
                </Button>
              </Box>
            ) : (
              <Box position="relative" ref={avatarRef}>
                <IconButton onClick={handleAccountMenuToggle}>
                  <Avatar src={data?.data?.userImage.userImage} sx={{ width: 32, height: 32 }} />
                </IconButton>

                {menuOpen && (
                  <ClickAwayListener onClickAway={handleMenuClose}>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        mt: 1,
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        padding: '8px 0',
                        minWidth: '150px',
                        backgroundColor: '#fff',
                        zIndex: 9999,
                      }}
                    >
                      <MenuItem onClick={goToProfile}>Thông tin cá nhân</MenuItem>
                      <MenuItem onClick={goToOrders}>Đơn Hàng</MenuItem>
                      <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
                    </Box>
                  </ClickAwayListener>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Container>

      <Divider />

      {/* Bottom Bar */}
      <Container
        maxWidth={false}
        sx={{
          maxWidth: '1400px',
          py: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          {/* Categories and Links */}
          <Box display="flex" alignItems="center" gap={3} sx={{ flex: 1, minWidth: 0 }}>
            {/* Category Button */}
            <Button
              startIcon={<MenuIcon />}
              onClick={handleCategoryMenuOpen}
              sx={{
                position: 'relative',
                backgroundColor: '#d51243',
                color: 'white',
                fontWeight: 'bold',
                px: 2,
                py: 1,
                '&:hover': {
                  backgroundColor: 'black',
                  color: 'white',
                },
                flexShrink: 0,
              }}
            >
              DANH MỤC
            </Button>

            {/* Navigation Links */}
            <Box
              display="flex"
              alignItems="center"
              gap={3}
              sx={{
                flexWrap: 'wrap',
                '& > *': { flexShrink: 0 },
              }}
            >
              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to} style={{ textDecoration: 'none' }}>
                  {({ isActive }) => (
                    <Typography
                      sx={{
                        color: isActive ? '#007bff' : '#333',
                        fontWeight: 'bold',
                        fontSize: '0.875rem',
                        '&:hover': { color: '#007bff' },
                      }}
                    >
                      {link.label}
                    </Typography>
                  )}
                </NavLink>
              ))}
            </Box>
          </Box>

          {/* Contact Info */}
          {!isTablet && (
            <Box display="flex" alignItems="center" gap={3}>
              <Box display="flex" alignItems="center" gap={1}>
                <LocalPhoneIcon sx={{ color: 'black', fontSize: '1.2rem' }} />
                <Typography variant="body2" fontWeight="bold">
                  0977.477.636
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <LocationOnIcon sx={{ color: 'black', fontSize: '1.2rem' }} />
                <Typography variant="body2" fontWeight="bold">
                  Hà Nội
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Container>
    </>
  );

  // Mobile Navigation
  const MobileNav = () => (
    <Container maxWidth={false} sx={{ maxWidth: '1400px', py: 1 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Mobile Menu Button */}
        <IconButton onClick={handleMobileMenuToggle}>
          <MenuIcon />
        </IconButton>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <img src="/images/logo.png" alt="logo" style={{ height: '40px' }} />
        </Link>

        {/* Cart and Account */}
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={handleCartToggle} size="small">
            <ShoppingCart />
            <Typography
              variant="caption"
              sx={{
                ml: 0.5,
                fontWeight: 'bold',
                color: '#007bff',
              }}
            >
              {cartQuery?.data?.data?.length || 0}
            </Typography>
          </IconButton>

          {!currentUser || !currentUser.jti ? (
            <Button variant="contained" size="small" onClick={handleClickOpen} sx={{ textTransform: 'none', ml: 1 }}>
              Login
            </Button>
          ) : (
            <IconButton onClick={handleAccountMenuToggle} size="small">
              <Avatar src={data?.data?.userImage.userImage} sx={{ width: 32, height: 32 }} />
              {menuOpen && (
                <ClickAwayListener onClickAway={handleMenuClose}>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      mt: 1,
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      padding: '8px 0',
                      minWidth: '150px',
                      backgroundColor: '#fff',
                      zIndex: 9999,
                    }}
                  >
                    <MenuItem onClick={goToProfile}>Thông tin cá nhân</MenuItem>
                    <MenuItem onClick={goToOrders}>Đơn Hàng</MenuItem>
                    <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
                  </Box>
                </ClickAwayListener>
              )}
            </IconButton>
          )}
        </Box>
      </Box>
    </Container>
  );

  // Mobile Menu Drawer
  const MobileMenuDrawer = () => (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          maxWidth: '80vw',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            Menu
          </Typography>
          <IconButton onClick={() => setMobileMenuOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Search */}
        <Box component="form" onSubmit={handleSearch} mb={2}>
          <TextField
            fullWidth
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search products..."
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Categories */}
        <List>
          <ListItemButton onClick={() => setMobileCategoryOpen(!mobileCategoryOpen)}>
            <ListItemText primary="DANH MỤC" />
            {mobileCategoryOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={mobileCategoryOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {listCategory.map((category) => (
                <ListItemButton
                  key={category.id}
                  sx={{ pl: 4 }}
                  component={Link}
                  to={`/products?category=${category.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <span>{category.icon || category.name.charAt(0)}</span>
                        <span>{category.name}</span>
                      </Box>
                    }
                  />
                </ListItemButton>
              ))}
            </List>
          </Collapse>

          <Divider />

          {/* Navigation Links */}
          {navLinks.map((link) => (
            <ListItemButton key={link.to} component={Link} to={link.to} onClick={() => setMobileMenuOpen(false)}>
              <ListItemText primary={link.label} />
            </ListItemButton>
          ))}

          <Divider />

          {/* Contact Info */}
          <ListItem>
            <Box>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <LocalPhoneIcon />
                <Typography variant="body2">0977.477.636</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <LocationOnIcon />
                <Typography variant="body2">Hà Nội</Typography>
              </Box>
            </Box>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );

  return (
    <Box sx={{ width: '100%', borderBottom: 1, borderColor: 'divider' }}>
      {isMobile ? <MobileNav /> : <DesktopNav />}

      {/* Mobile Menu Drawer */}
      <MobileMenuDrawer />

      {/* Cart Drawer */}
      <Drawer anchor="right" open={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)}>
        <CartFeature setOpen={setCartDrawerOpen}></CartFeature>
      </Drawer>

      {/* Category Menu */}
      <Menu
        anchorEl={categoryMenuAnchor}
        open={Boolean(categoryMenuAnchor)}
        onClose={handleCategoryMenuClose}
        MenuListProps={{ onMouseLeave: handleCategoryMenuClose }}
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
            to={`/products?category=${item.id}`}
            onClick={handleCategoryMenuClose}
            sx={{
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              '&:hover': {
                backgroundColor: '#f9f9f9',
                color: '#007bff',
              },
            }}
          >
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
              {item.icon || item.name.charAt(0).toUpperCase()}
            </Box>
            {item.name}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

NavWeb.propTypes = {
  listCategory: PropTypes.array,
};

export default NavWeb;
