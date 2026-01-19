"use client";

import { useState } from "react";
import { generateAIQuestions } from "@/lib/actions/ai-questions";

interface SmartFillButtonProps {
    statements: { id: number; text: string }[];
}

export default function SmartFillButton({ statements }: SmartFillButtonProps) {
    const [loading, setLoading] = useState(false);
    const [selectedStatementId, setSelectedStatementId] = useState<number | "">("");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [saving, setSaving] = useState<number | null>(null);

    const handleGenerate = async () => {
        if (!selectedStatementId || typeof selectedStatementId === "string") return;

        const statement = statements.find(s => s.id === selectedStatementId);
        if (!statement) return;

        setLoading(true);
        setError(null);
        setSuggestions([]);
        try {
            const result = await generateAIQuestions(statement.text);
            setSuggestions(result);
        } catch (err: any) {
            setError(err.message || "Er is iets misgegaan bij het genereren. Controleer je GOOGLE_AI_API_KEY.");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSuggestion = async (question: any, index: number) => {
        if (!selectedStatementId || typeof selectedStatementId === "string") return;

        setSaving(index);
        try {
            const { saveAIQuestions } = await import("@/lib/actions/ai-questions");
            await saveAIQuestions(selectedStatementId, [question]);

            // Remove from suggestions list on success
            setSuggestions(prev => prev.filter((_, i) => i !== index));
            alert("Vraag succesvol toegevoegd!");
        } catch (err: any) {
            alert("Fout bij opslaan: " + err.message);
        } finally {
            setSaving(null);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-2">
                <select
                    value={selectedStatementId as string}
                    onChange={(e) => setSelectedStatementId(parseInt(e.target.value))}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--brand-blue)] outline-none"
                >
                    <option value="">Selecteer een stelling om vragen voor te genereren...</option>
                    {statements.map(s => (
                        <option key={s.id} value={s.id}>{s.text.substring(0, 80)}...</option>
                    ))}
                </select>
                <button
                    onClick={handleGenerate}
                    disabled={loading || !selectedStatementId}
                    className={`px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${loading || !selectedStatementId
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md hover:shadow-lg active:scale-95'
                        }`}
                >
                    {loading ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : '✨ Smart Fill'}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg border border-red-100 flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                    {error}
                </div>
            )}

            {suggestions.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    {suggestions.map((s, i) => (
                        <div key={i} className="bg-white border border-purple-100 p-4 rounded-xl shadow-sm hover:border-purple-300 transition-colors flex flex-col justify-between">
                            <div>
                                <p className="font-bold text-gray-800 text-sm mb-3 leading-snug">{s.questionText}</p>
                                <div className="space-y-1">
                                    {s.options.map((opt: string, optIdx: number) => (
                                        <div
                                            key={optIdx}
                                            className={`text-[10px] p-2 rounded border ${optIdx === s.correctOptionIndex
                                                ? 'bg-green-50 border-green-200 text-green-700 font-bold'
                                                : 'bg-gray-50 border-gray-100 text-gray-500'
                                                }`}
                                        >
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={() => handleSaveSuggestion(s, i)}
                                disabled={saving !== null}
                                className={`mt-4 w-full py-2 text-[10px] font-black uppercase rounded transition-all flex items-center justify-center gap-2 ${saving === i
                                        ? 'bg-gray-100 text-gray-400'
                                        : 'text-[var(--brand-blue)] border border-blue-100 hover:bg-blue-50'
                                    }`}
                            >
                                {saving === i ? <span className="w-3 h-3 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" /> : "Toevoegen aan database"}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
