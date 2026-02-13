import prisma from "@/lib/prisma";
import DatabaseFillPanel from "@/components/admin/DatabaseFillPanel";

export const dynamic = "force-dynamic";

export default async function AdminDatabasePage() {
    const [
        totalTopics,
        totalStatements,
        totalParties,
        totalStances,
        totalQuestions,
        totalUsers,
    ] = await Promise.all([
        prisma.topic.count(),
        prisma.statement.count(),
        prisma.party.count(),
        prisma.partyStance.count(),
        prisma.knowledgeQuestion.count(),
        prisma.user.count(),
    ]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Database beheer</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Houd de database gevuld met basisdata, stellingen en partijen.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatusCard label="Onderwerpen" value={totalTopics} />
                <StatusCard label="Stellingen" value={totalStatements} />
                <StatusCard label="Partijen" value={totalParties} />
                <StatusCard label="Standpunten" value={totalStances} />
                <StatusCard label="Kennisvragen" value={totalQuestions} />
                <StatusCard label="Gebruikers" value={totalUsers} />
            </div>

            <DatabaseFillPanel />

            <div className="text-xs text-gray-400">
                Tip: de actie is idempotent en kan veilig opnieuw worden uitgevoerd.
            </div>
        </div>
    );
}

function StatusCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="card p-4 border border-gray-100">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
    );
}
