import { z } from 'zod';

export const createItemSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Name is required' }).max(255),
    price: z.number().positive(),
    content: z.string().optional(), // bundle.ymlの仕様に合わせて単数形に統一
    base64: z.string().optional(),
    extension: z.string().optional(),
  }),
});

export const updateItemSchema = z.object({
  body: z.object({
    name: z.string().max(255),
    price: z.number().positive(),
    content: z.string(), // PUTはcontent必須（決定ログに準拠）
  }),
});
