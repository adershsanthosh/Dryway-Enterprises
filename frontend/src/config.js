// Centralized API Base URL configuration for local dev and production hosting
// In local development, leaving it empty uses the Vite dev proxy to avoid CORS/IPv6 localhost issues
export const API_BASE_URL =
  import.meta.env.VITE_API_URL !== undefined ? import.meta.env.VITE_API_URL : '';
