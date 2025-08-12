/**
 * DI Container
 * 依存性の注入を管理する責務を持つ
 */

import { ItemUsecase } from '../application/usecases/itemUsecase';
import { IItemRepository } from '../domain/repositories/itemRepository';
import { InMemoryItemRepository } from '../infrastructure/repositories/inMemoryItemRepository';
import { ItemController } from '../interfaces/controllers/itemController';
import { UserUsecase } from '../application/usecases/userUsecase';
import { IUserRepository } from '../domain/repositories/userRepository';
import { InMemoryUserRepository } from '../infrastructure/repositories/inMemoryUserRepository';
import { UserController } from '../interfaces/controllers/userController';
import { ICartRepository } from '../domain/repositories/cartRepository';
import { InMemoryCartRepository } from '../infrastructure/repositories/inMemoryCartRepository';
import { CartUsecase } from '../application/usecases/cartUsecase';
import { CartController } from '../interfaces/controllers/cartController';
import { PrismaItemRepository } from '../infrastructure/repositories/prismaItemRepository';
import { PrismaUserRepository } from '../infrastructure/repositories/prismaUserRepository';
import { PrismaCartRepository } from '../infrastructure/repositories/prismaCartRepository';
import { IAuthRepository } from '../domain/repositories/authRepository';
import { InMemoryAuthRepository } from '../infrastructure/repositories/inMemoryAuthRepository';
import { PrismaAuthRepository } from '../infrastructure/repositories/prismaAuthRepository';
import { AuthUsecase } from '../application/usecases/authUsecase';
import { AuthController } from '../interfaces/controllers/authController';

/**
 * DIコンテナクラス
 * アプリケーション全体の依存性を管理
 */
export class Container {
  private static instance: Container;

  // リポジトリ
  private readonly itemRepository: IItemRepository;
  private readonly userRepository: IUserRepository;
  private readonly cartRepository: ICartRepository;
  private readonly authRepository: IAuthRepository;

  // ユースケース
  private readonly itemUsecase: ItemUsecase;
  private readonly userUsecase: UserUsecase;
  private readonly cartUsecase: CartUsecase;
  private readonly authUsecase: AuthUsecase;

  // コントローラー
  private readonly itemController: ItemController;
  private readonly userController: UserController;
  private readonly cartController: CartController;
  private readonly authController: AuthController;

  private constructor() {
    // 依存性の注入をここで設定
    // 注意: 依存関係の順序が重要（下位レイヤーから上位レイヤーへ）

    // Infrastructure Layer (最下位)
    const usePrisma = process.env.USE_DB === 'true';
    this.itemRepository = usePrisma ? new PrismaItemRepository() : new InMemoryItemRepository();
    this.userRepository = usePrisma ? new PrismaUserRepository() : new InMemoryUserRepository();
    this.cartRepository = usePrisma ? new PrismaCartRepository() : new InMemoryCartRepository();
    this.authRepository = usePrisma ? new PrismaAuthRepository() : new InMemoryAuthRepository();

    // Application Layer
    this.itemUsecase = new ItemUsecase(this.itemRepository);
    this.userUsecase = new UserUsecase(this.userRepository);
    this.cartUsecase = new CartUsecase(this.cartRepository);
    this.authUsecase = new AuthUsecase(this.authRepository);

    // Interface Layer (最上位)
    this.itemController = new ItemController(this.itemUsecase);
    this.userController = new UserController(this.userUsecase);
    this.cartController = new CartController(this.cartUsecase);
    this.authController = new AuthController(this.authUsecase);
  }

  /**
   * シングルトンパターンでインスタンスを取得
   */
  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  /**
   * ItemControllerのインスタンスを取得
   */
  public getItemController(): ItemController {
    return this.itemController;
  }

  /**
   * ItemUsecaseのインスタンスを取得（テスト用途など）
   */
  public getItemUsecase(): ItemUsecase {
    return this.itemUsecase;
  }

  /**
   * ItemRepositoryのインスタンスを取得（テスト用途など）
   */
  public getItemRepository(): IItemRepository {
    return this.itemRepository;
  }

  /**
   * UserControllerのインスタンスを取得
   */
  public getUserController(): UserController {
    return this.userController;
  }

  /**
   * CartControllerのインスタンスを取得
   */
  public getCartController(): CartController {
    return this.cartController;
  }

  /**
   * AuthControllerのインスタンスを取得
   */
  public getAuthController(): AuthController {
    return this.authController;
  }

  /**
   * UserUsecaseのインスタンスを取得（テスト用途など）
   */
  public getUserUsecase(): UserUsecase {
    return this.userUsecase;
  }

  /**
   * UserRepositoryのインスタンスを取得（テスト用途など）
   */
  public getUserRepository(): IUserRepository {
    return this.userRepository;
  }
}
