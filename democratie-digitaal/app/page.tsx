"use client";

import { useState } from "react";
import KnowledgeCard from "@/components/voting/KnowledgeCard";
import StatementCard from "@/components/voting/StatementCard";

// Mock data for demonstration
const mockData = [
  {
    theme: "Economie",
    knowledge: {
      question:
        "Wat is het huidige maximale tarief voor de hypotheekrenteaftrek?",
      options: ["36,93%", "49,50%", "52,00%", "Ik weet het niet"],
      correctIndex: 0,
    },
    statement: "De hypotheekrenteaftrek moet versneld worden afgebouwd.",
  },
  {
    theme: "Klimaat",
    knowledge: {
      question: "Wat is het doel van het Klimaatakkoord voor 2030?",
      options: [
        "25% minder CO2",
        "49% minder CO2",
        "55% minder CO2",
        "Ik weet het niet",
      ],
      correctIndex: 2,
    },
    statement:
      "Er moet meer geïnvesteerd worden in kernenergie als onderdeel van de energietransitie.",
  },
  {
    theme: "Zorg",
    knowledge: {
      question: "Hoeveel procent van het BBP besteedt Nederland aan zorg?",
      options: ["8%", "10%", "13%", "Ik weet het niet"],
      correctIndex: 2,
    },
    statement: "Het eigen risico in de zorg moet worden afgeschaft.",
  },
];

type Phase = "knowledge" | "statement";

interface VoteResult {
  theme: string;
  vote: "disagree" | "neutral" | "agree" | "skip";
  knowledgeCorrect: boolean;
}

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("knowledge");
  const [knowledgeCorrect, setKnowledgeCorrect] = useState(false);
  const [results, setResults] = useState<VoteResult[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const total = mockData.length;
  const currentItem = mockData[currentIndex];

  const handleKnowledgeAnswer = (selectedIndex: number) => {
    const isCorrect = selectedIndex === currentItem.knowledge.correctIndex;
    setKnowledgeCorrect(isCorrect);
    setPhase("statement");
  };

  const handleVote = (vote: "disagree" | "neutral" | "agree") => {
    const result: VoteResult = {
      theme: currentItem.theme,
      vote,
      knowledgeCorrect,
    };
    setResults([...results, result]);
    moveToNext();
  };

  const handleSkip = () => {
    const result: VoteResult = {
      theme: currentItem.theme,
      vote: "skip",
      knowledgeCorrect,
    };
    setResults([...results, result]);
    moveToNext();
  };

  const moveToNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex(currentIndex + 1);
      setPhase("knowledge");
      setKnowledgeCorrect(false);
    } else {
      setIsComplete(true);
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="card w-full max-w-2xl text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Bedankt voor je deelname!
          </h2>
          <p className="text-gray-600 mb-6">
            Je hebt {results.length} stellingen beantwoord.
          </p>
          <div className="text-left bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium mb-2">Resultaten:</h3>
            <ul className="space-y-2 text-sm">
              {results.map((r, i) => (
                <li key={i} className="flex justify-between">
                  <span>{r.theme}</span>
                  <span className="text-gray-500">
                    {r.vote === "agree"
                      ? "Eens"
                      : r.vote === "disagree"
                        ? "Oneens"
                        : r.vote === "neutral"
                          ? "Geen mening"
                          : "Overgeslagen"}
                    {r.knowledgeCorrect && " ✓"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      {phase === "knowledge" ? (
        <KnowledgeCard
          theme={currentItem.theme}
          counter={`Vraag ${currentIndex + 1} / ${total}`}
          question={currentItem.knowledge.question}
          options={currentItem.knowledge.options}
          onAnswer={handleKnowledgeAnswer}
        />
      ) : (
        <StatementCard
          theme={currentItem.theme}
          counter={`Stelling ${currentIndex + 1} / ${total}`}
          statement={currentItem.statement}
          onVote={handleVote}
          onSkip={handleSkip}
        />
      )}
    </div>
  );
}
