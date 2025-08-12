import { IItemRepository } from '../../domain/repositories/itemRepository';
import { Item } from '../../domain/entities/item';
import { ItemsResponse } from '../../domain/entities/pagination';
import { RepositorySearchParams, ItemSearchParams } from '../../types';
import { getPrismaClient } from '../prisma/client';

export class PrismaItemRepository implements IItemRepository {
  private prisma = getPrismaClient();

  async findAll(_params: RepositorySearchParams): Promise<Item[]> {
    const items = await this.prisma.item.findMany({ orderBy: { id: 'asc' } });
    return items as unknown as Item[];
  }

  async findAllWithPagination(params: ItemSearchParams = {}): Promise<ItemsResponse> {
    const { limit = 20, page = 1, name_like, price_gte, price_lte, price_gt, price_lt } = params;
    const offset = (page - 1) * limit;

    const where: any = {};
    if (name_like) where.name = { contains: name_like };
    const priceFilters: any = {};
    if (price_gte !== undefined) priceFilters.gte = price_gte;
    if (price_lte !== undefined) priceFilters.lte = price_lte;
    if (price_gt !== undefined) priceFilters.gt = price_gt;
    if (price_lt !== undefined) priceFilters.lt = price_lt;
    if (Object.keys(priceFilters).length) where.price = priceFilters;

    const [total, data] = await this.prisma.$transaction([
      this.prisma.item.count({ where }),
      this.prisma.item.findMany({ where, skip: offset, take: limit, orderBy: { id: 'asc' } }),
    ]);

    const lastPage = Math.ceil(total / limit) || 1;
    const from = total > 0 ? offset + 1 : 0;
    const to = Math.min(offset + limit, total);
    const baseUrl = 'http://localhost:8080/api/items';
    const buildUrl = (pageNum: number) => `${baseUrl}?limit=${limit}&page=${pageNum}`;

    return {
      data: data as unknown as Item[],
      currentPage: page,
      from,
      lastPage,
      lastPageUrl: buildUrl(lastPage),
      nextPageUrl: page < lastPage ? buildUrl(page + 1) : null,
      path: baseUrl,
      perPage: limit,
      prevPageUrl: page > 1 ? buildUrl(page - 1) : null,
      to,
      total,
    };
  }

  async findById(id: number): Promise<Item | null> {
    const item = await this.prisma.item.findUnique({ where: { id } });
    return (item as unknown as Item) || null;
  }

  async create(itemData: Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>): Promise<Item> {
    const now = new Date();
    const defaultUserId = 1;
    const created = await this.prisma.item.create({
      data: {
        name: itemData.name,
        price: itemData.price,
        content: itemData.content,
        image: itemData.image,
        createdAt: now,
        updatedAt: now,
        createdBy: defaultUserId,
        updatedBy: defaultUserId,
      },
    });
    return created as unknown as Item;
  }

  async update(id: number, itemData: Partial<Omit<Item, 'id' | 'createdAt' | 'createdBy'>>): Promise<Item | null> {
    try {
      const defaultUserId = 1;
      const updated = await this.prisma.item.update({
        where: { id },
        data: {
          ...('name' in itemData ? { name: itemData.name } : {}),
          ...('price' in itemData ? { price: itemData.price as number } : {}),
          ...('content' in itemData ? { content: itemData.content as string } : {}),
          updatedAt: new Date(),
          updatedBy: defaultUserId,
        },
      });
      return updated as unknown as Item;
    } catch (e) {
      return null;
    }
  }

  async delete(id: number): Promise<void> {
    await this.prisma.item.delete({ where: { id } });
  }
}


