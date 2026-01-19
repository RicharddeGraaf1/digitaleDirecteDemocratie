import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import MatchList from "@/components/dashboard/MatchList";
import KnowledgeOverview from "@/components/dashboard/KnowledgeOverview";
import { calculateFinalMatching } from "@/lib/matching";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/login");
    }

    const userId = (session.user as any).id;

    // 1. Fetch User Data (active session with votes and knowledge results)
    const userSession = await prisma.session.findFirst({
        where: { userId },
        include: {
            votes: {
                include: { statement: { include: { topic: true } } }
            },
            knowledgeResults: {
                include: { question: { include: { topic: true } } }
            }
        },
        orderBy: { startedAt: "desc" }
    });

    if (!userSession) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <div className="mb-8 text-6xl">🗳️</div>
                <h1 className="text-3xl font-black text-gray-900 mb-4">Welkom bij je Dashboard!</h1>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    Je hebt nog geen stemmen uitgebracht. Start de stemhulp om je persoonlijke politieke match te ontdekken.
                </p>
                <a href="/vote" className="btn-primary inline-flex items-center gap-2">
                    Start Stemhulp →
                </a>
            </div>
        );
    }

    // 2. Fetch All Parties and their stances for matching
    const parties = await prisma.party.findMany({
        include: { stances: true }
    });

    // 3. Process Topic Knowledge
    const topicStats: Record<number, { name: string, icon: string, correct: number, total: number }> = {};

    userSession.knowledgeResults.forEach((res: any) => {
        const topic = res.question.topic;
        if (!topic) return;

        if (!topicStats[topic.id]) {
            topicStats[topic.id] = { name: topic.name, icon: topic.icon || "📁", correct: 0, total: 0 };
        }
        topicStats[topic.id].total++;
        if (res.isCorrect) topicStats[topic.id].correct++;
    });

    const knowledgeStats = Object.entries(topicStats).map(([id, stat]) => ({
        topicId: parseInt(id),
        name: stat.name,
        icon: stat.icon,
        accuracy: Math.round((stat.correct / stat.total) * 100),
        questionsAnswered: stat.total
    }));

    const knowledgeWeightMap: Record<number, number> = {};
    knowledgeStats.forEach(s => knowledgeWeightMap[s.topicId] = s.accuracy / 100);

    // 4. Calculate Matches
    const matches = parties.map((party: any) => ({
        partyId: party.id,
        name: party.name,
        shortName: party.shortName || party.name,
        logoUrl: party.logoUrl || undefined,
        matchPercentage: calculateFinalMatching(userSession.votes, party.stances, knowledgeWeightMap)
    }));

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
            {/* Header section */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Voter Dashboard</h1>
                    <p className="text-gray-500 mt-1">Jouw gepersonaliseerde match op basis van mening en kennis.</p>
                </div>
                <div className="flex items-center gap-4 bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100">
                    <div className="w-12 h-12 rounded-full bg-[var(--brand-blue)] flex items-center justify-center text-white font-black">
                        {session.user.name?.charAt(0) || "U"}
                    </div>
                    <div>
                        <div className="text-sm font-black text-gray-900">{session.user.name}</div>
                        <div className="text-[10px] uppercase font-black text-gray-400 tracking-widest">{userSession.votes.length} Stemmen uitgebracht</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Matches Section */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Mijn Match</h2>
                        <span className="text-[10px] font-black uppercase text-[var(--brand-blue)] tracking-widest px-2 py-1 rounded bg-blue-50">Gewogen op kennis</span>
                    </div>
                    <MatchList matches={matches} />
                </div>

                {/* Knowledge & Detailed Analysis */}
                <div className="lg:col-span-7 space-y-10">
                    <div className="space-y-6">
                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Kennisanalyse</h2>
                        <KnowledgeOverview stats={knowledgeStats} />
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50/30 p-8 rounded-3xl border border-blue-100">
                        <h3 className="text-lg font-black text-[var(--brand-blue)] mb-4">💡 Inzicht</h3>
                        <p className="text-sm font-medium text-gray-600 leading-relaxed mb-6">
                            Jouw match is niet alleen gebaseerd op wat je vindt, maar ook op wat je weet.
                            Stemmen op onderwerpen waar je een hoge kennis-score hebt, wegen zwaarder mee in je uiteindelijke resultaat.
                        </p>
                        <div className="flex gap-4">
                            <button className="flex-1 bg-white text-gray-900 px-4 py-3 rounded-xl text-xs font-black border border-blue-100 shadow-sm hover:shadow-md active:scale-95 transition-all">
                                Bekijk Stellinghistorie
                            </button>
                            <button className="flex-1 bg-[var(--brand-blue)] text-white px-4 py-3 rounded-xl text-xs font-black shadow-lg shadow-blue-200 hover:shadow-xl active:scale-95 transition-all">
                                Verbeter Kennis
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
