import { UserRepository } from "../../domain/repositories/UserRepository";
import { User, Participant } from "../../domain/entities/user";
import { MockUserDatasource } from "../datasources/mock/MockUserDatasource";

const datasource = new MockUserDatasource();

export class UserRepositoryImpl implements UserRepository {
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
