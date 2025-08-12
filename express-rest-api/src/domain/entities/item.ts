export interface Item {
  id: number;
  name: string;
  price: number;
  content?: string; // bundle.ymlの仕様に合わせて単数形に統一
  image?: string; // 画像URLフィールドを追加
  base64?: string;
  extension?: string;
  createdAt: string; // 作成日（ISO 8601形式）
  updatedAt: string; // 更新日（ISO 8601形式）
  createdBy: number; // 作成者ID
  updatedBy: number; // 更新者ID
}
