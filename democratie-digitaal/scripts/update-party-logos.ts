import prisma from "../lib/prisma";

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

async function main() {
    console.log("Updating party logos...");

    const parties = await prisma.party.findMany();

    for (const party of parties) {
        const logoUrl = partyLogos[party.name];
        if (logoUrl) {
            await prisma.party.update({
                where: { id: party.id },
                data: { logoUrl },
            });
            console.log(`Updated logo for: ${party.name}`);
        } else {
            console.log(`No logo mapping found for: ${party.name}`);
        }
    }

    console.log("Logo update complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
