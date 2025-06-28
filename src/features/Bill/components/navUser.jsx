import React, { useEffect, useState } from 'react';
import {
  Box,
  Avatar,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
  useTheme,
  IconButton,
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LockIcon from '@mui/icons-material/Lock';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RedeemIcon from '@mui/icons-material/Redeem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import { useSelector } from 'react-redux';
import { useGetMyInfoQuery } from 'hookApi/userApi';

function NavUser() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [expanded, setExpanded] = useState(false);
  const currentUser = useSelector((state) => state.user.current);
  const { data, error, isLoading } = useGetMyInfoQuery();

  const toggleMenu = () => {
    setExpanded(!expanded);
  };

  const menuItems = [
    { label: 'Hồ Sơ', icon: <AccountCircleIcon />, path: './profile' },
    { label: 'Địa Chỉ', icon: <LocationOnIcon />, path: './address' },
    { label: 'Đổi Mật Khẩu', icon: <LockIcon />, path: './change-password' },
    { label: 'Đơn Mua', icon: <ShoppingCartIcon />, path: './bill/all' },
    { label: 'Kho Voucher', icon: <RedeemIcon />, path: './vouchers' },
  ];

  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: { xs: '100%', sm: 280 },
        overflow: 'hidden',
      }}
    >
      {/* User Info - Luôn hiển thị */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: { xs: 1.5, sm: 2 },
          borderBottom: '1px solid #eee',
          position: 'relative',
        }}
      >
        <Avatar
          src={data?.data?.userImage.userImage}
          sx={{
            width: { xs: 40, sm: 48 },
            height: { xs: 40, sm: 48 },
          }}
        />
        <Box sx={{ ml: 2, overflow: 'hidden', flex: 1 }}>
          <Typography fontWeight="bold" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }} noWrap>
            {data?.data?.fullName}
          </Typography>
          <NavLink
            to="/edit-profile"
            style={{
              textDecoration: 'none',
              color: theme.palette.primary.main,
              fontSize: isSmallScreen ? '0.75rem' : '0.875rem',
              display: 'block',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Sửa Hồ Sơ
          </NavLink>
        </Box>

        {/* Toggle Button cho mobile */}
        <IconButton
          onClick={toggleMenu}
          sx={{
            display: { xs: 'flex', sm: 'none' },
            ml: 1,
          }}
        >
          {expanded ? <ExpandMoreIcon sx={{ transform: 'rotate(180deg)' }} /> : <MenuIcon />}
        </IconButton>
      </Box>

      {/* Accordion cho Navigation Menu */}
      <Accordion
        expanded={isSmallScreen ? expanded : true}
        sx={{
          boxShadow: 'none',
          '&.MuiAccordion-root': {
            backgroundColor: 'transparent',
            '&:before': {
              display: 'none',
            },
          },
        }}
        disableGutters
      >
        <AccordionSummary
          expandIcon={isSmallScreen ? <ExpandMoreIcon /> : null}
          sx={{
            display: { xs: 'none', sm: 'flex' },
            minHeight: '0 !important',
            '& .MuiAccordionSummary-content': {
              margin: '0 !important',
              justifyContent: 'center',
            },
          }}
        ></AccordionSummary>

        <AccordionDetails sx={{ p: 0 }}>
          <List disablePadding>
            {menuItems.map((item, index) => (
              <NavLink key={index} to={item.path} style={{ textDecoration: 'none' }}>
                {({ isActive }) => (
                  <ListItemButton
                    sx={{
                      p: { xs: '8px 12px', sm: '12px 16px' },
                      borderLeft: isActive ? '3px solid' : '3px solid transparent',
                      borderColor: isActive ? theme.palette.primary.main : 'transparent',
                      backgroundColor: isActive ? theme.palette.action.selected : 'transparent',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: '36px',
                        color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                      }}
                    >
                      {React.cloneElement(item.icon, {
                        sx: { fontSize: { xs: '1.25rem', sm: '1.5rem' } },
                      })}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            fontWeight: isActive ? 600 : 'normal',
                            color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
                            fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.label}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                )}
              </NavLink>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

export default NavUser;
