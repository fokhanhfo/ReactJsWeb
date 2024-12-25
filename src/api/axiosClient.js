import axios from 'axios';
import StorageKeys from 'constants/storage-keys';
import { logout } from 'features/Auth/userSlice';
import { useDispatch } from 'react-redux';


const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/',
  headers: {
    'Content-Type': 'application/json',
  },
});


// Add a request interceptor
axiosClient.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
// axiosClient.interceptors.response.use(
//   function (response) {
//     // Any status code that lie within the range of 2xx cause this function to trigger
//     // Do something with response data
//     return response.data;
//   },
//   function (error) {
//     // Any status codes that falls outside the range of 2xx cause this function to trigger
//     // Do something with response error
//     return Promise.reject(error);
//   },
// );

axiosClient.interceptors.response.use(
  function (response) {
    return response.data;
  },
  async function (error) {
    const originalRequest = error.config;
    console.log(error);

    // Kiểm tra nếu lỗi là 401 và không phải là yêu cầu refresh token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.error(error);
      
      // Thử refresh token
      try {
        const refreshToken = localStorage.getItem(StorageKeys.TOKEN);
        const response = await axios.post('http://localhost:8080/auth/refresh', {
          token: refreshToken,
        });
        console.log(response);

        const { data:token } = response.data;
        localStorage.setItem(StorageKeys.TOKEN, token);

        // Cập nhật lại Authorization header và thực hiện lại yêu cầu ban đầu
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        console.log('log out ở đây ' + refreshError);
        const dispatch = useDispatch();
        dispatch(logout());
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
