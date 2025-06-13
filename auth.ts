import NextAuth, { User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "./database/drizzle";
import { users } from "./database/schema";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                if (!credentials || !credentials.email || !credentials.password) { return null; }

                const user = await db.select().from(users).where(eq(users.email, credentials.email.toString())).limit(1);

                if (!user || user.length === 0) {
                    return null;
                }
                const isPasswordValid = await compare(credentials.password.toString(), user[0].password);
                // const isPasswordValid = user[0].password === credentials.password.toString(); // Replace with your password hashing logic
                if (!isPasswordValid) {
                    return null;
                }
                return {
                    id: user[0].id.toString(),
                    name: user[0].fullName,
                    email: user[0].email,
                    // IDCard: user[0].IDCard
                } as User;
            }

        })
    ],
    pages: {
        signIn: "/sign-in",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                // token.email = user.email;
                // token.IDCard = user.IDCard;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name as string;
                // session.user.email = token.email as string;
                // session.user.IDCard = token.IDCard as string;
            }
            return session;
        }
    },
})