## REST クライアントと Swagger の使い方

### 1. Swagger（ブラウザUI）
- URL: `http://localhost:8888`
- サーバー選択: 右上の Servers で `http://localhost:18081/api` を選択
- 認証（JWT）:
  1. `POST /auth/signin` を実行し、レスポンスの `token` をコピー
  2. 右上の「Authorize」をクリックし、`Bearer <token>`（`Bearer` + 半角スペース + トークン）を入力
  3. `/my/user` など保護APIを実行

注意: Swagger(8888) は表示用で、リクエストは 18081 の API に送信されます。

### 2. VS Code REST Client（.restファイル）
- 変数
  - `express-rest-api/rest/*.rest` の先頭にある `@hostname`/`@port`/`@api` は `18081` に設定済み
  - 認証が必要なリクエストは `@token` を使います

手順:
1. `POST /auth/signin` を実行
2. レスポンス JSON の `token` の値（`eyJ...`）だけをコピー
3. `items.rest` の `@token =` の右側に貼り付け
4. `Send Request` で POST/PUT/DELETE が実行可能

例: `items.rest`
```http
@hostname = http://localhost
@port = 18081
@api = {{hostname}}:{{port}}/api
@token = eyJ...    # コピーしたJWT

POST {{api}}/items
Content-Type: application/json
Authorization: Bearer {{token}}
{
  "name": "サンプル",
  "price": 1000
}
```

### 3. 422 バリデーションエラー
- バリデーション失敗時は 422 で返却
- 形式: `{ error, message, statusCode, validationErrors: [{ field, message }] }`


