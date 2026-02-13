import Link from "next/link";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    const [totalStatements, totalUsers, totalVotes, totalKnowledgeResults] = await Promise.all([
        prisma.statement.count(),
        prisma.user.count(),
        prisma.vote.count(),
        prisma.knowledgeResult.count(),
    ]);

    const stats = [
        { name: "Totaal Stellingen", value: totalStatements.toString(), note: "in database" },
        { name: "Geregistreerde Gebruikers", value: totalUsers.toString(), note: "accounts" },
        { name: "Stemmen Uitgebracht", value: totalVotes.toString(), note: "sessies" },
        { name: "Kennisvragen Beantwoord", value: totalKnowledgeResults.toString(), note: "resultaten" },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat) => (
                    <div key={stat.name} className="card p-6">
                        <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                        <div className="flex items-baseline gap-2 mt-2">
                            <p className="text-3xl font-semibold text-gray-900">{stat.value}</p>
                            {stat.note && (
                                <span className="text-xs font-medium text-gray-400">
                                    {stat.note}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold mb-4">Recente Activiteit</h2>
                    <div className="space-y-4">
                        <ActivityItem
                            user="Admin"
                            action="importeerde 30 stellingen"
                            target="Stemwijzer 2025"
                            time="2 uur geleden"
                        />
                        <ActivityItem
                            user="Admin"
                            action="voegde een nieuwe kennisvraag toe aan"
                            target="Klimaat"
                            time="4 uur geleden"
                        />
                        <ActivityItem
                            user="Admin"
                            action="wijzigde standpunt van"
                            target="VVD"
                            time="Gisteren"
                        />
                    </div>
                </div>

                {/* Quick Links */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold mb-4">Snelle Acties</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <QuickAction href="/admin/database" label="Database Vullen" />
                        <QuickAction href="/admin/stats" label="Statistieken" />
                        <QuickAction href="/admin/statements" label="Nieuwe Stelling" />
                        <QuickAction href="/admin/questions" label="Nieuwe Kennisvraag" />
                        <QuickAction href="/admin/topics" label="Onderwerp Beheren" />
                        <QuickAction href="/admin/parties" label="Partijen Beheren" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function ActivityItem({ user, action, target, time }: any) {
    return (
        <div className="flex gap-4 text-sm pb-4 border-b border-gray-50 last:border-0 last:pb-0">
            <div className="w-8 h-8 rounded-full bg-[#f0f7ff] flex items-center justify-center text-[var(--brand-blue)] font-bold">
                {user[0]}
            </div>
            <div className="flex-1">
                <p className="text-gray-600">
                    <span className="font-medium text-gray-900">{user}</span> {action}{" "}
                    <span className="font-medium text-gray-900">{target}</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">{time}</p>
            </div>
        </div>
    );
}

function QuickAction({ href, label }: { href: string; label: string }) {
    return (
        <Link
            href={href}
            className="p-4 rounded-lg border border-gray-100 hover:border-[var(--brand-blue)] hover:bg-[#f0f7ff] transition-all text-sm font-medium text-gray-600 hover:text-[var(--brand-blue)] text-center"
        >
            {label}
        </Link>
    );
}
