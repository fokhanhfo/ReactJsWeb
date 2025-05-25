import React, { useEffect } from 'react';
import ListPageProduct from './pages/ListPageProduct';
import { Route, Routes } from 'react-router-dom';
import { Container } from '@mui/material';
import AddProduct from './components/AddProduct';
import { useDispatch, useSelector } from 'react-redux';
import { resetState } from 'admin/reduxAdmin/slices/actionsSlice';
import EditImage from './pages/EditImage';

ProductAdmin.propTypes = {};

function ProductAdmin(props) {
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);
  const actionsState = useSelector((state) => state.actions);
  const onSubmit = (status) => {
    if (status) {
    }
  };
  return (
    <>
      <Container maxWidth={false}>
        <Routes>
          <Route path="" element={<ListPageProduct actionsState={actionsState} />} />
          <Route path="/:productId/image" element={<EditImage />} />
        </Routes>
      </Container>
    </>
  );
}

export default ProductAdmin;
