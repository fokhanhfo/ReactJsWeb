import React from 'react';
import ListPageProduct from './pages/ListPageProduct';
import { Route, Routes } from 'react-router-dom';
import { Container } from '@mui/material';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import EditImage from './pages/EditImage';

ProductAdmin.propTypes = {
    
};

function ProductAdmin(props) {
    return (
        <Container maxWidth={false}iv>
            <Routes>
                <Route path="" element={<ListPageProduct />} />
                <Route path="/add" element={<AddProduct />} />
                <Route path='/:productId' element={<EditProduct/>} />
                <Route path='/:productId/image' element={<EditImage/> } />
            </Routes>
        </Container>
    );
}

export default ProductAdmin;