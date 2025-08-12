import { IItemRepository } from '../../domain/repositories/itemRepository';
import { Item } from '../../domain/entities/item';
import { ItemsResponse } from '../../domain/entities/pagination';
import {
  ItemCreateRequest,
  ItemSearchParams,
  ItemUpdateRequest,
  UseCaseOutput
} from '../../types';

export class ItemUsecase {
  constructor(private readonly itemRepository: IItemRepository) { }

  async createItem(itemData: ItemCreateRequest): Promise<Item> {
    const newItem = await this.itemRepository.create(itemData);
    return newItem;
  }

  /**
   * 商品一覧を取得します（ページネーション付き）。
   * @param params 検索条件 (ページネーション、フィルタリング)
   */
  async getItems(params: ItemSearchParams): Promise<ItemsResponse> {
    // bundle.ymlの仕様に従ってページネーション付きのレスポンスを返す
    return this.itemRepository.findAllWithPagination(params);
  }

  async getItemById(id: number): Promise<Item | null> {
    return this.itemRepository.findById(id);
  }

  async updateItem(id: number, updates: ItemUpdateRequest): Promise<Item | null> {
    return this.itemRepository.update(id, updates);
  }

  async deleteItem(id: number): Promise<void> {
    await this.itemRepository.delete(id);
  }
}
