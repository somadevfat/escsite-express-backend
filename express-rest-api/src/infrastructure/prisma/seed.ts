import { getPrismaClient } from './client';
import bcrypt from 'bcrypt';

export async function ensurePrismaSeed(): Promise<void> {
  const prisma = getPrismaClient();
  const users = await prisma.user.count();
  if (users === 0) {
    const passwordHash = await bcrypt.hash('pass', 10);
    await prisma.user.create({
      data: {
        email: 'admin@lh.sandbox',
        passwordHash,
        isAdmin: true,
        createdBy: 1,
        updatedBy: 1,
      },
    });
  }

  const items = await prisma.item.count();
  if (items === 0) {
    const nowUserId = 1;
    await prisma.item.createMany({
      data: [
        { name: '高機能ボールペン', price: 1000, content: '書き心地が滑らかなボールペンです。', createdBy: nowUserId, updatedBy: nowUserId },
        { name: 'シンプルノート', price: 500, content: '無地で使いやすいノート。', createdBy: nowUserId, updatedBy: nowUserId },
        { name: '強力消しゴム', price: 200, content: 'よく消えることで評判の消しゴムです。', createdBy: nowUserId, updatedBy: nowUserId },
      ],
    });
  }
}


