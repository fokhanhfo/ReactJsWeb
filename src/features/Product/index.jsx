import React from 'react';
import PropTypes from 'prop-types';
import { Route, Routes } from 'react-router-dom';
import ListPage from './pages/ListPage';
import { Box } from '@mui/material';
import DetailPage from './pages/DetailPage';

ProductFeature.propTypes = {
    
};

function ProductFeature(props) {
    return (
        <Box mt={2}>
            <Routes>
                <Route path="" element={<ListPage />} />
                <Route path="/:productId" element={<DetailPage />} />
            </Routes>
        </Box>
    );
}

export default ProductFeature;