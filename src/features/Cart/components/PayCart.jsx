import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, FormControlLabel, Grid, Paper, Typography } from '@mui/material';
import { CheckBox } from '@mui/icons-material';
import styled from 'styled-components';
import { formatPrice } from 'utils';
import { Link } from 'react-router-dom';

PayCart.propTypes = {
    listCart: PropTypes.array.isRequired,
    onAllCheckboxChange :PropTypes.func.isRequired,
};

const StyledGridCheckbox= styled(Grid)`
    display: flex;
    align-items:center;
`

const StyledGridToTal= styled(Grid)`
    display: flex;
    align-items:center;
    justify-content:flex-end;
`

const StyledGridContainer = styled(Grid)`
    justify-content: space-between;
    height:100%;
`


function PayCart({listCart=[],selectedItems,onAllCheckboxChange}) {

    const selectCartItem = listCart.filter(item => item.status === 1);
    const totalPrice = selectCartItem.reduce((sum, item) => sum + (item.product.price*item.quantity), 0);
    const [statusCheckBox,setStatusCheckBox] =useState(1);

    const handleCheckboxChange = (event)=>{
        const newStatus = event.target.checked ? 1 : 0;
        setStatusCheckBox(newStatus);
        onAllCheckboxChange(newStatus);
    }

    useEffect(() => {
        const allChecked = listCart.every(item => item.status === 1);
        setStatusCheckBox(allChecked ? 1 : 0);
    }, [listCart]);


    return (
        <Paper className='pay_cart'>
            <StyledGridContainer container>
                <StyledGridCheckbox item xs={12} md={6}>
                    <FormControlLabel control={<Checkbox checked={statusCheckBox === 1} onChange={handleCheckboxChange}/>} label="Chọn tất cả" />
                    <Button>Xóa</Button>
                </StyledGridCheckbox>
                <StyledGridToTal item xs={12} md={6}>
                    <Typography>Tổng thanh toán ( {selectCartItem.length} Sản phẩm )</Typography>
                    <Typography>{formatPrice(totalPrice)}</Typography>
                    <Link to={"/checkout"}>Thanh Toán</Link>
                </StyledGridToTal>
            </StyledGridContainer>
        </Paper>
    );
}

export default PayCart;