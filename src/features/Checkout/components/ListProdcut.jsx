import React from 'react';
import PropTypes from 'prop-types';
import { Paper, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import CartItem from 'features/Cart/components/CartItem';
import Loading from 'components/Loading';
import './styled.scss';
import styled from 'styled-components';
import { formatPrice } from 'utils';
import { useUpdateCartMutation } from 'features/Cart/cartApi';

ListProdcut.propTypes = {
    cartQuery: PropTypes.object.isRequired,
};

const StyledTypography = styled(Typography)`
    font-weight: 500;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
`;

function ListProdcut({cartQuery}) {
    const cartData = cartQuery?.data.data;
    const [updateCart] = useUpdateCartMutation();

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

    const CartItemSelect = cartData.filter(item => item.status === 1);

    return (
        <Paper>
            {cartData ? (
                <div>
                    {CartItemSelect.map(item => (
                        <div className='checkout_product'>
                            <div className='checkout_product_img'>
                                <img src={item.product.imagesUrl[0]} alt="" />
                            </div>

                            <div className='checkout_product_deltail'>
                                <StyledTypography>{item.product.name}</StyledTypography>
                                <p className='checkout_product_price'>{formatPrice(item.product.price)}</p>
                                <p className='checkout_product_quantity'>
                                    <span className='checkout_lable'>Số lượng </span>
                                    <span onClick={()=>handleDecrement(item)} className='checkout_quantity decrement'>-</span>
                                    <span>{item.quantity}</span>
                                    <span onClick={()=>handleIncrement(item)} className='checkout_quantity increment'>+</span>
                                </p>
                                <p className='checkout_product_category'>
                                    <span className='checkout_lable'>Loại hàng :</span> {item.product.category.name}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <Loading></Loading>
            )}
        </Paper>
    );
}

export default ListProdcut;