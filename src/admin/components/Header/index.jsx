import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './styled.scss';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { TextField } from '@mui/material';
import { Outlet } from 'react-router-dom';

Header.propTypes = {
    // Định nghĩa các prop nếu cần
};

function Header(props) {
    const [isMenu, setIsMenu] = useState(false);
    const handleClickMenu = () => {
        setIsMenu(!isMenu);
    };

    return (
        <>
            <div className='header-admin'>
                <div className='header_menu' onClick={handleClickMenu}>
                    <MenuIcon />
                </div>
                <div className='header_auth'>
                    <TextField></TextField>
                    <AccountCircleIcon />
                </div>
            </div>
            <div className='wrapper'>
                <div className={`nav_menu ${isMenu ? 'show' : ''}`}>
                    {/* Nội dung của menu */}
                </div>
                <div className={`content ${isMenu ? 'content_nav' : ''}`}>
                    <Outlet /> {/* Chèn nội dung của các route vào đây */}
                </div>
            </div>
        </>
    );
}

export default Header;
