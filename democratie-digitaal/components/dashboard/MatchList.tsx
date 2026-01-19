"use client";

interface MatchResult {
    partyId: number;
    name: string;
    shortName: string;
    logoUrl?: string;
    matchPercentage: number;
}

interface MatchListProps {
    matches: MatchResult[];
}

export default function MatchList({ matches }: MatchListProps) {
    // Sort matches by percentage descending
    const sortedMatches = [...matches].sort((a, b) => b.matchPercentage - a.matchPercentage);

    return (
        <div className="space-y-3">
            {sortedMatches.map((match, index) => (
                <div
                    key={match.partyId}
                    className={`relative overflow-hidden group p-4 rounded-2xl border transition-all ${index === 0
                            ? 'bg-[var(--brand-blue)] border-[var(--brand-blue)] text-white shadow-xl shadow-blue-100'
                            : 'bg-white border-gray-100 text-gray-900 hover:border-blue-200'
                        }`}
                >
                    <div className="relative z-10 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border ${index === 0
                                    ? 'bg-white/10 border-white/20'
                                    : 'bg-gray-50 border-gray-100 text-gray-400'
                                }`}>
                                {index + 1}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg leading-tight">{match.shortName || match.name}</h3>
                                <p className={`text-[10px] uppercase font-black tracking-widest ${index === 0 ? 'text-white/60' : 'text-gray-300'}`}>
                                    {match.name}
                                </p>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-2xl font-black">{Math.round(match.matchPercentage)}%</div>
                            <div className={`text-[10px] uppercase font-black tracking-widest ${index === 0 ? 'text-white/60' : 'text-gray-400'}`}>Match</div>
                        </div>
                    </div>

                    {/* Background Progress Bar for non-first items */}
                    {index !== 0 && (
                        <div
                            className="absolute bottom-0 left-0 h-1 bg-blue-500/10 group-hover:bg-blue-500/20 transition-all duration-1000"
                            style={{ width: `${match.matchPercentage}%` }}
                        />
                    )}

                    {/* Shine effect for first place */}
                    {index === 0 && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                    )}
                </div>
            ))}
        </div>
    );
}
