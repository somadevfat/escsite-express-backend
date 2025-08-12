# 決定ログ: PUT /items/{ItemId} の仕様修正

## 日付
2025-08-12

## 課題
Swagger UI上で `PUT /items/{ItemId}` を実行すると、バリデーションエラーが発生した。
調査の結果、OpenAPIの仕様書 `docs/requests/items/PutRequest.yml` と、元のLaravel実装のバリデーションルールに以下の矛盾があることが判明した。

1.  **ボディ内のID**: 仕様書ではリクエストボディに `id` が必須とされていたが、元のLaravel実装 (`UpdateRequest.php`) では `id` を要求していなかった。
2.  **contentの必須要件**: 仕様書では `content` が任意となっていたが、元のLaravel実装では必須項目だった。

## 原因
- `swagger-php` (Laravel側) が仕様書の矛盾を吸収してよしなに解釈していたのに対し、Node.js側の `swagger-ui-express` は仕様書を厳格に解釈するため、矛盾がエラーとして表面化した。
- おそらく、仕様書作成時のコピー＆ペーストミスが原因で、元の実装と乖離した仕様書ができていた。

## 決定事項
- **「元のLaravel実装のロジックこそが正である」** と判断。
- 矛盾を解消するため、OpenAPIの仕様書 (`PutRequest.yml`) の方を、元のLaravel実装に合わせて修正する。
  - `required` から `- id` を削除する。
  - `required` に `- content` を追加する。
- 上記の修正された仕様書に沿って、Node.js側の実装（バリデーションスキーマ等）も修正する。

---
## 追記 (同日)

### 課題
上記修正後、Swagger UI上で `PUT /items/{ItemId}` を実行しようとした際、URLパスパラメータである `ItemId` の入力欄が表示されない問題が発覚した (`DELETE` には表示されていた)。

### 原因
- `docs/paths/items/itemId/index.yml` ファイル内の `put` の定義に、`parameters` セクションが丸ごと欠落していた。
- これも仕様書の記述ミスであり、`swagger-cli` が仕様通りに `parameters` のない `put` を生成したため、Swagger UIに入力欄が表示されなかった。

### 決定事項
- `itemId/index.yml` の `put` セクションに、`get` や `delete` と同様の `parameters` 定義を追記する。
- これにより、すべてのHTTPメソッドでパスパラメータの定義が統一され、Swagger UIの表示が正常になることを期待する。

---
## 追記2 (同日) - OpenAPI仕様の根本的矛盾解決

### 課題
Node.js実装に移行後も、Swagger UIでのGET/PUT/DELETE `/items/{ItemId}` エンドポイントで404エラーが継続発生した。

### 詳細調査結果
bundle.ymlに**OpenAPI 3.0仕様に違反する矛盾**を発見：

```yaml
'/items/{itemId}':     # パス定義: {itemId} (小文字のi)
  get:
    parameters:
      - name: ItemId   # パラメータ名: ItemId (大文字のI)
```

### 根本原因
- **OpenAPI 3.0の仕様**: パス内の`{itemId}`とパラメータ名`ItemId`は完全に一致している必要がある
- **Laravel環境**: この矛盾を内部で吸収していたため問題が表面化しなかった
- **Node.js環境**: 仕様を厳格に解釈するため、Swagger UIが正しいリクエストを生成できず404エラーが発生

### 決定事項
**大文字Iで統一**する方針を採用：

1. **bundle.yml修正**:
   - パス定義: `'/items/{itemId}'` → `'/items/{ItemId}'`
   - 参照パス: `~1items~1%7BitemId%7D` → `~1items~1%7BItemId%7D`

2. **実装統一**:
   - Express.js ルーティング: `/:ItemId`
   - コントローラー: `const { ItemId } = req.params`

3. **bundle.yml準拠の完全実装**:
   - Itemドメイン: `contents`フィールド（複数形）+ 管理用フィールド
   - ページネーション: Paginationスキーマ準拠のレスポンス形式
   - クリーンアーキテクチャ: Domain/Application/Infrastructure/Interface分離

### 結果
- ✅ Swagger UI: 正常動作 (`http://localhost:8080/api-docs/`)
- ✅ 全CRUD操作: 404エラー解決
- ✅ OpenAPI仕様: 完全準拠
- ✅ アーキテクチャ: クリーンアーキテクチャ維持

### 学習ポイント
**OpenAPIの厳密性**: 異なる実装環境間で仕様書を共有する際は、仕様書自体がOpenAPI標準に完全準拠している必要がある。内部で吸収される矛盾も、環境が変わると顕在化する可能性がある。

---
## 追記3 (同日) - Laravel実装に合わせた仕様差分修正の反映

### 目的
Laravel実装を正とし、OpenAPI仕様書側の乖離を是正する。

### 変更点一覧（docs）
- openapi.yml
  - `/auth/signup` を有効化
  - `/items/{itemId}` → `/items/{ItemId}` に統一
- bundle.yml
  - `PUT /items/{ItemId}` の `required` から `id` を削除、`content` を必須に
  - `/auth/signup` の定義を追加
  - `ItemsResponse` のタイトル表記修正
- paths/items/itemId/index.yml
  - `put` に `parameters` を明記（`ItemId`）
- requests/items/PutRequest.yml
  - `required` から `id` を削除、`content` を必須に
- schemas/models/Item.yml
  - `required.contents` → `required.content` に修正
- schemas/models/User.yml
  - `required` から `status` を削除
- params/ItemId.yml
  - 説明文を「ユーザID」→「商品ID」に修正

### 備考
- 実装側の軽微な不具合（`paginate` の `input(['limit'])`）は今回は未対応。

---

