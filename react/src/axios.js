// import axios from 'axios';
// import router from './router';

// const axiosClient = axios.create({
//     baseURL: 'http://localhost:8000/api',
// });

// axiosClient.interceptors.request.use((config) => {
//     const token = localStorage.getItem('TOKEN');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// let isRefreshing = false;
// let refreshSubscribers = [];

// function onRefreshed(token) {
//     refreshSubscribers.forEach(callback => callback(token));
//     refreshSubscribers = [];
// }

// function addRefreshSubscriber(callback) {
//     refreshSubscribers.push(callback);
// }

// axiosClient.interceptors.response.use(response => {
//     return response;
// }, error => {
//     const { config, response } = error;

//     // Check if 401 error and avoid looping if already retrying
//     if (response && response.status === 401 && !config._retry) {
//         config._retry = true;

//         if (!isRefreshing) {
//             isRefreshing = true;
//             return axiosClient.post('/refresh-token')
//                 .then(({ data }) => {
//                     const newAccessToken = data.accessToken;
//                     localStorage.setItem('TOKEN', newAccessToken);
//                     axiosClient.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
//                     isRefreshing = false;
//                     onRefreshed(newAccessToken);
//                     return axiosClient(config); // Retry the original request
//                 })
//                 .catch(() => {
//                     localStorage.removeItem('TOKEN');
//                     router.navigate('/login');
//                     return Promise.reject(error);
//                 });
//         }

//         // Queue the request while refreshing
//         return new Promise(resolve => {
//             addRefreshSubscriber(token => {
//                 config.headers.Authorization = `Bearer ${token}`;
//                 resolve(axiosClient(config));
//             });
//         });
//     }

//     throw error;
// });

// export default axiosClient;
import axios from 'axios';
import router from './router';

// Assuming this file is part of a component
const axiosClient = axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: true,
    // headers: {
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json',
    // }
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('TOKEN');
    if (token && config.url !== '/refresh-token') {
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
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const { config, response } = error;

        if (response && response.status === 401 && !config._retry) {
            config._retry = true;

            if (!isRefreshing) {
                isRefreshing = true;
                console.log('Sending Refresh Token:', localStorage.getItem('REFRESH_TOKEN'));
                return axiosClient.post('/refresh-token', {}, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('REFRESH_TOKEN')}`
                    }
                })
                    .then(({ data }) => {
                        const newAccessToken = data.accessToken;
                        localStorage.setItem('TOKEN', newAccessToken);
                        axiosClient.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
                        isRefreshing = false;
                        onRefreshed(newAccessToken);
                        return axiosClient(config);
                    })
                    .catch((error) => {
                        console.error('Error in refresh token request:', error.response || error);
                        if (error.response && error.response.status === 401) {
                            localStorage.removeItem('TOKEN');
                            localStorage.removeItem('REFRESH_TOKEN');
                            router.push('/login'); // Ensure proper redirection here
                        }
                        return Promise.reject(error);
                    });
            }

            return new Promise((resolve) => {
                addRefreshSubscriber((token) => {
                    config.headers.Authorization = `Bearer ${token}`;
                    resolve(axiosClient(config));
                });
            });

        }
        if (response && response.status === 403) {
            console.warn('403 Forbidden - redirecting to UnauthorizedPage');
            history.push('/UnauthorizedPage');
        }
        return Promise.reject(error);
    }
);


export default axiosClient;
