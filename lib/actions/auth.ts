'use server';
import { db } from '@/database/drizzle';
import { users } from '@/database/schema';
import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { signIn } from '@/auth'


export const signInWithCredentials = async (params: Pick<AuthCredentials, "email" | "password">) => {
    const { email, password } = params;

    try {
        const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        if (result?.error) {
            console.error('Sign-in error:', result.error);
            return { success: false, message: result.error };
        }

        return { success: true };
    } catch (error) {
        console.error('Error during sign-in:', error);
        return { success: false, message: 'Sign-in failed' };
    }
}
export const signUp = async (params: AuthCredentials) => {
    const { fullName, email, password, IDCard } = params;

    // check if user exists already
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (existingUser.length > 0) {
        return { success: false, message: 'User already exists with this email' };
    }
    if (existingUser) {
        throw new Error('User already exists with this email');
    }

    const hashedPassword = await hash(password, 10);

    try {
        await db.insert(users).values({
            fullName,
            email,
            password: hashedPassword,
            IDCard,
        });

        await signInWithCredentials({email, password});

        return { success: true, message: 'User created successfully' };
    } catch (error) {
        console.error('Error creating user during signup:', error);
        return { success: false, message: 'Signup error' };
    }



}