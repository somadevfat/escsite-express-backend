### 目的
Node.js（Express）で本バックエンドを実装する際に参照した、既存実装（Laravel）と OpenAPI 分割ドキュメントの差分・決定事項メモ。

## 参照元
- ベースURL: `http://localhost:8080/api`
- OpenAPI 入口: `config/docs/openapi.yml`
- エンドポイント定義: `config/docs/paths/**/index.yml`
- リクエスト: `config/docs/requests/**.yml`
- レスポンス: `config/docs/responses/**.yml`
- モデル: `config/docs/schemas/models/**.yml`
- 実装（真値）: `api/routes/api.php`, `api/app/Http/Controllers/**`, `api/app/Models/**`

## 実装で確定している入出力（要点）
- 認証 POST `/auth/signin`: 入力 `email`,`password` 必須／出力 `{ token: string }`
- ユーザー GET `/my/user`: 認証必須／出力 現在ユーザー（snake_case）
- 商品 GET `/items`: クエリ `limit`（件数）, `page`（ページ）, `name_like`, `price_{lt,lte,gt,gte}`
- 商品 GET `/items/{item_id}`: 出力 Item
- 商品 POST `/items`: 入力 `name`,`price`,`content`,`base64`,`extension`（全て必須）
- 商品 PUT `/items/{item_id}`: 入力 `name`,`price`,`content`（必須）
- 商品 DELETE `/items/{item_id}`: 200 OK（body null）
- カート GET `/carts`: 認証必須／出力 自ユーザーの配列（各要素に `item` がネスト）
- カート POST `/carts`: 入力 `[{ item_id:int, quantity:int }, ...]`（item_id 重複不可、quantity=0 は削除）

## ドキュメントとの差分（修正候補）
- 命名・記法のゆれ
  - ルートのパラメータ名: 実装は `{item_id}`、ドキュメントは `{itemId}`。どちらかに統一が必要。
  - フィールドのケース: 実装は snake_case（`created_at` 等）、ドキュメントは camelCase（`createdAt` 等）。統一が必要。
- スキーマの不整合・誤記
  - `schemas/models/User.yml`: `required` に `status` があるが `properties` 未定義 → 追加するか `required` から削除。
  - `schemas/models/Item.yml`: `required` に `contents` があるが実体は `content` → `content` に統一。
  - `requests/items/StoreRequest.yml`: `required` に `id` が含まれる → 新規作成では不要のため削除。
  - `requests/items/PutRequest.yml`: `required` に `id` が含まれる → ルート `{item_id}` を使うため body の `id` は不要（削除推奨）。
  - `requests/auth/AuthSigninRequest.yml`: `title` が `AuthSignupRequest` になっている → `AuthSigninRequest` に修正。
  - `responses/items/ItemsResponse.yml`: `title` が `UsersResponse` になっている → `ItemsResponse` に修正。
  - `responses/items/ItemResponse.yml` / `responses/my/user/UserResponse.yml`: `$ref` の置き方が不正（`properties:` 直下）→ ルート直下に `$ref` を置くか、ラップする形へ修正。
  - `params/ItemId.yml`: 説明が「ユーザID」 → 「商品ID」に修正。
- 仕様差
  - タイムスタンプの表記: 実装は `Y-m-d H:i:s`（例: `2023-03-14 19:32:41`）。OpenAPI 側が `date-time` の ISO 8601 を想定している場合は要調整。
  - ページネーション: 実装は `limit` をページサイズとして参照。`page` は Laravel ページネータの標準キーを利用。

## 対応方針（推奨）
- 原則、既存実装（Laravel）を真値とし OpenAPI を実装に合わせて修正。
- Express 側の実装時も、以下を意識して合わせる:
  - ルート・パラメータ名は `{item_id}`（snake_case）で統一。
  - モデルのキーも snake_case で返却。
  - `/items` の検索クエリは `name_like`, `price_{lt,lte,gt,gte}` を踏襲。
  - `DELETE /items/{item_id}` は `200 OK` で `null` を返す挙動に合わせる。
  - 画像アップロードは `base64`（data URI）と `extension` 前提で保存し、返却時は絶対URL化。

## 備考
- 認証は Laravel Sanctum により Bearer トークン運用。Express では Bearer 検証を実装。
- Swagger UI: `http://localhost:8888` で入出力の確認が可能。

以上、Express 実装時の差分メモ。今後の修正・合意に応じて本ファイルを更新してください。


