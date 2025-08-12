import { User } from '../entities/user';

export interface IUserRepository {
  findMe(): Promise<User>;
  findById(id: number): Promise<User | null>;
}
