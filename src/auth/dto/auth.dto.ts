import { z } from 'zod';

export const signUpDto = z.object({
  email: z.string(),
  password: z.string().min(6),
  name: z.string().min(1),
});

export const signInDto = z.object({
  email: z.string(),
  password: z.string(),
});
