import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";

function maskEmail(email: string) {
    const [name, domain] = email.split("@");
    if (!domain) return email.slice(0, 1) + "***";
    const safeName = name.length > 1 ? `${name[0]}***` : "***";
    return `${safeName}@${domain}`;
}

// Caution: Password hashing should be used in production (e.g., bcrypt)
export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Wachtwoord", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    console.warn("Auth: missing credentials");
                    return null;
                }

                const email = credentials.email.toLowerCase();
                const user = await prisma.user.findUnique({
                    where: { email },
                });

                if (!user) {
                    console.warn("Auth: user not found", { email: maskEmail(email) });
                    return null;
                }

                // For this specific request, we check against the passwordHash field
                // In a production app, use bcrypt.compare(credentials.password, user.passwordHash)
                if (user.passwordHash !== credentials.password) {
                    console.warn("Auth: invalid password", { email: maskEmail(email) });
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.id;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    events: {
        signIn({ user, isNewUser }) {
            console.info("Auth sign-in:", {
                userId: user.id,
                email: user.email ? maskEmail(user.email) : undefined,
                isNewUser,
            });
        },
        signOut({ token }) {
            if (!token) return;
            console.info("Auth sign-out:", {
                userId: token.id,
                email: typeof token.email === "string" ? maskEmail(token.email) : undefined,
            });
        },
    },
    logger: {
        error(code, metadata) {
            console.error("NextAuth error:", code, metadata);
        },
        warn(code) {
            console.warn("NextAuth warning:", code);
        },
        debug(code, metadata) {
            if (process.env.NODE_ENV !== "production") {
                console.debug("NextAuth debug:", code, metadata);
            }
        },
    },
};
