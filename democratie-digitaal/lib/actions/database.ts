"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const STEMWIJZER_URL =
    "https://raw.githubusercontent.com/afvanwoudenberg/stemwijzer/main/tweedekamer2025.json";

const defaultUsers = [
    {
        email: "burger",
        name: "Burger-gebruiker",
        passwordHash: "Burger",
        role: "USER" as const,
    },
    {
        email: "admin",
        name: "Administrator",
        passwordHash: "Admin",
        role: "ADMIN" as const,
    },
];

const defaultTopics = [
    { name: "Economie", icon: "💰", description: "Inkomsten, belastingen en werkgelegenheid." },
    { name: "Klimaat", icon: "🌱", description: "Natuur, milieu en energietransitie." },
    { name: "Zorg", icon: "🏥", description: "Gezondheid, ziekenhuizen en welzijn." },
    { name: "Wonen", icon: "🏠", description: "Woningmarkt en huizenbouw." },
    { name: "Immigratie", icon: "🌍", description: "Asielbeleid en integratie." },
    { name: "Onderwijs", icon: "🎓", description: "Scholen, universiteiten en innovatie." },
];

const partyLogos: Record<string, string> = {
    "PVV (Partij voor de Vrijheid)": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Partij_voor_de_Vrijheid_logo.svg/240px-Partij_voor_de_Vrijheid_logo.svg.png",
    "PVV": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Partij_voor_de_Vrijheid_logo.svg/240px-Partij_voor_de_Vrijheid_logo.svg.png",
    "GroenLinks-PvdA": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/GroenLinks-PvdA_logo.svg/240px-GroenLinks-PvdA_logo.svg.png",
    "VVD": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Volkspartij_voor_Vrijheid_en_Democratie_logo.svg/240px-Volkspartij_voor_Vrijheid_en_Democratie_logo.svg.png",
    "Nieuw Sociaal Contract": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Nieuw_Sociaal_Contract_logo.svg/240px-Nieuw_Sociaal_Contract_logo.svg.png",
    "NSC": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Nieuw_Sociaal_Contract_logo.svg/240px-Nieuw_Sociaal_Contract_logo.svg.png",
    "D66": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Democraten_66_logo.svg/240px-Democraten_66_logo.svg.png",
    "BBB": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/BoerBurgerBeweging_logo.svg/240px-BoerBurgerBeweging_logo.svg.png",
    "CDA": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Christen-Democratisch_App%C3%A8l_logo.svg/240px-Christen-Democratisch_App%C3%A8l_logo.svg.png",
    "SP (Socialistische Partij)": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Socialistische_Partij_logo.svg/240px-Socialistische_Partij_logo.svg.png",
    "SP": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Socialistische_Partij_logo.svg/240px-Socialistische_Partij_logo.svg.png",
    "Partij voor de Dieren": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Partij_voor_de_Dieren_logo.svg/240px-Partij_voor_de_Dieren_logo.svg.png",
    "PvdD": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Partij_voor_de_Dieren_logo.svg/240px-Partij_voor_de_Dieren_logo.svg.png",
    "ChristenUnie": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/ChristenUnie_logo.svg/240px-ChristenUnie_logo.svg.png",
    "Volt": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Volt_Europa_logo_2023.svg/240px-Volt_Europa_logo_2023.svg.png",
    "SGP (Staatkundig Gereformeerde Partij)": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Staatkundig_Gereformeerde_Partij_logo.svg/240px-Staatkundig_Gereformeerde_Partij_logo.svg.png",
    "SGP": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Staatkundig_Gereformeerde_Partij_logo.svg/240px-Staatkundig_Gereformeerde_Partij_logo.svg.png",
    "DENK": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/DENK_logo.svg/240px-DENK_logo.svg.png",
    "Forum voor Democratie": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Forum_voor_Democratie_logo.svg/240px-Forum_voor_Democratie_logo.svg.png",
    "FVD": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Forum_voor_Democratie_logo.svg/240px-Forum_voor_Democratie_logo.svg.png",
    "JA21": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/JA21_logo.svg/240px-JA21_logo.svg.png",
    "FvD": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Forum_voor_Democratie_logo.svg/240px-Forum_voor_Democratie_logo.svg.png",
    "50PLUS": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/50PLUS_logo.svg/240px-50PLUS_logo.svg.png",
    "BVNL": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/BVNL_Logo.png/240px-BVNL_Logo.png",
};

const topicMatchers = [
    { topic: "Klimaat", keywords: ["klimaat", "energie", "milieu", "duurzaam"] },
    { topic: "Zorg", keywords: ["zorg", "gezondheid", "ziekenhuis", "medisch"] },
    { topic: "Wonen", keywords: ["wonen", "woning", "huur", "koopwoning", "huis"] },
    { topic: "Immigratie", keywords: ["immigratie", "asiel", "migratie", "integratie"] },
    { topic: "Onderwijs", keywords: ["onderwijs", "school", "universiteit", "student"] },
    { topic: "Economie", keywords: ["economie", "belasting", "werk", "inkomen", "financi"] },
];

type FillSummary = {
    usersUpserted: number;
    topicsCreated: number;
    topicsUpdated: number;
    statementsCreated: number;
    statementsUpdated: number;
    partiesCreated: number;
    stancesCreated: number;
    stancesUpdated: number;
    logosUpdated: number;
};

type StemwijzerItem = {
    theme: string;
    title: string;
    info?: string;
    positions: { party: string; position: string; explanation?: string }[];
};

