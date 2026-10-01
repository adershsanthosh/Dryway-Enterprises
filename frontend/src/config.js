// Centralized API Base URL configuration for local dev and production hosting
// In local dev, uses empty string (Vite proxy). In deployed production (e.g. Vercel), defaults to Render backend URL.
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? ''
    : 'https://dryway-backend.onrender.com');
