import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import userApi from 'api/userApi';
import StorageKeys from 'constants/storage-keys';


export const register = createAsyncThunk(
    'user/register',
    async(payload) => {
        const data = await userApi.register(payload);
        localStorage.setItem(StorageKeys.TOKEN, data.jwt);
        localStorage.setItem(StorageKeys.USER, JSON.stringify(data.user));
        return data.user;
    }
);

export const login = createAsyncThunk(
    'user/login',
    async(payload) => {
        const data = await userApi.login(payload);
        localStorage.setItem(StorageKeys.TOKEN, data.jwt);
        localStorage.setItem(StorageKeys.USER, JSON.stringify(data.user));
        return data.user;
    }
);
const userSlice = createSlice({
  name: 'user',
  initialState: {
    current: JSON.parse(localStorage.getItem(StorageKeys.USER)) ||{},
    settings:{},
  },
  reducers: {
    logout(state){
        state.current={};
        localStorage.removeItem(StorageKeys.TOKEN);
        localStorage.removeItem(StorageKeys.USER);
    }
  },
  extraReducers: (builder) => {
    builder
        .addCase(register.fulfilled, (state, action) => {
        state.current = action.payload;
        })
        .addCase(login.fulfilled, (state, action) => {
            state.current = action.payload;
        });
  },
});

export const { logout } = userSlice.actions;
const {reducer} = userSlice;
export default reducer;
