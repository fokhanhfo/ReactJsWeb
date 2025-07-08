'use client';

import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  Divider,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  useMediaQuery,
  useTheme,
  Grow,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { formatPrice, imageMainColor } from 'utils';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'components/InfiniteScroll';
import Loading from 'components/Loading';
import StatusChip from '../StatusChip';
import { useGetBillQuery } from 'hookApi/billApi';

function BillProcessing() {
  const [filterBill, setFilter] = useState(() => ({
    page: 1,
    limit: 5,
    status: '0,1',
  }));
  const { data, isLoading: isLoadingData, error } = useGetBillQuery(filterBill);
  const paginationBill = data?.data?.count || 0;
  const dataBill = data?.data?.bill || [];
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(filterBill.page || 1);
  const [filterSearch, setFilterSearch] = useState(filterBill.search || '');
  const [isSearch, setIsSearch] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [visible, setVisible] = useState([]);
  useEffect(() => {
    if (dataBill && dataBill.length > 0) {
      setPosts((prevPosts) => {
        // Tránh trùng lặp bài viết
        const newPosts = dataBill.filter((bill) => !prevPosts.some((p) => p.id === bill.id));
        return [...prevPosts, ...newPosts];
      });
    }
  }, [dataBill]);

  // useEffect(() => {
  //   let timers = [];
  //   const newBills = dataBill.filter((bill) => !visible.includes(bill.id));

  //   newBills.forEach((bill, index) => {
  //     const timer = setTimeout(() => {
  //       setVisible((prev) => [...prev, bill.id]);
  //     }, index * 300);
  //     timers.push(timer);
  //   });

  //   return () => timers.forEach(clearTimeout);
  // }, [dataBill, visible]);

  // Optimized search handler với debounce
  const handleSearch = (event) => {};

  // Optimized fetchMore function
  const fetchMore = useCallback(() => {
    if (isLoadingData) return;

    setFilter((prevFilter) => {
      const newPage = prevFilter.page + 1;
      return { ...prevFilter, page: newPage };
    });
  }, [filterBill, currentPage, , isLoadingData]);

  const hasMore = posts.length < paginationBill && !isLoadingData;
  return (
    <Box>
      {/* <Box sx={{ mb: 2 }}>
        <form onSubmit={handleSearch}>
          <TextField
            name="search"
            placeholder="Tìm kiếm hóa đơn..."
            fullWidth
            variant="outlined"
            defaultValue={filterSearch || ''}
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
      </Box> */}

      <InfiniteScroll
        loader={<Loading />}
        fetchMore={fetchMore}
        hasMore={hasMore}
        endMessage={
          <Typography textAlign="center" color="text.secondary" sx={{ my: 4 }}>
            Đã hiển thị tất cả hóa đơn
          </Typography>
        }
        isSearch={isSearch}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {posts.map((bill) => (
            <BillCard bill={bill} isMobile={isMobile} />
          ))}
        </Box>
      </InfiniteScroll>
    </Box>
  );
}

// Memoized BillCard component
const BillCard = React.memo(({ bill, isMobile }) => {
  const handleDetailClick = useCallback(() => {
    localStorage.setItem('bill_return_url', window.location.href);
  }, []);

  return (
    <Card elevation={3} sx={{ borderRadius: 2, overflow: 'visible' }}>
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
              <Button
                variant="contained"
                startIcon={<VisibilityIcon />}
                sx={{ borderRadius: 2 }}
                onClick={handleDetailClick}
              >
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
                    {formatPrice(item.sellingPrice)}
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
            <Button
              variant="contained"
              startIcon={<VisibilityIcon />}
              sx={{ borderRadius: 2 }}
              onClick={handleDetailClick}
            >
              Chi Tiết
            </Button>
          </Link>
        </CardActions>
      </Box>
    </Card>
  );
});

BillProcessing.propTypes = {
  listBill: PropTypes.array.isRequired,
  filter: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pagination: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
};

BillProcessing.defaultProps = {
  isLoading: false,
};

export default BillProcessing;
