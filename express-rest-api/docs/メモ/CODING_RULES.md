# コーディングルール・ガイドライン

express-typescript-skeletonプロジェクトを参考にした、クリーンアーキテクチャに基づくTypeScript + Express APIプロジェクトのコーディングルールとベストプラクティス集です。

## 目次

1. [プロジェクト構造](#プロジェクト構造)
2. [アーキテクチャ原則](#アーキテクチャ原則)
3. [TypeScript設定](#typescript設定)
4. [ESLint・Prettier設定](#eslintprettier設定)
5. [ネーミング規則](#ネーミング規則)
6. [ディレクトリ構造](#ディレクトリ構造)
7. [各層の実装ルール](#各層の実装ルール)
8. [依存関係管理](#依存関係管理)
9. [テスト戦略](#テスト戦略)
10. [パフォーマンスと監視](#パフォーマンスと監視)

## プロジェクト構造

### 基本構造

```
src/
├── application/        # アプリケーション層（ユースケース）
├── domain/            # ドメイン層（エンティティ、値オブジェクト、リポジトリ）  
├── infrastructure/    # インフラストラクチャ層（外部システム連携）
├── presentation/      # プレゼンテーション層（REST API）
├── types/            # 型定義
├── index.ts          # エントリーポイント
└── healthcheck.ts    # ヘルスチェック
```

### 意図とメリット

この構造は**ヘキサゴナルアーキテクチャ（ポート&アダプター）**を採用しており、以下のメリットがあります：

- **依存関係の逆転**: 外側の層（infrastructure）が内側の層（domain）に依存
- **テスタビリティ**: 各層が独立してテスト可能
- **保守性**: 変更影響範囲の最小化
- **拡張性**: 新機能の追加が容易

## アーキテクチャ原則

### 1. 依存関係の方向

```
Presentation → Application → Domain ← Infrastructure
```

- **ドメイン層**: 他の層に依存しない（純粋なビジネスロジック）
- **アプリケーション層**: ドメイン層のみに依存
- **インフラストラクチャ層**: ドメイン層の抽象化を実装
- **プレゼンテーション層**: アプリケーション層とドメイン層に依存

### 2. 重要な制約

```typescript
// ❌ ドメイン層でインフラストラクチャの実装を参照
import { PrismaClient } from '@prisma/client';

// ✅ ドメイン層で抽象化を定義
abstract class UserRepository {
  public abstract findByUuid(uuid: UserUuid): Promise<Nullable<User>>;
}
```

## TypeScript設定

### tsconfig.json のポイント

```json
{
  "compilerOptions": {
    "strict": true,                    // 厳格型チェック有効
    "noUnusedLocals": true,           // 未使用変数エラー
    "noUnusedParameters": true,       // 未使用パラメータエラー
    "noImplicitReturns": true,        // 戻り値の型明示必須
    "experimentalDecorators": true,   // デコレータサポート
    "emitDecoratorMetadata": true,    // メタデータ生成
    "paths": {                        // パスエイリアス設定
      "@application/*": ["src/application/*"],
      "@domain/*": ["src/domain/*"],
      "@infrastructure/*": ["src/infrastructure/*"],
      "@presentation/*": ["src/presentation/*"]
    }
  }
}
```

### 重要なルール

1. **明示的な戻り値の型**: すべての関数で戻り値の型を明示
2. **strictプロパティ**: 型安全性を最大化
3. **パスエイリアス**: 相対パス（`../`）を禁止し、エイリアスを使用

## ESLint・Prettier設定

### ESLintの重要なルール

```javascript
// .eslintrc.js の重要設定
{
  // TypeScript推奨設定
  '@typescript-eslint/explicit-function-return-type': 'error',
  '@typescript-eslint/explicit-member-accessibility': 'error',
  
  // インポート順序管理
  'simple-import-sort/imports': 'error',
  'no-restricted-imports': [
    'error',
    {
      patterns: [
        {
          group: ['../*'],
          message: '相対パスでの親ディレクトリ参照を禁止。パスエイリアスを使用してください'
        }
      ]
    }
  ],
  
  // ヘキサゴナルアーキテクチャ強制
  'hexagonal-architecture/enforce': ['error']
}
```

### Prettierの設定

```javascript
// .prettierrc.js
{
  printWidth: 120,        // 行幅制限
  singleQuote: true,      // シングルクォート使用
  trailingComma: 'none',  // 末尾カンマなし
  semi: true,             // セミコロン必須
  arrowParens: 'avoid'    // アロー関数の括弧最小化
}
```

## ネーミング規則

### ファイル・ディレクトリ命名

```
├── kebab-case/           # ディレクトリはケバブケース
├── PascalCase.ts         # クラス・エンティティファイル
├── camelCase.ts          # 関数・サービスファイル
├── snake_case.spec.ts    # テストファイル
└── UPPER_CASE.md         # 設定・ドキュメント
```

### コード内の命名

```typescript
// ✅ 推奨パターン
class UserRepository {}           // PascalCase: クラス
interface UserData {}            // PascalCase: インターフェース
type UserRole = string;          // PascalCase: 型エイリアス
const findUserById = () => {};   // camelCase: 関数・変数
const MAX_RETRY_COUNT = 3;       // UPPER_SNAKE_CASE: 定数

// 特別なパターン
abstract class UserRepository {} // ドメインサービス・リポジトリ
class PrismaUserRepository {}   // 実装クラス（技術的接頭辞）
```

## ディレクトリ構造

### 各層の構造

```
src/
├── application/
│   ├── users/
│   │   ├── find/
│   │   │   ├── find-user.usecase.ts      # ユースケース実装
│   │   │   ├── find-user.request.ts      # リクエストDTO
│   │   │   └── index.ts                  # エクスポート
│   │   ├── search-all/
│   │   ├── authentication/
│   │   └── user.response.ts              # レスポンスDTO
│   └── shared/
│       ├── base-usecase.ts               # ベースユースケース
│       ├── usecase.decorator.ts          # DIデコレータ
│       └── usecase.request.ts            # ベースリクエスト
├── domain/
│   ├── users/
│   │   ├── user.ts                       # エンティティ
│   │   ├── user-id.ts                    # 値オブジェクト
│   │   ├── user-email.ts                 # 値オブジェクト
│   │   ├── user.repository.ts            # リポジトリ抽象化
│   │   └── user-not-exists.exception.ts  # ドメイン例外
│   └── shared/
│       ├── entities/
│       ├── value-object/
│       └── exceptions/
├── infrastructure/
│   ├── users/
│   │   ├── prisma-user.repository.ts     # リポジトリ実装
│   │   └── prisma-user.mapper.ts         # マッピング
│   └── shared/
│       ├── persistence/
│       ├── cache/
│       └── logger/
└── presentation/
    └── rest/
        ├── controllers/
        │   └── users/
        │       ├── user.controller.ts     # コントローラー
        │       └── user.api-response.ts   # APIレスポンス
        ├── middlewares/
        ├── filters/
        └── server.ts                      # サーバー設定
```

### ディレクトリ命名の意図

- **機能別分割**: users、sessions、healthのように機能ごとに分割
- **操作別サブディレクトリ**: find、search-all、authenticationのように操作ごとに分割
- **層別明確化**: 各層の責務を明確に分離

## 各層の実装ルール

### 1. ドメイン層（Domain Layer）

**責務**: ビジネスルールとドメインロジック

```typescript
// ✅ エンティティの実装例
export class User extends DomainEntity {
  private constructor(
    private readonly id: Nullable<UserId>,
    private readonly uuid: UserUuid,
    private readonly email: UserEmail,
    // ... その他のプロパティ
  ) {
    super();
  }

  // ファクトリーメソッド
  public static create(
    uuid: UserUuid,
    email: UserEmail,
    // ... パラメータ
  ): User {
    return new User(undefined, uuid, email);
  }

  // ドメインロジック
  public async passwordMatches(plainPassword: string): Promise<boolean> {
    return this.passwordHash.checkIfMatchesWithPlainPassword(plainPassword);
  }
}

// ✅ 値オブジェクトの実装例
export class UserEmail extends StringValueObject {
  constructor(value: string) {
    super(value);
    this.validate();
  }

  private validate(): void {
    if (!this.isValidEmail(this.value)) {
      throw new InvalidUserEmailException(this.value);
    }
  }
}

// ✅ リポジトリ抽象化
export abstract class UserRepository {
  public abstract findByUuid(uuid: UserUuid): Promise<Nullable<User>>;
  public abstract create(user: User): Promise<User>;
}
```

**ドメイン層のルール**:
- 外部ライブラリに依存しない
- 純粋なTypeScriptとビジネスロジックのみ
- 抽象化のみ定義、実装は他の層で行う

### 2. アプリケーション層（Application Layer）

**責務**: ユースケースの実装とオーケストレーション

```typescript
// ✅ ユースケースの実装例
@UseCase()
export class FindUserUseCase extends BaseUseCase<FindUserRequest, UserResponse> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: Logger
  ) {
    super();
  }

  protected async performOperation(request: FindUserRequest): Promise<UserResponse> {
    const userUuid = new UserUuid(request.uuid);
    
    const user = await this.userRepository.findByUuid(userUuid);
    
    if (!user) {
      throw new UserNotExistsException(userUuid.value);
    }

    return UserResponse.fromUser(user);
  }
}

// ✅ リクエストDTOの実装例
export class FindUserRequest extends UseCaseRequest {
  constructor(
    triggeredBy: TriggeredBy,
    public readonly uuid: string
  ) {
    super(triggeredBy);
  }

  public static create(triggeredBy: TriggeredBy, uuid: string): FindUserRequest {
    return new FindUserRequest(triggeredBy, uuid);
  }

  public validate(): void {
    if (!this.uuid) {
      throw new ValidationException('UUID is required');
    }
  }
}
```

**アプリケーション層のルール**:
- 1つのユースケースクラス = 1つの操作
- ドメインオブジェクトのオーケストレーション
- トランザクション境界の管理
- DTOを使った外部とのやり取り

### 3. インフラストラクチャ層（Infrastructure Layer）

**責務**: 外部システムとの統合

```typescript
// ✅ リポジトリ実装例
@Repository({ enabled: true, type: UserRepository })
export class PrismaUserRepository extends BaseRepository<UserModel> implements UserRepository {
  constructor(private readonly usersRepository: UsersRepository) {
    super();
  }

  public async findByUuid(uuid: UserUuid): Promise<Nullable<User>> {
    const user = await this.usersRepository.findFirst({
      where: { uuid: uuid.value, deletedAt: null }
    });

    return user ? PrismaUserMapper.toDomainModel(user) : null;
  }

  public async create(user: User): Promise<User> {
    const persistenceModel = PrismaUserMapper.toPersistenceModel(user);
    const createdUser = await this.usersRepository.create({
      data: this.getAuditablePersitenceModel(RepositoryAction.CREATE, persistenceModel)
    });
    
    return PrismaUserMapper.toDomainModel(createdUser);
  }
}

// ✅ マッパーの実装例
export class PrismaUserMapper {
  public static toDomainModel(user: UserModel): User {
    return new User(
      user.id ? new UserId(user.id) : null,
      new UserUuid(user.uuid),
      new UserEmail(user.email),
      // ... 他のマッピング
    );
  }

  public static toPersistenceModel(user: User): Prisma.UserCreateInput {
    return {
      uuid: user.uuid.value,
      email: user.email.value,
      // ... 他のマッピング
    };
  }
}
```

**インフラストラクチャ層のルール**:
- ドメインの抽象化を実装
- データベース、外部API、ファイルシステムなどとの連携
- マッパーでドメインオブジェクトと永続化モデルを変換
- 技術的詳細をこの層に封じ込める

### 4. プレゼンテーション層（Presentation Layer）

**責務**: HTTP APIの提供

```typescript
// ✅ コントローラーの実装例
@RestController('/users')
@Tags({ name: 'User', description: 'User management' })
export class UserController {
  constructor(
    private readonly findUserUseCase: FindUserUseCase,
    private readonly searchAllUsersUseCase: SearchAllUsersUseCase
  ) {}

  @Get('/:uuid')
  @WithAuth({ roles: [UserRoles.ADMIN] })
  @Title('Get user by UUID')
  @Summary('Obtain user by UUID')
  @Returns(StatusCodes.OK, UserApiResponse)
  public async findUser(
    @Context(AppConfig.TRIGGERED_BY_CONTEXT_KEY) triggeredBy: TriggeredBy,
    @PathParams('uuid') uuid: string
  ): Promise<UserApiResponse> {
    const userResponse = await this.findUserUseCase.execute(
      FindUserRequest.create(triggeredBy, uuid)
    );
    
    return UserApiResponse.fromUserResponse(userResponse);
  }
}

// ✅ APIレスポンスDTOの実装例
export class UserApiResponse {
  @Property()
  uuid: string;

  @Property()
  email: string;

  @Property()
  firstName: string;

  @Property()
  lastName: string;

  public static fromUserResponse(userResponse: UserResponse): UserApiResponse {
    const apiResponse = new UserApiResponse();
    apiResponse.uuid = userResponse.uuid;
    apiResponse.email = userResponse.email;
    apiResponse.firstName = userResponse.firstName;
    apiResponse.lastName = userResponse.lastName;
    
    return apiResponse;
  }
}
```

**プレゼンテーション層のルール**:
- HTTPリクエスト/レスポンスの処理のみ
- アプリケーション層のユースケースを呼び出し
- 認証・認可の制御
- APIドキュメント用のアノテーション

## 依存関係管理

### 1. 依存性注入（DI）

```typescript
// ✅ デコレータによるDI登録
@UseCase()
export class FindUserUseCase {}

@Repository({ enabled: true, type: UserRepository })
export class PrismaUserRepository implements UserRepository {}

// ✅ コンストラクタインジェクション
export class UserController {
  constructor(
    private readonly findUserUseCase: FindUserUseCase,
    private readonly userRepository: UserRepository  // 抽象化を注入
  ) {}
}
```

### 2. インポート順序

```typescript
// ✅ 推奨インポート順序
// 1. Node.js ビルトイン
import * as http from 'node:http';

// 2. サードパーティライブラリ
import express from 'express';
import { StatusCodes } from 'http-status-codes';

// 3. 内部モジュール（パスエイリアス使用）
import { User } from '@domain/users';
import { FindUserUseCase } from '@application/users/find';

// 4. 相対インポート（同一ディレクトリのみ）
import { UserApiResponse } from './user.api-response';
```

### 3. パスエイリアスの活用

```typescript
// ❌ 相対パスの使用
import { User } from '../../../domain/users/user';

// ✅ パスエイリアスの使用
import { User } from '@domain/users';
```

## テスト戦略

### 1. テスト分類

```
test/
├── unit/           # 単体テスト（1つのクラス・関数）
├── integration/    # 統合テスト（複数のコンポーネント）
└── e2e/           # E2Eテスト（API全体）
```

### 2. テストファイル命名

```typescript
// ファイル命名規則
user.unit.ts        // 単体テスト
user.int.ts         // 統合テスト
user.e2e.ts         // E2Eテスト
```

### 3. テスト構造例

```typescript
// ✅ 単体テストの例
describe('FindUserUseCase', () => {
  let useCase: FindUserUseCase;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = createMockUserRepository();
    useCase = new FindUserUseCase(mockUserRepository);
  });

  describe('execute', () => {
    it('should return user when exists', async () => {
      // Arrange
      const request = FindUserRequest.create(triggeredBy, validUuid);
      const expectedUser = createTestUser();
      mockUserRepository.findByUuid.mockResolvedValue(expectedUser);

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result).toEqual(expectedUserResponse);
      expect(mockUserRepository.findByUuid).toHaveBeenCalledWith(
        expect.any(UserUuid)
      );
    });
  });
});
```

### 4. Jest設定のポイント

```javascript
// jest.config.js
module.exports = {
  testMatch: ['<rootDir>/test/**/?(*.)+(unit|int|e2e|spec|test).(ts|js)'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coveragePathIgnorePatterns: [
    '<rootDir>/src/types',
    '<rootDir>/src/index.ts'
  ]
};
```

## パフォーマンスと監視

### 1. ログ出力

```typescript
// ✅ 構造化ログ
export class BaseUseCase<IRequest, IResponse> {
  public async execute(request: IRequest): Promise<IResponse> {
    const startTime = performance.now();
    
    try {
      const response = await this.performOperation(request);
      const endTime = performance.now();
      
      Logger.info(
        `${this.constructor.name}.execute(${request}) took +${endTime - startTime} ms`
      );
      
      return response;
    } catch (error) {
      Logger.error(
        `[@UseCase] ${this.constructor.name}.execute(${request}) threw error: ${error}`
      );
      throw error;
    }
  }
}
```

### 2. エラーハンドリング

```typescript
// ✅ ドメイン例外の定義
export class UserNotExistsException extends NotFoundException {
  constructor(uuid: string) {
    super(`User with UUID ${uuid} does not exist`);
  }
}

// ✅ グローバルエラーハンドラー
@ExceptionFilter(HttpException)
export class HttpExceptionFilter implements ExceptionFilterMethods {
  catch(exception: HttpException, ctx: any): void {
    const { response } = ctx;
    
    Logger.error(`HTTP Exception: ${exception.message}`, {
      statusCode: exception.status,
      stack: exception.stack
    });
    
    response.status(exception.status).json({
      statusCode: exception.status,
      message: exception.message,
      timestamp: new Date().toISOString()
    });
  }
}
```

### 3. ヘルスチェック

```typescript
// ✅ ヘルスチェック実装
@Controller('/healthz')
export class HealthController {
  @Get()
  @Returns(StatusCodes.OK)
  public async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return {
      status: 'OK',
      timestamp: new Date().toISOString()
    };
  }
}
```

## 追加のベストプラクティス

### 1. パッケージ管理

```json
{
  "scripts": {
    "dev": "cross-env NODE_ENV=development nodemon",
    "build": "run-p build:*",
    "build:compile": "rimraf dist && tsc -p tsconfig.build.json && tsc-alias -p tsconfig.build.json",
    "start": "cross-env NODE_ENV=production npm run build && node ./dist/index.js",
    "test": "cross-env NODE_ENV=test jest --verbose --colors --detectOpenHandles",
    "test:unit": "npm run test -- --testPathPattern=unit",
    "test:int": "npm run test -- --testPathPattern=integration",
    "test:e2e": "npm run test -- --testPathPattern=e2e",
    "check:types": "tsc --pretty --noEmit",
    "check:lint": "eslint . --color",
    "fix:lint": "npm run check:lint -- --fix",
    "check:format": "prettier --check .",
    "fix:format": "prettier --write ."
  }
}
```

### 2. Git Hooks（Husky）

```javascript
// .husky/pre-commit
npm run check:staged

// .lintstagedrc.js
module.exports = {
  '*.{ts,js}': ['eslint --fix', 'prettier --write'],
  '*.{json,md}': ['prettier --write']
};
```

### 3. セキュリティ

```typescript
// ✅ 認証・認可デコレータ
@WithAuth({ roles: [UserRoles.ADMIN] })
export class AdminController {}

// ✅ バリデーション
export class CreateUserRequest extends UseCaseRequest {
  public validate(): void {
    if (!this.email || !this.isValidEmail(this.email)) {
      throw new ValidationException('Valid email is required');
    }
  }
}
```

---

## まとめ

このコーディングルールは以下の価値を重視します：

1. **保守性**: 変更に強い設計
2. **テスタビリティ**: 各層が独立してテスト可能
3. **可読性**: 意図が明確なコード
4. **拡張性**: 新機能の追加が容易
5. **型安全性**: TypeScriptの恩恵を最大化

これらのルールに従うことで、品質の高い、長期間保守可能なAPIを構築できます。新しいチームメンバーがプロジェクトに参加する際も、この構造により迅速に理解し、貢献できるようになります。

初心者の方へ：最初は複雑に感じるかもしれませんが、各層の責務を明確に分離することで、実は**複雑さが管理しやすくなり**、バグが起きにくく、テストしやすいコードになります。一歩ずつ学習していけば必ず習得できます！
