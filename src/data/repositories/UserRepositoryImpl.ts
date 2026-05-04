import { UserRepository } from "../../domain/repositories/UserRepository";
import { User, Participant } from "../../domain/entities/user";
import { MockUserDatasource } from "../datasources/mock/MockUserDatasource";
import { withRepoLogging } from "../utils/withRepoLogging";

const datasource = new MockUserDatasource();

class UserRepositoryBase implements UserRepository {
  async getCurrentUser(): Promise<User> {
    return datasource.getCurrentUser();
  }

  async updateUser(user: Partial<User>): Promise<User> {
    return datasource.updateUser(user);
  }

  async searchParticipants(query: string): Promise<Participant[]> {
    return datasource.searchParticipants(query);
  }
}

export const UserRepositoryImpl = withRepoLogging(
  "UserRepositoryImpl",
  new UserRepositoryBase(),
);
