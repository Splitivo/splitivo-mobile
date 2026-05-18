import { User, Participant } from "../entities/user";

export interface CompleteProfilePayload {
  username: string;
  phone?: string;
  currency_id?: number;
}

export interface UserRepository {
  getCurrentUser(): Promise<User>;
  updateUser(user: Partial<User>): Promise<User>;
  searchParticipants(query: string): Promise<Participant[]>;
  completeProfile(payload: CompleteProfilePayload): Promise<void>;
}
