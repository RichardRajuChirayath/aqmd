"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminStatsPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch("/api/admin/stats");
            if (res.status === 401) {
                router.push("/admin/login");
                return;
            }
            const data = await res.json();
            setStats(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading stats...</div>;

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-3xl font-bold">Website Usage Stats</h1>
                    <button
                        onClick={async () => {
                            await fetch("/api/admin/logout", { method: "POST" });
                            router.push("/admin/login");
                        }}
                        className="text-zinc-400 hover:text-white text-sm"
                    >
                        Logout
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Total Unique Users" value={stats?.totalUsers || 0} icon="👥" color="blue" />
                    <StatCard title="Analyses Done" value={stats?.totalAnalyses || 0} icon="🔍" color="purple" />
                    <StatCard title="Study Sessions" value={stats?.totalSessions || 0} icon="📚" color="green" />
                    <StatCard title="Pathways Created" value={stats?.totalPathways || 0} icon="🛤️" color="orange" />
                </div>

                <div className="mt-12 p-8 border border-zinc-800 rounded-2xl bg-zinc-900/30">
                    <h2 className="text-xl font-semibold mb-4">Quick Insights</h2>
                    <p className="text-zinc-400">Total active learners currently using the platform based on unique anonymous IDs.</p>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }: any) {
    const colors: any = {
        blue: "from-blue-500/20 text-blue-400 border-blue-500/20",
        purple: "from-purple-500/20 text-purple-400 border-purple-500/20",
        green: "from-green-500/20 text-green-400 border-green-500/20",
        orange: "from-orange-500/20 text-orange-400 border-orange-500/20",
    };

    return (
        <div className={`bg-gradient-to-br ${colors[color]} border p-6 rounded-2xl backdrop-blur-sm`}>
            <div className="text-3xl mb-4">{icon}</div>
            <div className="text-zinc-400 text-sm font-medium uppercase tracking-wider">{title}</div>
            <div className="text-4xl font-bold mt-1">{value}</div>
        </div>
    );
}
