import React from 'react';
import PropTypes from 'prop-types';
import { Box, Container, Grid } from '@mui/material';
import ShipDetail from '../components/ShipDetail';
import ListProdcut from '../components/ListProdcut';
import PayMethod from '../components/PayMethod';
import { useSelector } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
import { useGetCartQuery } from 'features/Cart/cartApi';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { formatPrice } from 'utils';
import billApi from 'api/billApi';
import { useSnackbar } from 'notistack';
import { handleGlobalError } from 'utils/errors';

CheckOut.propTypes = {};

function CheckOut(props) {
  const cartQuery = useSelector((state) => state.cartApi.queries['getCart(undefined)']);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const schema = yup
    .object({
      fullname: yup.string().required('Họ và tên là bắt buộc'),
      email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
      phone: yup.string().required('Số điện thoại là bắt buộc'),
      city: yup.string().required('Thành phố là bắt buộc'),
      district: yup.string().required('Quận/Huyện là bắt buộc'),
      commune: yup.string().required('Xã/Phường là bắt buộc'),
      addressDetail: yup.string().required('Địa chỉ chi tiết là bắt buộc'),
    })
    .required();

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
    resolver: yupResolver(schema),
  });

  const listCart = cartQuery?.data?.data || [];
  const selectCartItem = listCart.filter((item) => item.status === 1);
  const totalPrice = selectCartItem.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleSubmit = async (value) => {
    try {
      form.setValue('listCart', listCart);
      form.setValue('selectCartItem', selectCartItem);
      form.setValue('totalPrice', totalPrice);
      const newdata = {
        email: form.getValues('email'),
        address: `${form.getValues('addressDetail')} - ${form.getValues('commune')} - ${form.getValues(
          'district',
        )} - ${form.getValues('city')}`,
        phone: form.getValues('phone'),
        cartRequests: form.getValues('listCart'),
      };

      const res = await billApi.add(newdata);
      enqueueSnackbar(`${res.data.message}`, { variant: 'success' });
    } catch (error) {
      handleGlobalError(error, enqueueSnackbar);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={3.5}>
              <ShipDetail form={form}></ShipDetail>
            </Grid>

            <Grid item xs={12} sm={12} md={5}>
              <ListProdcut cartQuery={cartQuery}></ListProdcut>
            </Grid>

            <Grid item xs={12} sm={12} md={3.5}>
              <PayMethod form={form}></PayMethod>
            </Grid>
          </Grid>
          <div className="voucher-component">
            <div className="voucher-header">
              <button className="voucher-button">ẨN VÀO ĐÂY ĐỂ CHỌN CODE</button>
              <button className="apply-button">ÁP DỤNG</button>
            </div>
            <div className="voucher-details">
              <p>
                Tổng đơn: <span className="total-price">{formatPrice(totalPrice)}</span>
              </p>
              <p>
                Ưu đãi (voucher / thành viên): <span className="discount">- 0</span>
              </p>
              <p>
                Phí ship: <span className="shipping-fee">0</span>
              </p>
            </div>
            <div className="total-amount">
              <p>
                THÀNH TIỀN: <span className="final-price">{formatPrice(totalPrice)}</span>
              </p>
            </div>
            <button type="submit" className="complete-order">
              HOÀN TẤT ĐƠN HÀNG
            </button>
          </div>
        </Container>
      </form>
    </FormProvider>
  );
}

export default CheckOut;
