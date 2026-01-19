"use client";

import { useState } from "react";
import { createQuestion, updateQuestion } from "@/lib/actions/questions";

interface QuestionFormProps {
    initialData?: {
        id: number;
        questionText: string;
        options: string[];
        correctOptionIndex: number;
        statementId: number;
    };
    statements: { id: number; text: string }[];
    onClose: () => void;
}

export default function QuestionForm({ initialData, statements, onClose }: QuestionFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        questionText: initialData?.questionText || "",
        options: initialData?.options || ["", "", "", ""],
        correctOptionIndex: initialData?.correctOptionIndex || 0,
        statementId: initialData?.statementId || (statements[0]?.id || 0),
    });

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData({ ...formData, options: newOptions });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (initialData) {
                await updateQuestion(initialData.id, {
                    questionText: formData.questionText,
                    options: formData.options,
                    correctOptionIndex: formData.correctOptionIndex,
                });
            } else {
                await createQuestion(formData);
            }
            onClose();
        } catch (error) {
            alert("Er is iets misgegaan bij het opslaan.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-lg font-bold text-gray-900">
                        {initialData ? "Kennisvraag Bewerken" : "Nieuwe Kennisvraag"}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                    {!initialData && (
                        <div>
                            <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Koppelen aan stelling</label>
                            <select
                                required
                                value={formData.statementId}
                                onChange={(e) => setFormData({ ...formData, statementId: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--brand-blue)] outline-none"
                            >
                                <option value="">Kies een stelling...</option>
                                {statements.map(s => (
                                    <option key={s.id} value={s.id}>{s.text.substring(0, 70)}...</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">De Vraag</label>
                        <textarea
                            required
                            rows={3}
                            value={formData.questionText}
                            onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--brand-blue)] outline-none resize-none"
                            placeholder="Bijv. Wat is de maximale hypotheekrenteaftrek?"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3">Antwoordopties</label>
                        <div className="space-y-3">
                            {formData.options.map((opt, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, correctOptionIndex: i })}
                                        className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full border-2 transition-all ${formData.correctOptionIndex === i
                                                ? 'bg-green-500 border-green-500 text-white shadow-lg'
                                                : 'bg-white border-gray-200 text-gray-300 hover:border-gray-300'
                                            }`}
                                    >
                                        {formData.correctOptionIndex === i ? '✓' : i + 1}
                                    </button>
                                    <input
                                        type="text"
                                        required
                                        value={opt}
                                        onChange={(e) => handleOptionChange(i, e.target.value)}
                                        className={`flex-1 px-4 py-2 border rounded-xl outline-none transition-all ${formData.correctOptionIndex === i
                                                ? 'border-green-200 bg-green-50/30'
                                                : 'border-gray-200 focus:border-gray-300'
                                            }`}
                                        placeholder={`Optie ${i + 1}`}
                                    />
                                </div>
                            ))}
                        </div>
                        <p className="mt-3 text-[10px] text-gray-400 italic">Klik op het nummer om het juiste antwoord te markeren.</p>
                    </div>

                    <div className="pt-4 flex gap-3 sticky bottom-0 bg-white">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                            Annuleren
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-3 bg-[var(--brand-blue)] text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:shadow-xl active:scale-95 transition-all disabled:opacity-50"
                        >
                            {loading ? "Opslaan..." : "Bewaar Vraag"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
