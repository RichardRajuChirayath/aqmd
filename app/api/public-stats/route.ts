import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Public API - no auth required
export async function GET() {
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

        allGuestIds.delete('');
        const totalUsers = allGuestIds.size;
        const totalActions = totalAnalyses + totalSessions + totalPathways;

        return NextResponse.json({
            users: totalUsers,
            actions: totalActions,
        });
    } catch (error) {
        console.error('Public stats error:', error);
        return NextResponse.json({ users: 0, actions: 0 });
    }
}
