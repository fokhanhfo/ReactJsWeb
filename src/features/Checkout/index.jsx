import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Paper } from '@mui/material';
import ShipDetail from './components/ShipDetail';
import ListProdcut from './components/ListProdcut';
import PayMethod from './components/PayMethod';
import { Route, Routes } from 'react-router-dom';
import CheckOut from './pages/CheckOut';

CheckOutFeatures.propTypes = {
    
};

function CheckOutFeatures(props) {
    return (
        <div>
            <Routes>
                <Route path="" element={<CheckOut/>} />
            </Routes>
        </div>
    );
}

export default CheckOutFeatures;