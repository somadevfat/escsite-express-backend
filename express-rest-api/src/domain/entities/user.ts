export interface User {
  id: number;
  email: string;
  emailVerifiedAt?: string | null;
  emailReissueToken?: string | null;
  isAdmin: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  createdBy: number;
  updatedBy: number;
}
