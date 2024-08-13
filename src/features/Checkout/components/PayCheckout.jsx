import React from 'react';
import PropTypes from 'prop-types';
import './styled.scss';
import { formatPrice } from 'utils';

PayCheckout.propTypes = {
    cartQuery : PropTypes.object.isRequired,
};

function PayCheckout({cartQuery}) {
    const listCart = cartQuery.data.data;
    const selectCartItem = listCart.filter(item => item.status === 1);
    const totalPrice = selectCartItem.reduce((sum, item) => sum + (item.product.price*item.quantity), 0);
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
            <button className="complete-order">HOÀN TẤT ĐƠN HÀNG</button>  
        </div>  
    );
}

export default PayCheckout;