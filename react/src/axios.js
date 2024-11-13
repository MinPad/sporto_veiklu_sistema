import axios from 'axios';
import router from './router';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8000/api',
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('TOKEN');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(token) {
    refreshSubscribers.forEach(callback => callback(token));
    refreshSubscribers = [];
}

function addRefreshSubscriber(callback) {
    refreshSubscribers.push(callback);
}

axiosClient.interceptors.response.use(response => {
    return response;
}, error => {
    const { config, response } = error;

    // Check if 401 error and avoid looping if already retrying
    if (response && response.status === 401 && !config._retry) {
        config._retry = true;

        if (!isRefreshing) {
            isRefreshing = true;
            return axiosClient.post('/refresh-token')
                .then(({ data }) => {
                    const newAccessToken = data.accessToken;
                    localStorage.setItem('TOKEN', newAccessToken);
                    axiosClient.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
                    isRefreshing = false;
                    onRefreshed(newAccessToken);
                    return axiosClient(config); // Retry the original request
                })
                .catch(() => {
                    localStorage.removeItem('TOKEN');
                    router.navigate('/login');
                    return Promise.reject(error);
                });
        }

        // Queue the request while refreshing
        return new Promise(resolve => {
            addRefreshSubscriber(token => {
                config.headers.Authorization = `Bearer ${token}`;
                resolve(axiosClient(config));
            });
        });
    }

    throw error;
});

export default axiosClient;
