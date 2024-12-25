import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './styled.scss';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Grid, Paper, TextField, Typography } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';
import NavMenu from './NavMenu';

Header.propTypes = {
    // Định nghĩa các prop nếu cần
};

function Header(props) {
    const [isMenu, setIsMenu] = useState(false);
    const handleClickMenu = () => {
        setIsMenu(!isMenu);
    };

    const header = () => {
        return (
            <>
                <div className="header-admin">
                    <div className="header_home">
                        <div className="header_menu" onClick={handleClickMenu}>
                            <MenuIcon />
                        </div>
                    </div>
                    <div className="header_auth">
                        <TextField></TextField>
                        <AccountCircleIcon />
                    </div>
                </div>
            </>
        );
    };

    return (
        <>
            <Grid container>
                <Grid 
                    item 
                    style={{
                        width: isMenu ? "16.67%" : "4.17%", // Tương ứng với xs={2} và xs={0.5}
                        backgroundColor: "#3e5b93", 
                        transition: "width 0.5s"
                    }}
                >
                    <NavMenu isMenu={isMenu} />
                </Grid>
                <Grid 
                    item 
                    style={{
                        width: isMenu ? "83.33%" : "95.83%", // Tương ứng với xs={10} và xs={11.5}
                        transition: "width 0.5s"
                    }}
                >
                    <Grid container>
                        <Grid item xs={12}>
                            {header()}
                        </Grid>
                        <Grid item xs={12}>
                            <Outlet />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}

export default Header;
