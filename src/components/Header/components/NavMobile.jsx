import React from 'react';
import PropTypes from 'prop-types';
import NavLogo from './NavLogo';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, NavLink } from 'react-router-dom';
import { Paper } from '@mui/material';

NavMobile.propTypes = {
    toggleMenu:PropTypes.func.isRequired,
    isMenuOpen:PropTypes.bool,
    listCategory:PropTypes.array,

};

function NavMobile({toggleMenu,isMenuOpen,listCategory}) {

    const handleIconMenu=()=>{
        if(toggleMenu){
            toggleMenu();
        }
    };

    return (
        <div className="nav-content">
            <NavLogo/>
            <div className="nav-icon" onClick={handleIconMenu}>
                <MenuIcon></MenuIcon>
            </div>
            {isMenuOpen && (
                <Paper className={`nav nav-mobile ${isMenuOpen ? 'open' : 'close'}`}>
                <ul onClick={toggleMenu} className="nav-mobile-menu">
                    <li><NavLink className={({ isActive }) => (isActive ? 'active-link' : 'link')} to='/newproduct'>NEW ARRIVALS</NavLink></li>
                    <li><NavLink className={({ isActive }) => (isActive ? 'active-link' : 'link')} to='/todos'>TODO</NavLink></li>
                    <li><NavLink className={({ isActive }) => (isActive ? 'active-link' : 'link')} to='/albums'>ALBUM</NavLink></li>
                    <li><NavLink className={({ isActive }) => (isActive ? 'active-link' : 'link')} to='/products'>PRODUCT</NavLink></li>
                </ul>

                <ul className="nav-mobile-category">
                    {listCategory.map(item=>(
                    <li onClick={toggleMenu}><Link key={item.id} to={`/products?category=${item.id}`}>{item.name}</Link></li>
                    ))}
                </ul>

                </Paper>
            )}
        </div>
    );
}

export default NavMobile;