"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                body: JSON.stringify({ password }),
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
                router.push("/admin/stats");
            } else {
                setError("Invalid password");
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
            <div className="max-w-md w-full bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl backdrop-blur-xl">
                <h1 className="text-2xl font-bold mb-6 text-center">Admin Access</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Admin Password"
                        className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-xl font-medium transition-all"
                    >
                        {loading ? "Authenticating..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}
