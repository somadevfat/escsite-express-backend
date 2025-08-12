## Express 開発環境（Docker）

この `config` は Express（TypeScript + Prisma + MySQL）の開発用 Docker 構成です。

### 構成
- `express`（開発サーバー、`npm run dev`）: ポート `18081`
- `lh_react_mysql`（MySQL）: ポート `13307`
- `lh_react_adminer`（DB GUI）: ポート `18080`

環境変数（抜粋）:
- `DATABASE_URL=mysql://api_user:p@ssw0rd@lh_react_mysql:3306/api_db`
- `SHADOW_DATABASE_URL=mysql://api_user:p@ssw0rd@lh_react_mysql:3306/api_db_shadow`
- `JWT_SECRET=dev_secret`

### 手順
1. `cd config`
2. 初回セットアップ（ワンコマンド）: `make init`
   - コンテナ起動 → MySQL 起動待ち → Prisma `migrate deploy` → Client 生成 → Seed → ヘルスチェック → Prisma Studio 自動起動（:5555）
3. 以降の起動: `make up`
4. 停止/再起動: `make down` / `make restart`
5. ログ確認: `make logs`
6. DB リセット: `make db-reset`
7. テスト実行: `make test`

### 接続確認
- API: `http://localhost:18081/api/items` など
- Adminer: `http://localhost:18080`
  - サーバー: `lh_react_mysql`
  - ユーザー: `api_user`
  - パスワード: `p@ssw0rd`
  - DB: `api_db`
- Prisma Studio: `http://localhost:5555`（DBブラウザ。`make init` で自動起動。手動起動は `make studio`）

### 補足
- CORS は許可済み（`origin: true, credentials: true`）。フロントから直接アクセスできます。
- バリデーションエラーは 422 で `{ error, message, statusCode, validationErrors[] }` を返します。
- Prisma Studio はリアルタイム更新ではありません。DB 更新後は Studio 画面のリロード（ブラウザ更新）または Studio 再起動（`make studio`）で最新状態を反映してください。
