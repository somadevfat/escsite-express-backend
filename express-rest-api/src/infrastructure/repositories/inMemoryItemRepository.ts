import { IItemRepository } from '../../domain/repositories/itemRepository';
import { Item } from '../../domain/entities/item';
import { ItemsResponse } from '../../domain/entities/pagination';
import { RepositorySearchParams, ItemSearchParams } from '../../types';

export class InMemoryItemRepository implements IItemRepository {
  // 初期データをいくつか設定しておく
  private items: Item[] = [
    {
      id: 1,
      name: '高機能ボールペン',
      price: 1000,
      content: '書き心地が滑らかなボールペンです。',
      createdAt: '2023-03-14T19:32:41.000Z',
      updatedAt: '2023-03-15T18:03:09.000Z',
      createdBy: 1,
      updatedBy: 1
    },
    {
      id: 2,
      name: 'シンプルノート',
      price: 500,
      content: '無地で使いやすいノート。',
      createdAt: '2023-03-14T19:32:41.000Z',
      updatedAt: '2023-03-15T18:03:09.000Z',
      createdBy: 1,
      updatedBy: 1
    },
    {
      id: 3,
      name: '強力消しゴム',
      price: 200,
      content: 'よく消えることで評判の消しゴムです。',
      createdAt: '2023-03-14T19:32:41.000Z',
      updatedAt: '2023-03-15T18:03:09.000Z',
      createdBy: 1,
      updatedBy: 1
    },
    {
      id: 4,
      name: '多機能ペンケース',
      price: 1500,
      content: '収納力抜群のペンケース。',
      createdAt: '2023-03-14T19:32:41.000Z',
      updatedAt: '2023-03-15T18:03:09.000Z',
      createdBy: 1,
      updatedBy: 1
    },
    {
      id: 5,
      name: '万年筆セット',
      price: 5000,
      content: '初心者向けの万年筆セットです。',
      createdAt: '2023-03-14T19:32:41.000Z',
      updatedAt: '2023-03-15T18:03:09.000Z',
      createdBy: 1,
      updatedBy: 1
    }
  ];
  private nextId = 6;

  async findAll(params: RepositorySearchParams = {}): Promise<Item[]> {
    // パラメータを分割代入し、ページネーションのデフォルト値を設定
    const { limit = 10, offset = 0, name_like, price_gte, price_lte, price_gt, price_lt } = params;

    // フィルタリングのベースとなる配列を準備
    let filteredItems = this.items;

    // 条件: name_like (名前の部分一致)
    if (name_like) {
      filteredItems = filteredItems.filter(item =>
        item.name.toLowerCase().includes(name_like.toLowerCase())
      );
    }

    // 条件: price_gte (指定価格以上)
    if (price_gte !== undefined) {
      filteredItems = filteredItems.filter(item => item.price >= price_gte);
    }

    // 条件: price_lte (指定価格以下)
    if (price_lte !== undefined) {
      filteredItems = filteredItems.filter(item => item.price <= price_lte);
    }

    // 条件: price_gt (指定価格より大きい)
    if (price_gt !== undefined) {
      filteredItems = filteredItems.filter(item => item.price > price_gt);
    }

    // 条件: price_lt (指定価格より小さい)
    if (price_lt !== undefined) {
      filteredItems = filteredItems.filter(item => item.price < price_lt);
    }

    // フィルタリング後の配列から、指定された範囲を切り出して返す (ページネーション)
    return filteredItems.slice(offset, offset + limit);
  }

  async findAllWithPagination(params: ItemSearchParams = {}): Promise<ItemsResponse> {
    // パラメータを分割代入し、ページネーションのデフォルト値を設定
    const { limit = 20, page = 1, name_like, price_gte, price_lte, price_gt, price_lt } = params;
    const offset = (page - 1) * limit;

    // フィルタリングのベースとなる配列を準備
    let filteredItems = this.items;

    // 条件: name_like (名前の部分一致)
    if (name_like) {
      filteredItems = filteredItems.filter(item =>
        item.name.toLowerCase().includes(name_like.toLowerCase())
      );
    }

    // 条件: price_gte (指定価格以上)
    if (price_gte !== undefined) {
      filteredItems = filteredItems.filter(item => item.price >= price_gte);
    }

    // 条件: price_lte (指定価格以下)
    if (price_lte !== undefined) {
      filteredItems = filteredItems.filter(item => item.price <= price_lte);
    }

    // 条件: price_gt (指定価格より大きい)
    if (price_gt !== undefined) {
      filteredItems = filteredItems.filter(item => item.price > price_gt);
    }

    // 条件: price_lt (指定価格より小さい)
    if (price_lt !== undefined) {
      filteredItems = filteredItems.filter(item => item.price < price_lt);
    }

    // ページネーション情報を計算
    const total = filteredItems.length;
    const lastPage = Math.ceil(total / limit);
    const from = total > 0 ? offset + 1 : 0;
    const to = Math.min(offset + limit, total);

    // URL生成（実際の実装では環境変数から取得）
    const baseUrl = 'http://localhost:8080/api/items';
    const buildUrl = (pageNum: number) =>
      `${baseUrl}?limit=${limit}&page=${pageNum}`;

    const data = filteredItems.slice(offset, offset + limit);

    return {
      data,
      currentPage: page,
      from,
      lastPage,
      lastPageUrl: buildUrl(lastPage),
      nextPageUrl: page < lastPage ? buildUrl(page + 1) : null,
      path: baseUrl,
      perPage: limit,
      prevPageUrl: page > 1 ? buildUrl(page - 1) : null,
      to,
      total
    };
  }

  async findById(id: number): Promise<Item | null> {
    const item = this.items.find(i => i.id === id);
    return item || null;
  }

  async create(itemData: Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>): Promise<Item> {
    const now = new Date().toISOString();
    const defaultUserId = 1; // 実際の実装では認証されたユーザーIDを使用

    const newItem: Item = {
      id: this.nextId++,
      ...itemData,
      createdAt: now,
      updatedAt: now,
      createdBy: defaultUserId,
      updatedBy: defaultUserId,
    };
    this.items.push(newItem);
    return newItem;
  }

  async update(id: number, itemData: Partial<Omit<Item, 'id' | 'createdAt' | 'createdBy'>>): Promise<Item | null> {
    const itemIndex = this.items.findIndex(i => i.id === id);
    if (itemIndex === -1) {
      return null;
    }

    const defaultUserId = 1; // 実際の実装では認証されたユーザーIDを使用

    this.items[itemIndex] = {
      ...this.items[itemIndex],
      ...itemData,
      updatedAt: new Date().toISOString(),
      updatedBy: defaultUserId
    };
    return this.items[itemIndex];
  }

  async delete(id: number): Promise<void> {
    this.items = this.items.filter(i => i.id !== id);
  }
}
