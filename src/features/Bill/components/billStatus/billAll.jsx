import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Container, Grid, InputAdornment, Paper, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import styled from 'styled-components';
import { formatPrice, handleGlobalSuccess } from 'utils';
import billApi from 'api/billApi';
import { useSnackbar } from 'notistack';
import { handleGlobalError } from 'utils/errors';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InfiniteScroll from 'components/InfiniteScroll';
import Loading from 'components/Loading';

BillAll.propTypes = {
  listBills: PropTypes.array.isRequired,
  pagination: PropTypes.object.isRequired,
  queryParams: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

const StyledTextField = styled(TextField)`
  margin-right: 20px;
  width: 100%;
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 10px;
  padding: 5px;
  .MuiInputBase-root {
    border-radius: 10px;
  }
  .MuiInputAdornment-root {
    padding-left: 10px;
  }
`;

function BillAll({ listBill, queryParams, onSubmit, pagination }) {
  const [page, setPage] = useState(queryParams.page);
  const [posts, setPosts] = useState([]);
  const [isSearch, setIsSearch] = useState(false);

  useEffect(() => {
    if (queryParams.status) {
      // Khi có trạng thái cụ thể, thay thế danh sách hóa đơn
      setPosts([...listBill]);
      setPage(1); // Đặt lại page
    } else {
      // Khi quay lại trạng thái "Tất cả", làm mới danh sách
      setPosts((prevPosts) => {
        const newPosts = listBill.filter((newBill) => !prevPosts.some((prevBill) => prevBill.id === newBill.id));
        return [...prevPosts, ...newPosts];
      });
    }
    setIsSearch(queryParams.search != null);
  }, [listBill, queryParams.status, queryParams.search]);

  const handleSearch = (event) => {
    event.preventDefault();
    const newFilter = {
      ...queryParams,
      search: event.target.search.value,
      page: 1,
    };
    if (queryParams.search !== newFilter.search) {
      setPosts([]);
    }
    if (onSubmit) {
      onSubmit(newFilter);
    }
  };

  const fetchMore = () => {
    if (queryParams.search != null) {
      return;
    }
    setTimeout(() => {
      setPage((prevPage) => {
        const newPage = parseInt(prevPage) + 1;
        const newFilter = {
          ...queryParams,
          page: newPage,
        };
        if (onSubmit) {
          onSubmit(newFilter);
        }
        return newPage;
      });
    }, 1000);
  };

  return (
    <Box>
      {!queryParams.status && (
        <form onSubmit={(event) => handleSearch(event)}>
          <Box sx={{ marginBottom: '20px' }}>
            <StyledTextField
              name="search"
              placeholder="Tìm kiếm"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </form>
      )}

      <InfiniteScroll
        loader={<Loading />}
        className="w-[800px] mx-auto my-10"
        fetchMore={fetchMore}
        hasMore={queryParams.search != null ? isSearch : posts.length < pagination.count}
        endMessage={
          <>
            <p style={{ textAlign: 'center' }}>Đã hết sản phẩm</p>
          </>
        }
        isSearch={isSearch}
      >
        <Box>
          {posts.map((item) => {
            const billDetails = item.billDetail;
            return (
              <Paper key={item.id} elevation={3} sx={{ marginBottom: '20px', padding: '20px' }}>
                <Box>
                  <Typography variant="h6" sx={{ marginBottom: '10px' }}>
                    ID Hóa Đơn: {item.id}
                  </Typography>
                  <Typography variant="h6" sx={{ marginBottom: '10px' }}>
                    Trạng thái: {item.status}
                  </Typography>
                </Box>
                {billDetails.map((item, i) => {
                  const product = item.productId;
                  return (
                    <Box key={i} sx={{ marginBottom: '15px', display: 'flex', flexDirection: 'row' }}>
                      <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, paddingRight: '15px' }}>
                        <img
                          src={product.imagesUrl[0]}
                          alt={product.name}
                          style={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '8px',
                            objectFit: 'cover',
                            aspectRatio: '1/1.25',
                          }}
                        />
                      </Box>

                      <Box sx={{ width: { xs: '100%', sm: '50%', md: '50%' }, paddingRight: '15px' }}>
                        <Typography variant="body1" fontWeight="bold">
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Số lượng: {item.quantity}
                        </Typography>
                      </Box>

                      <Box sx={{ width: { xs: '100%', sm: '100%', md: '25%' }, margin: 'auto' }}>
                        <Typography variant="body1" fontWeight="bold">
                          {formatPrice(product.price)}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
                <Box sx={{ display: 'flex' }}>
                  <Box sx={{ marginLeft: 'auto' }}>
                    <Link to={`../${item.id}`}>
                      <Button variant="outlined" startIcon={<VisibilityIcon />}>
                        Chi Tiết
                      </Button>
                    </Link>
                  </Box>
                </Box>
              </Paper>
            );
          })}
        </Box>
      </InfiniteScroll>
    </Box>
  );
}

export default BillAll;
