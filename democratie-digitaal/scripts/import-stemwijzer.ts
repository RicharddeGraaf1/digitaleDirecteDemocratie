import prisma from "../lib/prisma";

async function main() {
    console.log("Start importing Stemwijzer data...");

    const response = await fetch(
        "https://raw.githubusercontent.com/afvanwoudenberg/stemwijzer/main/tweedekamer2025.json"
    );

    if (!response.ok) {
        throw new Error("Failed to fetch Stemwijzer data");
    }

    const data = await response.json();

    for (const item of data) {
        // 1. Create or get Statement
        const statement = await prisma.statement.create({
            data: {
                theme: item.theme,
                text: item.title,
                info: item.info,
            },
        });

        // 2. Process Positions (Parties and stances)
        for (const pos of item.positions) {
            // Create or get Party
            const party = await prisma.party.upsert({
                where: { name: pos.party },
                update: {},
                create: {
                    name: pos.party,
                },
            });

            // Map position string to enum
            let position: "EENS" | "ONEENS" | "GEEN";
            if (pos.position.toLowerCase() === "eens") position = "EENS";
            else if (pos.position.toLowerCase() === "oneens") position = "ONEENS";
            else position = "GEEN";

            // Create Stance
            await prisma.partyStance.create({
                data: {
                    partyId: party.id,
                    statementId: statement.id,
                    position: position,
                    explanation: pos.explanation,
                },
            });
        }

        console.log(`Imported statement: ${item.theme}`);
    }

    console.log("Import complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
