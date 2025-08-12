/**
 * 共通型定義
 * 全層で使用される汎用的な型
 */

/**
 * APIレスポンスの基本型
 */
export type ApiResponse<T = any> = {
  data?: T;
  message?: string;
  error?: string;
  status: 'success' | 'error';
};

/**
 * ページネーションパラメータ
 */
export type PaginationParams = {
  page?: number;
  limit?: number;
};

/**
 * 検索フィルターパラメータ
 */
export type SearchFilters = {
  name_like?: string;
  price_gte?: number;
  price_lte?: number;
  price_gt?: number;
  price_lt?: number;
};

/**
 * エラーレスポンス型
 */
export type ErrorResponse = {
  error: string;
  message?: string;
  statusCode: number;
};

/**
 * 成功レスポンス型
 */
export type SuccessResponse<T> = {
  data: T;
  message?: string;
  statusCode: number;
};

/**
 * HTTPメソッド型
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * 環境変数型
 */
export type Environment = 'development' | 'production' | 'test';
