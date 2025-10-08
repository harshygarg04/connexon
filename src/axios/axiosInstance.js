import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "https://connexon-backend-mx9f.onrender.com",
});

// ✅ Attach token dynamically in request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;

    
  },
  (error) => Promise.reject(error)
);


// ✅ Handle session expiry in response
axiosInstance.interceptors.response.use(
  (response) => response, // pass through if success
  (error) => {
    if (error.response && error.response.status === 401) {
      // token expired / unauthorized
      alert("⚠️ Your session has expired. Please log in again.");

      // clear old token
      localStorage.removeItem("authToken");

      // redirect to login page
      window.location.href = "/login"; 
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
