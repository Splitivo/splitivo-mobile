import { User, Participant } from "../entities/user";

export interface UserRepository {
  getCurrentUser(): Promise<User>;
  updateUser(user: Partial<User>): Promise<User>;
  searchParticipants(query: string): Promise<Participant[]>;
}
