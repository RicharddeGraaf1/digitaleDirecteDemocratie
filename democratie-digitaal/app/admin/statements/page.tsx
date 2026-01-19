import prisma from "@/lib/prisma";
import Link from "next/link";
import StatementsTable from "@/components/admin/StatementsTable";

export const dynamic = "force-dynamic";

export default async function AdminStatementsPage({
    searchParams,
}: {
    searchParams: { topic?: string };
}) {
    const topicId = searchParams.topic ? parseInt(searchParams.topic) : undefined;

    // Fetch topics for filter
    const topics = await prisma.topic.findMany();

    // Fetch statements with topic filter if provided
    const statements = await prisma.statement.findMany({
        where: topicId ? { topicId } : {},
        include: {
            topic: true,
            knowledgeQuestions: true,
        },
        orderBy: { id: "desc" },
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Stellingen beheren</h1>
                    <p className="text-sm text-gray-500 mt-1">Beheer stellingen en hun context per onderwerp.</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-wrap items-center gap-4 shadow-sm">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Filter op onderwerp:</span>
                <div className="flex flex-wrap gap-2">
                    <Link
                        href="/admin/statements"
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${!topicId ? 'bg-[var(--brand-blue)] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        Alles
                    </Link>
                    {topics.map(t => (
                        <Link
                            key={t.id}
                            href={`/admin/statements?topic=${t.id}`}
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${topicId === t.id ? 'bg-[var(--brand-blue)] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            {t.icon} {t.name}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Table Manager */}
            <StatementsTable statements={statements} topics={topics} />
        </div>
    );
}
