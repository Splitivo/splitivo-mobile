import { Bill, PersonBreakdown } from "../../../domain/entities/bill";
import billsData from "../../mocks/bills.json";
import { simulateDelay } from "../../utils/delay";

export class MockBillDatasource {
  private bills: Bill[] = billsData as Bill[];

  async getBills(): Promise<Bill[]> {
    await simulateDelay();
    return this.bills;
  }

  async getBillById(id: string): Promise<Bill> {
    await simulateDelay();
    const bill = this.bills.find((b) => b.id === id);
    if (!bill) throw new Error(`Bill ${id} not found`);
    return bill;
  }

  async createBill(bill: Omit<Bill, "id" | "createdAt">): Promise<Bill> {
    await simulateDelay();
    const newBill: Bill = {
      ...bill,
      id: `b${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.bills.push(newBill);
    return newBill;
  }

  async updateBill(id: string, update: Partial<Bill>): Promise<Bill> {
    await simulateDelay();
    const index = this.bills.findIndex((b) => b.id === id);
    if (index === -1) throw new Error(`Bill ${id} not found`);
    this.bills[index] = { ...this.bills[index], ...update };
    return this.bills[index];
  }

  async getPersonBreakdown(billId: string): Promise<PersonBreakdown[]> {
    await simulateDelay();
    const bill = this.bills.find((b) => b.id === billId);
    if (!bill) throw new Error(`Bill ${billId} not found`);

    const totals = new Map<string, number>();
    bill.participants.forEach((p) => totals.set(p.id, 0));

    bill.items.forEach((item) => {
      const share = (item.quantity * item.unitPrice) / item.assignedTo.length;
      item.assignedTo.forEach((pid) => {
        totals.set(pid, (totals.get(pid) || 0) + share);
      });
    });

    // Distribute shared costs equally
    const sharedCosts = bill.tax + bill.serviceCharge - bill.discount;
    const perPersonShared = sharedCosts / bill.participants.length;

    return bill.participants.map((p) => ({
      participantId: p.id,
      amount: (totals.get(p.id) || 0) + perPersonShared,
      isPaid: bill.status === "settled",
    }));
  }

  async settlePerson(billId: string, participantId: string): Promise<void> {
    await simulateDelay();
    // In mock, we just simulate success
  }

  async finalizeBill(billId: string): Promise<void> {
    await simulateDelay();
    const index = this.bills.findIndex((b) => b.id === billId);
    if (index !== -1) {
      this.bills[index].isFinalized = true;
      this.bills[index].status = "settled";
    }
  }
}
