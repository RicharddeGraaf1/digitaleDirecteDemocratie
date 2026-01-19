import prisma from "@/lib/prisma";
import VotingFlow from "@/components/voting/VotingFlow";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  let selectedTopicIds: number[] = [];
  if (userId) {
    const preferences = await prisma.userTopicPreference.findMany({
      where: { userId, selected: true },
      select: { topicId: true },
    });
    selectedTopicIds = preferences.map((p) => p.topicId);
  }

  // Fetch statements with stances and knowledge questions from DB
  const statements = await prisma.statement.findMany({
    where: selectedTopicIds.length > 0 ? {
      topicId: { in: selectedTopicIds }
    } : {},
    include: {
      partyStances: {
        include: {
          party: true,
        },
      },
      knowledgeQuestions: true,
    },
    take: 30, // Limit to 30 as imported
  });

  // Transform data to match VotingFlow expectations
  const items = statements.map((s: any) => {
    // Pick the first knowledge question if available
    const kq = s.knowledgeQuestions[0];

    return {
      id: s.id,
      theme: s.theme,
      statement: s.text,
      knowledge: kq ? {
        id: kq.id,
        question: kq.questionText,
        options: kq.options as string[],
        correctIndex: kq.correctOptionIndex,
      } : undefined,
      partyStances: s.partyStances.map((ps: any) => ({
        partyId: ps.partyId,
        partyName: ps.party.name,
        position: ps.position as "EENS" | "ONEENS" | "GEEN",
        explanation: ps.explanation || "",
        logoUrl: ps.party.logoUrl,
      })),
    };
  });

  return <VotingFlow items={items} />;
}
