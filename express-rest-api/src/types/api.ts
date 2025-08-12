/**
 * API層の型定義
 * HTTPリクエスト/レスポンスに関連する型
 */

import { ApiResponse, ErrorResponse, SuccessResponse } from './common';

/**
 * 商品APIレスポンス型
 */
export type ItemApiResponse = {
  id: number;
  name: string;
  price: number;
  content?: string;
  image?: string;
  base64?: string;
  extension?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
};

/**
 * 商品一覧APIレスポンス型
 */
export type ItemsListApiResponse = {
  data: ItemApiResponse[];
  currentPage: number;
  from: number;
  lastPage: number;
  lastPageUrl: string;
  nextPageUrl: string | null;
  path: string;
  perPage: number;
  prevPageUrl: string | null;
  to: number;
  total: number;
};

/**
 * 商品作成APIリクエスト型
 */
export type CreateItemApiRequest = {
  name: string;
  price: number;
  content?: string;
  base64?: string;
  extension?: string;
};

/**
 * 商品更新APIリクエスト型
 */
export type UpdateItemApiRequest = {
  name: string;
  price: number;
  content: string;
};

/**
 * 商品作成APIレスポンス型
 */
export type CreateItemApiResponse = SuccessResponse<ItemApiResponse>;

/**
 * 商品更新APIレスポンス型
 */
export type UpdateItemApiResponse = SuccessResponse<ItemApiResponse>;

/**
 * 商品削除APIレスポンス型
 */
export type DeleteItemApiResponse = {
  message: string;
  statusCode: number;
};

/**
 * 商品取得APIレスポンス型
 */
export type GetItemApiResponse = SuccessResponse<ItemApiResponse>;

/**
 * 商品一覧取得APIレスポンス型
 */
export type GetItemsApiResponse = SuccessResponse<ItemsListApiResponse>;

/**
 * バリデーションエラーレスポンス型
 */
export type ValidationErrorResponse = ErrorResponse & {
  validationErrors: {
    field: string;
    message: string;
  }[];
};

/**
 * HTTPステータスコード型
 */
export type HttpStatusCode = 200 | 201 | 204 | 400 | 401 | 403 | 404 | 500;
