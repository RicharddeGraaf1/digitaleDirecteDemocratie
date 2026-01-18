"use client";

interface StatementCardProps {
    theme: string;
    counter: string;
    statement: string;
    onVote: (vote: "disagree" | "neutral" | "agree") => void;
    onSkip: () => void;
}

export default function StatementCard({
    theme,
    counter,
    statement,
    onVote,
    onSkip,
}: StatementCardProps) {
    return (
        <div className="card w-full max-w-2xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 text-sm">
                <span className="text-gray-600">
                    Thema: <span className="font-semibold text-gray-900">{theme}</span>
                </span>
                <span className="text-gray-400">{counter}</span>
            </div>

            {/* Statement */}
            <p className="text-2xl font-medium text-gray-900 leading-relaxed mb-8 text-center">
                {statement}
            </p>

            {/* Vote Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
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

            {/* Skip / Proxy Link */}
            <div className="text-center">
                <button
                    onClick={onSkip}
                    className="text-[var(--brand-blue)] hover:underline text-sm inline-flex items-center gap-1"
                >
                    Ik weet het niet
                    <ArrowRightIcon />
                </button>
            </div>
        </div>
    );
}

// Icons
function ThumbDownIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" />
            <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
        </svg>
    );
}

function MinusIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    );
}

function ThumbUpIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
            <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
        </svg>
    );
}

function ArrowRightIcon() {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
        </svg>
    );
}
