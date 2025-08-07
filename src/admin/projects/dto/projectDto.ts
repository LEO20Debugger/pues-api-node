import { z } from 'zod';

export const createProjectDto = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  imageUrl: z.string().optional(),
  completedAt: z.string().optional(),
});

export const updateProjectDto = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  imageUrl: z.string().optional(),
  completedAt: z.string().optional(),
});
