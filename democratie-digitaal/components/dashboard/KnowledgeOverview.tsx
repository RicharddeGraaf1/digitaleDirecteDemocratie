"use client";

interface KnowledgeOverviewProps {
    stats: {
        topicId: number;
        name: string;
        icon: string;
        accuracy: number;
        questionsAnswered: number;
    }[];
}

export default function KnowledgeOverview({ stats }: KnowledgeOverviewProps) {
    if (stats.length === 0) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.map((topic) => (
                <div key={topic.topicId} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl bg-gray-50 p-2 rounded-xl">{topic.icon}</span>
                            <div>
                                <h3 className="font-bold text-gray-900 leading-tight">{topic.name}</h3>
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">
                                    {topic.questionsAnswered} vragen beantwoord
                                </p>
                            </div>
                        </div>
                        <span className={`text-xs font-black px-2 py-1 rounded-lg ${topic.accuracy >= 70 ? 'bg-green-50 text-green-600' :
                                topic.accuracy >= 40 ? 'bg-amber-50 text-amber-600' :
                                    'bg-gray-50 text-gray-400'
                            }`}>
                            {topic.accuracy}%
                        </span>
                    </div>

                    <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className={`absolute top-0 left-0 h-full transition-all duration-1000 ${topic.accuracy >= 70 ? 'bg-green-500' :
                                    topic.accuracy >= 40 ? 'bg-amber-500' :
                                        'bg-gray-300'
                                }`}
                            style={{ width: `${topic.accuracy}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
