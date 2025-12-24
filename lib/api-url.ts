// Centralized API base URL handling
const isBrowser = typeof window !== 'undefined';

const isLocalhost =
    isBrowser &&
    (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1');

// For Capacitor/APK, we ALWAYS want to point to the production API.
// We only use relative paths if we are explicitly on a local browser dev environment (localhost).
export const API_BASE_URL = (isLocalhost && !window.location.href.includes('capacitor:'))
    ? ''
    : 'https://www.aqmd.site';

export function apiUrl(path: string): string {
    // If the path already has a protocol, return it as is
    if (path.startsWith('http')) return path;
    // Otherwise, prepend the base URL
    return `${API_BASE_URL}${path}`;
}
