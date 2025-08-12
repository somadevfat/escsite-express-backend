export interface IAuthRepository {
  signin(email: string, password: string, admin?: boolean): Promise<string>; // returns token
  signout(token?: string): Promise<void>;
  signup(email: string, password: string): Promise<string>;
}


