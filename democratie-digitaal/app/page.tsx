import prisma from "@/lib/prisma";
import VotingFlow from "@/components/voting/VotingFlow";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch statements with stances and knowledge questions from DB
  const statements = await prisma.statement.findMany({
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
