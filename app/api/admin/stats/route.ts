import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    if (!(await isAdminAuthenticated())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const [totalAnalyses, totalPathways, totalSessions] = await Promise.all([
            prisma.analysis.count(),
            prisma.pathway.count(),
            prisma.studySession.count(),
        ]);

        const [analysesUsers, pathwaysUsers, sessionsUsers] = await Promise.all([
            prisma.analysis.findMany({ select: { guestId: true }, distinct: ['guestId'] }),
            prisma.pathway.findMany({ select: { guestId: true }, distinct: ['guestId'] }),
            prisma.studySession.findMany({ select: { guestId: true }, distinct: ['guestId'] }),
        ]);

        const allGuestIds = new Set<string>([
            ...analysesUsers.map((u: { guestId: string }) => u.guestId),
            ...pathwaysUsers.map((u: { guestId: string }) => u.guestId),
            ...sessionsUsers.map((u: { guestId: string }) => u.guestId),
        ]);

        // Only count non-empty guestIds
        allGuestIds.delete('');
        const totalUsers = allGuestIds.size;

        return NextResponse.json({
            totalUsers,
            totalAnalyses,
            totalPathways,
            totalSessions,
        });
    } catch (error) {
        console.error('Stats error:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
