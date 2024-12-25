import React from 'react';
import PropTypes from 'prop-types';
import { Container } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import ListPageBill from './page/ListPageBill';
import PageBillDetail from 'components/billDetail/PageBillDetail';

BillFeature.propTypes = {};

function BillFeature(props) {
  return (
    <Container maxWidth={false}>
      <Routes>
        <Route path="" element={<ListPageBill />} />
        <Route path="/:billId" element={<PageBillDetail />} />
      </Routes>
    </Container>
  );
}

export default BillFeature;
