import axios from 'axios';
import { API_BASE_URL } from '@/constants';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // send/receive cookies
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15_000,
});

// Helper to extract cookie by name safely
function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const val = parts.pop()?.split(';').shift();
    return val ? decodeURIComponent(val) : undefined;
  }
  return undefined;
}

// ─── Request interceptor — attach access token ────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    // Access token is stored in window.__accessToken or document.cookie (authToken / accessToken)
    let token = typeof window !== 'undefined' ? window.__accessToken : undefined;

    if (!token) {
      token = getCookie('authToken') || getCookie('accessToken');
    }

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
        if (typeof window !== 'undefined') {
          window.__accessToken = undefined;
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

declare global {
  interface Window {
    __accessToken?: string;
  }
}

export default apiClient;
