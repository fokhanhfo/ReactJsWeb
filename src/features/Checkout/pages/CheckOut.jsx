import React from 'react';
import PropTypes from 'prop-types';
import { Box, Container, Grid } from '@mui/material';
import ShipDetail from '../components/ShipDetail';
import ListProdcut from '../components/ListProdcut';
import PayMethod from '../components/PayMethod';
import PayCheckout from '../components/PayCheckout';
import { useSelector } from 'react-redux';

CheckOut.propTypes = {
    
};

function CheckOut(props) {

    const cartQuery = useSelector((state) => state.cartApi.queries["getCart(undefined)"]);
    return (
        <Container>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={12} md={3.5}>
                    <ShipDetail></ShipDetail>
                </Grid>

                <Grid item xs={12} sm={12} md={5}>
                    <ListProdcut cartQuery={cartQuery}></ListProdcut>
                </Grid>

                <Grid item xs={12} sm={12} md={3.5}>
                    <PayMethod></PayMethod>
                </Grid>
            </Grid>
            <PayCheckout cartQuery={cartQuery}></PayCheckout>
        </Container>
    );
}

export default CheckOut;