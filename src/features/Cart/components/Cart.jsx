import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import CartItem from './CartItem';
import { useSelector } from 'react-redux';
import Loading from 'components/Loading';
import PayCart from './PayCart';
import styled from 'styled-components';
import { useUpdateCartMutation } from '../cartApi';

const StyledCartItems = styled(CartItem)`
    
`

Cart.propTypes = {};

function Cart(props) {
    const cartQuery = useSelector((state) => state.cartApi.queries["getCart(undefined)"]);
    const cartData = cartQuery?.data;
    const isFetching = cartQuery?.isFetching;
    const [updateCart]=useUpdateCartMutation();
    if (isFetching) {
        return <div>Đang tải dữ liệu...</div>;
    }

    const handleCheckboxChange = async(cartItem) => {
        const updatedCartItem = { ...cartItem, status: cartItem.status === 1 ? 0 : 1,product : cartItem.product.id };
        try {
            const response = await updateCart(updatedCartItem).unwrap();
        } catch (error) {
            console.log(`Lỗi: ${error?.data?.message || 'Đã xảy ra lỗi'}`);
        }
    };

    const handleAllCheckboxChange = async(status) => {
        const listCart = [...cartData.data];
        listCart.forEach(async(item) => {
            const newItem = {...item, product:item.product.id,status:status}
            try {
                const response = await updateCart(newItem).unwrap();
            } catch (error) {
                console.log(`Lỗi: ${error?.data?.message || 'Đã xảy ra lỗi'}`);
            }
        })
    };

    return (
        <div className='cart'>
            {cartData ? (
                <div>
                    <CartItem listCart={cartData.data} onCheckboxChange={handleCheckboxChange}></CartItem>
                    <PayCart listCart={cartData.data} onAllCheckboxChange={handleAllCheckboxChange}></PayCart>
                </div>
            ) : (
                <Loading></Loading>
            )}
        </div>
    );
}

export default Cart;
