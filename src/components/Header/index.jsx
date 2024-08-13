import styled from '@emotion/styled';
import { Close, ShoppingCart } from '@mui/icons-material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Avatar } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Login from 'features/Auth/Components/Login';
import Register from 'features/Auth/Components/Register';
import { logout } from 'features/Auth/userSlice';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import './styles.scss';

const LinkStyled = styled(Link)`
  color: #fff,
  text-decoration: none;
`
const CloseDialogButton= styled(IconButton)`
  position: absolute;
  top: 0,
  right: 0,
`

const MODE ={
  LOGIN: 'login',
  REGISTER: 'register'
}


export default function ButtonAppBar() {

    const dispatch = useDispatch();
    const useCurrentUser = ()=>{
      return useSelector((state)=>state.user.current);
    }
    const currentUser = useCurrentUser();
    const [mode,setMode]=React.useState(MODE.LOGIN);
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const [anchorEl, setAnchorEl] = React.useState(null);
    const openMenu = Boolean(anchorEl);
    const handleClickMenu = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
      setAnchorEl(null);
    };

    const handleLogout = () => {
      const action = logout();
      console.log(action);
      dispatch(action);
      handleCloseMenu();
    };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
        <AddShoppingCartIcon style={{padding: '0 10px'}}/>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <LinkStyled to="/">FashionShop</LinkStyled>
          </Typography>
          <NavLink className={({ isActive }) => (isActive ? 'active-link' : 'link')} to="/todos">
            <Button color="inherit">Todo</Button>
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? 'active-link' : 'link')} to="/albums">
            <Button color="inherit">Album</Button>
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? 'active-link' : 'link')} to="/products">
            <Button color="inherit">Products</Button>
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? 'active-link' : 'link')} to="/cart">
            <IconButton>
              <ShoppingCart />
            </IconButton>
          </NavLink>
          {!currentUser || !currentUser.id ?
          <Button color="inherit" onClick={handleClickOpen}>Login</Button> : 
          <IconButton onClick={handleClickMenu}>
            <Avatar></Avatar>
          </IconButton>
          }
          <Menu
            MenuListProps={{
              'aria-labelledby': 'fade-button',
            }}
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleCloseMenu}
            TransitionComponent={Fade}
          >
            <MenuItem onClick={handleCloseMenu}>Profile</MenuItem>
            <MenuItem onClick={handleCloseMenu}>My account</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <React.Fragment>
        <Dialog
          open={open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          disableEscapeKeyDown
        >
          <CloseDialogButton onClick={handleClose}>
            <Close />
          </CloseDialogButton>
          <DialogContent>
            {mode === MODE.REGISTER && (
              <>
                <Register closeDialog={handleClose}></Register>
                <Box>
                  <Button onClick={()=>{setMode(MODE.LOGIN)}}>Register</Button>
                </Box>
              </>
            )}

            {mode === MODE.LOGIN && (
              <>
                <Login closeDialog={handleClose}></Login>
                <Box>
                  <Button onClick={()=>{setMode(MODE.REGISTER)}}>Login</Button>
                </Box>
              </>
            )}
          </DialogContent>
        </Dialog>
      </React.Fragment>
    </Box>
  );
}
