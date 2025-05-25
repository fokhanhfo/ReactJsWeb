import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Container } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import DiscountPeriod from './page/DiscountPeriod';
import DiscountPeriodDetail from './page/DiscountPeriodDetail';

DiscountPeriodAdmin.propTypes = {};

function DiscountPeriodAdmin(props) {
  return (
    <Container maxWidth={false}>
      <Routes>
        <Route path="" element={<DiscountPeriod />} />
        <Route path="/:discountPeriodId" element={<DiscountPeriodDetail />} />
      </Routes>
    </Container>
  );
}

export default DiscountPeriodAdmin;
