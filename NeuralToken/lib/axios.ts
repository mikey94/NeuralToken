import axios from 'axios';
import { NEURAL_TOKEN_API_BASE_URL } from '@env';
console.log('NEURAL_TOKEN_API_BASE_URL', NEURAL_TOKEN_API_BASE_URL)
const api = axios.create({
    baseURL: NEURAL_TOKEN_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
