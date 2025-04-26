import axios from 'axios';
import router from './router';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: true,
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('TOKEN');

    const isPublicRequest = config.headers['X-Public-Request'] === 'true';

    // not public
    if (!isPublicRequest && token && config.url !== '/refresh-token') {
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

            const refreshToken = localStorage.getItem('REFRESH_TOKEN');
            if (refreshToken) {
                if (!isRefreshing) {
                    isRefreshing = true;
                    return axiosClient.post('/refresh-token', {}, {
                        headers: {
                            Authorization: `Bearer ${refreshToken}`
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
                            console.log('Refresh failed - redirecting to login');
                            if (error.response && (
                                error.response.status === 401 ||
                                error.response.data?.message === 'Refresh token expired'
                            )) {
                                localStorage.removeItem('TOKEN');
                                localStorage.removeItem('REFRESH_TOKEN');
                                router.push('/login');
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
            } else {
                // No refresh token — logout guest
                localStorage.removeItem('TOKEN');
                localStorage.removeItem('REFRESH_TOKEN');
                console.log('Redirecting to login');
                router.push('/login');
            }
        }

        // Optional: handle forbidden access
        if (response && response.status === 403) {
            history.push('/UnauthorizedPage');
        }

        return Promise.reject(error);
    }
);

export default axiosClient;