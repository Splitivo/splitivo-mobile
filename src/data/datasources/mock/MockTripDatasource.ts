import {
  Trip,
  TransferOptimizationResult,
  OptimizedTransfer,
} from "../../../domain/entities/trip";
import { Bill } from "../../../domain/entities/bill";
import { Participant } from "../../../domain/entities/user";
import tripsData from "../../mocks/trips.json";
import billsData from "../../mocks/bills.json";
import { simulateDelay } from "../../utils/delay";

export class MockTripDatasource {
  private trips = tripsData as any[];
  private bills = billsData as Bill[];

  async getTrips(): Promise<Trip[]> {
    await simulateDelay();
    return this.trips.map((t) => ({
      ...t,
      bills: this.bills.filter((b) => b.tripId === t.id),
    })) as Trip[];
  }

  async getTripById(id: string): Promise<Trip> {
    await simulateDelay();
    const trip = this.trips.find((t) => t.id === id);
    if (!trip) throw new Error(`Trip ${id} not found`);
    return {
      ...trip,
      bills: this.bills.filter((b) => b.tripId === id),
    } as Trip;
  }

  async createTrip(
    trip: Omit<Trip, "id" | "createdAt" | "bills" | "totalSpend">,
  ): Promise<Trip> {
    await simulateDelay();
    const newTrip = {
      ...trip,
      id: `t${Date.now()}`,
      createdAt: new Date().toISOString(),
      bills: [],
      totalSpend: 0,
    } as Trip;
    this.trips.push(newTrip);
    return newTrip;
  }

  async updateTrip(id: string, update: Partial<Trip>): Promise<Trip> {
    await simulateDelay();
    const index = this.trips.findIndex((t) => t.id === id);
    if (index === -1) throw new Error(`Trip ${id} not found`);
    this.trips[index] = { ...this.trips[index], ...update };
    return this.getTripById(id);
  }

  async getOptimizedTransfers(
    tripId: string,
  ): Promise<TransferOptimizationResult> {
    await simulateDelay();
    const trip = await this.getTripById(tripId);

    // Calculate net balances for each participant
    const balances = new Map<string, number>();
    const participantMap = new Map<string, Participant>();

    trip.participants.forEach((p) => {
      balances.set(p.id, 0);
      participantMap.set(p.id, p);
    });

    // For each bill, calculate who owes what
    trip.bills.forEach((bill) => {
      bill.items.forEach((item) => {
        const share = (item.quantity * item.unitPrice) / item.assignedTo.length;
        item.assignedTo.forEach((pid) => {
          balances.set(pid, (balances.get(pid) || 0) - share);
        });
      });

      // The bill creator "paid" the total
      const sharedCosts = bill.tax + bill.serviceCharge - bill.discount;
      const itemsTotal = bill.items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0,
      );
      balances.set(
        bill.createdBy,
        (balances.get(bill.createdBy) || 0) + itemsTotal + sharedCosts,
      );

      // Distribute shared costs
      const perPerson = sharedCosts / bill.participants.length;
      bill.participants.forEach((p) => {
        balances.set(p.id, (balances.get(p.id) || 0) - perPerson);
      });
    });

    // Compute minimum transfers using greedy algorithm
    const debtors: { id: string; amount: number }[] = [];
    const creditors: { id: string; amount: number }[] = [];

    balances.forEach((balance, id) => {
      if (balance < -0.01) debtors.push({ id, amount: -balance });
      else if (balance > 0.01) creditors.push({ id, amount: balance });
    });

    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    const transfers: OptimizedTransfer[] = [];
    let dIdx = 0;
    let cIdx = 0;

    while (dIdx < debtors.length && cIdx < creditors.length) {
      const amount = Math.min(debtors[dIdx].amount, creditors[cIdx].amount);
      if (amount > 0.01) {
        transfers.push({
          id: `tr${transfers.length + 1}`,
          from: participantMap.get(debtors[dIdx].id)!,
          to: participantMap.get(creditors[cIdx].id)!,
          amount: Math.round(amount * 100) / 100,
          currency: trip.bills[0]?.currency || "USD",
          isCompleted: false,
        });
      }

      debtors[dIdx].amount -= amount;
      creditors[cIdx].amount -= amount;

      if (debtors[dIdx].amount < 0.01) dIdx++;
      if (creditors[cIdx].amount < 0.01) cIdx++;
    }

    // Original transfer count = total participant pairs across all bills
    const originalCount = trip.bills.reduce(
      (sum, bill) => sum + bill.participants.length - 1,
      0,
    );

    return {
      originalTransferCount: originalCount,
      optimizedTransferCount: transfers.length,
      transfers,
    };
  }

  async finalizeTrip(tripId: string): Promise<void> {
    await simulateDelay();
    const index = this.trips.findIndex((t) => t.id === tripId);
    if (index !== -1) {
      this.trips[index].isFinalized = true;
      this.trips[index].status = "completed";
    }
  }
}
