import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Container } from '@mui/material';
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
import { useGetCategoryQuery } from 'hookApi/categoryApi';
import ListCategory from './components/ListCategory';
import AddCategory from './components/AddCategory';
import Fuse from 'fuse.js';
CategoryAdmin.propTypes = {};

function CategoryAdmin(props) {
  const { data, error, isLoading, refetch } = useGetCategoryQuery();
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchTerm, setSearchTerm] = React.useState('');

  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);
  const fuse = new Fuse(data?.data || [], {
    keys: ['name', 'description'], // bạn có thể thêm các trường muốn tìm
    threshold: 0.4, // độ "lỏng" của tìm kiếm (0: chính xác tuyệt đối, 1: lỏng nhất)
    ignoreLocation: true,
    includeScore: true,
    isCaseSensitive: false,
    // bạn có thể thêm config để xử lý dấu tiếng việt nếu muốn
  });

  const filteredCategories = searchTerm ? fuse.search(searchTerm).map((result) => result.item) : data?.data || [];

  const actionsState = useSelector((state) => state.actions);
  const handleActions = (state) => handleAction(state, dispatch, actionsState);

  return (
    <Container maxWidth={false}>
      <>
        {!isLoading ? (
          <Paper>
            <Box sx={{ p: 3, backgroundColor: '#fff', borderRadius: 2 }}>
              {/* Search and Actions */}
              <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                <TextField
                  size="small"
                  placeholder="Tìm kiếm danh mục"
                  sx={{ width: 300 }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                <Box display="flex" alignItems="center" gap={1}>
                  <FormControl size="small">
                    <Select value={rowsPerPage} onChange={(e) => setRowsPerPage(e.target.value)}>
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={20}>20</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                    </Select>
                  </FormControl>

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
            <ListCategory actionsState={actionsState} categorys={filteredCategories} />{' '}
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
    </Container>
  );
}

export default CategoryAdmin;
