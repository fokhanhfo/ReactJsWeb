import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useGetColorQuery } from 'hookApi/colorApi';
import { useDispatch, useSelector } from 'react-redux';
import { resetState } from 'admin/reduxAdmin/slices/actionsSlice';
import Loading from 'components/Loading';
import ListColor from './componennts/ListColor';
import AddColor from './componennts/AddColor';
import { Box, Button, Container, Typography } from '@mui/material';
import { handleAction } from 'admin/ultilsAdmin/actionHandlers';

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

  const handleActions = (state, row) => {
    handleAction(state, dispatch, actionsState);
  };
  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap">
        <Typography variant="h6" fontWeight={600} color="primary.main">
          Quản lý màu sắc
        </Typography>
        <Button onClick={() => handleActions('add')} variant="contained">
          Thêm Màu Sắc
        </Button>
      </Box>
      {!isLoading ? <ListColor colors={data.data} actionsState={actionsState} /> : <Loading />}
      {actionsState.add && <AddColor actionsState={actionsState} onSubmit={onSubmit} />}
    </Box>
  );
}

export default ColorAdmin;
