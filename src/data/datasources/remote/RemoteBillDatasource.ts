import {
  buildUrl,
  ApiVersion,
  HttpMethod,
} from "../../../core/config/environment";
import { Bill, PersonBreakdown } from "../../../domain/entities/bill";

/**
 * Remote bill datasource — will be activated when backend is ready.
 * Currently inactive; mock datasource is used instead.
 */
export class RemoteBillDatasource {
  async getBills(): Promise<Bill[]> {
    const { url, method } = buildUrl(ApiVersion.V1, "bills");
    const res = await fetch(url, { method });
    return res.json();
  }

  async getBillById(id: string): Promise<Bill> {
    const { url, method } = buildUrl(
      ApiVersion.V1,
      `bills/${encodeURIComponent(id)}`,
    );
    const res = await fetch(url, { method });
    return res.json();
  }

  async createBill(bill: Omit<Bill, "id" | "createdAt">): Promise<Bill> {
    const { url, method } = buildUrl(ApiVersion.V1, "bills", HttpMethod.Post);
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bill),
    });
    return res.json();
  }

  async updateBill(id: string, update: Partial<Bill>): Promise<Bill> {
    const { url, method } = buildUrl(
      ApiVersion.V1,
      `bills/${encodeURIComponent(id)}`,
      HttpMethod.Patch,
    );
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
    });
    return res.json();
  }

  async getPersonBreakdown(billId: string): Promise<PersonBreakdown[]> {
    const { url, method } = buildUrl(
      ApiVersion.V1,
      `bills/${encodeURIComponent(billId)}/breakdown`,
    );
    const res = await fetch(url, { method });
    return res.json();
  }

  async settlePerson(billId: string, participantId: string): Promise<void> {
    const { url, method } = buildUrl(
      ApiVersion.V1,
      `bills/${encodeURIComponent(billId)}/settle/${encodeURIComponent(participantId)}`,
      HttpMethod.Post,
    );
    await fetch(url, { method });
  }

  async finalizeBill(billId: string): Promise<void> {
    const { url, method } = buildUrl(
      ApiVersion.V1,
      `bills/${encodeURIComponent(billId)}/finalize`,
      HttpMethod.Post,
    );
    await fetch(url, { method });
  }
}
