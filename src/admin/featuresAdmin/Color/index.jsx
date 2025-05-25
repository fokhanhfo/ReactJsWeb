import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useGetColorQuery } from 'hookApi/colorApi';
import { useDispatch, useSelector } from 'react-redux';
import { resetState } from 'admin/reduxAdmin/slices/actionsSlice';
import Loading from 'components/Loading';
import ListColor from './componennts/ListColor';
import AddColor from './componennts/AddColor';
import { Container } from '@mui/material';

ColorAdmin.propTypes = {};

function ColorAdmin(props) {
  const { data, error, isLoading, refetch } = useGetColorQuery();
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);
  const actionsState = useSelector((state) => state.actions);
  const onSubmit = (status) => {
    if (status) {
      refetch();
    }
  };
  return (
    <Container maxWidth={false}>
      {!isLoading ? <ListColor colors={data.data} actionsState={actionsState} /> : <Loading />}
      {actionsState.add && <AddColor actionsState={actionsState} onSubmit={onSubmit} />}
    </Container>
  );
}

export default ColorAdmin;
