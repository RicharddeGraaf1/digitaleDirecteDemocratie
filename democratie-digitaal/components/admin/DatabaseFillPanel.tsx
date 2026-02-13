"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { fillDatabase } from "@/lib/actions/database";

type FillSummary = {
    usersUpserted: number;
    topicsCreated: number;
    topicsUpdated: number;
    statementsCreated: number;
    statementsUpdated: number;
    partiesCreated: number;
    stancesCreated: number;
    stancesUpdated: number;
    logosUpdated: number;
};

type FillResult = {
    success: boolean;
    summary?: FillSummary;
    error?: string;
};

export default function DatabaseFillPanel() {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [result, setResult] = useState<FillResult | null>(null);

    const handleFill = () => {
        setResult(null);
        startTransition(async () => {
            const response = await fillDatabase();
            setResult(response);
            if (response.success) {
                router.refresh();
            }
        });
    };

    return (
        <div className="card space-y-6 border border-gray-100">
            <div className="space-y-2">
                <h2 className="text-lg font-bold text-gray-900">Database vullen</h2>
                <p className="text-sm text-gray-500">
                    Deze actie seedt basisgebruikers, standaardonderwerpen, importeert stellingen en
                    partijen uit de Stemwijzer dataset en vult partijlogo&apos;s aan.
                </p>
            </div>

            <button
                type="button"
                onClick={handleFill}
                disabled={pending}
                className={`btn-primary w-full sm:w-auto ${pending ? "opacity-70 cursor-not-allowed" : ""}`}
            >
                {pending ? "Database vullen..." : "Database vullen"}
            </button>

            {result?.success && result.summary && (
                <div className="rounded-lg border border-green-100 bg-green-50 p-4 text-sm text-green-800">
                    <p className="font-semibold mb-3">Database is succesvol bijgewerkt.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <ResultRow label="Gebruikers bijgewerkt" value={result.summary.usersUpserted} />
                        <ResultRow label="Onderwerpen aangemaakt" value={result.summary.topicsCreated} />
                        <ResultRow label="Onderwerpen bijgewerkt" value={result.summary.topicsUpdated} />
                        <ResultRow label="Stellingen aangemaakt" value={result.summary.statementsCreated} />
                        <ResultRow label="Stellingen bijgewerkt" value={result.summary.statementsUpdated} />
                        <ResultRow label="Partijen aangemaakt" value={result.summary.partiesCreated} />
                        <ResultRow label="Standpunten aangemaakt" value={result.summary.stancesCreated} />
                        <ResultRow label="Standpunten bijgewerkt" value={result.summary.stancesUpdated} />
                        <ResultRow label="Logo&apos;s bijgewerkt" value={result.summary.logosUpdated} />
                    </div>
                </div>
            )}

            {result?.success === false && (
                <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-700">
                    {result.error}
                </div>
            )}
        </div>
    );
}

function ResultRow({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex items-center justify-between gap-4">
            <span className="text-gray-600">{label}</span>
            <span className="font-semibold text-gray-900">{value}</span>
        </div>
    );
}
