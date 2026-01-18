"use client";

import { useState } from "react";

interface KnowledgeCardProps {
    theme: string;
    counter: string;
    question: string;
    options: string[];
    onAnswer: (selectedIndex: number) => void;
}

export default function KnowledgeCard({
    theme,
    counter,
    question,
    options,
    onAnswer,
}: KnowledgeCardProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const handleSubmit = () => {
        if (selectedIndex !== null) {
            onAnswer(selectedIndex);
        }
    };

    return (
        <div className="card w-full max-w-2xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 text-sm">
                <span className="text-[var(--brand-blue)] font-semibold">
                    Kennisvraag: {theme}
                </span>
                <span className="text-gray-400">{counter}</span>
            </div>

            {/* Question */}
            <p className="text-xl font-medium text-gray-900 leading-relaxed mb-6">
                {question}
            </p>

            {/* Options */}
            <div className="flex flex-col gap-3 mb-6">
                {options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedIndex(index)}
                        className={`radio-option ${selectedIndex === index ? "radio-option--selected" : ""
                            }`}
                    >
                        <span
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedIndex === index
                                    ? "border-[var(--brand-blue)] bg-[var(--brand-blue)]"
                                    : "border-gray-300"
                                }`}
                        >
                            {selectedIndex === index && (
                                <span className="w-2 h-2 rounded-full bg-white" />
                            )}
                        </span>
                        <span className="text-gray-800">{option}</span>
                    </button>
                ))}
            </div>

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                disabled={selectedIndex === null}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Bevestig antwoord
            </button>
        </div>
    );
}
