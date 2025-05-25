import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import userApi from 'api/userApi';
import StorageKeys from 'constants/storage-keys';
import { jwtDecode } from 'jwt-decode';


export const register = createAsyncThunk(
    'user/register',
    async(payload,{ rejectWithValue }) => {
        try{
          const data = await userApi.register(payload);
          return data;
        }catch(e){
          if(e.response.status === 400){
            return rejectWithValue(e.response.data);
          }
          return e.response.data;
        }
    }
);

export const login = createAsyncThunk(
    'user/login',
    async(payload,{ rejectWithValue }) => {
      try{
        const data = await userApi.login(payload);
        const token = data.data;
        localStorage.setItem(StorageKeys.TOKEN, token);
        const decodedToken = jwtDecode(data.data);
        const jsonJWT = JSON.stringify(decodedToken);
        console.log(jsonJWT);
        localStorage.setItem(StorageKeys.USER, jsonJWT);
        try {
          const decodedToken = jwtDecode(token);
          return decodedToken;
        } catch (decodeError) {
            console.error('Failed to decode token:', decodeError);
            return rejectWithValue({ message: 'Token không hợp lệ' });
        }
      }catch(e){
        console.error(e);
        if(e.response.status === 400){
          return rejectWithValue(e.response.data);
        }
        return e.response.data;
      }
    }
);

export const facebookLogin = createAsyncThunk(
  'user/loginFacebook',
  async(payload,{ rejectWithValue }) => {
    try{
      const data= await userApi.facebookLogin(payload);
      const token = data.data;
      localStorage.setItem(StorageKeys.TOKEN, token);
      const decodedToken = jwtDecode(data.data);
      const jsonJWT = JSON.stringify(decodedToken);
      localStorage.setItem(StorageKeys.USER, jsonJWT);
      try {
        const decodedToken = jwtDecode(token);
        return decodedToken;
      } catch (decodeError) {
          console.error('Failed to decode token:', decodeError);
          return rejectWithValue({ message: 'Token không hợp lệ' });
      }
    }catch(e){
      console.error(e);
      if(e.response.status === 400){
        return rejectWithValue(e.response.data);
      }
      return e.response.data;
    };
  }
)


const userSlice = createSlice({
  name: 'user',
  initialState: {
    current: JSON.parse(localStorage.getItem(StorageKeys.USER)) || {},
    settings:{isLoginWindow : false},
    error: null,

  },
  reducers: {
    logout(state){
        state.current={};
        localStorage.removeItem(StorageKeys.TOKEN);
        localStorage.removeItem(StorageKeys.USER);
    },
    loginWindow(state){
        state.settings.isLoginWindow = !state.settings.isLoginWindow;
    }
  },
  extraReducers: (builder) => {
    builder
        .addCase(register.fulfilled, (state, action) => {
          
        })
        .addCase(register.rejected, (state, action) => {
            state.error = action.payload;
        })
        .addCase(login.fulfilled, (state, action) => {
            state.current = action.payload;
            state.error = null;
        })
        .addCase(login.rejected, (state, action) => {
            state.error = action.payload;
        })
        .addCase(facebookLogin.fulfilled, (state, action) => {
          state.current = action.payload;
          state.error = null;
        })
        .addCase(facebookLogin.rejected, (state, action) => {
          state.error = action.payload;
        });
  },
});

export const { logout,loginWindow } = userSlice.actions;
const {reducer} = userSlice;
export default reducer;
