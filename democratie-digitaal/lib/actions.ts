"use server";

import prisma from "./prisma";
import { revalidatePath } from "next/cache";

export async function saveTopicPreferences(userId: string, topicIds: number[]) {
    try {
        // First clear existing preferences for this user
        await prisma.userTopicPreference.deleteMany({
            where: { userId },
        });

        // Then create new ones
        await prisma.userTopicPreference.createMany({
            data: topicIds.map((topicId) => ({
                userId,
                topicId,
                selected: true,
            })),
        });

        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Error saving topic preferences:", error);
        return { success: false, error: "Failed to save preferences" };
    }
}

export async function saveVotingSession(userId: string, results: any[]) {
    try {
        const session = await prisma.session.create({
            data: {
                userId,
                completedAt: new Date(),
                votes: {
                    create: results.map((r) => ({
                        statementId: r.statementId,
                        userOpinion: r.vote.toUpperCase().replace(" ", "_"), // Match enum Opinion
                        delegatedToPartyId: r.delegatedToPartyId || null,
                    })),
                },
                knowledgeResults: {
                    create: results
                        .filter((r) => r.knowledgeQuestionId !== undefined)
                        .map((r) => ({
                            questionId: r.knowledgeQuestionId,
                            isCorrect: r.knowledgeCorrect,
                        })),
                },
            },
        });

        revalidatePath("/dashboard");
        return { success: true, sessionId: session.id };
    } catch (error) {
        console.error("Error saving voting session:", error);
        return { success: false, error: "Failed to save session" };
    }
}
