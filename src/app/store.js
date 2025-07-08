import { configureStore } from "@reduxjs/toolkit";
import conterReducer from '../features/Counter/counterSlice';
import useReducer from '../features/Auth/userSlice';
import actionsReducer from '../admin/reduxAdmin/slices/actionsSlice';
import { categoryApiRedux } from "api/categoryApi";
import { productApi } from "hookApi/productApi";
import { colorApi } from "hookApi/colorApi";
import { sizeApi } from "hookApi/sizeApi";
import { cartApi } from "hookApi/cartApi";
import { imageApi } from "hookApi/imageApi";
import { discountApi } from "hookApi/discountApi";
import { userApi } from "hookApi/userApi";
import { discountUserApi } from "hookApi/discountUserApi";
import { categoryApi } from "hookApi/categoryApi";
import { billApi } from "hookApi/billApi";
import { discountPeriodApi } from "hookApi/discountPeriodApi";
import { discountProductPeriodApi } from "hookApi/discountProductPeriod";
import { roleApi } from "hookApi/roleApi";
import { notificationApi } from "hookApi/notificationApi";
import { dashboardApi } from "hookApi/dashboard";
import { shippingAddressApi } from "hookApi/shippingAddressApi";
import { blogApi } from "hookApi/blogApi";
// import {productApi} from "admin/featuresAdmin/Produuct/hook/productApi"
// import { colorApi } from "admin/hookApi/colorApi";
// import { sizeApi } from "admin/hookApi/sizeApi";
const rootReducer ={
    actions : actionsReducer,
    count : conterReducer,
    user: useReducer,
    [cartApi.reducerPath]: cartApi.reducer, 
    // [categoryApiRedux.reducerPath]: categoryApiRedux.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [colorApi.reducerPath]: colorApi.reducer,
    [sizeApi.reducerPath]: sizeApi.reducer,
    [imageApi.reducerPath]: imageApi.reducer,
    [discountApi.reducerPath]: discountApi.reducer,
    [discountUserApi.reducerPath]: discountUserApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [billApi.reducerPath]: billApi.reducer,
    [discountPeriodApi.reducerPath]: discountPeriodApi.reducer,
    [discountProductPeriodApi.reducerPath]: discountProductPeriodApi.reducer,
    [roleApi.reducerPath]: roleApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [shippingAddressApi.reducerPath]: shippingAddressApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,

}

const store = configureStore({
    reducer:rootReducer,
    middleware:(getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            cartApi.middleware,
            // categoryApiRedux.middleware,
            productApi.middleware,
            colorApi.middleware,
            sizeApi.middleware,
            imageApi.middleware,
            discountApi.middleware,
            userApi.middleware,
            discountUserApi.middleware,
            categoryApi.middleware,
            billApi.middleware,
            discountPeriodApi.middleware,
            discountProductPeriodApi.middleware,
            roleApi.middleware,
            notificationApi.middleware,
            dashboardApi.middleware,
            shippingAddressApi.middleware,
            blogApi.middleware,
        ),
});

export default store;