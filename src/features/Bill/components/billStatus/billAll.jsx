import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  Grid,
  Divider,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import styled from 'styled-components';
import { formatPrice, imageMainColor } from 'utils';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'components/InfiniteScroll';
import Loading from 'components/Loading';
import StatusChip from '../StatusChip';

const StyledTextField = styled(TextField)`
  width: 100%;
  background-color: white;
  border-radius: 8px;
  .MuiInputBase-root {
    border-radius: 8px;
  }
  .MuiInputAdornment-root {
    padding-left: 10px;
  }
`;

function BillAll({ listBill, filter, onSubmit, pagination }) {
  const [page, setPage] = useState(filter.page);
  const [posts, setPosts] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    console.log(filter.status);
    if (filter.status) {
      setPosts([...listBill]);
      setPage(1);
    } else {
      setPosts((prevPosts) => {
        const newPosts = listBill.filter((newBill) => !prevPosts.some((prevBill) => prevBill.id === newBill.id));
        return [...prevPosts, ...newPosts];
      });
    }
    setIsSearch(!!filter.search);
  }, [listBill, filter.status, filter.search]);

  const handleSearch = (event) => {
    event.preventDefault();
    const newFilter = {
      ...filter,
      search: event.target.search.value,
      page: 1,
    };
    setPosts([]);
    onSubmit(newFilter);
  };

  const fetchMore = () => {
    setTimeout(() => {
      setPage((prevPage) => {
        const newPage = prevPage + 1;
        onSubmit({ ...filter, page: newPage });
        return newPage;
      });
    }, 1000);
  };

  console.log('posts', posts);

  return (
    <Box>
      {!filter.status && (
        <Box sx={{ mb: 2 }}>
          <form onSubmit={handleSearch}>
            <TextField
              name="search"
              placeholder="Tìm kiếm hóa đơn..."
              fullWidth
              variant="outlined"
              sx={{
                backgroundColor: 'white',
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </form>
        </Box>
      )}

      <InfiniteScroll
        loader={<Loading />}
        fetchMore={fetchMore}
        hasMore={posts.length < pagination.count}
        endMessage={
          <Typography textAlign="center" color="text.secondary" sx={{ my: 4 }}>
            Đã hiển thị tất cả hóa đơn
          </Typography>
        }
        isSearch={isSearch}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {posts.map((bill) => (
            <Card key={bill.id} elevation={3} sx={{ borderRadius: 2, overflow: 'visible' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      ID Hóa Đơn: {bill.id}
                    </Typography>
                    <StatusChip status={bill.status} />
                  </Box>
                  <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <Link to={`../${bill.id}`} style={{ textDecoration: 'none' }}>
                      <Button variant="contained" startIcon={<VisibilityIcon />} sx={{ borderRadius: 2 }}>
                        Chi Tiết
                      </Button>
                    </Link>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {bill.billDetail.map((item, index) => {
                    const productDetail = item.productDetail;
                    return (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          gap: 2,
                          flexDirection: isMobile ? 'column' : 'row',
                          p: 1,
                          borderRadius: 2,
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.03)',
                          },
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={imageMainColor(productDetail)?.imageUrl}
                          alt={productDetail.product.name}
                          sx={{
                            width: isMobile ? '100%' : 100,
                            height: isMobile ? 200 : 100,
                            borderRadius: 2,
                            objectFit: 'cover',
                          }}
                        />

                        <Box
                          sx={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: isMobile ? 'column' : 'row',
                            justifyContent: 'space-between',
                            alignItems: isMobile ? 'flex-start' : 'center',
                          }}
                        >
                          <Box>
                            <Typography fontWeight="bold" variant="body1">
                              {productDetail.product.name}
                            </Typography>
                            <Box
                              sx={{
                                display: 'flex',
                                gap: 2,
                                flexWrap: 'wrap',
                                mt: 0.5,
                              }}
                            >
                              <Typography variant="body2" color="text.secondary">
                                Số lượng: {item.quantity}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Màu: {item.color}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Size: {item.size}
                              </Typography>
                            </Box>
                          </Box>

                          <Typography
                            fontWeight="bold"
                            color="primary"
                            variant="body1"
                            sx={{
                              mt: isMobile ? 1 : 0,
                              fontSize: isMobile ? '1.1rem' : 'inherit',
                            }}
                          >
                            {formatPrice(productDetail.sellingPrice)}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </CardContent>

              <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                <CardActions sx={{ p: 2, pt: 0, justifyContent: 'flex-end' }}>
                  <Link to={`../${bill.id}`} style={{ textDecoration: 'none' }}>
                    <Button variant="contained" fullWidth startIcon={<VisibilityIcon />} sx={{ borderRadius: 2 }}>
                      Chi Tiết
                    </Button>
                  </Link>
                </CardActions>
              </Box>
            </Card>
          ))}
        </Box>
      </InfiniteScroll>
    </Box>
  );
}

BillAll.propTypes = {
  listBill: PropTypes.array.isRequired,
  filter: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pagination: PropTypes.object.isRequired,
};

export default BillAll;
