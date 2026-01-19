"use client";

import { useState, useEffect } from "react";
import KnowledgeCard from "@/components/voting/KnowledgeCard";
import StatementCard from "@/components/voting/StatementCard";
import { saveVotingSession } from "@/lib/actions";
import { useSession } from "next-auth/react";

interface PartyStance {
    partyId: number;
    partyName: string;
    position: "EENS" | "ONEENS" | "GEEN";
    explanation: string;
    logoUrl?: string | null;
}

interface VotingItem {
    id: number;
    theme: string;
    statement: string;
    knowledge?: {
        id: number;
        question: string;
        options: string[];
        correctIndex: number;
    };
    partyStances: PartyStance[];
}

interface VotingFlowProps {
    items: VotingItem[];
}

interface VoteResult {
    statementId: number;
    theme: string;
    vote: "disagree" | "neutral" | "agree" | "skip" | "proxy";
    delegatedTo?: string;
    delegatedToPartyId?: number;
    knowledgeQuestionId?: number;
    knowledgeCorrect: boolean;
}

export default function VotingFlow({ items }: VotingFlowProps) {
    const { data: session } = useSession();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [phase, setPhase] = useState<"knowledge" | "statement">(items[0]?.knowledge ? "knowledge" : "statement");
    const [knowledgeCorrect, setKnowledgeCorrect] = useState(false);
    const [results, setResults] = useState<VoteResult[]>([]);
    const [isComplete, setIsComplete] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isComplete && session?.user?.id && results.length > 0) {
            handleSaveResults();
        }
    }, [isComplete]);

    const handleSaveResults = async () => {
        if (!session?.user?.id) return;
        setIsSaving(true);
        await saveVotingSession(session.user.id, results);
        setIsSaving(false);
    };

    const total = items.length;
    const currentItem = items[currentIndex];

    if (!currentItem) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 text-gray-500">
                Geen stellingen gevonden.
            </div>
        );
    }

    const handleKnowledgeAnswer = (selectedIndex: number) => {
        const isCorrect = selectedIndex === currentItem.knowledge?.correctIndex;
        setKnowledgeCorrect(isCorrect);
        setPhase("statement");
    };

    const moveToNext = () => {
        if (currentIndex < total - 1) {
            const nextItem = items[currentIndex + 1];
            setCurrentIndex(currentIndex + 1);
            setPhase(nextItem.knowledge ? "knowledge" : "statement");
            setKnowledgeCorrect(false);
        } else {
            setIsComplete(true);
        }
    };

    const handleVote = (vote: "disagree" | "neutral" | "agree") => {
        const result: VoteResult = {
            statementId: currentItem.id,
            theme: currentItem.theme,
            vote,
            knowledgeQuestionId: currentItem.knowledge?.id,
            knowledgeCorrect,
        };
        setResults([...results, result]);
        moveToNext();
    };

    const handleProxy = (partyId: number) => {
        const party = currentItem.partyStances.find((p) => p.partyId === partyId);
        const result: VoteResult = {
            statementId: currentItem.id,
            theme: currentItem.theme,
            vote: "proxy",
            delegatedTo: party?.partyName,
            delegatedToPartyId: partyId,
            knowledgeQuestionId: currentItem.knowledge?.id,
            knowledgeCorrect,
        };
        setResults([...results, result]);
        moveToNext();
    };

    const handleSkip = () => {
        const result: VoteResult = {
            statementId: currentItem.id,
            theme: currentItem.theme,
            vote: "skip",
            knowledgeQuestionId: currentItem.knowledge?.id,
            knowledgeCorrect,
        };
        setResults([...results, result]);
        moveToNext();
    };

    if (isComplete) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="card w-full max-w-2xl text-center">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        Bedankt voor je deelname!
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Je hebt {results.length} stellingen beantwoord.
                    </p>
                    {isSaving && (
                        <p className="text-sm text-blue-500 mb-4 animate-pulse">
                            Resultaten opslaan...
                        </p>
                    )}
                    <div className="text-left bg-gray-50 rounded-lg p-6">
                        <h3 className="font-bold mb-4 text-gray-700 uppercase text-xs tracking-wider">Mijn Resultaten:</h3>
                        <ul className="space-y-3">
                            {results.map((r, i) => (
                                <li key={i} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-gray-800">{r.theme}</span>
                                        <span className="text-xs text-gray-400">
                                            Kennisvraag: {r.knowledgeCorrect ? "✅ Correct" : "❌ Onjuist"}
                                        </span>
                                    </div>
                                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${r.vote === "proxy" ? "bg-blue-100 text-[var(--brand-blue)]" : "bg-gray-100 text-gray-600"
                                        }`}>
                                        {r.vote === "agree"
                                            ? "Eens"
                                            : r.vote === "disagree"
                                                ? "Oneens"
                                                : r.vote === "neutral"
                                                    ? "Geen mening"
                                                    : r.vote === "proxy"
                                                        ? `Gevolgd: ${r.delegatedTo}`
                                                        : "Overgeslagen"}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
            {phase === "knowledge" && currentItem.knowledge ? (
                <KnowledgeCard
                    theme={currentItem.theme}
                    counter={`Vraag ${currentIndex + 1} / ${total}`}
                    question={currentItem.knowledge.question}
                    options={currentItem.knowledge.options}
                    onAnswer={handleKnowledgeAnswer}
                />
            ) : (
                <StatementCard
                    theme={currentItem.theme}
                    counter={`Stelling ${currentIndex + 1} / ${total}`}
                    statement={currentItem.statement}
                    partyStances={currentItem.partyStances}
                    onVote={handleVote}
                    onProxy={handleProxy}
                    onSkip={handleSkip}
                />
            )}
        </div>
    );
}
