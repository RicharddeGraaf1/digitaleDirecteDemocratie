"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";

export default function Header() {
    const { data: session, status } = useSession();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header className="bg-white border-b border-gray-100 px-6 py-4 shadow-sm relative z-50">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 active:scale-95 transition-transform">
                    {/* DD Logo */}
                    <svg
                        width="36"
                        height="36"
                        viewBox="0 0 40 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle cx="20" cy="20" r="18" stroke="#1a5fb4" strokeWidth="3" />
                        <path
                            d="M12 12h5c4 0 7 3 7 8s-3 8-7 8h-5V12z"
                            stroke="#1a5fb4"
                            strokeWidth="2.5"
                            fill="none"
                        />
                        <path
                            d="M22 12h5c4 0 7 3 7 8s-3 8-7 8h-5"
                            stroke="#1a5fb4"
                            strokeWidth="2.5"
                            fill="none"
                            strokeLinecap="round"
                        />
                    </svg>
                    <span className="text-xl font-black text-gray-900 tracking-tighter">
                        Democratie{" "}
                        <span className="text-[var(--brand-blue)]">Digitaal</span>
                    </span>
                </Link>

                <nav className="flex items-center gap-2 sm:gap-6">
                    <div className="hidden sm:flex items-center gap-6 text-sm font-bold text-gray-500 mr-4">
                        <Link href="/over" className="hover:text-gray-900 transition-colors">Over ons</Link>
                        <Link href="/actueel" className="hover:text-gray-900 transition-colors">Actueel</Link>
                    </div>

                    {!mounted ? (
                        <div className="w-8 h-8" /> // Invisible placeholder to prevent layout shift
                    ) : status === "loading" ? (
                        <div className="w-8 h-8 rounded-full border-2 border-gray-100 border-t-blue-500 animate-spin" />
                    ) : session ? (
                        <div className="flex items-center gap-3">
                            {session.user.role === "ADMIN" && (
                                <Link
                                    href="/admin"
                                    className="hidden md:inline-flex px-3 py-1.5 rounded-lg bg-purple-50 text-purple-600 text-[10px] font-black uppercase tracking-widest border border-purple-100 hover:bg-purple-100 transition-colors"
                                >
                                    Admin
                                </Link>
                            )}
                            <Link
                                href="/dashboard"
                                className="px-4 py-2 rounded-xl bg-gray-50 text-gray-900 text-xs font-black border border-gray-100 hover:border-blue-200 transition-all active:scale-95"
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                title="Uitloggen"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="bg-[var(--brand-blue)] text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all"
                        >
                            Inloggen
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}
