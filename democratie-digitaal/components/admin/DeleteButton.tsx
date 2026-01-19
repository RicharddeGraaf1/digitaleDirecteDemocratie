"use client";

import { useState } from "react";

interface DeleteButtonProps {
    id: number;
    onDelete: (id: number) => Promise<{ success: boolean; error?: string }>;
    className?: string;
}

export default function DeleteButton({ id, onDelete, className }: DeleteButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        if (!confirm("Weet je zeker dat je dit item wilt verwijderen?")) return;

        setLoading(true);
        try {
            const result = await onDelete(id);
            if (!result.success) {
                alert(result.error || "Verwijderen mislukt.");
            }
        } catch (error) {
            alert("Er is een onverwachte fout opgetreden.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className={`p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
            title="Verwijderen"
        >
            {loading ? (
                <span className="w-4 h-4 border-2 border-red-200 border-t-red-600 rounded-full animate-spin" />
            ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
                </svg>
            )}
        </button>
    );
}
