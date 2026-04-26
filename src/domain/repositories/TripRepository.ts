import { Trip, TransferOptimizationResult } from "../entities/trip";

export interface TripRepository {
  getTrips(): Promise<Trip[]>;
  getTripById(id: string): Promise<Trip>;
  createTrip(
    trip: Omit<Trip, "id" | "createdAt" | "bills" | "totalSpend">,
  ): Promise<Trip>;
  updateTrip(id: string, trip: Partial<Trip>): Promise<Trip>;
  getOptimizedTransfers(tripId: string): Promise<TransferOptimizationResult>;
  finalizeTrip(tripId: string): Promise<void>;
}
