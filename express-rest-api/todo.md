# Todoリスト (バックエンド開発ロードマップ)

このリストは、API機能の実装からデータベース導入、デプロイ準備までのバックエンド開発に必要なタスクを管理するためのものです。

## Phase 1: API機能実装 (インメモリ)
まずはインメモリ（サーバーのメモリ上）でデータを管理し、APIのコア機能を一通り実装します。

### P1: `items`機能の完成
- [x] **GET /items APIの改修**
    - [x] クエリパラメータ (`limit`, `offset`) に対応したページネーション機能の実装
    - [x] クエリパラメータ (`name_like`, `price_gte`, `price_lte` など) に対応したフィルタリング機能の実装
    - [x] 上記に伴う `ItemUsecase` と `ItemRepository` の修正

### P1.5: OpenAPI仕様への準拠対応
- [x] **`itemController` の改修**: `req.query` から `offset` の代わりに `page` を受け取るように変更。
- [x] **`itemUsecase` の改修**: `page` パラメータを受け取り、`offset` に変換するロジック (`offset = (page - 1) * limit`) を追加。
- [x] **`itemRepository` (I/F) の改修**: `findAll` の引数に `price_gt`, `price_lt` を追加。
- [x] **`inMemoryItemRepository` (実装) の改修**: `price_gt`, `price_lt` のフィルタリングロジックを実装。
- [x] **`items.rest` のテストケース修正**: `offset` を使うようにしているテストを `page` を使うように修正。

### P1.6: Refactor Item ID to Number (OpenAPI準拠)
- [x] `domain/item.ts`: `Item.id` の型を `number` に変更
- [x] `domain/itemRepository.ts`: メソッドの `id` 引数の型を `number` に変更
- [x] `infrastructure/inMemoryItemRepository.ts`: ID生成ロジックと初期データを `number` 型に修正
- [x] `application/itemUsecase.ts`: メソッドの `id` 引数の型を `number` に変更
- [x] `interfaces/itemController.ts`: パスパラメータを `:ItemId` として `number` 型で処理
- [x] `src/index.ts` (Router): ルートのパスパラメータを `:id` から `:ItemId` に変更
- [x] `items.rest`: テスト変数を `number` 型に修正

### P2: `carts`機能の実装
- [x] **Cartモデルの作成**: `src/domain/cart.ts`
- [x] **CartRepositoryの作成**: `src/domain/cartRepository.ts` (I/F), `src/infrastructure/inMemoryCartRepository.ts` (実装)
- [x] **CartUsecaseの作成**: `src/application/cartUsecase.ts`
- [x] **CartControllerの作成**: `src/interfaces/cartController.ts`
- [x] **ルーティングの設定**: `src/infrastructure/cartRouter.ts`, `src/index.ts`

### P3: `auth`, `my/user`機能の実装
- [x] **認証機能の実装 (`/auth`)**
    - [x] サインイン (`/signin`)
    - [x] サインアウト (`/signout`)
    - [x] 管理者サインイン (`/admin/signin`)
    - [x] サインアップ (`/signup`)
- [x] **ログインユーザー情報取得機能の実装 (`/my/user`)**

### P1.7: バリデーション（Zod）追加
- [x] items: GETクエリ, POST/PUT body
- [x] auth: signin/signup body
- [x] carts: POST body（配列: { item_id, quantity }）
- [x] E2E: 成功/失敗パターンの自動テスト追加
- [x] 手動検証 REST: `express-rest-api/rest/*.rest` 追加

## Phase 2: データベース導入 (永続化)
API機能が固まったら、データを永続化するためにデータベースを導入します。

### P4: Prismaのセットアップ（MySQL）
- [ ] `Prisma` と `Prisma Client` のインストール
- [ ] `npx prisma init` により `prisma/schema.prisma` と `.env` 作成
- [ ] `.env` の `DATABASE_URL` を MySQL コンテナに合わせて設定
- [ ] モデル定義: `User`, `Item`, `Cart`（既存ドメインと整合）
- [ ] `npx prisma migrate dev --name init` で初期マイグレーション
- [ ] `npx prisma generate` でクライアント生成
- [ ] Seed スクリプト作成（初期 Item データ等）

### P5: リポジトリのPrisma対応
- [ ] `PrismaItemRepository` を作成
- [ ] `PrismaCartRepository` を作成
- [ ] `PrismaUserRepository` を作成
- [ ] DI 切替: `Container` で InMemory と Prisma の切り替え（envで制御）
- [ ] E2E: テスト DB へ migrate+seed → 既存テスト緑化

## Phase 3: 本番環境準備 (デプロイ)
アプリケーションを本番環境で動かすための準備をします。

### P6: 画像保存方針（本番ストレージ）
- [ ] 開発: ローカル `public/storage/items/{itemId}/images/{uuid}.{ext}`
- [ ] 本番: S3/MinIO + CDN（.env で切替）
- [ ] API入力は当面 `base64 + extension`、保存後はURL/パスをDB保存
- [ ] 更新時のロールバック/旧ファイル削除ルール

### P7: 認証/認可（本番仕様）
- [ ] JWT または セッション（Cookie+CSRF）方式を決定
- [ ] `/auth` 実装を本番仕様へ（疑似トークン除去、失敗時のHTTP/フォーマット整備）
- [ ] ルート毎の認可（管理者専用 等）

### P8: セキュリティ/安定性
- [ ] CORS/Helmet/RateLimit 導入
- [ ] バリデーションエラー形式/HTTP 422 を @api に準拠
- [ ] 入力サイズ上限（画像/JSON）
- [ ] `/health` と Graceful shutdown

### P9: OpenAPI/契約
- [ ] securitySchemes と `security` の明記（Bearer or Cookie）
- [ ] CI で OpenAPI 検証・コントラクトテスト

### P10: ログ/監視
- [ ] アクセス/アプリログ（マスキング）
- [ ] 監視（APM/メトリクス/アラート）

### P11: CI/CD
- [ ] Lint/Test/Build/Migrate/Deploy のパイプライン
- [ ] Secrets 管理（環境別 .env）
