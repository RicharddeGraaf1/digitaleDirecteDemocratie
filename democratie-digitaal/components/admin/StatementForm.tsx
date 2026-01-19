"use client";

import { useState } from "react";
import { createStatement, updateStatement } from "@/lib/actions/statements";

interface StatementFormProps {
    initialData?: {
        id: number;
        theme: string;
        text: string;
        topicId: number;
    };
    topics: { id: number; name: string; icon: string }[];
    onClose: () => void;
}

export default function StatementForm({ initialData, topics, onClose }: StatementFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        theme: initialData?.theme || "",
        text: initialData?.text || "",
        topicId: initialData?.topicId || (topics[0]?.id || 0),
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (initialData) {
                await updateStatement(initialData.id, formData);
            } else {
                await createStatement(formData);
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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-lg font-bold text-gray-900">
                        {initialData ? "Stelling Bewerken" : "Nieuwe Stelling"}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Thema</label>
                        <input
                            type="text"
                            required
                            value={formData.theme}
                            onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--brand-blue)] outline-none transition-all"
                            placeholder="Bijv. Woningmarkt"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Onderwerp</label>
                        <div className="grid grid-cols-2 gap-2">
                            {topics.map(t => (
                                <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, topicId: t.id })}
                                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${formData.topicId === t.id
                                            ? 'bg-blue-50 border-[var(--brand-blue)] text-[var(--brand-blue)]'
                                            : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                                        }`}
                                >
                                    <span>{t.icon}</span>
                                    <span>{t.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Stelling Tekst</label>
                        <textarea
                            required
                            rows={4}
                            value={formData.text}
                            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--brand-blue)] outline-none transition-all resize-none"
                            placeholder="Beschrijf de stelling..."
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
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
                            {loading ? "Opslaan..." : "Bewaar Stelling"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
