import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import VotingFlow from "@/components/voting/VotingFlow";

export const dynamic = "force-dynamic";

function normalizeOptions(options: unknown): string[] {
    if (!Array.isArray(options)) return [];
    return options.filter((option) => typeof option === "string") as string[];
}

export default async function VotePage() {
    const session = await getServerSession(authOptions);
    let selectedTopicIds: number[] = [];

    if (session?.user) {
        const userId = (session.user as any).id;
        if (userId) {
            const preferences = await prisma.userTopicPreference.findMany({
                where: {
                    userId,
                    selected: true,
                },
                select: { topicId: true },
            });
            selectedTopicIds = preferences.map((pref) => pref.topicId);
        }
    }

    const statements = await prisma.statement.findMany({
        where: selectedTopicIds.length > 0
            ? {
                OR: [
                    { topicId: { in: selectedTopicIds } },
                    { topicId: null },
                ],
            }
            : {},
        include: {
            partyStances: {
                include: {
                    party: true,
                },
            },
            knowledgeQuestions: true,
        },
        orderBy: { id: "asc" },
    });

    if (statements.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
                <div className="card w-full max-w-xl text-center">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-3">
                        Geen stellingen gevonden
                    </h1>
                    <p className="text-gray-600">
                        Er zijn nog geen stellingen beschikbaar voor de geselecteerde
                        onderwerpen. Vul eerst de database of probeer andere topics.
                    </p>
                </div>
            </div>
        );
    }

    const items = statements.map((statement) => {
        const knowledge = statement.knowledgeQuestions[0];
        const options = knowledge ? normalizeOptions(knowledge.options) : [];
        const knowledgePayload = knowledge && options.length > 0
            ? {
                id: knowledge.id,
                question: knowledge.questionText,
                options,
                correctIndex: knowledge.correctOptionIndex,
            }
            : undefined;

        return {
            id: statement.id,
            theme: statement.theme,
            statement: statement.text,
            knowledge: knowledgePayload,
            partyStances: statement.partyStances.map((stance) => ({
                partyId: stance.partyId,
                partyName: stance.party.name,
                position: stance.position,
                explanation: stance.explanation ?? "Geen toelichting beschikbaar.",
                logoUrl: stance.party.logoUrl,
            })),
        };
    });

    return <VotingFlow items={items} />;
}
