import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { resetState } from 'admin/reduxAdmin/slices/actionsSlice';
import Loading from 'components/Loading';
import { Container } from '@mui/material';
import ListSize from './componennts/ListSize';
import AddSize from './componennts/AddSize';
import { useGetSizeQuery } from 'hookApi/sizeApi';

SizeAdmin.propTypes = {};

function SizeAdmin(props) {
  const { data, error, isLoading, refetch } = useGetSizeQuery();
  console.log(data);
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
      {!isLoading ? <ListSize sizes={data.data} actionsState={actionsState} /> : <Loading />}
      {actionsState.add && <AddSize actionsState={actionsState} onSubmit={onSubmit} />}
    </Container>
  );
}

export default SizeAdmin;
