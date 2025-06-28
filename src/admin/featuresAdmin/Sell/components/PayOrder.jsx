import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  InputAdornment,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { handleAction } from 'admin/ultilsAdmin/actionHandlers';
import { useSnackbar } from 'notistack';
import InputField from 'components/form-controls/InputForm';
import CKEditorForm from 'components/form-controls/CKEditorForm';
import SelectFrom from 'components/form-controls/SelectFrom';
import Loading from 'components/Loading';
import FileForm from 'components/form-controls/FileForm';
import RadioForm from 'components/form-controls/RadioForm';
import { optionStatus } from 'utils/status';
import productApi from 'api/productApi';
import { useAddProductMutation, useUpdateProductMutation } from '../hook/productApi';
import { useDispatch } from 'react-redux';
import { NumberFormatBase, NumericFormat } from 'react-number-format';
import billApi from 'api/billApi';
import { formatPrice } from 'utils';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart } from '../CartContext';

PayOrder.propTypes = {
  actionsState: PropTypes.object.isRequired,
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  totalPrice: PropTypes.number.isRequired,
  cart: PropTypes.array,
};

function PayOrder({ cart, actionsState, onSubmit, initialValues, totalPrice }) {
  const { add, edit, del, view } = actionsState;
  const activeAction = Object.keys(actionsState).find((key) => actionsState[key]);
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { clearCart } = useCart();

  const handleClick = async () => {
    if (Object.keys(payments).length === 0) {
      enqueueSnackbar('Vui lòng tạo khoản thanh toán!', { variant: 'error' });
      return;
    }

    setIsSubmitting(true);

    const listCart = cart.map((item) => {
      const size = item.productDetail.productDetailSizes.find((i) => i.size.name === item.size);
      console.log(item);

      return {
        quantity: item.quantity,
        size: { id: size.size.id },
        color: item.color,
        productDetail: item.productDetail,
      };
    });

    const newDataRequest = {
      note: note,
      paymentMethod: paymentMethod,
      total_price: totalPrice,
      cartRequests: listCart,
    };

    try {
      const res = await billApi.add(newDataRequest);
      if (res) {
        clearCart();
        handleAction(activeAction, dispatch, { add, edit, del, view });
      }
      enqueueSnackbar('Tạo hoá đơn thành công!', { variant: 'success' });
      setIsSubmitting(true);
    } catch (error) {
      enqueueSnackbar('Tạo hoá đơn thất bại!', { variant: 'error' });
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [paymentMethod, setPaymentMethod] = useState(0);
  const [customerAmount, setCustomerAmount] = useState(totalPrice);
  const [note, setNote] = useState('');
  const [payments, setPayments] = useState({});

  const handleCreatePayment = () => {
    if (Number(customerAmount) < totalPrice) {
      enqueueSnackbar(`Thiếu: ${formatPrice(totalPrice - customerAmount)} `, { variant: 'error' });
      return;
    }
    const newPayment = {
      amount: customerAmount,
      method: paymentMethod === '0' ? 'Tiền mặt' : 'Chuyển khoản',
      note: note,
    };

    setPayments(newPayment);
    setNote('');
  };

  const handleRemovePayment = () => {
    setPayments({});
  };

  return (
    <Dialog fullWidth maxWidth="md" open={view}>
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Thanh toán
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => handleAction(activeAction, dispatch, { add, edit, del, view })}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body1">Tổng tiền:</Typography>
            <Typography variant="body1" color="error">
              {formatPrice(totalPrice)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body1">Tiền thiếu:</Typography>
            <Typography variant="body1" color="error">
              {formatPrice(totalPrice - customerAmount)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body1">Tiền khách đưa:</Typography>
            {/* <TextField
              variant="standard"
              value={customerAmount}
              onChange={(e) => setCustomerAmount(e.target.value)}
              sx={{ width: '200px' }}
              InputProps={{
                endAdornment: <InputAdornment position="end"></InputAdornment>,
              }}
            /> */}
            <NumericFormat
              customInput={TextField}
              variant="standard"
              value={customerAmount}
              onValueChange={(values) => setCustomerAmount(values.value)}
              thousandSeparator=","
              decimalScale={0}
              allowNegative={false}
              inputMode="numeric"
              sx={{ width: '200px' }}
            />
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Hình thức:
          </Typography>
          <FormControl>
            <RadioGroup row value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <FormControlLabel value={0} control={<Radio />} label="Tiền mặt" />
              <FormControlLabel value={1} control={<Radio />} label="Chuyển khoản" />
            </RadioGroup>
          </FormControl>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Ghi chú:
          </Typography>
          <TextField fullWidth variant="standard" value={note} onChange={(e) => setNote(e.target.value)} multiline />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreatePayment}
            disabled={Object.keys(payments).length === 0 ? false : true}
            sx={{
              borderRadius: '20px',
              textTransform: 'none',
              px: 3,
              width: '200px',
            }}
          >
            Tạo thanh toán
          </Button>
        </Box>

        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Số tiền</TableCell>
                <TableCell>Phương thức</TableCell>
                <TableCell>Ghi chú</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(payments).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2" color="textSecondary">
                      Chưa có dữ liệu
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow key={payments.id}>
                  <TableCell>{formatPrice(payments.amount)}</TableCell>
                  <TableCell>{payments.method}</TableCell>
                  <TableCell>{payments.note}</TableCell>
                  <TableCell>
                    <IconButton onClick={handleRemovePayment}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button sx={{ width: '200px' }} onClick={handleClick} type="submit" autoFocus disabled={isSubmitting}>
          Thanh toán
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PayOrder;
