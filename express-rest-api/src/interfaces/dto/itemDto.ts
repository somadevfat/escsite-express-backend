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

// GET /items クエリ用
export const listItemsQuerySchema = z.object({
  query: z.object({
    limit: z.coerce.number().int().positive().max(100).optional(),
    page: z.coerce.number().int().positive().optional(),
    name_like: z.string().optional(),
    price_gte: z.coerce.number().int().min(0).optional(),
    price_lte: z.coerce.number().int().min(0).optional(),
    price_gt: z.coerce.number().int().min(0).optional(),
    price_lt: z.coerce.number().int().min(0).optional(),
  }),
});

// URL パラメータの ItemId 検証
export const itemIdParamSchema = z.object({
  params: z.object({
    ItemId: z.coerce.number().int().positive(),
  }),
});
