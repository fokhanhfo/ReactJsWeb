import { configureStore } from "@reduxjs/toolkit";
import conterReducer from '../features/Counter/counterSlice';
import useReducer from '../features/Auth/userSlice';
import { cartApi } from "features/Cart/cartApi";
import { categoryApiRedux } from "api/categoryApi";
const rootReducer ={
    count : conterReducer,
    user: useReducer,
    [cartApi.reducerPath]: cartApi.reducer, 
    [categoryApiRedux.reducerPath]: categoryApiRedux.reducer,
}

const store = configureStore({
    reducer:rootReducer,
    middleware:(getDefaultMiddleware) =>
        getDefaultMiddleware().concat(cartApi.middleware,categoryApiRedux.middleware),
});

export default store;