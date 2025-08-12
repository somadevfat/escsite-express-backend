import { User } from '../entities/user';

export interface IUserRepository {
  findMe(): Promise<User>;
}
