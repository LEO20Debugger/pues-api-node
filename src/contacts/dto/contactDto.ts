import { z } from 'zod';

export const createContactDto = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string(),
  phone: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
});

export const updateContactDto = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  message: z.string().min(1, 'Message is required').optional(),
});
