/**
 * ページネーション情報の型定義
 * bundle.ymlのPaginationスキーマに準拠
 */
export interface Pagination {
  currentPage: number; // 現在のページ番号
  from: number; // 現在のページの最初のデータ番号
  lastPage: number; // 最後のページ番号
  lastPageUrl: string; // 最後のページのURL
  nextPageUrl: string | null; // 次のページのURL
  path: string; // エンドポイント
  perPage: number; // 1ページ当たりのデータ数
  prevPageUrl: string | null; // 前のページのURL
  to: number; // 現在のページの最後のデータ番号
  total: number; // 検索ヒット数
}

/**
 * 商品一覧のレスポンス形式
 * bundle.ymlのUsersResponseスキーマに準拠
 */
export interface ItemsResponse extends Pagination {
  data: import('./item').Item[];
}
