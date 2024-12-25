import React, { useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import './styled.scss';
import { formatPrice } from 'utils';
import { CheckoutContext } from './CheckoutProvider';
import * as yup from 'yup';
import { useFormContext } from 'react-hook-form';

PayCheckout.propTypes = {
    cartQuery : PropTypes.object.isRequired,
    onSubmit:PropTypes.func.isRequired,
};

function PayCheckout({cartQuery,onSubmit}) {
    const listCart = cartQuery.data.data || [];
    const selectCartItem = listCart.filter(item => item.status === 1);
    const totalPrice = selectCartItem.reduce((sum, item) => sum + (item.product.price*item.quantity), 0);

    const { shipDetail ,payMethod  } = useContext(CheckoutContext);

    const handleCompleteOrder = async () => {
        const cartRequests = cartQuery.data.data.filter(element=>element.status === 1).map(element => {
            return {
                ...element,
                product: element.product.id,
            };
        });
        
        const newValue = {
            email:shipDetail.email,
            address:`${shipDetail.addressDetail} ${shipDetail.commune} ${shipDetail.district} ${shipDetail.city}`,
            phone:shipDetail.phone,
            cartRequests:cartRequests,
        }
        if(onSubmit){
            onSubmit(newValue);
        }
    };  

    return (
        <div className="voucher-component">  
            <div className="voucher-header">   
                <button className="voucher-button">ẨN VÀO ĐÂY ĐỂ CHỌN CODE</button>  
                <button className="apply-button">ÁP DỤNG</button>  
            </div>  
            <div className="voucher-details">  
                <p>Tổng đơn: <span className="total-price">{formatPrice(totalPrice)}</span></p>  
                <p>Ưu đãi (voucher / thành viên): <span className="discount">- 0</span></p>  
                <p>Phí ship: <span className="shipping-fee">0</span></p>  
            </div>  
            <div className="total-amount">  
                <p>THÀNH TIỀN: <span className="final-price">{formatPrice(totalPrice)}</span></p>  
            </div>  
            <button onClick={handleCompleteOrder} className="complete-order">HOÀN TẤT ĐƠN HÀNG</button>  
        </div>  
    );
}

export default PayCheckout;