import { BillRepository } from "../../domain/repositories/BillRepository";
import { Bill, PersonBreakdown } from "../../domain/entities/bill";
import { MockBillDatasource } from "../datasources/mock/MockBillDatasource";
import { withRepoLogging } from "../utils/withRepoLogging";

class BillRepositoryBase implements BillRepository {
  private readonly datasource = new MockBillDatasource();
  async getBills(): Promise<Bill[]> {
    return this.datasource.getBills();
  }

  async getBillById(id: string): Promise<Bill> {
    return this.datasource.getBillById(id);
  }

  async createBill(bill: Omit<Bill, "id" | "createdAt">): Promise<Bill> {
    return this.datasource.createBill(bill);
  }

  async updateBill(id: string, bill: Partial<Bill>): Promise<Bill> {
    return this.datasource.updateBill(id, bill);
  }

  async getPersonBreakdown(billId: string): Promise<PersonBreakdown[]> {
    return this.datasource.getPersonBreakdown(billId);
  }

  async settlePerson(billId: string, participantId: string): Promise<void> {
    return this.datasource.settlePerson(billId, participantId);
  }

  async finalizeBill(billId: string): Promise<void> {
    return this.datasource.finalizeBill(billId);
  }
}

export const BillRepositoryImpl = withRepoLogging(
  "BillRepositoryImpl",
  new BillRepositoryBase(),
);
