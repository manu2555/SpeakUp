// API Configuration
export const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8888/api';
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888';

// App Configuration
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'SpeakUp';

// File Upload Configuration
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
export const MAX_FILES = 5; 