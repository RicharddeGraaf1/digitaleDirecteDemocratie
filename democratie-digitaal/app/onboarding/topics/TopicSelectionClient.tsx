"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { saveTopicPreferences } from "@/lib/actions";

interface Topic {
    id: number;
    name: string;
    icon: string | null;
}

interface TopicSelectionClientProps {
    topics: Topic[];
    initialSelectedIds: number[];
}

export default function TopicSelectionClient({ topics, initialSelectedIds }: TopicSelectionClientProps) {
    const [selectedIds, setSelectedIds] = useState<number[]>(initialSelectedIds);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();

    const toggleTopic = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const selectAll = () => setSelectedIds(topics.map((t) => t.id));
    const selectNone = () => setSelectedIds([]);

    const handleProceed = async () => {
        if (!session?.user?.id) {
            // If not logged in, just proceed (fallback)
            router.push("/");
            return;
        }

        setIsSaving(true);
        const result = await saveTopicPreferences(session.user.id, selectedIds);
        setIsSaving(false);

        if (result.success) {
            router.push("/");
        } else {
            alert("Er is iets misgegaan bij het opslaan van je voorkeuren.");
        }
    };

    return (
        <div className="card w-full max-w-3xl">
            <h1 className="text-2xl font-semibold mb-4 text-center">
                Over welke onderwerpen wil je je mening geven?
            </h1>

            <p className="text-gray-600 text-center mb-8">
                We hebben standaard alles aangevinkt. Deselecteer de onderwerpen die je wilt overslaan.
            </p>

            <div className="flex justify-center gap-4 mb-8 text-sm font-medium">
                <button onClick={selectAll} className="text-[var(--brand-blue)] hover:underline">
                    Alles selecteren
                </button>
                <span className="text-gray-300">|</span>
                <button onClick={selectNone} className="text-[var(--brand-blue)] hover:underline">
                    Niets selecteren
                </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                {topics.map((topic) => (
                    <button
                        key={topic.id}
                        onClick={() => toggleTopic(topic.id)}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 group ${selectedIds.includes(topic.id)
                            ? "border-[var(--brand-blue)] bg-[#f0f7ff]"
                            : "border-gray-100 hover:border-gray-200"
                            }`}
                    >
                        <span className="text-2xl">{topic.icon || "📁"}</span>
                        <span className={`text-sm font-medium ${selectedIds.includes(topic.id) ? "text-[var(--brand-blue)]" : "text-gray-600"
                            }`}>
                            {topic.name}
                        </span>
                        <div className={`mt-auto w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedIds.includes(topic.id)
                            ? "bg-[var(--brand-blue)] border-[var(--brand-blue)]"
                            : "border-gray-200"
                            }`}>
                            {selectedIds.includes(topic.id) && (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            )}
                        </div>
                    </button>
                ))}
            </div>

            <button
                onClick={handleProceed}
                disabled={selectedIds.length === 0 || isSaving}
                className="btn-primary w-full max-w-xs mx-auto block disabled:opacity-50"
            >
                {isSaving ? "Laden..." : "Verder naar stellingen"}
            </button>
        </div>
    );
}
