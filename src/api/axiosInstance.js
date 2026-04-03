import axios from 'axios';
const axiosInstance = axios.create({
    baseURL: 'https://socialapp-back.onrender.com/api' || 'https://socialapp-back.onrender.com/',
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('userInfo') ?
            JSON.parse(localStorage.getItem('userInfo')) :
            null;

        if (userInfo && userInfo.token) {
            config.headers.Authorization = `Bearer ${userInfo.token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error("Token expired or unauthorized. Logging out...");
            localStorage.removeItem('userInfo');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;