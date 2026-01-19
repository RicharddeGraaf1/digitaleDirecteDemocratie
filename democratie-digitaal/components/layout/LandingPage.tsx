"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LandingPage() {
    const [activeTab, setActiveTab] = useState<"start" | "why">("start");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        const result = await signIn("credentials", {
            email,
            password,
            callbackUrl: "/onboarding",
        });
        if (result?.error) {
            setError("Ongeldige inloggegevens");
        }
    };

    return (
        <div className="min-h-[calc(100vh-72px)] bg-gray-50 flex items-center justify-center p-6">
            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Left side: Hero Text */}
                <div className="space-y-6">
                    <h1 className="text-5xl font-black text-gray-900 leading-tight tracking-tighter">
                        Geef je mening, <br />
                        <span className="text-[var(--brand-blue)]">test je kennis.</span>
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        Democratie Digitaal combineert een klassieke stemhulp
                        met slimme kennistoetsing. Ontdek hoe goed je de thema's echt kent.
                    </p>
                    <div className="flex gap-4 pt-4">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200" />
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 font-medium flex items-center">
                            Sluit je aan bij vragende burgers
                        </p>
                    </div>
                </div>

                {/* Right side: Tabs & Content */}
                <div className="card shadow-2xl p-0 overflow-hidden bg-white border-none">
                    <div className="flex border-b border-gray-100">
                        <button
                            onClick={() => setActiveTab("start")}
                            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-all ${activeTab === "start"
                                    ? "text-[var(--brand-blue)] border-b-2 border-[var(--brand-blue)]"
                                    : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            Direct starten
                        </button>
                        <button
                            onClick={() => setActiveTab("why")}
                            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-all ${activeTab === "why"
                                    ? "text-[var(--brand-blue)] border-b-2 border-[var(--brand-blue)]"
                                    : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            Waarom DD?
                        </button>
                    </div>

                    <div className="p-8">
                        {activeTab === "start" ? (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                <form onSubmit={handleLogin} className="space-y-4">
                                    {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">E-mail</label>
                                        <input
                                            type="text"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                            placeholder="burger / admin"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Wachtwoord</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <button type="submit" className="btn-primary w-full py-4 text-lg">
                                        Inloggen & Starten
                                    </button>
                                </form>
                                <div className="relative flex items-center gap-4 py-2">
                                    <div className="flex-1 border-t border-gray-100" />
                                    <span className="text-xs text-gray-300 font-bold uppercase">of</span>
                                    <div className="flex-1 border-t border-gray-100" />
                                </div>
                                <Link
                                    href="/voting"
                                    className="block text-center text-sm font-bold text-gray-500 hover:text-[var(--brand-blue)] transition-colors"
                                >
                                    Doorgaan als gast &rarr;
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-in fade-in duration-500">
                                <div className="space-y-4 text-gray-600 leading-relaxed">
                                    <p>
                                        In een tijd van snelle meningen en polarisatie geloven wij in
                                        <span className="font-bold text-gray-900"> geïnformeerde keuzes</span>.
                                    </p>
                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                        <p className="text-sm text-blue-700 italic">
                                            "Weten waar je over praat, maakt je stem krachtiger."
                                        </p>
                                    </div>
                                    <p className="text-sm">
                                        *Uitleg komt hier te staan zodra deze beschikbaar is.*
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
