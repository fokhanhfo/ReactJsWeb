import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, FormControlLabel, FormLabel, Paper, Radio, RadioGroup } from '@mui/material';
import { Controller } from 'react-hook-form';

PayMethod.propTypes = {
  form: PropTypes.object.isRequired,
};

function PayMethod({ form }) {
  const { control } = form;

  return (
    <Paper>
      <FormControl>
        <FormLabel id="payment-method-group-label">Hình thức thanh toán</FormLabel>
        <Controller
          name="paymentMethod"
          control={control}
          defaultValue="cod"
          render={({ field }) => (
            <RadioGroup {...field} aria-labelledby="payment-method-group-label">
              <FormControlLabel value="card" control={<Radio />} label="Thanh toán thẻ (ATM, Visa)" />
              <FormControlLabel value="shopeePay" control={<Radio />} label="Thanh toán bằng Shopee Pay" />
              <FormControlLabel value="cod" control={<Radio />} label="Thanh toán khi nhận hàng (COD)" />
            </RadioGroup>
          )}
        />
      </FormControl>
    </Paper>
  );
}

export default PayMethod;
