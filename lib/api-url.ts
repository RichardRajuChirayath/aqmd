// Centralized API base URL handling
const isBrowser = typeof window !== 'undefined';

const isLocalhost =
    isBrowser &&
    (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1');

// For Capacitor/APK, we ALWAYS want to point to the production API.
// For local browser development, we use relative paths so it hits the local dev server.
export const API_BASE_URL = (isBrowser && window.location.protocol === 'capacitor:')
    ? 'https://www.aqmd.site'
    : '';

export function apiUrl(path: string): string {
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    // If we have a base URL (APK/Dev), use it. Otherwise relative.
    return API_BASE_URL ? `${API_BASE_URL}${cleanPath}` : cleanPath;
}
