import React, { createContext, useState } from 'react';

export const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
    const [shipDetail, setShipDetail] = useState({});
    const [payMethod, setPayMethod] = useState('');
    const [submitForm] = useState(() => () => {
        console.log("Submit form from context");
    });

    return (
        <CheckoutContext.Provider value={{ shipDetail, setShipDetail, payMethod, setPayMethod,submitForm }}>
            {children}
        </CheckoutContext.Provider>
    );
};
