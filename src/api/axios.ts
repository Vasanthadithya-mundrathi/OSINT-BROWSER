import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    // Any status code within the range of 2xx triggers this function
    return response;
  },
  (error) => {
    // Any status codes outside the range of 2xx trigger this function
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response Error:', error.response.data);
      return Promise.reject(new Error(error.response.data.error || 'Server error'));
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request Error:', error.request);
      return Promise.reject(new Error('No response from server. Please check if the server is running.'));
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
      return Promise.reject(new Error('Failed to send request. Please check your connection.'));
    }
  }
);

export default api;
