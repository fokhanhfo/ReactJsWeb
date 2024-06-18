import React from 'react';
import PropTypes from 'prop-types';
import { Route, Routes } from 'react-router-dom';
import ListPage from './ListPage';

ProductFeature.propTypes = {
    
};

function ProductFeature(props) {
    return (
        <div>
            product feature
            <Routes>
                <Route path="" element={<ListPage />} />
            </Routes>
        </div>
    );
}

export default ProductFeature;