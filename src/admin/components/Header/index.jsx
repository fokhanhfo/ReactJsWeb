import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './styled.scss';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { AppBar, Box, Container, Drawer, IconButton, Paper, TextField, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import NavMenu from './NavMenu';
import BasicBreadcrumbs from '../Breadcrumbs/Breadcrumbs';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

Header.propTypes = {};

const drawerWidth = 240;

function Header(props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState([]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Box
        position="fixed"
        sx={{
          backgroundColor: '#1976d2',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          transition: 'margin-left 0.3s, width 0.3s',
          width: `calc(100% - ${open ? drawerWidth : 60}px)`,
          marginLeft: `${open ? drawerWidth : 60}px`,
          height: '50px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box display={'flex'} alignItems={'center'} gap={2}>
            <IconButton onClick={toggleDrawer} sx={{ color: 'white' }}>
              {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
            <Box>
              <BasicBreadcrumbs />
            </Box>
          </Box>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TextField variant="outlined" size="small" sx={{ marginRight: 2, width: '200px' }} />
            <AccountCircleIcon />
          </div>
        </div>
      </Box>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : 60,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 60,
            transition: 'width 0.3s',
            overflowX: 'hidden',
          },
        }}
      >
        <NavMenu isMenu={open}></NavMenu>
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
        }}
      >
        <Box sx={{ height: '50px', flexShrink: 0 }}></Box>
        <Box marginTop={2}>
          <Outlet />
          <Container maxWidth={false}>
            <Box paddingY={4}>© 2025, Made with ❤️ by ThemeSelection</Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}

export default Header;
