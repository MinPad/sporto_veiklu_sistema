import axios from 'axios';
import router from './router';

const axiosClient = axios.create({
    // baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`
    baseURL: 'http://localhost:8000/api',
    // headers: {
    //     'Content-Type': 'application/json',
    // },
})

axiosClient.interceptors.request.use((config) => {
    // const token = '123'; //NO FORGETO
    config.headers.Authorization = `Bearer ${localStorage.getItem('TOKEN')}`
    return config;
})

axiosClient.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response && error.response.status === 401) {
        router.navigate('/login')
        return error;
    }
    throw error;
})

export default axiosClient;