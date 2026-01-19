"use client";

import { useState } from "react";

const initialParties = [
    { id: 1, name: "GroenLinks-PvdA", shortName: "GL-PvdA", stances: 30 },
    { id: 2, name: "VVD", shortName: "VVD", stances: 30 },
    { id: 3, name: "PVV", shortName: "PVV", stances: 28 },
    { id: 4, name: "NSC", shortName: "NSC", stances: 30 },
];

export default function AdminPartiesPage() {
    const [parties, setParties] = useState(initialParties);

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Partijen beheren</h1>
                <button className="btn-primary">
                    + Nieuwe partij
                </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium lowercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Naam</th>
                            <th className="px-6 py-4">Kort</th>
                            <th className="px-6 py-4">Ingevoerde standpunten</th>
                            <th className="px-6 py-4 text-right">Acties</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {parties.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                                <td className="px-6 py-4 text-gray-600">{p.shortName}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[var(--brand-blue)]"
                                                style={{ width: `${(p.stances / 30) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-400">{p.stances}/30</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-1 hover:text-[var(--brand-blue)]">
                                            <EditIcon />
                                        </button>
                                        <button className="p-1 hover:text-red-600">
                                            <DeleteIcon />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
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

function DeleteIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
        </svg>
    );
}
