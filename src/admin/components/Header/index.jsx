'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  IconButton,
  TextField,
  Container,
  Drawer,
  InputAdornment,
  Badge,
  Avatar,
  Paper,
  Popover,
  Typography,
  Button,
  List,
  ListItemAvatar,
  ListItemText,
  Divider,
  ListItem,
  Snackbar,
  Alert,
} from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import NavMenu from './NavMenu';
import BasicBreadcrumbs from '../Breadcrumbs/Breadcrumbs';
import {
  Search,
  Language,
  LightMode,
  Apps,
  Notifications,
  Settings,
  ChevronLeft,
  ChevronRight,
  Home,
  NavigateNext,
} from '@mui/icons-material';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { Email, Warning, CheckCircle, Info } from '@mui/icons-material';
import { useGetNotificationQuery } from 'hookApi/notificationApi';
import { useGetBillQuery } from 'hookApi/billApi';

const drawerWidth = 240;

function Header() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { data, isLoding, error, isError } = useGetNotificationQuery({ limit: 8, page: 1 });
  const { data: bills, refetch } = useGetBillQuery({ limit: 20, page: 1 });
  useEffect(() => {
    // Kết nối WebSocket
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('Connected to WebSocket');
        stompClient.subscribe('/topic/orders', (message) => {
          const data = JSON.parse(message.body);
          setNotifications((prev) => [data, ...prev]);
          console.log(data);
          setOpenSnackbar(true);
          refetch();
        });
      },
    });

    stompClient.activate();
    return () => {
      stompClient.deactivate();
    };
  }, []);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, unread: false })));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle sx={{ color: '#4caf50' }} />;
      case 'warning':
        return <Warning sx={{ color: '#ff9800' }} />;
      case 'error':
        return <Email sx={{ color: '#f44336' }} />;
      default:
        return <Info sx={{ color: '#2196f3' }} />;
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  const unreadCount = data?.data?.notifications.filter((notif) => !notif.isRead).length;
  const openNotification = Boolean(anchorEl);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* App Bar */}
      <Box
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          transition: 'margin-left 0.3s, width 0.3s',
          width: `calc(100% - ${open ? drawerWidth : 88}px)`,
          marginLeft: `${open ? drawerWidth : 72}px`,
          height: '64px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Container maxWidth={false} sx={{ width: '100%', height: '100%' }}>
          <Paper
            sx={{
              height: '100%',
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0 10px 0 10px',
            }}
          >
            {/* Left side - Toggle button and Breadcrumbs */}
            <Box display="flex" alignItems="center" gap={2}>
              <IconButton
                onClick={toggleDrawer}
                sx={{
                  color: '#1976d2',
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  '&:hover': {
                    backgroundColor: '#e3f2fd',
                    color: '#0d47a1',
                    borderColor: '#bbdefb',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                {open ? <ChevronLeft /> : <ChevronRight />}
              </IconButton>

              <Box>
                <BasicBreadcrumbs />
              </Box>
            </Box>

            {/* Right side - Search and Icons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Search Bar */}
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search ⌘K"
                sx={{
                  width: '250px',
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'white',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                      borderWidth: 2,
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />

              <IconButton
                size="small"
                sx={{
                  color: '#2196f3',
                  '&:hover': {
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                  },
                }}
              >
                <Language fontSize="small" />
              </IconButton>

              <IconButton
                size="small"
                sx={{
                  color: '#fbc02d',
                  '&:hover': {
                    backgroundColor: 'rgba(251, 192, 45, 0.1)',
                  },
                }}
              >
                <LightMode fontSize="small" />
              </IconButton>

              <IconButton
                size="small"
                sx={{
                  color: '#ab47bc',
                  '&:hover': {
                    backgroundColor: 'rgba(171, 71, 188, 0.1)',
                  },
                }}
              >
                <Apps fontSize="small" />
              </IconButton>

              <IconButton
                size="small"
                onClick={handleClick}
                sx={{
                  color: '#ef5350',
                  '&:hover': {
                    backgroundColor: 'rgba(239, 83, 80, 0.1)',
                  },
                }}
              >
                <Badge
                  badgeContent={unreadCount}
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '0.75rem',
                      minWidth: 16,
                      height: 16,
                    },
                  }}
                >
                  <Notifications fontSize="small" />
                </Badge>
              </IconButton>

              <Snackbar
                open={openSnackbar}
                autoHideDuration={2000} // 2 giây
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <Alert severity="info" onClose={handleSnackbarClose} variant="filled">
                  Khách hàng đặt hàng
                </Alert>
              </Snackbar>

              <Popover
                open={openNotification}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  sx: {
                    width: 360,
                    maxHeight: 400,
                    overflow: 'hidden',
                  },
                }}
              >
                <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Thông báo
                    </Typography>
                    {unreadCount > 0 && (
                      <Button
                        size="small"
                        onClick={handleMarkAllAsRead}
                        sx={{ textTransform: 'none', fontSize: '0.875rem' }}
                      >
                        Đánh dấu đã đọc
                      </Button>
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Bạn có {unreadCount} thông báo chưa đọc
                  </Typography>
                </Box>

                <List sx={{ p: 0, maxHeight: 300, overflow: 'auto' }}>
                  {data?.data?.notifications.map((notification, index) => (
                    <React.Fragment key={notification.id}>
                      <ListItem
                        onClick={() => {
                          const match = notification.content.match(/Đơn hàng mã (\d+)/);
                          const orderId = match ? match[1] : null;

                          if (orderId) {
                            navigate(`/admin/bill/${orderId}`);
                            handleClose();
                          }
                        }}
                        sx={{
                          backgroundColor: !notification.isRead ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          },
                          cursor: 'pointer',
                          position: 'relative',
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ width: 32, height: 32, backgroundColor: 'transparent' }}>
                            {getIcon('order')} {/* hoặc notification.type nếu có */}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: !notification.isRead ? 600 : 400,
                                fontSize: '0.875rem',
                              }}
                            >
                              {notification.title}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontSize: '0.8125rem', mb: 0.5 }}
                              >
                                {notification.content}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                {new Date(notification.createdAt).toLocaleString('vi-VN')}
                              </Typography>
                            </Box>
                          }
                        />
                        {!notification.isRead && (
                          <Box
                            sx={{
                              position: 'absolute',
                              right: 12,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: '#1976d2',
                            }}
                          />
                        )}
                      </ListItem>
                      {index < notifications.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>

                <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', textAlign: 'center' }}>
                  <Button fullWidth variant="text" sx={{ textTransform: 'none' }} onClick={handleClose}>
                    Xem tất cả thông báo
                  </Button>
                </Box>
              </Popover>

              <IconButton
                size="small"
                sx={{
                  color: '#90a4ae',
                  '&:hover': {
                    backgroundColor: 'rgba(144, 164, 174, 0.1)',
                  },
                }}
              >
                <Settings fontSize="small" />
              </IconButton>

              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  ml: 1,
                  background: 'linear-gradient(to right, #8e2de2, #4a00e0)', // tím gradient
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.9,
                  },
                }}
              >
                JD
              </Avatar>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : 72,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 72,
            transition: 'width 0.3s',
            overflowX: 'hidden',
            border: 'none',
          },
        }}
      >
        <NavMenu isMenu={open} />
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          transition: 'margin-left 0.3s',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Box sx={{ height: '72px', flexShrink: 0 }}></Box>
        <Box>
          <Outlet />
        </Box>
        <Container maxWidth={false}>
          <Box
            paddingY={2}
            textAlign="center"
            sx={{
              borderTop: '1px solid #e0e0e0',
              color: '#666',
              fontSize: '0.875rem',
            }}
          >
            © 2025, Made with ❤️ by ThemeSelection
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default Header;
