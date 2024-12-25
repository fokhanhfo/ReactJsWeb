import React from 'react';
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