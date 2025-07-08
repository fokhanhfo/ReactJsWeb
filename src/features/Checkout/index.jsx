import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Box, Container, Grid, Paper } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { formatPrice } from 'utils';
import billApi from 'api/billApi';
import { useSnackbar } from 'notistack';
import { handleGlobalError } from 'utils/errors';
import ShipDetail from './components/ShipDetail';
import ListProdcut from './components/ListProdcut';
import { useSelector } from 'react-redux';
import { CheckoutContext, CheckoutProvider } from './components/CheckoutProvider';
import CartFeature from 'features/Cart';
import { useGetCartQuery } from 'hookApi/cartApi';
import Banner from 'components/Banner/Banner';

CheckOutFeatures.propTypes = {};

function CheckOutFeatures(props) {
  const cartQuery = useSelector((state) => state.cartApi.queries['getCart(undefined)']);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // const schema = yup
  //   .object({
  //     fullname: yup.string().required('Họ và tên là bắt buộc'),
  //     email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
  //     phone: yup.string().required('Số điện thoại là bắt buộc'),
  //     city: yup
  //       .object()
  //       .transform((value, originalValue) => (originalValue === '' ? null : value))
  //       .nullable()
  //       .required('Thành phố là bắt buộc'),
  //     district: yup
  //       .object()
  //       .transform((value, originalValue) => (originalValue === '' ? null : value))
  //       .nullable()
  //       .required('Quận/Huyện là bắt buộc'),
  //     commune: yup
  //       .object()
  //       .transform((value, originalValue) => (originalValue === '' ? null : value))
  //       .nullable()
  //       .required('Xã/Phường là bắt buộc'),
  //     addressDetail: yup.string().required('Địa chỉ chi tiết là bắt buộc'),
  //   })
  //   .required();

  const form = useForm({
    defaultValues: {
      fullname: '',
      email: '',
      phone: '',
      city: '',
      district: '',
      commune: '',
      addressDetail: '',
    },
    // resolver: yupResolver(schema),
  });

  // const listCart = cartQuery?.data?.data || [];
  // const selectCartItem = listCart.filter((item) => item.status === 1);
  // const totalPrice = selectCartItem.reduce((sum, item) => {
  //   return sum + item.productDetail.sellingPrice * item.quantity;
  // }, 0);

  const { refetch } = useGetCartQuery();

  // const handleSubmit = async (value) => {
  //   console.log(shipDetail);
  //   console.log(moneyToPay);
  // try {
  //   // form.setValue('listCart', listCart);
  //   // form.setValue('selectCartItem', selectCartItem);
  //   // form.setValue('totalPrice', totalPrice);
  //   const city = form.getValues('city').name;
  //   const district = form.getValues('district').name;
  //   const commune = form.getValues('commune').name;
  //   const newdata = {
  //     email: form.getValues('email'),
  //     address: `${form.getValues('addressDetail')} - ${commune} - ${district} - ${city}`,
  //     phone: form.getValues('phone'),
  //     cartRequests: listCart.filter((item) => item.status === 1),
  //     total_price: totalPrice,
  //   };
  //   const res = await billApi.add(newdata);
  //   enqueueSnackbar(`Mua hàng thành công`, { variant: 'success' });
  //   if (res) {
  //     refetch();
  //     navigate('./home');
  //   }
  // } catch (error) {
  //   handleGlobalError(error, enqueueSnackbar);
  // }
  // };
  return (
    <>
      <Banner />
      <CheckoutProvider>
        <Box sx={{ backgroundColor: '#ffffff' }}>
          <FormProvider {...form}>
            <form>
              <Container maxWidth={false} sx={{ maxWidth: '1400px', padding: '20px' }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={12} md={3.5}>
                    <ShipDetail form={form}></ShipDetail>
                  </Grid>

                  <Grid item xs={12} sm={12} md={8.5}>
                    <ListProdcut
                      form={form}
                      // onSubmit={handleSubmit}
                      cartQuery={cartQuery}
                    ></ListProdcut>
                  </Grid>
                </Grid>
              </Container>
            </form>
          </FormProvider>
        </Box>
      </CheckoutProvider>
    </>
  );
}

export default CheckOutFeatures;
