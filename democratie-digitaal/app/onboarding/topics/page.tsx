import prisma from "@/lib/prisma";
import TopicSelectionClient from "./TopicSelectionClient";

export const dynamic = "force-dynamic";

export default async function TopicSelectionPage() {
    // Fetch topics from database
    const topics = await prisma.topic.findMany({
        select: {
            id: true,
            name: true,
            icon: true,
        },
    });

    const initialSelectedIds = topics.map((t) => t.id);

    return (
        <div className="min-h-[calc(100-72px)] flex items-center justify-center p-6">
            <TopicSelectionClient
                topics={topics}
                initialSelectedIds={initialSelectedIds}
            />
        </div>
    );
}
