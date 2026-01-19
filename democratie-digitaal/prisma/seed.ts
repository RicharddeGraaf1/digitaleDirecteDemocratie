import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Start seeding...");

    // 1. Create default accounts
    // Note: Password hashing is recommended for production,
    // but for this specific request we use the plaintext/provided values.
    const users = [
        {
            email: "burger", // Username used as email for simplicity in login
            name: "Burger-gebruiker",
            passwordHash: "Burger", // In a real app, hash this!
            role: "USER" as const,
        },
        {
            email: "admin",
            name: "Administrator",
            passwordHash: "Admin",
            role: "ADMIN" as const,
        },
    ];

    for (const u of users) {
        await prisma.user.upsert({
            where: { email: u.email },
            update: {
                role: u.role,
                passwordHash: u.passwordHash,
            },
            create: u,
        });
        console.log(`User created/updated: ${u.email}`);
    }

    // 2. Add some default topics if they don't exist
    const topics = [
        { name: "Economie", icon: "💰", description: "Inkomsten, belastingen en werkgelegenheid." },
        { name: "Klimaat", icon: "🌱", description: "Natuur, milieu en energietransitie." },
        { name: "Zorg", icon: "🏥", description: "Gezondheid, ziekenhuizen en welzijn." },
        { name: "Wonen", icon: "🏠", description: "Woningmarkt en huizenbouw." },
        { name: "Immigratie", icon: "🌍", description: "Asielbeleid en integratie." },
        { name: "Onderwijs", icon: "🎓", description: "Scholen, universiteiten en innovatie." },
    ];

    for (const t of topics) {
        await prisma.topic.upsert({
            where: { name: t.name },
            update: {},
            create: t,
        });
        console.log(`Topic created/updated: ${t.name}`);
    }

    console.log("Seeding complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