function resolveTopicId(
    topicLookup: Map<string, number>,
    theme: string,
    title: string
) {
    const combined = `${theme} ${title}`.toLowerCase();
    for (const matcher of topicMatchers) {
        if (matcher.keywords.some((keyword) => combined.includes(keyword))) {
            const topicId = topicLookup.get(matcher.topic.toLowerCase());
            if (topicId) return topicId;
        }
    }
    return undefined;
}

type PositionValue = "EENS" | "ONEENS" | "GEEN";

function mapPosition(position: string): PositionValue {
    const normalized = position.toLowerCase();
    if (normalized.includes("eens") || normalized.includes("voor")) return "EENS";
    if (normalized.includes("oneens") || normalized.includes("tegen")) return "ONEENS";
    return "GEEN";
}

export async function fillDatabase(): Promise<{ success: boolean; summary?: FillSummary; error?: string }> {
    const summary: FillSummary = {
        usersUpserted: 0,
        topicsCreated: 0,
        topicsUpdated: 0,
        statementsCreated: 0,
        statementsUpdated: 0,
        partiesCreated: 0,
        stancesCreated: 0,
        stancesUpdated: 0,
        logosUpdated: 0,
    };

    try {
        for (const user of defaultUsers) {
            const existing = await prisma.user.findUnique({
                where: { email: user.email },
            });
            if (existing) {
                await prisma.user.update({
                    where: { id: existing.id },
                    data: {
                        name: user.name,
                        passwordHash: user.passwordHash,
                        role: user.role,
                    },
                });
            } else {
                await prisma.user.create({ data: user });
            }
            summary.usersUpserted += 1;
        }

        for (const topic of defaultTopics) {
            const existing = await prisma.topic.findUnique({
                where: { name: topic.name },
            });
            if (existing) {
                await prisma.topic.update({
                    where: { id: existing.id },
                    data: {
                        description: topic.description,
                        icon: topic.icon,
                    },
                });
                summary.topicsUpdated += 1;
            } else {
                await prisma.topic.create({ data: topic });
                summary.topicsCreated += 1;
            }
        }

        const response = await fetch(STEMWIJZER_URL, { cache: "no-store" });
        if (!response.ok) {
            throw new Error(`Stemwijzer import failed (${response.status})`);
        }

        const data = (await response.json()) as StemwijzerItem[];
        const topics = await prisma.topic.findMany({ select: { id: true, name: true } });
        const topicLookup = new Map(topics.map((topic) => [topic.name.toLowerCase(), topic.id]));

        const parties = await prisma.party.findMany({ select: { id: true, name: true } });
        const partyLookup = new Map(parties.map((party) => [party.name.toLowerCase(), party]));

        for (const item of data) {
            const topicId = resolveTopicId(topicLookup, item.theme, item.title);
            const existingStatement = await prisma.statement.findFirst({
                where: { text: item.title, theme: item.theme },
            });

            let statementId: number;
            if (existingStatement) {
                const updateData: { info?: string; topicId?: number } = {};
                if (item.info && item.info !== existingStatement.info) {
                    updateData.info = item.info;
                }
                if (topicId && !existingStatement.topicId) {
                    updateData.topicId = topicId;
                }
                if (Object.keys(updateData).length > 0) {
                    await prisma.statement.update({
                        where: { id: existingStatement.id },
                        data: updateData,
                    });
                }
                statementId = existingStatement.id;
                summary.statementsUpdated += 1;
            } else {
                const statement = await prisma.statement.create({
                    data: {
                        theme: item.theme,
                        text: item.title,
                        info: item.info,
                        topicId,
                    },
                });
                statementId = statement.id;
                summary.statementsCreated += 1;
            }

            for (const pos of item.positions || []) {
                const partyKey = pos.party.toLowerCase();
                let party = partyLookup.get(partyKey);
                if (!party) {
                    party = await prisma.party.create({
                        data: { name: pos.party },
                    });
                    partyLookup.set(partyKey, party);
                    summary.partiesCreated += 1;
                }

                const position = mapPosition(pos.position);
                const existingStance = await prisma.partyStance.findUnique({
                    where: {
                        partyId_statementId: {
                            partyId: party.id,
                            statementId,
                        },
                    },
                });

                if (existingStance) {
                    await prisma.partyStance.update({
                        where: {
                            partyId_statementId: {
                                partyId: party.id,
                                statementId,
                            },
                        },
                        data: {
                            position,
                            explanation: pos.explanation,
                        },
                    });
                    summary.stancesUpdated += 1;
                } else {
                    await prisma.partyStance.create({
                        data: {
                            partyId: party.id,
                            statementId,
                            position,
                            explanation: pos.explanation,
                        },
                    });
                    summary.stancesCreated += 1;
                }
            }
        }

        const partiesWithLogos = await prisma.party.findMany();
        for (const party of partiesWithLogos) {
            const logoUrl = partyLogos[party.name];
            if (logoUrl && party.logoUrl !== logoUrl) {
                await prisma.party.update({
                    where: { id: party.id },
                    data: { logoUrl },
                });
                summary.logosUpdated += 1;
            }
        }

        revalidatePath("/admin");
        revalidatePath("/admin/stats");
        revalidatePath("/admin/database");
        revalidatePath("/admin/parties");
        revalidatePath("/admin/statements");
        revalidatePath("/admin/questions");
        revalidatePath("/admin/topics");

        return { success: true, summary };
    } catch (error) {
        console.error("Database fill failed:", error);
        return { success: false, error: "Database vullen is mislukt. Controleer de logs." };
    }
}
