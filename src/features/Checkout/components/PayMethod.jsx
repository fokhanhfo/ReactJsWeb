import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, FormControlLabel, FormLabel, Paper, Radio, RadioGroup } from '@mui/material';
import './styled.scss';

PayMethod.propTypes = {
    
};

function PayMethod(props) {
    return (
        <Paper>
            <FormControl margin='10px'>
                <FormLabel id="demo-radio-buttons-group-label">Hình thức thanh toán</FormLabel>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="female"
                    name="radio-buttons-group"
                >
                    <FormControlLabel value="female" control={<Radio />} label="Thanh toán thẻ (ATM, Visa)" />
                    <FormControlLabel value="male" control={<Radio />} label="Thanh toán bằng Shopee Pay" />
                    <FormControlLabel value="other" control={<Radio />} label="Thanh toán khi nhận hàng (COD)" />
                </RadioGroup>
            </FormControl>
        </Paper>
    );
}

export default PayMethod;