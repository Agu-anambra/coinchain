import { z } from 'zod';


export const signUpSchema = z.object({
    fullName: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
    IDCard: z.string().nonempty('ID card is required')
});

export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});