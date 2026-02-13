const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function resetDatabase() {
    await prisma.knowledgeResult.deleteMany();
    await prisma.vote.deleteMany();
    await prisma.partyStance.deleteMany();
    await prisma.knowledgeQuestion.deleteMany();
    await prisma.statement.deleteMany();
    await prisma.userTopicPreference.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.party.deleteMany();
    await prisma.topic.deleteMany();
    await prisma.user.deleteMany();
}

async function seed() {
    await resetDatabase();

    const admin = await prisma.user.create({
        data: {
            email: "admin",
            name: "Administrator",
            passwordHash: "Admin",
            role: "ADMIN",
        },
    });

    await prisma.user.create({
        data: {
            email: "burger",
            name: "Burger-gebruiker",
            passwordHash: "Burger",
            role: "USER",
        },
    });

    const klimaat = await prisma.topic.create({
        data: {
            name: "Klimaat",
            icon: "🌱",
            description: "Energietransitie en milieu.",
        },
    });

    const economie = await prisma.topic.create({
        data: {
            name: "Economie",
            icon: "💰",
            description: "Inkomsten, belastingen en werkgelegenheid.",
        },
    });

    const statement = await prisma.statement.create({
        data: {
            theme: "Klimaat",
            text: "Nederland moet sneller overstappen op duurzame energie.",
            info: "Overheid moet versnellen om klimaatdoelen te halen.",
            topicId: klimaat.id,
        },
    });

    const secondStatement = await prisma.statement.create({
        data: {
            theme: "Economie",
            text: "Belastingen voor werkenden moeten omlaag.",
            info: "Lagere lasten verhogen koopkracht.",
            topicId: economie.id,
        },
    });

    const party = await prisma.party.create({
        data: {
            name: "TestPartij",
            shortName: "TP",
        },
    });

    await prisma.partyStance.create({
        data: {
            partyId: party.id,
            statementId: statement.id,
            position: "EENS",
            explanation: "Versnellen helpt de klimaatdoelen halen.",
        },
    });

    await prisma.partyStance.create({
        data: {
            partyId: party.id,
            statementId: secondStatement.id,
            position: "ONEENS",
            explanation: "Overheidsinkomsten blijven nodig.",
        },
    });

    await prisma.knowledgeQuestion.create({
        data: {
            statementId: statement.id,
            topicId: klimaat.id,
            questionText: "Welke sector stoot in Nederland het meest CO2 uit?",
            options: [
                "Industrie en energie",
                "Landbouw",
                "Luchtvaart",
            ],
            correctOptionIndex: 0,
            difficulty: 1,
        },
    });

    await prisma.userTopicPreference.create({
        data: {
            userId: admin.id,
            topicId: klimaat.id,
            selected: true,
        },
    });
}

seed()
    .catch((error) => {
        console.error("Seed failed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
