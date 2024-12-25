import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Container, Grid, IconButton, Paper, TextField, Typography } from '@mui/material';
import CartItem from '../components/CartItem';
import Cart from '../components/Cart';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

ListPage.propTypes = {
    // Add PropTypes if required
};

const StyledDiv = styled('div')`

    .cart-title{
        margin-left:10px;
        padding:10px;
    }
    .cart-title-link{
        margin-left:30px;
        padding:0 10px 10px 10px;
        display:flex;
        align-items:center;
    }

    .cart-title-link a{
        text-decoration:none;
        color:black;
        padding:5px;
        font-weight:300;
    }
`

function ListPage(props) {

    return (
        <Container>
            <StyledDiv>
                <div className='cart-title'>
                    GIỎ HÀNG
                </div>
                <div className='cart-title-link'>
                    <Link to='/'>Home</Link>
                    <ChevronRightIcon fontSize='small' style={{opacity:0.5}} />
                    <Link to='/products'>Shop</Link>
                    <ChevronRightIcon fontSize='small' style={{opacity:0.5}} />
                    <Link to='/cart'>Cart</Link>
                </div>
            </StyledDiv>
            <div>
                <Cart></Cart>
            </div>
        </Container>
    );
}

export default ListPage;
