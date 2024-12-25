import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import axios from "axios";
import StorageKeys from "constants/storage-keys";
import { logout } from "features/Auth/userSlice";

const axiosInstance  = axios.create({
    baseURL: 'http://localhost:8080/',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8080',
  prepareHeaders: (headers, { getState }) => {
    const token = localStorage.getItem(StorageKeys.TOKEN);
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
    console.log(result);
  if (result?.error?.status === 401) {
    try{
      const refreshToken = localStorage.getItem('access_token');
      console.log(refreshToken);
      const refreshResult = await axiosInstance.post('/auth/refresh',{
          token: refreshToken, // Body chứa refresh token
        });
        console.log('Refresh result:', refreshResult);

      if (refreshResult) {
        localStorage.setItem(StorageKeys.TOKEN, refreshResult?.data?.data);
        // Retry the original query with new access token
        result = await baseQuery(args, api, extraOptions);
      }
    }catch(e){
      console.log('log out ở đây ' + e);
      api.dispatch(logout());
    }
  }

  return result;
};

export default baseQueryWithReauth;
