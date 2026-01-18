"use client";

import { useState, useMemo } from "react";

interface PartyStance {
    partyId: number;
    partyName: string;
    position: "EENS" | "ONEENS" | "GEEN";
    explanation: string;
    logoUrl?: string | null;
}

interface StatementCardProps {
    theme: string;
    counter: string;
    statement: string;
    partyStances: PartyStance[];
    onVote: (vote: "disagree" | "neutral" | "agree") => void;
    onProxy: (partyId: number) => void;
    onSkip: () => void;
}

export default function StatementCard({
    theme,
    counter,
    statement,
    partyStances,
    onVote,
    onProxy,
    onSkip,
}: StatementCardProps) {
    const [showOpinions, setShowOpinions] = useState(false);

    const groupedStances = useMemo(() => {
        return {
            EENS: partyStances.filter((s) => s.position === "EENS"),
            ONEENS: partyStances.filter((s) => s.position === "ONEENS"),
            GEEN: partyStances.filter((s) => s.position === "GEEN"),
        };
    }, [partyStances]);

    return (
        <div className="card w-full max-w-4xl transition-all duration-300">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 text-sm px-4">
                <span className="text-gray-600">
                    Thema: <span className="font-semibold text-gray-900">{theme}</span>
                </span>
                <span className="text-gray-400">{counter}</span>
            </div>

            {/* Statement */}
            <p className="text-2xl font-medium text-gray-900 leading-relaxed mb-8 text-center px-6">
                {statement}
            </p>

            {/* Vote Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10 px-6">
                <button
                    className="vote-btn vote-btn--disagree"
                    onClick={() => onVote("disagree")}
                >
                    <ThumbDownIcon />
                    Oneens
                </button>
                <button
                    className="vote-btn vote-btn--neutral"
                    onClick={() => onVote("neutral")}
                >
                    <MinusIcon />
                    Geen mening
                </button>
                <button
                    className="vote-btn vote-btn--agree"
                    onClick={() => onVote("agree")}
                >
                    <ThumbUpIcon />
                    Eens
                </button>
            </div>

            {/* Accordion Trigger */}
            <div className="border-t border-gray-100 pt-6 px-6">
                <button
                    onClick={() => setShowOpinions(!showOpinions)}
                    className="w-full flex items-center justify-between text-gray-600 hover:text-gray-900 transition-colors py-2 group"
                >
                    <span className="text-sm font-semibold uppercase tracking-wider">Wat vinden de partijen?</span>
                    <div className={`transition-transform duration-300 ${showOpinions ? "rotate-180" : ""}`}>
                        <ChevronDownIcon />
                    </div>
                </button>

                {/* Accordion Content */}
                {showOpinions && (
                    <div className="mt-6 space-y-8 animate-in fade-in slide-in-from-top-4 duration-300 pb-6">
                        {/* Side-by-Side Grid for Eens and Oneens */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <StanceGroup
                                title="Eens"
                                stances={groupedStances.EENS}
                                colorClass="text-green-600 bg-green-50 border-green-100"
                                onProxy={onProxy}
                            />
                            <StanceGroup
                                title="Oneens"
                                stances={groupedStances.ONEENS}
                                colorClass="text-red-600 bg-red-50 border-red-100"
                                onProxy={onProxy}
                            />
                        </div>

                        {/* Separate section for No Opinion if it exists */}
                        {groupedStances.GEEN.length > 0 && (
                            <div className="border-t border-gray-50 pt-8">
                                <StanceGroup
                                    title="Geen mening"
                                    stances={groupedStances.GEEN}
                                    colorClass="text-gray-600 bg-gray-50 border-gray-100"
                                    onProxy={onProxy}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Skip Link */}
            <div className="text-center mt-6 pt-6 border-t border-gray-50">
                <button
                    onClick={onSkip}
                    className="text-[var(--brand-blue)] hover:underline text-sm inline-flex items-center gap-1"
                >
                    Ik weet het niet / Volgende stelling
                    <ArrowRightIcon />
                </button>
            </div>
        </div>
    );
}

function StanceGroup({ title, stances, colorClass, onProxy }: {
    title: string;
    stances: PartyStance[];
    colorClass: string;
    onProxy: (id: number) => void;
}) {
    if (stances.length === 0) return null;

    return (
        <div className="space-y-4">
            <h4 className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-md border inline-block ${colorClass}`}>
                {title}
            </h4>
            <div className="space-y-3">
                {stances.map((stance) => (
                    <div key={stance.partyId} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:border-gray-200 transition-all">
                        <div className="flex justify-between items-start gap-3 mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                                    {stance.logoUrl ? (
                                        <img src={stance.logoUrl} alt={stance.partyName} className="w-full h-full object-contain" />
                                    ) : (
                                        <span className="text-[var(--brand-blue)] font-bold text-xs uppercase">
                                            {stance.partyName.substring(0, 2)}
                                        </span>
                                    )}
                                </div>
                                <span className="font-bold text-gray-900 text-sm">{stance.partyName}</span>
                            </div>
                            <button
                                onClick={() => onProxy(stance.partyId)}
                                className="text-[10px] font-bold text-[var(--brand-blue)] border border-blue-200 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap"
                            >
                                Volg
                            </button>
                        </div>
                        <p className="text-gray-600 text-xs leading-relaxed italic border-l-2 border-gray-100 pl-3 ml-1">
                            "{stance.explanation}"
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Icons
function ThumbDownIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" />
            <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
        </svg>
    );
}

function MinusIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    );
}

function ThumbUpIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
            <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
        </svg>
    );
}

function ArrowRightIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}

function ChevronDownIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
        </svg>
    );
}
