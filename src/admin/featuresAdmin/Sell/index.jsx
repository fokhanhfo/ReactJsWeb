import React, { useEffect, useMemo } from 'react';
import { Box, Container, Divider, Paper, Typography } from '@mui/material';
import OrdersTab from './components/OrdersTab';
import ListProduct from './components/ListProduct';
import { useGetProductsQuery } from './hook/productApi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loading from 'components/Loading';
import queryString from 'query-string';
import { handleAction } from 'admin/ultilsAdmin/actionHandlers';
import { resetState } from 'admin/reduxAdmin/slices/actionsSlice';
import ProductSellFilter from './components/ProductSellFilter';
import { CartProvider } from './CartContext';

function FeatureSellAdmin() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryParams = useMemo(() => {
    const params = queryString.parse(location.search);
    return {
      page: Number.parseInt(params.page) || 1,
      limit: Number.parseInt(params.limit) || 100,
      status: Number.parseInt(params.status) || 1,
      ...params,
    };
  }, [location.search]);

  const actionsState = useSelector((state) => state.actions);
  const { data, error, isLoading } = useGetProductsQuery(queryParams);

  useEffect(() => {
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

  if (isLoading) return <Loading />;
  if (error) return <Typography color="error">Đã xảy ra lỗi khi tải sản phẩm!</Typography>;

  const products = data?.data.products || [];

  const handleNextPage = (event, page) => {
    const newFilter = { ...queryParams, page };
    navigate({ pathname: location.pathname, search: queryString.stringify(newFilter) }, { replace: true });
  };

  const handleChangeFilter = (newFilter) => {
    navigate({ pathname: location.pathname, search: queryString.stringify(newFilter) }, { replace: true });
  };

  return (
    <CartProvider>
      <Container maxWidth={false} sx={{ display: 'flex', gap: 2, height: 'calc(100vh - 64px)' }}>
        <Paper
          sx={{
            flex: 2,
            p: 2,
            borderRadius: 2,
            boxShadow: 3,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <ProductSellFilter onChange={handleChangeFilter} filter={queryParams} />
          <Divider sx={{ marginY: 2 }} />
          <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
            <ListProduct products={products} onPageChange={handleNextPage} />
          </Box>
        </Paper>

        {/* Right Section - Orders */}
        <Paper sx={{ flex: 1, p: 2, borderRadius: 2, boxShadow: 3, height: '100%' }}>
          <OrdersTab actionsState={actionsState} />
        </Paper>
      </Container>
    </CartProvider>
  );
}

export default FeatureSellAdmin;
