import { Participant } from "./user";
import { Bill } from "./bill";

export type TripStatus = "active" | "completed";

export interface Trip {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  currency: string;
  participants: Participant[];
  bills: Bill[];
  totalSpend: number;
  status: TripStatus;
  createdBy: string;
  createdAt: string;
  isFinalized: boolean;
}

export interface OptimizedTransfer {
  id: string;
  from: Participant;
  to: Participant;
  amount: number;
  currency: string;
  isCompleted: boolean;
}

export interface TransferOptimizationResult {
  originalTransferCount: number;
  optimizedTransferCount: number;
  transfers: OptimizedTransfer[];
}
