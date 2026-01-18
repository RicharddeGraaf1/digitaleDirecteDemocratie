import Link from "next/link";

export default function Header() {
    return (
        <header className="bg-white border-b border-gray-100 px-6 py-4">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                    {/* DD Logo */}
                    <svg
                        width="40"
                        height="40"
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
                    <span className="text-xl font-semibold text-gray-900">
                        Democratie{" "}
                        <span className="text-[var(--brand-blue)]">Digitaal</span>
                    </span>
                </Link>
                <nav className="hidden sm:flex items-center gap-6 text-sm text-gray-600">
                    <Link href="/over" className="hover:text-gray-900">
                        Over ons
                    </Link>
                    <Link href="/actueel" className="hover:text-gray-900">
                        Actueel
                    </Link>
                </nav>
            </div>
        </header>
    );
}
