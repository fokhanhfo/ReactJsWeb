import axios from 'axios';
const token = 'eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiIiLCJzdWIiOiJqb2huZG9lNCIsImV4cCI6MTcyNTI3MTQ1NywiaWF0IjoxNzIyNjc5NDU3LCJqdGkiOiI3NTdiYjNkYy0xOTU4LTQyNjItYjg4Zi04NDEyNzViZjA5YjIiLCJzY29wZSI6IlJPTEVfVVNFUiBBUFBST1ZFX1BPU1QifQ.cQaWG9Li8OI7l60wJEirCsu-adveot6DBD6KPb1xYfYQnr4C8UcN5Pl8nrMuVrZykowW9KnU5DcFNz8tImhjfA'
const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
axiosClient.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  },
);

export default axiosClient;
