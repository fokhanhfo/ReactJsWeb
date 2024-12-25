import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import NavLogo from './NavLogo';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Link, NavLink } from 'react-router-dom';
import { Avatar, Button, Fade, IconButton, Menu, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { loginWindow, logout } from 'features/Auth/userSlice';
import { useClearCartMutation } from 'features/Cart/cartApi';
import { ShoppingCart } from '@mui/icons-material';

NavWeb.propTypes = {
  listCategory: PropTypes.array.isRequired,
};

function NavWeb({ listCategory }) {
  const cartQuery = useSelector((state) => state.cartApi.queries['getCart(undefined)']);
  const useCurrentUser = () => {
    return useSelector((state) => state.user.current);
  };
  const currentUser = useCurrentUser();
  const [isMenuCategory, setMenuCategory] = useState(false);
  const [clearCart] = useClearCartMutation();
  const dispatch = useDispatch();
  const handleClickOpen = () => {
    dispatch(loginWindow());
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    const action = logout();
    console.log(action);
    dispatch(action);
    await clearCart();
    handleCloseMenu();
  };

  const handleClickMenuCategory = () => {
    setMenuCategory(!isMenuCategory);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const navCategory = document.querySelector('.nav_category');
      if (navCategory && !navCategory.contains(event.target)) {
        setMenuCategory(false);
      }
    };

    if (isMenuCategory) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    // Cleanup event listener when component unmounts or when isMenuCategory changes
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuCategory]);

  return (
    <div className="nav-content">
      <NavLogo />
      <div className="nav__link">
        <div className="nav_category">
          <div className="nav_category_btn" onClick={handleClickMenuCategory}>
            <span>DANH MỤC</span>
            <span>
              <KeyboardArrowDownIcon />
            </span>
            {isMenuCategory && (
              <div className="nav_category_list">
                <ul className="nav-mobile-category">
                  {listCategory.map((item) => (
                    <li key={item.id}>
                      <Link onClick={handleClickMenuCategory} to={`/products?category=${item.id}`}>
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <NavLink className={({ isActive }) => (isActive ? 'active-link' : 'link')} to="/newproduct">
          NEW ARRIVALS
        </NavLink>
        <NavLink className={({ isActive }) => (isActive ? 'active-link' : 'link')} to="/albums">
          ALBUM
        </NavLink>
        <NavLink className={({ isActive }) => (isActive ? 'active-link' : 'link')} to="/products">
          PRODUCT
        </NavLink>
        <NavLink className={({ isActive }) => (isActive ? 'active-link' : 'link')} to="/bill">
          BILL
        </NavLink>
      </div>
      <nav className="nav">
        <Link to="/cart">
          <IconButton className="icon_cart">
            <ShoppingCart />
            <span>{cartQuery?.data?.data?.length || ''}</span>
          </IconButton>
        </Link>
        {!currentUser !== false || !currentUser.jti ? (
          <div className="nav__sign">
            <Button color="inherit" onClick={handleClickOpen}>
              Login
            </Button>
            <Button color="inherit" onClick={handleClickOpen}>
              Register
            </Button>
          </div>
        ) : (
          <IconButton onClick={handleClickMenu}>
            <Avatar></Avatar>
          </IconButton>
        )}
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
  );
}

export default NavWeb;
