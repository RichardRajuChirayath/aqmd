import { cookies } from 'next/headers';

const ADMIN_SESSION_COOKIE = 'admin_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function verifyAdminPassword(password: string): boolean {
    const adminPassword = process.env.ADMIN_PASSWORD;
    return password === adminPassword;
}

export function createSessionToken(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
    if (!token) return false;
    try {
        const [timestamp] = token.split('-');
        return (Date.now() - parseInt(timestamp, 10)) < SESSION_DURATION;
    } catch {
        return false;
    }
}

export async function setAdminSession() {
    const token = createSessionToken();
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: SESSION_DURATION / 1000,
        path: '/',
    });
}

export async function isAdminAuthenticated(): Promise<boolean> {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
    return verifySessionToken(token);
}

export async function clearAdminSession() {
    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_SESSION_COOKIE);
}
