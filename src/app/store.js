import { configureStore } from "@reduxjs/toolkit";
import conterReducer from '../features/Counter/counterSlice';
import useReducer from '../features/Auth/userSlice';
const rootReducer ={
    count : conterReducer,
    user: useReducer,
}

const store = configureStore({
    reducer:rootReducer,
});

export default store;