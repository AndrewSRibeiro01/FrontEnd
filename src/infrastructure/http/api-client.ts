import axios from 'axios';

const envUrl = import.meta.env.VITE_API_URL;

if (!envUrl && import.meta.env.PROD) {
  throw new Error(
    'VITE_API_URL is required in production builds. Set it in the deploy environment before building.',
  );
}

export const apiClient = axios.create({
  baseURL: envUrl ?? 'http://localhost:3000/api',
  timeout: 10_000,
});
