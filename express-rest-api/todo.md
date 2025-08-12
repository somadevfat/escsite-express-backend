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
- [ ] **`itemController` の改修**: `req.query` から `offset` の代わりに `page` を受け取るように変更。
- [ ] **`itemUsecase` の改修**: `page` パラメータを受け取り、`offset` に変換するロジック (`offset = (page - 1) * limit`) を追加。
- [ ] **`itemRepository` (I/F) の改修**: `findAll` の引数に `price_gt`, `price_lt` を追加。
- [ ] **`inMemoryItemRepository` (実装) の改修**: `price_gt`, `price_lt` のフィルタリングロジックを実装。
- [ ] **`items.rest` のテストケース修正**: `offset` を使うようにしているテストを `page` を使うように修正。

### P1.6: Refactor Item ID to Number (OpenAPI準拠)
- [ ] `domain/item.ts`: `Item.id` の型を `number` に変更
- [ ] `domain/itemRepository.ts`: メソッドの `id` 引数の型を `number` に変更
- [ ] `infrastructure/inMemoryItemRepository.ts`: ID生成ロジックと初期データを `number` 型に修正
- [ ] `application/itemUsecase.ts`: メソッドの `id` 引数の型を `number` に変更
- [ ] `interfaces/itemController.ts`: パスパラメータを `:ItemId` として `number` 型で処理
- [ ] `src/index.ts` (Router): ルートのパスパラメータを `:id` から `:ItemId` に変更
- [ ] `items.rest`: テスト変数を `number` 型に修正

### P2: `carts`機能の実装
- [ ] **Cartモデルの作成**: `src/domain/cart.ts`
- [ ] **CartRepositoryの作成**: `src/domain/cartRepository.ts` (I/F), `src/infrastructure/inMemoryCartRepository.ts` (実装)
- [ ] **CartUsecaseの作成**: `src/application/cartUsecase.ts`
- [ ] **CartControllerの作成**: `src/interfaces/cartController.ts`
- [ ] **ルーティングの設定**: `src/infrastructure/cartRouter.ts`, `src/index.ts`

### P3: `auth`, `my/user`機能の実装
- [ ] **認証機能の実装 (`/auth`)**
    - [ ] サインイン (`/signin`)
    - [ ] サインアウト (`/signout`)
    - [ ] 管理者サインイン (`/admin/signin`)
- [ ] **ログインユーザー情報取得機能の実装 (`/my/user`)**

## Phase 2: データベース導入 (永続化)
API機能が固まったら、データを永続化するためにデータベースを導入します。

### P4: Prismaのセットアップ
- [ ] `Prisma` と `Prisma Client` のインストール
- [ ] `prisma/schema.prisma` ファイルの作成と設定 (DB接続情報、`User`, `Item`, `Cart` モデルの定義)
- [ ] `prisma migrate dev` を実行して、データベースにテーブルを作成

### P5: リポジトリのPrisma対応
- [ ] `ItemRepository` のPrisma実装 (`PrismaItemRepository`) を作成
- [ ] `CartRepository` のPrisma実装 (`PrismaCartRepository`) を作成
- [ ] `UserRepository` のPrisma実装 (`PrismaUserRepository`) を作成
- [ ] `src/index.ts` でインメモリリポジトリをPrismaリポジトリに差し替える

## Phase 3: 本番環境準備 (デプロイ)
アプリケーションを本番環境で動かすための準備をします。

### P6: Docker環境の構築
- [ ] `Dockerfile` の作成 (Node.jsアプリケーションをコンテナ化)
- [ ] `docker-compose.yml` の作成 (アプリケーション、データベース(例: PostgreSQL)を連携して起動)

### P7: Nginxの導入
- [ ] `Nginx` の設定ファイルを作成 (リバースプロキシとしてリクエストをNode.jsアプリに転送)
- [ ] `docker-compose.yml` に `Nginx` サービスを追加
