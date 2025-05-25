import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import useListCategory from '../hook/categoryFetch';
import ListCategory from '../components/ListCategory';
import Loading from 'components/Loading';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Add, ArrowLeft, ArrowRight } from '@mui/icons-material';
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Pagination,
  PaginationItem,
  Paper,
  Select,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux';
import { resetState } from 'admin/reduxAdmin/slices/actionsSlice';
import { handleAction } from 'admin/ultilsAdmin/actionHandlers';
import AddCategory from '../components/AddCategory';
import { useGetCategoryQuery } from 'hookApi/categoryApi';

ListPageCategory.propTypes = {};

const StyledButton = styled(Button)`
  float: right;
`;

function ListPageCategory() {
  const { categorys, loading } = useListCategory();
  const { data, error, isLoading, refetch } = useGetCategoryQuery();
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);
  const actionsState = useSelector((state) => state.actions);
  const handleActions = (state) => handleAction(state, dispatch, actionsState);

  return (
    <>
      {!isLoading ? (
        <Paper>
          <Box sx={{ p: 3, backgroundColor: '#fff', borderRadius: 2 }}>
            {/* Search and Actions */}
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
              <TextField size="small" placeholder="Search Product" sx={{ width: 300 }} />

              <Box display="flex" alignItems="center" gap={1}>
                <FormControl size="small">
                  <Select value={rowsPerPage} onChange={(e) => setRowsPerPage(e.target.value)}>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                  </Select>
                </FormControl>

                <Button variant="outlined" disabled>
                  Export
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  sx={{ float: 'right' }}
                  startIcon={<AddIcon />}
                  onClick={() => handleActions('add')}
                >
                  THÊM DANH MỤC
                </Button>
              </Box>
            </Box>
          </Box>
          <ListCategory actionsState={actionsState} categorys={data.data} />
          {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 2 }}>
            <Pagination
              //   count={Math.ceil(pagination.count / queryParams.limit)}
              count={5}
              //   page={Number.parseInt(queryParams.page)}
              //   onChange={handleNextPage}
              shape="rounded"
              size="large"
              color="primary"
              siblingCount={1}
              boundaryCount={1}
              showFirstButton
              showLastButton
              renderItem={(item) => <PaginationItem slots={{ previous: ArrowLeft, next: ArrowRight }} {...item} />}
            />
          </Box> */}
        </Paper>
      ) : (
        <Loading />
      )}
      {actionsState.add && <AddCategory actionsState={actionsState} />}
    </>
  );
}

export default ListPageCategory;
