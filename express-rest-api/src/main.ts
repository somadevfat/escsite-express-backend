/**
 * アプリケーションエントリーポイント
 * アプリケーションの起動と基本設定のみを行う
 */

import express from 'express';
import dotenv from 'dotenv';
import { Container } from './config/container';
import { createApiRoutes } from './interfaces/routes/itemRoutes';

// 環境変数の読み込み
dotenv.config();

/**
 * アプリケーションを初期化し起動する
 */
async function startApplication(): Promise<void> {
  try {
    // Expressアプリケーションの作成
    const app = express();
    const port = process.env.PORT || 8080;

    // 基本的なミドルウェアの設定
    app.use(express.json());

    // DIコンテナからコントローラーを取得
    const container = Container.getInstance();
    const itemController = container.getItemController();
    const userController = container.getUserController();

    // Swagger UIの提供はこのアプリから除去（ドキュメントは別サービスで提供）

    // APIルートの設定
    app.use('/api', createApiRoutes(itemController, userController));

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
