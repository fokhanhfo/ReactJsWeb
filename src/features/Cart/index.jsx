import React from 'react';
import PropTypes from 'prop-types';
import ListPage from './pages/ListPage';
import { Box } from '@mui/material';
import { Route, Routes } from 'react-router-dom';

CartFeature.propTypes = {
    
};

function CartFeature(props) {
    return (
        <Box mt={2}>
            <Routes>
                <Route path="" element={<ListPage />} />
            </Routes>
        </Box>
    );
}

export default CartFeature;