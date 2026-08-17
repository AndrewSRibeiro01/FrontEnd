import axios from 'axios';

const PROD_FALLBACK_URL = 'https://backend-ngrl.onrender.com/api';
const DEV_FALLBACK_URL = 'http://localhost:3000/api';

const envUrl = import.meta.env.VITE_API_URL;
const fallback = import.meta.env.PROD ? PROD_FALLBACK_URL : DEV_FALLBACK_URL;
const baseURL = envUrl ?? fallback;

if (!envUrl && import.meta.env.PROD) {
  console.warn(
    `[api-client] VITE_API_URL not set at build time. Using fallback: ${PROD_FALLBACK_URL}`,
  );
}

export const apiClient = axios.create({
  baseURL,
  timeout: 10_000,
});
