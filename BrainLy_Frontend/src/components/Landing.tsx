import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
    return (
        <section className="min-h-screen bg-linear-to-br from-[#0b0913] via-[#120f20] to-[#08070d] text-white">
            {/* Navbar */}
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
                <h1 className="text-2xl font-bold tracking-wide text-violet-400">
                    BrainLy
                </h1>

                <div className="flex items-center gap-4">
                    <Link
                        to="/signin"
                        className="rounded-lg border border-violet-700 px-5 py-2 transition hover:border-violet-500 hover:bg-violet-500/10"
                    >
                        Login
                    </Link>

                    <Link
                        to="/signup"
                        className="rounded-lg bg-violet-600 px-5 py-2 font-medium transition hover:bg-violet-500"
                    >
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <div className="mx-auto flex min-h-[80vh] max-w-7xl items-center px-6">
                <div className="max-w-3xl">
                    <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
                        🚀 Your Second Brain
                    </span>

                    <h1 className="mt-8 text-6xl font-extrabold leading-tight">
                        Save.
                        <span className="text-violet-500"> Organize.</span>
                        <br />
                        Never Lose an Idea Again.
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">
                        BrainLy helps you collect links, notes, YouTube videos,
                        tweets, documents, and ideas in one beautiful,
                        searchable workspace. Your knowledge, always within
                        reach.
                    </p>

                    <div className="mt-10 flex flex-wrap gap-4">
                        <Link
                            to="/signup"
                            className="rounded-xl bg-violet-600 px-8 py-4 font-semibold transition hover:bg-violet-500"
                        >
                            Start Free
                        </Link>

                        <Link
                            to="/signin"
                            className="rounded-xl border border-violet-700 px-8 py-4 transition hover:border-violet-500 hover:bg-violet-500/10"
                        >
                            Login
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="mt-14 flex flex-wrap gap-10">
                        <div>
                            <h2 className="text-3xl font-bold text-violet-400">
                                10K+
                            </h2>
                            <p className="text-gray-400">
                                Resources Saved
                            </p>
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold text-violet-400">
                                Fast
                            </h2>
                            <p className="text-gray-400">
                                Global Search
                            </p>
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold text-violet-400">
                                Secure
                            </h2>
                            <p className="text-gray-400">
                                Private Workspace
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Card */}
                <RightPanel />
            </div>
        </section>
    );
};



import { useEffect, useState } from "react";

const cards = [
    "📺 React Authentication Tutorial",
    "📄 Database Design Notes",
    "💡 SaaS Startup Ideas",
    "🔖 AI & Machine Learning Resources",
    "🔍 Search anything instantly...",
];

function RightPanel() {
    const [active, setActive] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActive((prev) => (prev + 1) % cards.length);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="hidden flex-1 justify-end lg:flex">
            <div className="w-[420px] rounded-3xl border border-violet-700/30 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
                <div className="mb-6 flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-red-400"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                    <div className="h-3 w-3 rounded-full bg-green-400"></div>
                </div>

                <div className="space-y-4">
                    {cards.map((card, index) => (
                        <div key={index}
                            className={`rounded-xl p-4 transition-all duration-700 ease-in-out 
                                ${active === index
                                    ? "bg-violet-600 text-white font-semibold scale-105 -translate-y-1 opacity-100 shadow-xl"
                                    : "bg-white/5 text-gray-400 scale-100 translate-y-0 opacity-90"
                                }
                            `}>
                            {card}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Landing;