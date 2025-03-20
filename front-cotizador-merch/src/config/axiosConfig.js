import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true, // Si necesitas manejar cookies
});

export default apiClient;