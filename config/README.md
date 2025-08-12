## 環境構築

- `api`と`config`のリポジトリをクローン
  - 以下のフォルダ構成にする
  ```
  <project-name>
  ├── config // docker環境構築設定ファイル
  ├── api // Laravelプロジェクト
  ```

### 環境構築手順（Mac）

- config に移動 `cd config`
- `make init`で docker のコンテナ、server コンテナの nginx を起動する
- POST: `http://localhost:8080/api/auth/signin` の API を次のパラメータで叩き `{"email": "user@lh.sandbox","password": "pass"}` でログインする。
- http://localhost:8080 を確認
  - Laravel の初期画面が表示されれば OK

### 環境構築手順（WSL（Windows））

1. config に移動 `cd config`
2. `make init`で docker のコンテナ、server コンテナの nginx を起動する
3. `make db-fresh`で データベースをリセットする
4. config から api に移動 `cd ../api`
5. 権限を変更 `sudo chmod 777 . -R`（必ず api ディレクトリで実行してください）
6. http://localhost:8080 を確認
   - Laravel の初期画面が表示されれば OK

### API ドキュメント

http://localhost:8888

### 操作ガイド

- 各コンテナを起動して、nginx を起動する `make start`
- データベースをリセットする `make db-fresh`
- nginx を起動する `make nginx-start`
- PC を電源を落とした場合には `make up`

Docker Desktop for Mac で `Failed to get D-Bus connection: No such file or directory`
と表示される場合は別途設定が必要

[参考](https://ufirst.jp/memo/2023/01/docker-desktop-for-mac-%E3%81%A7-%E3%80%8Cfailed-to-get-d-bus-connection-no-such-file-or-directory%E3%80%8D%E3%82%A8%E3%83%A9%E3%83%BC/)
