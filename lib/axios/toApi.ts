
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3000';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 在这里可以添加认证token等
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 在这里可以统一处理错误
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;