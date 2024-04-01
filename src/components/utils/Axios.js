// axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACK_END_API_URL,
 
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  config => {
    // Add authorization token to headers or other configurations
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `JWT ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // Handle global errors
    if (error.response && error.response.status === 401) {
      // Handle 401 errors, e.g., redirect to login or refresh token
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;