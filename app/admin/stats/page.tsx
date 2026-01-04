"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, TrendingUp, Users, Brain, BookOpen, Target } from "lucide-react";

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

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
            <div className="flex items-center gap-3 text-white">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                Loading analytics...
            </div>
        </div>
    );

    const totalUsers = stats?.totalUsers || 0;
    const totalAnalyses = stats?.totalAnalyses || 0;
    const totalSessions = stats?.totalSessions || 0;
    const totalPathways = stats?.totalPathways || 0;
    const totalActions = totalAnalyses + totalSessions + totalPathways;
    const engagementRate = totalUsers > 0 ? ((totalActions / totalUsers)).toFixed(1) : "0";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6 md:p-10">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-3">
                            <Zap className="w-3 h-3" />
                            LIVE ANALYTICS
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
                            AQMD Usage Dashboard
                        </h1>
                        <p className="text-zinc-500 mt-2 text-sm">Real-time platform metrics • Updated just now</p>
                    </div>
                    <button
                        onClick={async () => {
                            await fetch("/api/admin/logout", { method: "POST" });
                            router.push("/admin/login");
                        }}
                        className="text-zinc-500 hover:text-white text-sm border border-zinc-800 px-4 py-2 rounded-lg hover:border-zinc-600 transition-colors"
                    >
                        Logout
                    </button>
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                    <StatCard
                        title="Total Users"
                        value={totalUsers}
                        icon={<Users className="w-6 h-6" />}
                        color="blue"
                        subtitle="Unique learners"
                    />
                    <StatCard
                        title="Analyses"
                        value={totalAnalyses}
                        icon={<Brain className="w-6 h-6" />}
                        color="purple"
                        subtitle="AI-powered checks"
                    />
                    <StatCard
                        title="Study Sessions"
                        value={totalSessions}
                        icon={<BookOpen className="w-6 h-6" />}
                        color="green"
                        subtitle="PDF companions"
                    />
                    <StatCard
                        title="Pathways"
                        value={totalPathways}
                        icon={<Target className="w-6 h-6" />}
                        color="orange"
                        subtitle="Learning maps"
                    />
                </div>

                {/* Engagement Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Big Engagement Card */}
                    <div className="lg:col-span-2 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 backdrop-blur-sm">
                        <div className="flex items-center gap-2 text-blue-400 mb-4">
                            <TrendingUp className="w-5 h-5" />
                            <span className="text-sm font-medium uppercase tracking-wider">Engagement Rate</span>
                        </div>
                        <div className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                            {engagementRate}x
                        </div>
                        <p className="text-zinc-400 text-sm">Average actions per user across all features</p>

                        {/* Mini Progress Bars */}
                        <div className="mt-6 space-y-4">
                            <ProgressBar label="Analysis Adoption" value={totalAnalyses} max={totalActions} color="purple" />
                            <ProgressBar label="Study Sessions" value={totalSessions} max={totalActions} color="green" />
                            <ProgressBar label="Pathway Generation" value={totalPathways} max={totalActions} color="orange" />
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="space-y-4">
                        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                            <div className="text-3xl font-bold text-white mb-1">{totalActions}</div>
                            <div className="text-zinc-500 text-sm">Total Platform Actions</div>
                        </div>
                        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                            <div className="text-3xl font-bold text-emerald-400 mb-1">100%</div>
                            <div className="text-zinc-500 text-sm">System Uptime</div>
                        </div>
                        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                            <div className="text-3xl font-bold text-amber-400 mb-1">🇮🇳</div>
                            <div className="text-zinc-500 text-sm">Built for India</div>
                        </div>
                    </div>
                </div>

                {/* Feature Breakdown */}
                <div className="p-6 md:p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        Feature Breakdown
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FeatureCard
                            emoji="🔍"
                            title="Q&A Mismatch Detector"
                            count={totalAnalyses}
                            desc="AI-powered answer alignment analysis"
                        />
                        <FeatureCard
                            emoji="📚"
                            title="Smart PDF Companion"
                            count={totalSessions}
                            desc="Interactive study sessions with AI"
                        />
                        <FeatureCard
                            emoji="🗺️"
                            title="Learning Pathways"
                            count={totalPathways}
                            desc="Personalized study roadmaps"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-zinc-600 text-xs font-mono">
                    AQMD • Answer–Question Mismatch Detector • {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color, subtitle }: any) {
    const colors: any = {
        blue: "from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/20",
        purple: "from-purple-500/20 to-purple-600/5 text-purple-400 border-purple-500/20",
        green: "from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/20",
        orange: "from-orange-500/20 to-orange-600/5 text-orange-400 border-orange-500/20",
    };

    return (
        <div className={`bg-gradient-to-br ${colors[color]} border p-5 md:p-6 rounded-2xl backdrop-blur-sm transition-transform hover:scale-[1.02]`}>
            <div className={`mb-3 ${color === 'blue' ? 'text-blue-400' : color === 'purple' ? 'text-purple-400' : color === 'green' ? 'text-emerald-400' : 'text-orange-400'}`}>
                {icon}
            </div>
            <div className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-1">{title}</div>
            <div className="text-3xl md:text-4xl font-bold text-white">{value}</div>
            <div className="text-zinc-500 text-xs mt-1">{subtitle}</div>
        </div>
    );
}

function ProgressBar({ label, value, max, color }: any) {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    const colors: any = {
        purple: "bg-purple-500",
        green: "bg-emerald-500",
        orange: "bg-orange-500",
    };

    return (
        <div>
            <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-400">{label}</span>
                <span className="text-zinc-500">{value} ({percentage.toFixed(0)}%)</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                    className={`h-full ${colors[color]} rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

function FeatureCard({ emoji, title, count, desc }: any) {
    return (
        <div className="p-5 rounded-xl bg-zinc-800/30 border border-zinc-700/50 hover:border-zinc-600 transition-colors">
            <div className="text-3xl mb-3">{emoji}</div>
            <div className="font-semibold text-white mb-1">{title}</div>
            <div className="text-2xl font-bold text-blue-400 mb-2">{count}</div>
            <div className="text-zinc-500 text-xs">{desc}</div>
        </div>
    );
}
