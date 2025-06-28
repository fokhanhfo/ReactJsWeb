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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { formatPrice, imageMainColor } from 'utils';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'components/InfiniteScroll';
import Loading from 'components/Loading';
import StatusChip from '../StatusChip';

function BillAll({ listBill, filter, onSubmit, pagination, isLoading }) {
  const [posts, setPosts] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Refs để track state và tránh infinite loops
  const prevFilterRef = useRef();
  const isInitialized = useRef(false);
  const searchTimeoutRef = useRef();

  // Memoize filter values để tránh unnecessary re-renders
  const filterStatus = useMemo(() => filter.status, [filter.status]);
  const filterSearch = useMemo(() => filter.search, [filter.search]);
  const currentPage = useMemo(() => filter.page || 1, [filter.page]);

  // Optimized effect để handle list updates
  useEffect(() => {
    const prevFilter = prevFilterRef.current;

    // Kiểm tra xem có phải là filter change hay page change
    const isFilterChanged = !prevFilter || prevFilter.status !== filterStatus || prevFilter.search !== filterSearch;

    const isPageChanged = prevFilter && prevFilter.page !== currentPage;

    if (!isInitialized.current || isFilterChanged) {
      // Reset posts khi filter thay đổi hoặc lần đầu
      setPosts([...listBill]);
      setIsSearch(!!filterSearch);
      isInitialized.current = true;
    } else if (isPageChanged && currentPage > 1) {
      // Append posts khi load more
      setPosts((prevPosts) => {
        const existingIds = new Set(prevPosts.map((bill) => bill.id));
        const newPosts = listBill.filter((bill) => !existingIds.has(bill.id));
        return [...prevPosts, ...newPosts];
      });
    } else if (!isPageChanged && currentPage === 1) {
      // Update posts nếu cùng page nhưng data thay đổi
      setPosts([...listBill]);
    }

    // Update previous filter reference
    prevFilterRef.current = { ...filter };
  }, [listBill, filterStatus, filterSearch, currentPage, filter]);

  // Optimized search handler với debounce
  const handleSearch = useCallback(
    (event) => {
      event.preventDefault();
      const searchValue = event.target.search.value.trim();

      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Debounce search để tránh quá nhiều API calls
      searchTimeoutRef.current = setTimeout(() => {
        const newFilter = {
          ...filter,
          search: searchValue || undefined,
          page: 1,
        };

        onSubmit(newFilter);
      }, 300);
    },
    [filter, onSubmit],
  );

  // Optimized fetchMore function
  const fetchMore = useCallback(() => {
    if (isLoading) return;

    const nextPage = currentPage + 1;
    onSubmit({ ...filter, page: nextPage });
  }, [filter, currentPage, onSubmit, isLoading]);

  // Memoize hasMore calculation
  const hasMore = useMemo(() => {
    return posts.length < pagination.count && !isLoading;
  }, [posts.length, pagination.count, isLoading]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Box>
      {!filterStatus && (
        <Box sx={{ mb: 2 }}>
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
        </Box>
      )}

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
            <BillCard key={bill.id} bill={bill} isMobile={isMobile} />
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

BillAll.propTypes = {
  listBill: PropTypes.array.isRequired,
  filter: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pagination: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
};

BillAll.defaultProps = {
  isLoading: false,
};

export default BillAll;
