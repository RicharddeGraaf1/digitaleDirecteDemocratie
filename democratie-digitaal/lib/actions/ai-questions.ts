"use strict";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

export async function generateAIQuestions(statementText: string) {
    if (!process.env.GOOGLE_AI_API_KEY) {
        throw new Error("GOOGLE_AI_API_KEY is not set in environment variables.");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Je bent een expert in burgereducatie en politiek. 
    Genereer 3 meerkeuze-kennisvragen (Dutch) op basis van de volgende politieke stelling:
    "${statementText}"

    De vragen moeten objectief zijn en feitelijke kennis testen die relevant is om een geïnformeerde mening over deze stelling te vormen.
    
    Formatteer het resultaat als een JSON array van objecten:
    [
      {
        "questionText": "Vraag tekst hier?",
        "options": ["Optie A", "Optie B", "Optie C", "Optie D"],
        "correctOptionIndex": 0
      }
    ]
    Geef alleen de pure JSON terug, geen markdown of extra tekst.
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean potential markdown wrappers if AI provides them
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const questions = JSON.parse(jsonString);

        return questions;
    } catch (error) {
        console.error("AI Generation failed:", error);
        throw new Error("Failed to generate AI questions.");
    }
}

export async function saveAIQuestions(statementId: number, questions: any[]) {
    const prisma = (await import("@/lib/prisma")).default;

    const createdQuestions = await Promise.all(
        questions.map(q =>
            prisma.knowledgeQuestion.create({
                data: {
                    statementId,
                    questionText: q.questionText,
                    options: q.options,
                    correctOptionIndex: q.correctOptionIndex,
                }
            })
        )
    );

    return createdQuestions;
}
