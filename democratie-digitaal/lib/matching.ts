import { Opinion, Position } from "@prisma/client";

/**
 * Calculates the match score between a user's opinion and a party's stance.
 * Returns a value between 0 and 1.
 */
export function calculateStanceMatch(userOpinion: Opinion, partyPosition: Position): number {
    if (userOpinion === Opinion.SKIP || userOpinion === Opinion.GEEN_MENING) return 0.5;

    const userMap: Record<Opinion, Position | null> = {
        [Opinion.EENS]: Position.EENS,
        [Opinion.ONEENS]: Position.ONEENS,
        [Opinion.GEEN_MENING]: Position.GEEN,
        [Opinion.SKIP]: null,
    };

    const userPos = userMap[userOpinion];
    if (!userPos) return 0.5;

    if (userPos === partyPosition) return 1;
    if (partyPosition === Position.GEEN) return 0.5;

    return 0; // Absolute mismatch (EENS vs ONEENS)
}

/**
 * Calculates a weighted match for a set of votes, adjusted by topic knowledge.
 */
export function calculateFinalMatching(
    votes: any[],
    partyStances: any[],
    topicKnowledge: Record<number, number>
) {
    let totalScore = 0;
    let totalWeight = 0;

    votes.forEach(vote => {
        const stance = partyStances.find(s => s.statementId === vote.statementId);
        if (!stance) return;

        const match = calculateStanceMatch(vote.userOpinion, stance.position);

        // Weight by topic knowledge (0-1). If no knowledge results, default to 0.5.
        const topicId = vote.statement.topicId;
        const knowledgeWeight = topicId !== null ? (topicKnowledge[topicId] ?? 0.5) : 0.5;

        // The knowledge weight influences how much this statement counts toward the final score.
        // We use a base weight of 1 + knowledge boost to ensure even low knowledge counts somewhat.
        const finalWeight = 1 + (knowledgeWeight * 2); // 1.0 to 3.0 weight

        totalScore += match * finalWeight;
        totalWeight += finalWeight;
    });

    return totalWeight > 0 ? (totalScore / totalWeight) * 100 : 0;
}
