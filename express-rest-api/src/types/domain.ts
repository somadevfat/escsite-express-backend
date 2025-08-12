/**
 * ドメイン層の型定義
 * ビジネスロジックに関連する型
 */

import { PaginationParams, SearchFilters } from './common';

/**
 * 商品作成リクエスト型
 */
export type ItemCreateRequest = {
  name: string;
  price: number;
  content?: string;
  base64?: string;
  extension?: string;
};

/**
 * 商品更新リクエスト型
 */
export type ItemUpdateRequest = {
  name: string;
  price: number;
  content: string;
};

/**
 * 商品検索パラメータ型
 */
export type ItemSearchParams = PaginationParams & SearchFilters;

/**
 * 商品作成用データ型（ID除外）
 */
export type ItemCreateData = Omit<ItemCreateRequest, 'id'>;

/**
 * 商品更新用データ型（ID除外）
 */
export type ItemUpdateData = Partial<Omit<ItemUpdateRequest, 'id'>>;

/**
 * リポジトリの検索パラメータ型
 */
export type RepositorySearchParams = {
  limit?: number;
  offset?: number;
  name_like?: string;
  price_gte?: number;
  price_lte?: number;
  price_gt?: number;
  price_lt?: number;
};

/**
 * ユースケースの入力パラメータ型
 */
export type UseCaseInput<T> = {
  data: T;
  userId?: number; // 将来的に認証機能追加時
};

/**
 * ユースケースの出力型
 */
export type UseCaseOutput<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
