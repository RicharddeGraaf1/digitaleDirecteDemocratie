"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LandingPage() {
    const [activeTab, setActiveTab] = useState<"start" | "why">("start");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        const result = await signIn("credentials", {
            email,
            password,
            callbackUrl: "/onboarding",
        });
        if (result?.error) {
            setError("Ongeldige inloggegevens");
        }
    };

    return (
        <div className="min-h-[calc(100vh-72px)] bg-gray-50 flex items-center justify-center p-6">
            <div className="max-w-5xl w-full space-y-8">
                <div className="flex justify-center md:justify-end">
                    <div className="inline-flex rounded-full border border-gray-200 bg-white shadow-sm overflow-hidden">
                        <button
                            onClick={() => setActiveTab("start")}
                            className={`px-6 py-2 text-xs font-bold uppercase tracking-wider transition-all ${activeTab === "start"
                                ? "text-[var(--brand-blue)] bg-blue-50"
                                : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            Direct starten
                        </button>
                        <button
                            onClick={() => setActiveTab("why")}
                            className={`px-6 py-2 text-xs font-bold uppercase tracking-wider transition-all ${activeTab === "why"
                                ? "text-[var(--brand-blue)] bg-blue-50"
                                : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            Waarom DD?
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    {/* Left side: Hero Text */}
                    <div className="space-y-6">
                        <h1 className="text-5xl font-black text-gray-900 leading-tight tracking-tighter">
                            Democratie <br />
                            <span className="text-[var(--brand-blue)]">hoe het bedoeld is.</span>
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            Democratie Digitaal combineert het geven van je mening met het toetsen
                            hoeveel kennis je hebt over de onderwerpen. Hierdoor kan er beleid gemaakt
                            worden op basis van de meningen en expertise vanuit de Nederlandse kiezer
                            in plaats van compromissen in achterkamertjes.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200" />
                                ))}
                            </div>
                            <p className="text-sm text-gray-500 font-medium flex items-center">
                                Sluit je aan bij vragende burgers
                            </p>
                        </div>
                    </div>

                    {activeTab === "start" ? (
                        <div className="card shadow-2xl bg-white border-none">
                            <div className="space-y-6 animate-in fade-in duration-500">
                                <form onSubmit={handleLogin} className="space-y-4">
                                    {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Gebruikersnaam / E-mail</label>
                                        <input
                                            type="text"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all text-gray-900"
                                            placeholder="burger / admin"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Wachtwoord</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all text-gray-900"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <button type="submit" className="btn-primary w-full py-4 text-lg">
                                        Inloggen & Starten
                                    </button>
                                </form>
                                <div className="relative flex items-center gap-4 py-2">
                                    <div className="flex-1 border-t border-gray-100" />
                                    <span className="text-xs text-gray-300 font-bold uppercase">of</span>
                                    <div className="flex-1 border-t border-gray-100" />
                                </div>
                                <Link
                                    href="/voting"
                                    className="block text-center text-sm font-bold text-gray-500 hover:text-[var(--brand-blue)] transition-colors"
                                >
                                    Doorgaan als gast &rarr;
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="card shadow-2xl bg-white border-none">
                            <div className="space-y-6 animate-in fade-in duration-500 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                <section className="space-y-4">
                                    <h3 className="text-lg font-bold text-gray-900">Onze Visie op Moderne Democratie</h3>
                                    <ul className="space-y-4">
                                        {[
                                            { title: "Innovatie boven Traditie", text: "Stemmen met papier is een relikwie uit het verleden. In een digitale wereld moet democratie toegankelijk, direct en veilig zijn." },
                                            { title: "Continuïteit in Inspraak", text: "Democratie zou niet beperkt moeten blijven tot een vierjaarlijkse gang naar de stembus. De mening van het volk is elke dag relevant." },
                                            { title: "Jouw Stem, Jouw Visie", text: "Voorkom dat je 'tegen jezelf stemt'. Door op individuele stellingen te stemmen, ben je niet langer gebonden aan starre partijprogramma's." },
                                            { title: "Kwaliteit door Kennis", text: "Nederland is gebaat bij onderbouwde keuzes. Onze optionele kennistoetsing maakt inzichtelijk waar de expertise in de samenleving ligt." },
                                            { title: "Directe Vertegenwoordiging", text: "Breng de focus terug naar de inhoud. Geen politieke compromissen meer die jouw standpunten overschaduwen." }
                                        ].map((item, i) => (
                                            <li key={i} className="flex gap-3">
                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--brand-blue)] shrink-0" />
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-bold text-gray-900 block mb-0.5">{item.title}</span>
                                                    {item.text}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                </section>

                                <section className="pt-4 border-t border-gray-50 space-y-4">
                                    <h3 className="text-sm font-bold text-[var(--brand-blue)] uppercase tracking-wider">Veelgehoorde Tegenargumenten</h3>
                                    <div className="space-y-4">
                                        {[
                                            { q: "Is het onethisch om stemmen te wegen?", a: "Een wegingsfactor is optioneel. We kunnen stemmen als gelijkwaardig behandelen terwijl we waardevolle inzichten verzamelen over het kennisniveau bij specifieke thema's." },
                                            { q: "Zullen mensen nog wel lastige keuzes maken?", a: "Dit is in het huidige stelsel ook de uitdaging. DD helpt beleidsmakers juist door het draagvlak bij een goed geïnformeerde burgerij inzichtelijk te maken." },
                                            { q: "Kunnen mensen de toetsvragen niet oefenen?", a: "Dat zou prachtig zijn! Als burgers zich gaan inlezen om de materie te begrijpen, verhoogt dit de algehele kwaliteit van de democratie." }
                                        ].map((item, i) => (
                                            <div key={i} className="bg-gray-50 p-4 rounded-xl space-y-2 border border-gray-100">
                                                <p className="text-xs font-bold text-gray-900">"{item.q}"</p>
                                                <p className="text-xs text-gray-600 leading-relaxed italic">{item.a}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                    <p className="text-xs text-blue-700 italic text-center font-medium">
                                        "Weten waar je over praat, maakt je stem krachtiger."
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
