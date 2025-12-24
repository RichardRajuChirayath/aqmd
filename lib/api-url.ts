// Centralized API base URL handling
// - Local dev      → relative paths
// - Web (prod)     → https://www.aqmd.site
// - Capacitor APK  → https://www.aqmd.site

const isBrowser = typeof window !== 'undefined';

const isLocalhost =
    isBrowser &&
    (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1');

export const API_BASE_URL = isLocalhost
    ? ''
    : 'https://www.aqmd.site';

export function apiUrl(path: string): string {
    return `${API_BASE_URL}${path}`;
}
