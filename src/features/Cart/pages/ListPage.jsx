import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Container, Grid, IconButton, Paper, TextField, Typography } from '@mui/material';
import CartItem from '../components/CartItem';
import Cart from '../components/Cart';

ListPage.propTypes = {
    // Add PropTypes if required
};

function ListPage(props) {

    return (
        <Container>
            <div>
                <Cart></Cart>
            </div>
        </Container>
    );
}

export default ListPage;
