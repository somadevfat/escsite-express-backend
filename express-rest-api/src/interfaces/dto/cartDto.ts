import { z } from 'zod';

// カート更新: 厳格化
// - 未知キーは拒否
// - quantity 上限を追加（業務要件に応じて調整。ここでは 999）
// - item_id の配列内重複を禁止
const cartItemSchema = z
  .object({
    item_id: z.number().int().positive(),
    quantity: z.number().int().min(0).max(999),
  })
  .strict();

export const updateCartSchema = z.object({
  body: z
    .array(cartItemSchema)
    .min(1)
    .refine(
      (items) => {
        const ids = new Set<number>();
        for (const it of items) {
          if (ids.has(it.item_id)) return false;
          ids.add(it.item_id);
        }
        return true;
      },
      { message: 'Duplicate item_id is not allowed' }
    ),
});


