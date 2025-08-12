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

/**
 * DIコンテナクラス
 * アプリケーション全体の依存性を管理
 */
export class Container {
  private static instance: Container;

  // リポジトリ
  private readonly itemRepository: IItemRepository;
  private readonly userRepository: IUserRepository;

  // ユースケース
  private readonly itemUsecase: ItemUsecase;
  private readonly userUsecase: UserUsecase;

  // コントローラー
  private readonly itemController: ItemController;
  private readonly userController: UserController;

  private constructor() {
    // 依存性の注入をここで設定
    // 注意: 依存関係の順序が重要（下位レイヤーから上位レイヤーへ）

    // Infrastructure Layer (最下位)
    this.itemRepository = new InMemoryItemRepository();
    this.userRepository = new InMemoryUserRepository();

    // Application Layer
    this.itemUsecase = new ItemUsecase(this.itemRepository);
    this.userUsecase = new UserUsecase(this.userRepository);

    // Interface Layer (最上位)
    this.itemController = new ItemController(this.itemUsecase);
    this.userController = new UserController(this.userUsecase);
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
