// This file provides the base URL for API calls.
// When running locally (dev server), it uses relative paths.
// When running as a static export (e.g., Capacitor APK), it uses the deployed Railway URL.

const isStaticExport = typeof window !== 'undefined' && !window.location.hostname.includes('localhost');

export const API_BASE_URL = isStaticExport
    ? 'https://aqmd-production.up.railway.app'
    : '';

export function apiUrl(path: string): string {
    return `${API_BASE_URL}${path}`;
}
