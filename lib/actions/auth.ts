'use server';
import { db } from '@/database/drizzle';
import { users } from '@/database/schema';
import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { signIn } from '@/auth'
import { headers } from 'next/headers';
import ratelimit from '../ratelimit';
import { redirect } from 'next/navigation';
import { workflowClient } from '../workflow';
import config from '../config';
import { revalidatePath } from 'next/cache';


export const signInWithCredentials = async (params: Pick<AuthCredentials, "email" | "password">) => {
    const { email, password } = params;

    const ip = (await headers()).get('x-forwarded-for') || '127.0.0.1';
    const { success } = await ratelimit.limit(ip)

    if (!success) return redirect('/too-fast');

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

    const ip = (await headers()).get('x-forwarded-for') || '127.0.0.1';
    const { success } = await ratelimit.limit(ip)

    if (!success) return redirect('/too-fast');

    // check if user exists already
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (existingUser.length > 0) {
        return { success: false, message: 'User already exists with this email' };
    }

    const hashedPassword = await hash(password, 10);

    try {
        await db.insert(users).values({
            fullName,
            email,
            password: hashedPassword,
            IDCard,
        });

        // await workflowClient.trigger({
        //     url: `${config.env.prodApiEndPoint}/api/workflows/onboarding`, body: {
        //         email,
        //         fullName,
        //     }
        // });
        try {
    await workflowClient.trigger({
      url: `${config.env.prodApiEndPoint}/api/workflows/onboarding`,
      body: {
        email,
        fullName,
      },
    });
  } catch (workflowErr) {
    console.error("Workflow trigger failed:", workflowErr);
    // optional: continue even if this fails
  }
        await signInWithCredentials({ email, password });

        return { success: true, message: 'User created successfully' };
    } catch (error) {
        console.error('Error creating user during signup:', error);
        return { success: false, message: 'Signup error' };
    }



}

export async function updateUserRole(formData: FormData) {
  const userId = formData.get('userId') as string;
  if (!userId) return;
  try {
    await db.update(users)
      .set({ role: 'ADMIN' })
      .where(eq(users.id, userId));

    revalidatePath('/admin/users'); // to refresh the page data
    // return { success: true };
  } catch (error) {
    console.error('Error promoting user to admin:', error);
    // return { success: false, message: 'Failed to update user role' };
  }
}