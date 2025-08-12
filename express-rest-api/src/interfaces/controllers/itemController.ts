import { Request, Response } from 'express';
import { ItemUsecase } from '../../application/usecases/itemUsecase';
import {
  ItemApiResponse,
  ItemsListApiResponse,
  ErrorResponse,
  HttpStatusCode
} from '../../types';

export class ItemController {
  constructor(private itemUsecase: ItemUsecase) { }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const item = await this.itemUsecase.createItem(req.body);
      const response: ItemApiResponse = item;
      res.status(200).json(response);
    } catch (error) {
      const errorResponse: ErrorResponse = {
        error: 'Failed to create item',
        statusCode: 500
      };
      res.status(500).json(errorResponse);
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      // リクエストのクエリパラメータを取得
      const { limit, page, name_like, price_gte, price_lte, price_gt, price_lt } = req.query;

      // Usecaseに渡すための検索条件オブジェクトを構築
      const params = {
        // 文字列を数値に変換。未指定の場合はundefinedのままにする
        limit: limit ? parseInt(limit as string, 10) : undefined,
        page: page ? parseInt(page as string, 10) : undefined,
        price_gte: price_gte ? parseInt(price_gte as string, 10) : undefined,
        price_lte: price_lte ? parseInt(price_lte as string, 10) : undefined,
        price_gt: price_gt ? parseInt(price_gt as string, 10) : undefined,
        price_lt: price_lt ? parseInt(price_lt as string, 10) : undefined,
        // 文字列なのでそのまま渡す
        name_like: name_like as string | undefined,
      };

      // 構築した検索条件をUsecaseに渡してページネーション付きの商品一覧を取得
      const itemsResponse = await this.itemUsecase.getItems(params);
      const response: ItemsListApiResponse = itemsResponse;
      res.status(200).json(response);
    } catch (error) {
      const errorResponse: ErrorResponse = {
        error: 'Failed to get items',
        statusCode: 500
      };
      res.status(500).json(errorResponse);
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { ItemId } = req.params;
    try {
      const id = parseInt(ItemId, 10);
      const item = await this.itemUsecase.getItemById(id);
      if (item) {
        const response: ItemApiResponse = item;
        res.status(200).json(response);
      } else {
        const errorResponse: ErrorResponse = {
          error: 'Item not found',
          statusCode: 404
        };
        res.status(404).json(errorResponse);
      }
    } catch (error) {
      const errorResponse: ErrorResponse = {
        error: 'Failed to get item',
        statusCode: 500
      };
      res.status(500).json(errorResponse);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    const { ItemId } = req.params;
    const updates = req.body;
    try {
      const id = parseInt(ItemId, 10);
      const updatedItem = await this.itemUsecase.updateItem(id, updates);
      if (updatedItem) {
        const response: ItemApiResponse = updatedItem;
        res.status(200).json(response);
      } else {
        const errorResponse: ErrorResponse = {
          error: 'Item not found',
          statusCode: 404
        };
        res.status(404).json(errorResponse);
      }
    } catch (error) {
      const errorResponse: ErrorResponse = {
        error: 'Failed to update item',
        statusCode: 500
      };
      res.status(500).json(errorResponse);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { ItemId } = req.params;
    try {
      const id = parseInt(ItemId, 10);
      await this.itemUsecase.deleteItem(id);
      res.status(200).send();
    } catch (error) {
      const errorResponse: ErrorResponse = {
        error: 'Failed to delete item',
        statusCode: 500
      };
      res.status(500).json(errorResponse);
    }
  }
}
