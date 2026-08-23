import axios, { type AxiosInstance } from 'axios';
import { api, refreshSession } from './api';

/**
 * Builds a feature API client that shares the app's auth.
 *
 * Every feature used to declare its own axios instance with a copy of the same
 * interceptors. Besides the duplication, each copy called /auth/refresh on its
 * own — and refresh tokens are single-use, so two clients refreshing at the
 * same moment meant one of them got a 401 and the session appeared to end.
 * Routing every client through the one deduped refresh fixes that.
 */
export function createApiClient(baseURL: string): AxiosInstance {
  const http = axios.create({ baseURL, withCredentials: true });

  // Take the current token at call time; it changes after every refresh.
  http.interceptors.request.use((config) => {
    const token = api.defaults.headers.common.Authorization;
    if (token) config.headers.Authorization = token;
    return config;
  });

  http.interceptors.response.use(
    (response) => response,
    async (error) => {
      const original = error.config;

      if (error.response?.status === 401 && original && !original._retry) {
        original._retry = true;
        try {
          const token = await refreshSession();
          original.headers.Authorization = `Bearer ${token}`;
          return http(original);
        } catch {
          // Refresh genuinely failed — let the 401 reach the caller.
        }
      }

      return Promise.reject(error);
    },
  );

  return http;
}
