import { BillRepository } from "../../domain/repositories/BillRepository";
import { Bill, PersonBreakdown } from "../../domain/entities/bill";
import { MockBillDatasource } from "../datasources/mock/MockBillDatasource";
import { withRepoLogging } from "../utils/withRepoLogging";

const datasource = new MockBillDatasource();

class BillRepositoryBase implements BillRepository {
  async getBills(): Promise<Bill[]> {
    return datasource.getBills();
  }

  async getBillById(id: string): Promise<Bill> {
    return datasource.getBillById(id);
  }

  async createBill(bill: Omit<Bill, "id" | "createdAt">): Promise<Bill> {
    return datasource.createBill(bill);
  }

  async updateBill(id: string, bill: Partial<Bill>): Promise<Bill> {
    return datasource.updateBill(id, bill);
  }

  async getPersonBreakdown(billId: string): Promise<PersonBreakdown[]> {
    return datasource.getPersonBreakdown(billId);
  }

  async settlePerson(billId: string, participantId: string): Promise<void> {
    return datasource.settlePerson(billId, participantId);
  }

  async finalizeBill(billId: string): Promise<void> {
    return datasource.finalizeBill(billId);
  }
}

export const BillRepositoryImpl = withRepoLogging(
  "BillRepositoryImpl",
  new BillRepositoryBase(),
);
