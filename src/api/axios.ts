import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://skygloss-backend-production.up.railway.app',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add a response interceptor to unwrap the standardized backend response
api.interceptors.response.use(
    (response) => {
        // If the response follows our standard format { data, statusCode, message }
        // we return the internal data to keep the frontend logic simple.
        if (response.data && response.data.hasOwnProperty('data') && response.data.hasOwnProperty('statusCode')) {
            return {
                ...response,
                data: response.data.data,
            };
        }
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
