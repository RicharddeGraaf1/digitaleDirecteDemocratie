"use client";

import { useState } from "react";

const initialTopics = [
    { id: 1, name: "Economie", icon: "💰", description: "Balanzen, belastingen en begrotingen." },
    { id: 2, name: "Klimaat", icon: "🌱", description: "Energietransitie en milieu." },
    { id: 3, name: "Zorg", icon: "🏥", description: "Gezondheidszorg en welzijn." },
];

export default function AdminTopicsPage() {
    const [topics, setTopics] = useState(initialTopics);

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Onderwerpen beheren</h1>
                <button className="btn-primary">
                    + Nieuw onderwerp
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {topics.map((topic) => (
                    <div key={topic.id} className="card p-6 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <span className="text-4xl">{topic.icon}</span>
                            <div className="flex gap-2">
                                <button className="p-1 text-gray-400 hover:text-[var(--brand-blue)]">
                                    <EditIcon />
                                </button>
                                <button className="p-1 text-gray-400 hover:text-red-600">
                                    <DeleteIcon />
                                </button>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{topic.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">{topic.description}</p>
                        </div>
                        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                            <span>8 stellingen</span>
                            <span>12 vragen</span>
                        </div>
                    </div>
                ))}
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
