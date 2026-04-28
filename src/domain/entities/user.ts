export interface User {
  id: string;
  username: string;
  displayName: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  baseCurrency: string;
  bankAccounts: BankAccount[];
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  isDefault: boolean;
  color: string;
}

export interface GuestParticipant {
  id: string;
  name: string;
  isGuest: true;
}

export type Participant =
  | (Pick<User, "id" | "displayName" | "avatarUrl"> & { isGuest: false })
  | GuestParticipant;
