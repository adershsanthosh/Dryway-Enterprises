// Centralized API Base URL configuration for local dev and production hosting
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5001';
