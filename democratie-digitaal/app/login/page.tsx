"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError("Ongeldige inloggegevens");
        } else {
            router.push("/onboarding");
        }
    };

    return (
        <div className="min-h-[calc(100-72px)] flex items-center justify-center p-6">
            <div className="card w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-8">Inloggen</h2>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            E-mailadres
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent outline-none"
                            placeholder="naam@voorbeeld.nl"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Wachtwoord
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent outline-none"
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary w-full mt-4">
                        Inloggen
                    </button>
                </form>

                <div className="mt-8 text-center space-y-3">
                    <p className="text-sm text-gray-500">
                        Of inloggen met Google
                    </p>
                    <div className="border-t border-gray-100 pt-4">
                        <p className="text-sm text-gray-600">
                            Nog geen account?{" "}
                            <button className="text-[var(--brand-blue)] font-medium hover:underline">
                                Registreren
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
