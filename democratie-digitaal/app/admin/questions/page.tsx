import prisma from "@/lib/prisma";
import Link from "next/link";
import SmartFillButton from "@/components/admin/SmartFillButton";
import QuestionsTable from "@/components/admin/QuestionsTable";

export const dynamic = "force-dynamic";

export default async function AdminQuestionsPage({
    searchParams,
}: {
    searchParams: { topic?: string };
}) {
    const topicId = searchParams.topic ? parseInt(searchParams.topic) : undefined;

    // Fetch topics for filter
    const topics = await prisma.topic.findMany();

    // Fetch all statements for SmartFill context
    const allStatements = await prisma.statement.findMany({
        where: topicId ? { topicId } : {},
        select: { id: true, text: true }
    });

    // Fetch questions with topic or statement context
    const questions = await prisma.knowledgeQuestion.findMany({
        where: topicId ? {
            statement: {
                topicId: topicId
            }
        } : {},
        include: {
            statement: {
                include: { topic: true }
            },
            results: true
        },
        orderBy: { id: "desc" },
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Kennisvragen beheren</h1>
                    <p className="text-sm text-gray-500 mt-1">Beheer toetsvragen en genereer nieuwe suggesties met AI.</p>
                </div>
            </div>

            {/* AI Smart Fill Section */}
            <div className="card border-purple-100 bg-gradient-to-br from-white to-purple-50/30">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg">✨</span>
                    <h2 className="text-sm font-black uppercase text-purple-600 tracking-tighter">AI Smart Fill</h2>
                </div>
                <SmartFillButton statements={allStatements} />
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-wrap items-center gap-4 shadow-sm">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Filter op onderwerp:</span>
                <div className="flex flex-wrap gap-2">
                    <Link
                        href="/admin/questions"
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${!topicId ? 'bg-[var(--brand-blue)] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        Alles
                    </Link>
                    {topics.map((t: any) => (
                        <Link
                            key={t.id}
                            href={`/admin/questions?topic=${t.id}`}
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${topicId === t.id ? 'bg-[var(--brand-blue)] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            {t.icon} {t.name}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Table Manager */}
            <QuestionsTable questions={questions} statements={allStatements} />
        </div>
    );
}
