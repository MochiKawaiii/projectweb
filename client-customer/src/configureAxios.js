import axios from 'axios';

const apiBaseUrl = (process.env.REACT_APP_API_BASE_URL || '').trim().replace(/\/+$/, '');
const shouldWarmRender = apiBaseUrl.includes('onrender.com');

if (apiBaseUrl) {
  axios.defaults.baseURL = apiBaseUrl;
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const isRetriableMethod = (method = 'get') => ['get', 'head', 'options'].includes(String(method).toLowerCase());
const isRetriableStatus = (status) => !status || [404, 408, 425, 429, 500, 502, 503, 504].includes(status);

if (shouldWarmRender) {
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const config = error.config || {};
      const retryCount = Number(config.__retryCount || 0);
      const maxRetries = 3;

      if (!isRetriableMethod(config.method) || !isRetriableStatus(error.response?.status) || retryCount >= maxRetries) {
        return Promise.reject(error);
      }

      config.__retryCount = retryCount + 1;
      await wait((retryCount + 1) * 2000);
      return axios(config);
    }
  );
}
