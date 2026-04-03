import axios from 'axios';

// 1. Create Axios Instance with Base URL
const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api' || 'http://localhost:5000/', // Backend ka URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Add Request Interceptor (Token attach karne ke liye)
axiosInstance.interceptors.request.use(
    (config) => {
        // LocalStorage se user info uthao
        const userInfo = localStorage.getItem('userInfo') ?
            JSON.parse(localStorage.getItem('userInfo')) :
            null;

        // Agar user logged in hai aur token hai, toh Authorization header set karo
        if (userInfo && userInfo.token) {
            config.headers.Authorization = `Bearer ${userInfo.token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. Add Response Interceptor (Error handle karne ke liye)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Agar token expire ho gaya (401 Unauthorized)
        if (error.response && error.response.status === 401) {
            console.error("Token expired or unauthorized. Logging out...");
            localStorage.removeItem('userInfo');
            // User ko login page par bhej sakte hain (Window redirect)
            // window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;