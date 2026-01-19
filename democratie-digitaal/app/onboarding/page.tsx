"use client";

import Link from "next/link";

export default function OnboardingPage() {
    return (
        <div className="min-h-[calc(100-72px)] flex items-center justify-center p-6 text-center">
            <div className="card w-full max-w-2xl">
                <div className="mb-8 flex justify-center">
                    <svg
                        width="64"
                        height="64"
                        viewBox="0 0 40 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle cx="20" cy="20" r="18" stroke="#1a5fb4" strokeWidth="2" />
                        <path
                            d="M12 12h5c4 0 7 3 7 8s-3 8-7 8h-5V12z"
                            stroke="#1a5fb4"
                            strokeWidth="2"
                            fill="none"
                        />
                        <path
                            d="M22 12h5c4 0 7 3 7 8s-3 8-7 8h-5"
                            stroke="#1a5fb4"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>

                <h1 className="text-3xl font-semibold mb-4">
                    Welkom bij Democratie Digitaal
                </h1>

                <p className="text-lg text-gray-600 mb-10 max-w-lg mx-auto leading-relaxed">
                    Ontdek wat je écht vindt van politieke stellingen en test
                    tegelijkertijd je kennis. Voor elk onderwerp krijg je eerst
                    een vraag om te bepalen hoeveel je al weet.
                </p>

                <Link href="/onboarding/topics" className="btn-primary inline-flex items-center gap-2 text-lg px-8">
                    Start met het geven van je mening
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                    </svg>
                </Link>

                <p className="mt-8 text-sm text-gray-400">
                    Je kunt op elk moment stoppen en later verdergaan.
                </p>
            </div>
        </div>
    );
}
