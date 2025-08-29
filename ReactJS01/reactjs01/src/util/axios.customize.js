import axios from "axios";

// Tạo instance Axios với baseURL
const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Interceptor trước khi gửi request
instance.interceptors.request.use(
  function (config) {
    // Thêm token vào header Authorization
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Interceptor xử lý response
instance.interceptors.response.use(
  function (response) {
    // Trả về data nếu có
    if (response && response.data) return response.data;
    return response;
  },
  function (error) {
    // Trả về data lỗi nếu có
    if (error?.response?.data) return error.response.data;
    return Promise.reject(error);
  }
);

export default instance;
