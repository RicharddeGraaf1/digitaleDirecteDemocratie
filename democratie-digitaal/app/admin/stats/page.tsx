import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function StatsPage() {
    // Fetch real data from DB
    const [
        totalVotes,
        totalUsers,
        totalKnowledgeResults,
        correctKnowledgeResults,
        totalStatements,
        totalParties,
    ] = await Promise.all([
        prisma.vote.count(),
        prisma.user.count(),
        prisma.knowledgeResult.count(),
        prisma.knowledgeResult.count({ where: { isCorrect: true } }),
        prisma.statement.count(),
        prisma.party.count(),
    ]);

    const knowledgeAccuracy = totalKnowledgeResults > 0
        ? Math.round((correctKnowledgeResults / totalKnowledgeResults) * 100)
        : 0;

    // Stats per topic
    const topics = await prisma.topic.findMany({
        include: {
            statements: {
                include: {
                    votes: true,
                    knowledgeQuestions: {
                        include: {
                            results: true
                        }
                    }
                }
            }
        }
    });

    const topicStats = topics.map((topic: any) => {
        let topicVotes = 0;
        let topicCorrect = 0;
        let topicTotalQuestions = 0;

        topic.statements.forEach((s: any) => {
            topicVotes += s.votes.length;
            s.knowledgeQuestions.forEach((q: any) => {
                topicTotalQuestions += q.results.length;
                topicCorrect += q.results.filter((r: any) => r.isCorrect).length;
            });
        });

        return {
            name: topic.name,
            icon: topic.icon,
            voteCount: topicVotes,
            accuracy: topicTotalQuestions > 0 ? Math.round((topicCorrect / topicTotalQuestions) * 100) : 0,
        };
    }).sort((a: any, b: any) => b.voteCount - a.voteCount);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 border-l-4 border-[var(--brand-blue)] pl-4">
                    Statistieken Overzicht
                </h1>
                <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                    Live data van Vercel Postgres
                </div>
            </div>

            {/* High Level Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-6">
                <StatCard label="Totaal Stemmen" value={totalVotes.toString()} subValue="totaal" />
                <StatCard label="Geregistreerde Burgers" value={totalUsers.toString()} subValue="accounts" />
                <StatCard label="Stellingen" value={totalStatements.toString()} subValue="in database" />
                <StatCard label="Partijen" value={totalParties.toString()} subValue="geimporteerd" />
                <StatCard label="Kennis Accuracy" value={`${knowledgeAccuracy}%`} subValue="gemiddelde score" />
                <StatCard label="Toetsvragen Beantwoord" value={totalKnowledgeResults.toString()} subValue="resultaten" />
            </div>

            {/* Topic Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></svg>
                        Populaire Onderwerpen
                    </h3>
                    <div className="space-y-6">
                        {topicStats.map((topic: any, i: number) => (
                            <div key={i} className="flex items-center gap-4">
                                <span className="text-2xl w-8 text-center">{topic.icon}</span>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-semibold text-gray-700">{topic.name}</span>
                                        <span className="text-sm font-bold text-gray-500">{topic.voteCount} stemmen</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden border border-gray-50">
                                        <div
                                            className="bg-[var(--brand-blue)] h-full transition-all duration-1000"
                                            style={{ width: `${Math.min(100, (topic.voteCount / (totalVotes || 1)) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                        Kennis-niveau per Onderwerp
                    </h3>
                    <div className="space-y-6">
                        {topicStats.map((topic: any, i: number) => (
                            <div key={i} className="flex items-center gap-4">
                                <span className="text-2xl w-8 text-center">{topic.icon}</span>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-semibold text-gray-700">{topic.name}</span>
                                        <span className="text-sm font-bold text-gray-500">{topic.accuracy}% correct</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden border border-gray-50">
                                        <div
                                            className="bg-green-500 h-full transition-all duration-1000"
                                            style={{ width: `${topic.accuracy}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, subValue }: { label: string; value: string; subValue?: string }) {
    return (
        <div className="card p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{label}</span>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-gray-900 leading-none">{value}</span>
            </div>
            {subValue && (
                <span className="text-[10px] text-gray-400 font-semibold mt-2">
                    {subValue}
                </span>
            )}
        </div>
    );
}
