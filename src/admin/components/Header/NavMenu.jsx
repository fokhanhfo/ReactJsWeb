'use client';

import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Tooltip,
  alpha,
} from '@mui/material';
import { Link, Navigate, NavLink, useLocation } from 'react-router-dom';
import {
  MoveToInbox as InboxIcon,
  ShoppingCart as SellIcon,
  Category as CategoryIcon,
  Inventory as ProductIcon,
  Receipt as BillIcon,
  Security as PermissionIcon,
  Palette as ColorIcon,
  LocalOffer as DiscountIcon,
  Straighten as SizeIcon,
  People as UserIcon,
  AdminPanelSettings as RolePermissionIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import EventIcon from '@mui/icons-material/Event';
import './styled.scss';
import { useSelector } from 'react-redux';
import NewspaperIcon from '@mui/icons-material/Newspaper';

NavMenu.propTypes = {
  isMenu: PropTypes.bool.isRequired,
};

function NavMenu({ isMenu }) {
  const currentUser = useSelector((state) => state.user.current);
  const listRoles = currentUser.scope.split(' ');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', link: '../home', icon: <DashboardIcon /> },
    { id: 'sell', label: 'Tại quầy', link: '../sell', icon: <SellIcon /> },
    { id: 'category', label: 'Danh mục', link: '../category', icon: <CategoryIcon /> },
    { id: 'product', label: 'Sản phẩm', link: '../products', icon: <ProductIcon /> },
    { id: 'color', label: 'Kích thước và Màu', link: '../productAttributes', icon: <ColorIcon /> },
    { id: 'blog', label: 'Tin tức', link: '../blog', icon: <NewspaperIcon /> },
    { id: 'bill', label: 'Hóa đơn', link: '../bill', icon: <BillIcon /> },
    // { id: 'permission', label: 'Permission', link: '../permission', icon: <PermissionIcon /> },
    // { id: 'color', label: 'Màu', link: '../color', icon: <ColorIcon /> },
    { id: 'discount', label: 'Giảm giá khách hàng', link: '../discount', icon: <DiscountIcon /> },
    { id: 'discountPeriod', label: 'Giảm giá theo đợt', link: '../discountPeriod', icon: <EventIcon /> },
    // { id: 'size', label: 'Kích cỡ', link: '../size', icon: <SizeIcon /> },
    {
      id: 'permission_and_user',
      label: 'Quản lý người dùng',
      icon: <PermissionIcon />,
      subItems: [
        { id: 'user', label: 'Người dùng', link: '../user', icon: <UserIcon /> },
        // {
        //   id: 'role_and_permission',
        //   label: 'Vai trò & Quyền',
        //   link: '../role-and-permission',
        //   icon: <RolePermissionIcon />,
        // },
        { id: 'profile', label: 'Thông tin cá nhân', link: '../profile', icon: <UserIcon /> },
      ],
    },
  ];
  const [openMenus, setOpenMenus] = useState({});
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const location = useLocation();

  // Set initial open state for menu containing the current path
  useEffect(() => {
    const currentPath = location.pathname;

    // Find if any submenu contains the current path
    menuItems.forEach((menu) => {
      if (menu.subItems) {
        const hasActivePath = menu.subItems.some((subItem) => currentPath.includes(subItem.link.replace('..', '')));

        if (hasActivePath) {
          setOpenMenus((prev) => ({ ...prev, [menu.id]: true }));
        }
      }

      // Set selected menu based on current path
      if (menu.link && currentPath.includes(menu.link.replace('..', ''))) {
        setSelectedMenuId(menu.id);
      } else if (menu.subItems) {
        menu.subItems.forEach((subItem) => {
          if (currentPath.includes(subItem.link.replace('..', ''))) {
            setSelectedMenuId(subItem.id);
          }
        });
      }
    });
  }, [location.pathname]);

  const handleClick = useCallback((menuId) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  }, []);

  if (!currentUser || Object.keys(currentUser).length === 0) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box
      sx={{
        height: '100vh',
        backgroundColor: '#ffffff',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        width: isMenu ? 240 : 72,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isMenu ? 'flex-start' : 'center',
          px: isMenu ? 2 : 0,
          borderBottom: '1px solid #ddd',
          backgroundColor: '#f5f7fa', // Màu nền mới: xanh xám nhạt
          color: '#333', // Màu chữ: đen xám dễ đọc
        }}
      >
        <Link
          to="./home"
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: '#333', // đồng bộ với màu chữ
          }}
        >
          <img
            src="/images/logoAdmin.png"
            alt="Admin Panel"
            style={{
              height: 40,
              objectFit: 'contain',
              marginRight: isMenu ? 12 : 0,
            }}
          />
          {isMenu && (
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  letterSpacing: 1,
                  lineHeight: 1.2,
                  color: '#222', // đậm hơn một chút
                }}
              >
                HOÀNG HẢI
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: 12,
                  letterSpacing: 1,
                  opacity: 0.7,
                  color: '#666',
                }}
              >
                FASHION
              </Typography>
            </Box>
          )}
        </Link>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          },
        }}
      >
        <List
          component="nav"
          sx={{
            p: 1,
            '& .MuiListItemButton-root': {
              borderRadius: '8px',
              mb: 0.5,
              transition: 'all 0.2s ease',
            },
          }}
        >
          {menuItems.map((menu) => {
            if (
              (menu.id === 'permission_and_user' || menu.id === 'discount' || menu.id === 'discountPeriod') &&
              !listRoles.includes('ROLE_ADMIN')
            ) {
              return null;
            }
            return (
              <React.Fragment key={menu.id}>
                {menu.subItems ? (
                  <>
                    <Tooltip title={!isMenu ? menu.label : ''} placement="right" arrow>
                      <ListItemButton
                        onClick={() => handleClick(menu.id)}
                        sx={{
                          py: 1,
                          px: isMenu ? 2 : 1.5,
                          backgroundColor: openMenus[menu.id] ? alpha('#1976d2', 0.08) : 'transparent',
                          '&:hover': {
                            backgroundColor: alpha('#1976d2', 0.12),
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: isMenu ? 36 : 24,
                            color: openMenus[menu.id] ? '#1976d2' : '#666',
                          }}
                        >
                          {menu.icon}
                        </ListItemIcon>
                        {isMenu && (
                          <>
                            <ListItemText
                              primary={menu.label}
                              primaryTypographyProps={{
                                fontSize: 14,
                                fontWeight: openMenus[menu.id] ? 600 : 400,
                                color: openMenus[menu.id] ? '#1976d2' : '#333',
                              }}
                            />
                            {openMenus[menu.id] ? <ExpandLess color="primary" /> : <ExpandMore />}
                          </>
                        )}
                      </ListItemButton>
                    </Tooltip>

                    <Collapse in={openMenus[menu.id] && isMenu} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {menu.subItems.map((subItem) => (
                          <NavLink
                            to={subItem.link}
                            key={subItem.id}
                            className={({ isActive }) => (isActive ? 'active-link-nav' : '')}
                            style={{ textDecoration: 'none' }}
                          >
                            {({ isActive }) => (
                              <ListItemButton
                                sx={{
                                  pl: 4,
                                  py: 1,
                                  backgroundColor: isActive ? alpha('#1976d2', 0.08) : 'transparent',
                                  '&:hover': {
                                    backgroundColor: alpha('#1976d2', 0.12),
                                  },
                                }}
                              >
                                <ListItemIcon
                                  sx={{
                                    minWidth: 36,
                                    color: isActive ? '#1976d2' : '#666',
                                  }}
                                >
                                  {subItem.icon}
                                </ListItemIcon>
                                <ListItemText
                                  primary={subItem.label}
                                  primaryTypographyProps={{
                                    fontSize: 14,
                                    fontWeight: isActive ? 600 : 400,
                                    color: isActive ? '#1976d2' : '#333',
                                  }}
                                />
                              </ListItemButton>
                            )}
                          </NavLink>
                        ))}
                      </List>
                    </Collapse>
                  </>
                ) : (
                  <Tooltip title={!isMenu ? menu.label : ''} placement="right" arrow>
                    <Box sx={{ display: 'block' }}>
                      <NavLink
                        to={menu.link}
                        className={({ isActive }) => (isActive ? 'active-link-nav' : '')}
                        style={{ textDecoration: 'none' }}
                      >
                        {({ isActive }) => (
                          <ListItemButton
                            sx={{
                              py: 1,
                              px: isMenu ? 2 : 1.5,
                              backgroundColor: isActive ? alpha('#1976d2', 0.08) : 'transparent',
                              '&:hover': {
                                backgroundColor: alpha('#1976d2', 0.12),
                              },
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: isMenu ? 36 : 24,
                                color: isActive ? '#1976d2' : '#666',
                              }}
                            >
                              {menu.icon}
                            </ListItemIcon>
                            {isMenu && (
                              <ListItemText
                                primary={menu.label}
                                primaryTypographyProps={{
                                  fontSize: 14,
                                  fontWeight: isActive ? 600 : 400,
                                  color: isActive ? '#1976d2' : '#333',
                                }}
                              />
                            )}
                          </ListItemButton>
                        )}
                      </NavLink>
                    </Box>
                  </Tooltip>
                )}
              </React.Fragment>
            );
          })}
        </List>
      </Box>

      <Box sx={{ p: 2, borderTop: '1px solid #f0f0f0' }}>
        <Typography
          variant="caption"
          component="div"
          sx={{
            color: '#666',
            textAlign: 'center',
            display: isMenu ? 'block' : 'none',
          }}
        >
          © 2024 Admin System
        </Typography>
      </Box>
    </Box>
  );
}

export default NavMenu;
