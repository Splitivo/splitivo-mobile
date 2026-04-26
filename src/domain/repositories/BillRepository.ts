import { Bill, PersonBreakdown } from "../entities/bill";

export interface BillRepository {
  getBills(): Promise<Bill[]>;
  getBillById(id: string): Promise<Bill>;
  createBill(bill: Omit<Bill, "id" | "createdAt">): Promise<Bill>;
  updateBill(id: string, bill: Partial<Bill>): Promise<Bill>;
  getPersonBreakdown(billId: string): Promise<PersonBreakdown[]>;
  settlePerson(billId: string, participantId: string): Promise<void>;
  finalizeBill(billId: string): Promise<void>;
}
