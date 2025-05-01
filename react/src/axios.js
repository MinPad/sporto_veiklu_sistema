import axios from 'axios';
import router from './router';

const axiosClient = axios.create({
    // baseURL: 'http://localhost:8000/api',
    baseURL: 'http://127.0.0.1:8000/api',
    withCredentials: true,
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('TOKEN');
    const isPublicRequest = config.headers['X-Public-Request'] === 'true';

    // console.log(`[REQUEST] ${config.method?.toUpperCase()} ${config.url}`, {
    //     isPublicRequest,
    //     hasToken: !!token,
    // });

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
    (response) => {
        // console.log(`[RESPONSE] ${response.config.url} - ${response.status}`);
        return response;
    },
    (error) => {
        const { config, response } = error;
        const isPublicRequest = config?.headers['X-Public-Request'] === 'true';
        console.error(`[ERROR] ${config?.url} - ${response?.status}`, {
            isPublicRequest,
            response,
        });
        if (response && response.status === 401 && !config._retry && !isPublicRequest) {
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
                            console.log('Refresh failed');

                            const isPublicRequest = config?.headers['X-Public-Request'] === 'true';

                            if (error.response && (
                                error.response.status === 401 ||
                                error.response.data?.message === 'Refresh token expired'
                            )) {
                                localStorage.removeItem('TOKEN');
                                localStorage.removeItem('REFRESH_TOKEN');

                                if (!isPublicRequest) {
                                    console.log('Redirecting to login');
                                    router.push('/login');
                                } else {
                                    console.log('Public request failed, no redirect.');
                                }
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
                localStorage.removeItem('TOKEN');
                localStorage.removeItem('REFRESH_TOKEN');
                console.log('Redirecting to login');
                router.push('/login');
            }
        }

        // Forbidden access (403)
        if (response && response.status === 403) {
            router.push('/UnauthorizedPage');
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
