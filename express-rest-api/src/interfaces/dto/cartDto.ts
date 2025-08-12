import { z } from 'zod';

export const updateCartSchema = z.object({
  body: z
    .array(
      z.object({
        item_id: z.number().int().positive(),
        quantity: z.number().int().min(0),
      })
    )
    .min(1),
});


