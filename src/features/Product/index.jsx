import React from 'react';
import PropTypes from 'prop-types';
import { Route, Routes } from 'react-router-dom';
import ListPage from './pages/ListPage';
import { Box, Container, Paper } from '@mui/material';
import DetailPage from './pages/DetailPage';

ProductFeatureCopy.propTypes = {};

function ProductFeatureCopy(props) {
  return (
    <>
      <Routes>
        <Route path="" element={<ListPage />} />
        <Route path="/:productId" element={<DetailPage />} />
      </Routes>
    </>
  );
}

export default ProductFeatureCopy;
