import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import userApi from 'api/userApi';
import StorageKeys from 'constants/storage-keys';
import { jwtDecode } from 'jwt-decode';


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
    async(payload,{ rejectWithValue }) => {
        const data = await userApi.login(payload);
        console.log(data)
        if (data.statusCode === 'BAD_REQUEST') {
            return rejectWithValue(data.body);
        }
        const token = data.body.data;
        localStorage.setItem(StorageKeys.TOKEN, token);
        const decodedToken = jwtDecode(data.body.data);
        const jsonJWT = JSON.stringify(decodedToken);
        localStorage.setItem(StorageKeys.USER, jsonJWT);
        try {
          const decodedToken = jwtDecode(token);
          return decodedToken;
        } catch (decodeError) {
            console.error('Failed to decode token:', decodeError);
            return rejectWithValue({ message: 'Token không hợp lệ' });
        }
    }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    current: JSON.parse(localStorage.getItem(StorageKeys.USER)) || {},
    settings:{},
    error: null,
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
            state.error = null;
        })
        .addCase(login.rejected, (state, action) => {
            state.error = action.payload;
        });
  },
});

export const { logout } = userSlice.actions;
const {reducer} = userSlice;
export default reducer;
