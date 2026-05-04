import { UserRepository } from "../../domain/repositories/UserRepository";
import { User, Participant } from "../../domain/entities/user";
import { MockUserDatasource } from "../datasources/mock/MockUserDatasource";
import { withRepoLogging } from "../utils/withRepoLogging";

class UserRepositoryBase implements UserRepository {
  private readonly datasource = new MockUserDatasource();
  async getCurrentUser(): Promise<User> {
    return this.datasource.getCurrentUser();
  }

  async updateUser(user: Partial<User>): Promise<User> {
    return this.datasource.updateUser(user);
  }

  async searchParticipants(query: string): Promise<Participant[]> {
    return this.datasource.searchParticipants(query);
  }
}

export const UserRepositoryImpl = withRepoLogging(
  "UserRepositoryImpl",
  new UserRepositoryBase(),
);
