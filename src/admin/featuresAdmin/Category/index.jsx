import React from 'react';
import PropTypes from 'prop-types';
import { Route, Routes } from 'react-router-dom';
import ListPageCategory from './pages/ListPageCategory';
import { Container } from '@mui/material';
import AddCategory from './pages/AddCategory';
import EditCategory from './pages/EditCategory';

CategoryAdmin.propTypes = {
    
};

function CategoryAdmin(props) {
    return (
        <Container maxWidth={false}>
            <Routes>
                <Route path="" element={<ListPageCategory />} />
                <Route path="/add" element={<AddCategory />} />
                <Route path="/:categoryId" element={<EditCategory />} />
            </Routes>
        </Container>
    );
}

export default CategoryAdmin;