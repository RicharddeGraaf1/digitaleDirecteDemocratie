"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteQuestion(id: number) {
    try {
        await prisma.knowledgeQuestion.delete({
            where: { id },
        });
        revalidatePath("/admin/questions");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete question:", error);
        return { success: false, error: "Verwijderen mislukt." };
    }
}

export async function createQuestion(data: {
    statementId: number;
    questionText: string;
    options: string[];
    correctOptionIndex: number;
}) {
    try {
        const question = await prisma.knowledgeQuestion.create({
            data,
        });
        revalidatePath("/admin/questions");
        return { success: true, data: question };
    } catch (error) {
        console.error("Failed to create question:", error);
        return { success: false, error: "Aanmaken mislukt." };
    }
}

export async function updateQuestion(id: number, data: {
    questionText?: string;
    options?: string[];
    correctOptionIndex?: number;
}) {
    try {
        const question = await prisma.knowledgeQuestion.update({
            where: { id },
            data,
        });
        revalidatePath("/admin/questions");
        return { success: true, data: question };
    } catch (error) {
        console.error("Failed to update question:", error);
        return { success: false, error: "Bewerken mislukt." };
    }
}
