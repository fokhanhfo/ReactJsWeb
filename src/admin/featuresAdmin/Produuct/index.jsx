import React from 'react';
import ListPageProduct from './pages/ListPageProduct';
import { Route, Routes } from 'react-router-dom';
import { Container } from '@mui/material';
import AddProduct from './pages/AddProduct';

ProductAdmin.propTypes = {
    
};

function ProductAdmin(props) {
    return (
        <Container>
            <Routes>
                <Route path="" element={<ListPageProduct />} />
                <Route path="/add" element={<AddProduct />} />
            </Routes>
        </Container>
    );
}

export default ProductAdmin;