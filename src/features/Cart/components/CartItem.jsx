import React from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, IconButton, Paper, TextField, Typography } from '@mui/material';
import './styles.scss';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { formatPrice } from 'utils';
import styled from 'styled-components';
import { useDeletecartMutation, useUpdateCartMutation } from '../cartApi';
import { useSnackbar } from 'notistack';

CartItem.propTypes = {
    listCart: PropTypes.array.isRequired,
    onCheckboxChange :PropTypes.func.isRequired,
};

const StyledTypography = styled(Typography)`
    width: 100%;
    height: 100%;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const StyledPaper = styled(Paper)`
    margin: 20px 0 ;
`;

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

function CartItem({ listCart = [], onCheckboxChange  }) {
    const [updateCart] = useUpdateCartMutation();
    const { enqueueSnackbar } = useSnackbar();
    const [deleteCart] = useDeletecartMutation();

    const handleIncrement = async (cartItem) => {
        const newQuantity = {...cartItem,quantity: (cartItem.quantity+1),product: cartItem.product.id}
        try {
            await updateCart(newQuantity).unwrap();
        } catch (error) {
            console.log(error);
        }
    };

    const handleDecrement = async (cartItem) => {
        if (cartItem.quantity > 1) {
            const newQuantity = {...cartItem,quantity: (cartItem.quantity-1),product: cartItem.product.id};
            console.log(newQuantity);
            try {
                await updateCart(newQuantity).unwrap();
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await deleteCart(id).unwrap();
        } catch (error) {
            console.log(error);
        }
    }
    const isChecked = (cartItem) => {
        if(cartItem.status===1){
            return true;
        }
        return false;
    };

    return (
        <div>
            {listCart.map((cartItem, index) => (
                <StyledPaper className='cart_item' key={index}>
                    <div className='cart_item_checkbox'>
                        <Checkbox 
                            {...label} 
                            checked={isChecked(cartItem)}                            
                            onChange={()=>onCheckboxChange(cartItem)}
                        />
                    </div>
                    <div className='cart_item_product'>
                        <img src={cartItem.product.imagesUrl[0]} alt="" />
                        <StyledTypography>{cartItem.product.name}</StyledTypography>
                    </div>
                    <div className='cart_item_category'>
                        <p>Phân Loại Hàng :</p>
                        <p>{cartItem.product.category.name}</p>
                    </div>
                    <div className='cart_item_sale'>
                        <p>{formatPrice(cartItem.product.price*cartItem.quantity)}</p>
                    </div>

                    <div className='cart_item_quantity'>
                        <IconButton onClick={() => handleDecrement(cartItem)}>
                            <RemoveIcon />
                        </IconButton>
                        <TextField
                            value={cartItem.quantity}
                            readOnly
                            sx={{
                                width: '50px',
                                textAlign: 'center',
                                mx: 1,
                            }}
                        />
                        <IconButton onClick={() => handleIncrement(cartItem)}>
                            <AddIcon />
                        </IconButton>
                    </div>

                    <Button onClick={() => handleDelete(cartItem.id)}>
                        Xóa
                    </Button>
                </StyledPaper>
            ))}
        </div>
    );
}

export default CartItem;
