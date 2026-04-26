import { Participant } from "./user";
import { ExpenseCategory } from "./expense";

export type BillStatus = "pending" | "partial" | "settled";

export interface BillItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  assignedTo: string[]; // participant IDs
}

export interface Bill {
  id: string;
  tripId?: string;
  merchantName: string;
  date: string;
  currency: string;
  category: ExpenseCategory;
  items: BillItem[];
  tax: number;
  serviceCharge: number;
  discount: number;
  totalAmount: number;
  participants: Participant[];
  splitType: "single" | "trip";
  status: BillStatus;
  createdBy: string;
  createdAt: string;
  isFinalized: boolean;
}

export interface PersonBreakdown {
  participantId: string;
  amount: number;
  isPaid: boolean;
}
