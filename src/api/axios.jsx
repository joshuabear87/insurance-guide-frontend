import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Attach access token if present
API.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

/** ---- Refresh de-dupe queue ---- */
let isRefreshing = false;
let refreshQueue = [];

const processQueue = (error, token = null) => {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  refreshQueue = [];
};

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    const status = error?.response?.status;

    // If no request context, bail early
    if (!originalRequest) return Promise.reject(error);

    // Only handle 401s once per request, and never for the refresh call itself
    const isRefreshCall = originalRequest.url?.includes('/auth/refresh');
    if (status === 401 && !originalRequest._retry && !isRefreshCall) {
      originalRequest._retry = true;

      // If a refresh is already in progress, queue this request to retry later
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({
            resolve: (newToken) => {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              resolve(API(originalRequest));
            },
            reject,
          });
        });
      }

      try {
        isRefreshing = true;

        // Include activeFacility in the body as your backend expects
        const activeFacility = localStorage.getItem('activeFacility');

        // Use bare axios to avoid this interceptor recursively
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { activeFacility },
          { withCredentials: true }
        );

        const newAccessToken = res.data?.accessToken;
        if (!newAccessToken) {
          throw new Error('No access token returned from refresh.');
        }

        localStorage.setItem('accessToken', newAccessToken);
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (err) {
        if (import.meta.env.DEV) console.error('Refresh failed:', err);
        processQueue(err, null);
        // Clear auth state and kick to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('activeFacility');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default API;
