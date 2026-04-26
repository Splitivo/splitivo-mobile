import { appConfig } from "../../../core/config/environment";
import { Bill, PersonBreakdown } from "../../../domain/entities/bill";

/**
 * Remote bill datasource — will be activated when backend is ready.
 * Currently inactive; mock datasource is used instead.
 */
export class RemoteBillDatasource {
  private baseUrl = appConfig.apiUrl;

  async getBills(): Promise<Bill[]> {
    const res = await fetch(`${this.baseUrl}/bills`);
    return res.json();
  }

  async getBillById(id: string): Promise<Bill> {
    const res = await fetch(`${this.baseUrl}/bills/${encodeURIComponent(id)}`);
    return res.json();
  }

  async createBill(bill: Omit<Bill, "id" | "createdAt">): Promise<Bill> {
    const res = await fetch(`${this.baseUrl}/bills`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bill),
    });
    return res.json();
  }

  async updateBill(id: string, update: Partial<Bill>): Promise<Bill> {
    const res = await fetch(`${this.baseUrl}/bills/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
    });
    return res.json();
  }

  async getPersonBreakdown(billId: string): Promise<PersonBreakdown[]> {
    const res = await fetch(
      `${this.baseUrl}/bills/${encodeURIComponent(billId)}/breakdown`,
    );
    return res.json();
  }

  async settlePerson(billId: string, participantId: string): Promise<void> {
    await fetch(
      `${this.baseUrl}/bills/${encodeURIComponent(billId)}/settle/${encodeURIComponent(participantId)}`,
      {
        method: "POST",
      },
    );
  }

  async finalizeBill(billId: string): Promise<void> {
    await fetch(
      `${this.baseUrl}/bills/${encodeURIComponent(billId)}/finalize`,
      {
        method: "POST",
      },
    );
  }
}
