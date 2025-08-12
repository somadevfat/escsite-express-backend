import { Item } from '../entities/item';
import { ItemsResponse } from '../entities/pagination';
import { RepositorySearchParams, ItemSearchParams } from '../../types';

export interface IItemRepository {
  findAll(params: RepositorySearchParams): Promise<Item[]>;
  findAllWithPagination(params: ItemSearchParams): Promise<ItemsResponse>;
  findById(id: number): Promise<Item | null>;
  create(item: Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>): Promise<Item>;
  update(id: number, item: Partial<Omit<Item, 'id' | 'createdAt' | 'createdBy'>>): Promise<Item | null>;
  delete(id: number): Promise<void>;
}
