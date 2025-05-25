import { useSnackbar } from "notistack";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const{enqueueSnackbar } = useSnackbar();
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (productDetailCart) => {
    setCart((prevCart) => {
      const isExist = prevCart.some((item) => (item.productDetail.id === productDetailCart.productDetail.id&& item.size === productDetailCart.size));
  
      if (isExist) {
        enqueueSnackbar('Sản phẩm đã chọn',{variant: 'error'});
        return prevCart;
      }
      enqueueSnackbar('Thêm thành công',{variant: 'success'});
      return [...prevCart, { ...productDetailCart, quantity: 1 }];
    });
  };

  const removeFromCart = (productDetailId, size) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter(
        (item) => !(item.productDetail.id === productDetailId && item.size === size)
      );
  
      if (prevCart.length === updatedCart.length) {
        enqueueSnackbar('Sản phẩm không tồn tại trong giỏ hàng', { variant: 'error' });
        return prevCart;
      }
  
      enqueueSnackbar('Xóa sản phẩm thành công', { variant: 'success' });
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };  
  
  

  return (
    <CartContext.Provider value={{ cart,clearCart , removeFromCart, addToCart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
