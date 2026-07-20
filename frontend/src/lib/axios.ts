import axios from 'axios';
import { API_BASE_URL } from '@/constants';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,            // send/receive cookies (refresh token)
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15_000,
});

// ─── Request interceptor — attach access token ────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    // Access token is stored in memory (set by auth store)
    const token =
      typeof window !== 'undefined'
        ? window.__accessToken
        : undefined;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response interceptor — handle 401 / token refresh ───────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Try to get a new access token via refresh endpoint
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true },
        );
        const newToken = data?.data?.accessToken as string | undefined;
        if (newToken && typeof window !== 'undefined') {
          window.__accessToken = newToken;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return apiClient(originalRequest);
      } catch {
        // Refresh failed — clear token and let the app redirect to login
        if (typeof window !== 'undefined') {
          window.__accessToken = undefined;
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

// Extend Window to hold the in-memory access token
declare global {
  interface Window {
    __accessToken?: string;
  }
}

export default apiClient;
