"use client";

import { useState } from "react";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteStatement } from "@/lib/actions/statements";
import StatementForm from "@/components/admin/StatementForm";

interface StatementsTableProps {
    statements: any[];
    topics: any[];
}

export default function StatementsTable({ statements, topics }: StatementsTableProps) {
    const [editingStatement, setEditingStatement] = useState<any | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex justify-end gap-3 -mt-16">
                <button
                    onClick={() => setIsAdding(true)}
                    className="btn-primary"
                >
                    + Nieuwe Stelling
                </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm mt-8">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Thema</th>
                            <th className="px-6 py-4">Stelling</th>
                            <th className="px-6 py-4">Onderwerp</th>
                            <th className="px-6 py-4">Vragen</th>
                            <th className="px-6 py-4 text-right">Acties</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {statements.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">
                                    Geen stellingen gevonden voor dit filter.
                                </td>
                            </tr>
                        )}
                        {statements.map((s: any) => (
                            <tr key={s.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4 font-mono text-xs text-gray-400">#{s.id}</td>
                                <td className="px-6 py-4 font-bold text-gray-700">{s.theme}</td>
                                <td className="px-6 py-4 text-gray-600 truncate max-w-xs">{s.text}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-[var(--brand-blue)] font-bold text-[10px] uppercase border border-blue-100">
                                        {s.topic?.icon} {s.topic?.name || 'Vrij'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5">
                                        <span className={`w-2 h-2 rounded-full ${s.knowledgeQuestions.length > 0 ? 'bg-green-500' : 'bg-amber-400 animate-pulse'}`} />
                                        <span className="font-bold text-gray-500">{s.knowledgeQuestions.length}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => setEditingStatement(s)}
                                            title="Bewerken"
                                            className="p-2 hover:bg-blue-50 text-gray-400 hover:text-[var(--brand-blue)] rounded-lg transition-colors"
                                        >
                                            <EditIcon />
                                        </button>
                                        <DeleteButton id={s.id} onDelete={deleteStatement} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isAdding && (
                <StatementForm
                    topics={topics}
                    onClose={() => setIsAdding(false)}
                />
            )}

            {editingStatement && (
                <StatementForm
                    initialData={editingStatement}
                    topics={topics}
                    onClose={() => setEditingStatement(null)}
                />
            )}
        </div>
    );
}

function EditIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    );
}
