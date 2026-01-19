"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteStatement(id: number) {
    try {
        await prisma.statement.delete({
            where: { id },
        });
        revalidatePath("/admin/statements");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete statement:", error);
        return { success: false, error: "Verwijderen mislukt." };
    }
}

export async function createStatement(data: {
    theme: string;
    text: string;
    topicId: number;
}) {
    try {
        const statement = await prisma.statement.create({
            data,
        });
        revalidatePath("/admin/statements");
        return { success: true, data: statement };
    } catch (error) {
        console.error("Failed to create statement:", error);
        return { success: false, error: "Aanmaken mislukt." };
    }
}

export async function updateStatement(id: number, data: {
    theme?: string;
    text?: string;
    topicId?: number;
}) {
    try {
        const statement = await prisma.statement.update({
            where: { id },
            data,
        });
        revalidatePath("/admin/statements");
        return { success: true, data: statement };
    } catch (error) {
        console.error("Failed to update statement:", error);
        return { success: false, error: "Bewerken mislukt." };
    }
}
