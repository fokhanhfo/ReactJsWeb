import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { resetState } from 'admin/reduxAdmin/slices/actionsSlice';
import ListDiscount from './components/ListDiscount';
import Loading from 'components/Loading';
import AddDiscount from './components/AddDiscount';
import useListDiscount from './hook/discountFetch';
import { Container } from '@mui/material';
import { useGetDiscountQuery } from 'hookApi/discountApi';
import { useBreadcrumb } from 'admin/components/Breadcrumbs/BreadcrumbContext';
import Discount from './page/Discount';
import { Route, Routes } from 'react-router-dom';
import DiscountDetail from './page/DiscountDetail';

DiscountAdmin.propTypes = {};

function DiscountAdmin(props) {
  return (
    <Container maxWidth={false}>
      <Routes>
        <Route path="" element={<Discount />} />
        <Route path="/:discountId" element={<DiscountDetail />} />
      </Routes>
    </Container>
  );
}

export default DiscountAdmin;
