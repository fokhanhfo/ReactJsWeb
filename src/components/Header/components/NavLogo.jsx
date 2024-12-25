import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

NavLogo.propTypes = {
    
};

function NavLogo(props) {
    return (
        <div className='nav_logo'>
            <Link to='/'>
                ShopKhanh
            </Link>
        </div>
    );
}

export default NavLogo;