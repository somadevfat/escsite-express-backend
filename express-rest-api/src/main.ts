/**
 * アプリケーションエントリーポイント
 * アプリケーションの起動と基本設定のみを行う
 */

import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { loadEnv } from './config/env';
import { Container } from './config/container';
import { createApiRoutes } from './interfaces/routes/itemRoutes';

// 環境変数の読み込み (.env.development があれば優先して読み込む)
loadEnv();

/**
 * アプリケーションを初期化して返す（テストでも利用）
 */
export function createApp(): Express {
  // Expressアプリケーションの作成
  const app = express();

  // 基本的なミドルウェアの設定
  app.use(helmet());
  app.use(cors({ origin: true, credentials: true }));
  const windowMsSec = Number(process.env.RATE_LIMIT_WINDOW_SEC ?? 60);
  const maxReq = Number(process.env.RATE_LIMIT_MAX ?? 1000);
  app.use(
    rateLimit({
      windowMs: windowMsSec * 1000,
      max: maxReq,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );
  app.use(express.json());

  // DIコンテナからコントローラーを取得
  const container = Container.getInstance();
  const itemController = container.getItemController();
  const userController = container.getUserController();
  const cartController = container.getCartController();
  const authController = container.getAuthController();

  // APIルートの設定
  app.use('/api', createApiRoutes(itemController, userController, cartController, authController));

  return app;
}

/**
 * アプリケーションを起動する
 */
async function startApplication(): Promise<void> {
  try {
    const app = createApp();
    const port = process.env.PORT || 18081;
    // サーバー起動
    app.listen(port, () => {
      console.log(`🚀 Server is running at http://localhost:${port}`);
      console.log(`🏗️  Architecture: Clean Architecture`);
    });

  } catch (error) {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
  }
}

// アプリケーション開始
startApplication().catch((error) => {
  console.error('💥 Unhandled error during application startup:', error);
  process.exit(1);
});
