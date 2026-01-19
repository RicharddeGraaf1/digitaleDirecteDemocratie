"use client";

import { useState } from "react";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteQuestion } from "@/lib/actions/questions";
import QuestionForm from "@/components/admin/QuestionForm";

interface QuestionsTableProps {
    questions: any[];
    statements: any[];
}

export default function QuestionsTable({ questions, statements }: QuestionsTableProps) {
    const [editingQuestion, setEditingQuestion] = useState<any | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex justify-end gap-3 -mt-16">
                <button
                    onClick={() => setIsAdding(true)}
                    className="btn-primary"
                >
                    + Nieuwe Vraag
                </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm mt-8">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                        <tr>
                            <th className="px-6 py-4">Vraag</th>
                            <th className="px-6 py-4">Gekoppeld aan</th>
                            <th className="px-6 py-4 text-center">Correcte Optie</th>
                            <th className="px-6 py-4 text-center">Ingevuld</th>
                            <th className="px-6 py-4 text-right">Acties</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {questions.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                                    Geen vragen gevonden voor dit filter.
                                </td>
                            </tr>
                        )}
                        {questions.map((q: any) => (
                            <tr key={q.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-700 leading-tight">{q.questionText}</div>
                                    <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-2">
                                        <span className="uppercase font-black text-purple-600/50 tracking-tighter">Options:</span>
                                        {(q.options as string[]).map((opt, i) => (
                                            <span key={i} className={i === q.correctOptionIndex ? "text-green-600 font-bold" : ""}>
                                                {opt}{i < (q.options as string[]).length - 1 ? " • " : ""}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-xs font-semibold text-gray-500 line-clamp-1">{q.statement?.text}</div>
                                    <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded bg-blue-50 text-[var(--brand-blue)] font-bold text-[9px] uppercase border border-blue-100">
                                        {q.statement?.topic?.icon} {q.statement?.topic?.name}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="w-6 h-6 inline-flex items-center justify-center rounded-full bg-green-50 text-green-600 font-black text-xs border border-green-200 shadow-sm">
                                        {q.correctOptionIndex + 1}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="font-bold text-gray-400">{q.results.length}×</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => setEditingQuestion(q)}
                                            title="Bewerken"
                                            className="p-2 hover:bg-blue-50 text-gray-400 hover:text-[var(--brand-blue)] rounded-lg transition-colors"
                                        >
                                            <EditIcon />
                                        </button>
                                        <DeleteButton id={q.id} onDelete={deleteQuestion} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isAdding && (
                <QuestionForm
                    statements={statements}
                    onClose={() => setIsAdding(false)}
                />
            )}

            {editingQuestion && (
                <QuestionForm
                    initialData={editingQuestion}
                    statements={statements}
                    onClose={() => setEditingQuestion(null)}
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
