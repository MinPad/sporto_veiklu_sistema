// import axios from 'axios';
// import router from './router';

// const axiosClient = axios.create({
//     // baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`
//     baseURL: 'http://localhost:8000/api',
//     // headers: {
//     //     'Content-Type': 'application/json',
//     // },
// })

// axiosClient.interceptors.request.use((config) => {
//     // const token = '123'; //NO FORGETO
//     config.headers.Authorization = `Bearer ${localStorage.getItem('TOKEN')}`
//     return config;
// })

// axiosClient.interceptors.response.use(response => {
//     return response;
// }, error => {
//     if (error.response && error.response.status === 401) {
//         router.navigate('/login')
//         return error;
//     }
//     throw error;
// })

// export default axiosClient;

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

function onRrefreshed(token) {
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
            return axiosClient.post('/refresh')
                .then(({ data }) => {
                    const newAccessToken = data.accessToken;
                    localStorage.setItem('TOKEN', newAccessToken);
                    axiosClient.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
                    isRefreshing = false;
                    onRrefreshed(newAccessToken);
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
