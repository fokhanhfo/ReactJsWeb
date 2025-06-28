import React, { createContext, useState } from 'react';

export const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
    const [shipDetail, setShipDetail] = useState({});
    const [payMethod, setPayMethod] = useState('');
    const [moneyToPay,setmoneyToPay] = useState(0);
    const [voucherProduct, setvoucherProduct] = useState(null);
      const [discountFreeShip, setDiscountFreeShip] = useState(null);
      const [valueVoucherProduct, setValueVoucherProduct] = useState(0);
      const [valueDiscountFreeShip, setValueDiscountFreeShip] = useState(0);
    const [submitForm] = useState(() => () => {
        console.log("Submit form from context");
    });

    return (
        <CheckoutContext.Provider value={{ 
            shipDetail, setShipDetail,
             payMethod, setPayMethod,
             submitForm,
             moneyToPay,setmoneyToPay,
             voucherProduct, setvoucherProduct,
             discountFreeShip, setDiscountFreeShip,
             valueVoucherProduct, setValueVoucherProduct,
             valueDiscountFreeShip, setValueDiscountFreeShip}}>
            {children}
        </CheckoutContext.Provider>
    );
};
