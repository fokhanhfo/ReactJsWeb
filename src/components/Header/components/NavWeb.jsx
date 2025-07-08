'use client';

import React, { useCallback, useEffect, useRef, useMemo } from 'react';
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
  Snackbar,
  Alert,
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
import Search from './Search';
import SockJS from 'sockjs-client';
import { useGetNotificationQuery } from 'hookApi/notificationApi';
import { useGetBillQuery } from 'hookApi/billApi';
import { Client } from '@stomp/stompjs';

function NavWeb({ listCategory }) {
  const [notifications, setNotifications] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [notification, setNotification] = useState();
  const {
    data: dataNotification,
    isLoading: isLoadingNotification,
    refetch: refetchNotifi,
  } = useGetNotificationQuery({ limit: 8, page: 1 });
  const { data: bills, refetch } = useGetBillQuery({ limit: 20, page: 1 });
  const { data, error, isLoading } = useGetMyInfoQuery();
  useEffect(() => {
    const initChat = async () => {
      try {
        await createChat({
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
      } catch (error) {
        console.error('Error creating chat:', error);
      }
    };

    initChat();
  }, []);

  useEffect(() => {
    // Kết nối WebSocket
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('Connected to WebSocket');
        stompClient.subscribe('/topic/notifications/' + data?.data?.username, (message) => {
          const data = JSON.parse(message.body);
          console.log(data);
          setNotifications(data);
          setOpenSnackbar(true);
          refetch();
          refetchNotifi();
        });
      },
    });

    stompClient.activate();
    return () => {
      stompClient.deactivate();
    };
  }, []);
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

  // Memoized values to prevent unnecessary re-renders
  const cartItemCount = useMemo(() => {
    return cartQuery?.data?.data?.length || 0;
  }, [cartQuery?.data?.data?.length]);

  // Event handlers - all wrapped with useCallback to prevent re-renders
  const handleInputChange = useCallback((event) => {
    setSearchValue(event.target.value);
  }, []);

  const handleMobileMenuToggle = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const handleCartToggle = useCallback(() => {
    setCartDrawerOpen((prev) => !prev);
  }, []);

  const handleCategoryMenuOpen = useCallback((event) => {
    setCategoryMenuAnchor(event.currentTarget);
  }, []);

  const handleCategoryMenuClose = useCallback(() => {
    setCategoryMenuAnchor(null);
  }, []);

  const handleAccountMenuToggle = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const handleMenuClose = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const handleSearch = useCallback(
    (event) => {
      event.preventDefault();
      if (searchValue.trim()) {
        navigate(`/products?name=${encodeURIComponent(searchValue)}`);
        setMobileMenuOpen(false);
      }
    },
    [searchValue, navigate],
  );

  const handleLogout = useCallback(async () => {
    setMenuOpen(false);
    dispatch(logout());
    enqueueSnackbar('Đăng xuất thành công', { variant: 'success' });
    await clearCart();
  }, [dispatch, enqueueSnackbar, clearCart]);

  const handleClickOpen = useCallback(() => {
    dispatch(loginWindow());
  }, [dispatch]);

  const goToProfile = useCallback(() => {
    handleMenuClose();
    navigate('/user/profile');
  }, [navigate, handleMenuClose]);

  const goToOrders = useCallback(() => {
    handleMenuClose();
    navigate('/user/bill/all');
  }, [navigate, handleMenuClose]);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const closeCartDrawer = useCallback(() => {
    setCartDrawerOpen(false);
  }, []);

  const toggleMobileCategoryOpen = useCallback(() => {
    setMobileCategoryOpen((prev) => !prev);
  }, []);

  // Navigation links - memoized to prevent re-creation
  const navLinks = useMemo(
    () => [
      { to: '/', label: 'TRANG CHỦ' },
      { to: '/ABOUT-US', label: 'VỀ CHÚNG TÔI' },
      { to: '/products', label: 'SẢN PHẨM' },
      { to: '/contact', label: 'LIÊN HỆ' },
      { to: '/Blog', label: 'TIN TỨC' },
      { to: '/user/bill/all', label: 'HÓA ĐƠN' },
    ],
    [],
  );

  // Memoized search input props to prevent re-renders
  const searchInputProps = useMemo(
    () => ({
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon sx={{ color: '#888' }} />
        </InputAdornment>
      ),
      sx: {
        '& .MuiOutlinedInput-root': {
          '& fieldset': { borderColor: '#ddd' },
          '&:hover fieldset': { borderColor: '#007bff' },
          '&.Mui-focused fieldset': { borderColor: '#007bff' },
        },
      },
    }),
    [],
  );

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        handleSearch(event);
      }
    },
    [handleSearch],
  );
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  // Desktop Navigation - memoized component
  const DesktopNav = useMemo(
    () => (
      <>
        {/* Top Bar */}
        <Container
          maxWidth={false}
          sx={{
            maxWidth: '1400px',
            py: 1,
          }}
        >
          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000} // 2 giây
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert severity="info" onClose={handleSnackbarClose} variant="filled">
              Đơn hàng của bạn đã được {notifications.content}
            </Alert>
          </Snackbar>
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
                sx={{
                  width: isTablet ? '250px' : '350px',
                  minWidth: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <TextField
                  fullWidth
                  value={searchValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Tìm kiếm sản phẩm..."
                  size="small"
                  InputProps={searchInputProps}
                />
                {/* <button
                  onClick={handleSearch}
                  style={{
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    height: '40px',
                  }}
                >
                  Tìm
                </button> */}
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
                  {cartItemCount}
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
                    <Avatar src={data?.data?.userImage?.userImage || ''} sx={{ width: 32, height: 32 }} />
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
                  <NavLink
                    onClick={() => {
                      window.scrollTo({
                        top: 0,
                        behavior: 'smooth',
                      });
                    }}
                    key={link.to}
                    to={link.to}
                    style={{ textDecoration: 'none' }}
                  >
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
    ),
    [
      isTablet,
      searchValue,
      handleInputChange,
      searchInputProps,
      handleSearch,
      handleCartToggle,
      cartItemCount,
      currentUser,
      dispatch,
      data?.data?.userImage?.userImage || '',
      menuOpen,
      handleAccountMenuToggle,
      handleMenuClose,
      goToProfile,
      goToOrders,
      handleLogout,
      handleCategoryMenuOpen,
      navLinks,
      handleKeyDown,
      openSnackbar,
    ],
  );

  // Mobile Navigation - memoized component
  const MobileNav = useMemo(
    () => (
      <Container maxWidth={false} sx={{ maxWidth: '1400px', py: 1 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000} // 2 giây
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert severity="info" onClose={handleSnackbarClose} variant="filled">
              Đơn hàng của bạn đã được {notifications.content}
            </Alert>
          </Snackbar>
          {/* Mobile Menu Button */}
          <IconButton onClick={handleMobileMenuToggle}>
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
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
                {cartItemCount}
              </Typography>
            </IconButton>
            {!currentUser || !currentUser.jti ? (
              <Button variant="contained" size="small" onClick={handleClickOpen} sx={{ textTransform: 'none', ml: 1 }}>
                Login
              </Button>
            ) : (
              <IconButton onClick={handleAccountMenuToggle} size="small">
                <Avatar src={data?.data?.userImage?.userImage || ''} sx={{ width: 32, height: 32 }} />
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

        {/* Mobile Search Bar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mt: 1,
            px: 1,
          }}
        >
          <TextField
            fullWidth
            value={searchValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Tìm kiếm sản phẩm..."
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#888' }} />
                </InputAdornment>
              ),
              sx: {
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#ddd' },
                  '&:hover fieldset': { borderColor: '#007bff' },
                  '&.Mui-focused fieldset': { borderColor: '#007bff' },
                },
              },
            }}
          />
          <Button
            onClick={handleSearch}
            type="submit"
            variant="contained"
            size="small"
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              px: 2,
            }}
          >
            Tìm
          </Button>
        </Box>
      </Container>
    ),
    [
      handleMobileMenuToggle,
      handleCartToggle,
      cartItemCount,
      currentUser,
      handleClickOpen,
      data?.data?.userImage?.userImage || '',
      handleAccountMenuToggle,
      menuOpen,
      handleMenuClose,
      goToProfile,
      goToOrders,
      handleLogout,
      searchValue,
      handleInputChange,
      handleKeyDown,
      handleSearch,
      openSnackbar,
    ],
  );

  // Mobile Menu Drawer - memoized component
  const MobileMenuDrawer = useMemo(
    () => (
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={closeMobileMenu}
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
            <IconButton onClick={closeMobileMenu}>
              <CloseIcon />
            </IconButton>
          </Box>
          {/* Search */}
          <Box component="form" onSubmit={handleSearch} mb={2}>
            <TextField
              fullWidth
              value={searchValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
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
            <ListItemButton onClick={toggleMobileCategoryOpen}>
              <ListItemText primary="CATEGORY" />
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
                    onClick={closeMobileMenu}
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
              <ListItemButton key={link.to} component={Link} to={link.to} onClick={closeMobileMenu}>
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
    ),
    [
      mobileMenuOpen,
      closeMobileMenu,
      handleSearch,
      searchValue,
      handleInputChange,
      toggleMobileCategoryOpen,
      mobileCategoryOpen,
      listCategory,
      navLinks,
      handleKeyDown,
    ],
  );

  return (
    <Box
      sx={{
        width: '100%',
        borderBottom: 1,
        borderColor: 'divider',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1100,
        backgroundColor: '#fff',
      }}
    >
      <Search />
      {isMobile ? MobileNav : DesktopNav}
      {/* Mobile Menu Drawer */}
      {MobileMenuDrawer}
      {/* Cart Drawer */}
      <Drawer anchor="right" open={cartDrawerOpen} onClose={closeCartDrawer}>
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
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            padding: '8px 0',
          },
          '& .MuiMenuItem-root': {
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#333',
            '&:hover': {
              backgroundColor: '#f9f9f9',
              color: '#007bff',
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

export default React.memo(NavWeb);
