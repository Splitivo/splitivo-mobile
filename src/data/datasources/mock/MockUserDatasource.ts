import { User, Participant } from "../../../domain/entities/user";
import usersData from "../../mocks/users.json";
import participantsData from "../../mocks/participants.json";
import { simulateDelay } from "../../utils/delay";

export class MockUserDatasource {
  async getCurrentUser(): Promise<User> {
    await simulateDelay();
    return usersData.currentUser as User;
  }

  async updateUser(update: Partial<User>): Promise<User> {
    await simulateDelay();
    return { ...usersData.currentUser, ...update } as User;
  }

  async searchParticipants(query: string): Promise<Participant[]> {
    await simulateDelay();
    const results = (participantsData as any[]).filter(
      (p) =>
        p.displayName.toLowerCase().includes(query.toLowerCase()) ||
        (p.phone && p.phone.includes(query)),
    );
    return results as Participant[];
  }
}
