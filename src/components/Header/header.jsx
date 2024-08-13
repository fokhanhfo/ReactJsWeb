import React, { useState, useEffect } from "react";
import './styles.scss';
import MenuIcon from '@mui/icons-material/Menu';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "features/Auth/userSlice";
import { Avatar, Box, Button, Dialog, DialogContent, Fade, IconButton, InputAdornment, Menu, MenuItem, Paper, TextField, Typography } from "@mui/material";
import styled from "@emotion/styled";
import { Close, ShoppingCart} from "@mui/icons-material";
import Register from "features/Auth/Components/Register";
import { Link, NavLink } from "react-router-dom";
import Login from "features/Auth/Components/Login";
import SearchIcon from '@mui/icons-material/Search';

const LinkStyled = styled(Link)`
  color: #fff,
  text-decoration: none;
`
const CloseDialogButton= styled(IconButton)`
  position: absolute;
  top: 0,
  right: 0,
`

const InputField = styled(TextField)`
    margin-right:20px;
    width:30%;
    display: flex;
    align-items: center;
    background-color:white;
    border-radius:10px;
    div{
        height:100%;
        width:100%;
        div{
            width:10%
        }
    }
    input{
        padding:0px;
    }
`

const MODE ={
    LOGIN: 'login',
    REGISTER: 'register'
  }

const Navbar = () => {
    const cartQuery = useSelector((state) => state.cartApi.queries["getCart(undefined)"]);
    const categoryQuery = useSelector((state)=> state.categoryApi.queries["getCategory(undefined)"]);
    const listCategory = categoryQuery.data.data;
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return ( 
    <div className="header">
        <div className="nav-noti">
            <p>Free shipping, 30-day return or refund guarantee.</p>
            <InputField
                InputProps={{
                    startAdornment:(
                        <InputAdornment position="start">
                            <SearchIcon/>
                        </InputAdornment>
                    ),
                }}
            />
        </div>
        <div className="nav-container">
        {isMobile ? (
            <div className="nav-content">
                <div>
                    <Link to='/'>
                        ShopKhanh
                    </Link>
                </div>
                <div className="nav-icon" onClick={toggleMenu}>
                    <MenuIcon></MenuIcon>
                </div>
            {isMenuOpen && (
                <Paper className={`nav nav-mobile ${isMenuOpen ? 'open' : 'close'}`}>
                  <ul className="nav-mobile-menu">
                      <li><NavLink className={({ isActive }) => (isActive ? 'active-link' : 'link')} to='/newproduct'>NEW ARRIVALS</NavLink></li>
                      <li><NavLink className={({ isActive }) => (isActive ? 'active-link' : 'link')} to='/todos'>TODO</NavLink></li>
                      <li><NavLink className={({ isActive }) => (isActive ? 'active-link' : 'link')} to='/albums'>ALBUM</NavLink></li>
                      <li><NavLink className={({ isActive }) => (isActive ? 'active-link' : 'link')} to='/products'>PRODUCT</NavLink></li>
                  </ul>

                  <ul className="nav-mobile-category">
                    {listCategory.map(item=>(
                      <li><Link key={item.id} to={`/products?category=${item.id}`}>{item.name}</Link></li>
                    ))}
                  </ul>

                </Paper>
            )}
            </div>
        ) : (
            <div className="nav-content">
                <div>
                    <Link to='/'>
                        ShopKhanh
                    </Link>
                </div>
                <div className="nav__link">
                    <NavLink className={({ isActive }) => (isActive ? 'active-link' : 'link')} to='/newproduct'>NEW ARRIVALS</NavLink>
                    <NavLink className={({ isActive }) => (isActive ? 'active-link' : 'link')} to='/todos'>TODO</NavLink>
                    <NavLink className={({ isActive }) => (isActive ? 'active-link' : 'link')} to='/albums'>ALBUM</NavLink>
                    <NavLink className={({ isActive }) => (isActive ? 'active-link' : 'link')} to='/products'>PRODUCT</NavLink>
                </div>
                <nav className="nav">
                    <Link to='/cart'>
                        <IconButton className="icon_cart">
                            <ShoppingCart/>
                            <span>{cartQuery.data.data.length}</span>
                        </IconButton>
                    </Link>
                    {!currentUser !== false || !currentUser.jti ?
                    <div className="nav__sign">
                        <Button color="inherit" onClick={handleClickOpen}>Login</Button>
                        <Button color="inherit" onClick={handleClickOpen}>Register</Button>
                    </div> : 
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
                </nav>
            </div>
        )}
        </div>
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
                  <Button onClick={()=>{setMode(MODE.LOGIN)}}>Login</Button>
                </Box>
              </>
            )}

            {mode === MODE.LOGIN && (
              <>
                <Login closeDialog={handleClose}></Login>
                <Box>
                  <Button onClick={()=>{setMode(MODE.REGISTER)}}>Register</Button>
                </Box>
              </>
            )}
          </DialogContent>
        </Dialog>
      </React.Fragment>
    </div>
  );
};

export default Navbar;
