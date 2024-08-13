import { createSlice } from '@reduxjs/toolkit';


const counterSlice = createSlice({
  name: 'counter',//name
  initialState: 0,//giá trị khởi tạo
  reducers: {
    increase(state) {
      return state + 1;
    },
    decrease(state) {
      return state - 1;
    },
  },
});

// Giải cấu trúc đúng
const { actions, reducer } = counterSlice;
export const { increase, decrease } = actions;
export default reducer;
