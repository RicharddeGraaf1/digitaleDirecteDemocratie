import { Opinion, Position } from "@prisma/client";
import { calculateFinalMatching, calculateStanceMatch } from "@/lib/matching";

describe("matching calculations", () => {
    it("returns perfect match when opinions align", () => {
        expect(calculateStanceMatch(Opinion.EENS, Position.EENS)).toBe(1);
        expect(calculateStanceMatch(Opinion.ONEENS, Position.ONEENS)).toBe(1);
    });

    it("returns partial match for skip or no opinion", () => {
        expect(calculateStanceMatch(Opinion.SKIP, Position.EENS)).toBe(0.5);
        expect(calculateStanceMatch(Opinion.GEEN_MENING, Position.ONEENS)).toBe(0.5);
    });

    it("weights matching with topic knowledge", () => {
        const votes = [
            {
                statementId: 1,
                userOpinion: Opinion.EENS,
                statement: { topicId: 10 },
            },
            {
                statementId: 2,
                userOpinion: Opinion.ONEENS,
                statement: { topicId: 20 },
            },
        ];
        const partyStances = [
            { statementId: 1, position: Position.EENS },
            { statementId: 2, position: Position.ONEENS },
        ];
        const topicKnowledge = { 10: 1, 20: 0 };

        const score = calculateFinalMatching(votes, partyStances, topicKnowledge);
        expect(score).toBe(100);
    });
});
