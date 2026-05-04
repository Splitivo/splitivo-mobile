import { TripRepository } from "../../domain/repositories/TripRepository";
import { Trip, TransferOptimizationResult } from "../../domain/entities/trip";
import { MockTripDatasource } from "../datasources/mock/MockTripDatasource";
import { withRepoLogging } from "../utils/withRepoLogging";

class TripRepositoryBase implements TripRepository {
  private readonly datasource = new MockTripDatasource();
  async getTrips(): Promise<Trip[]> {
    return this.datasource.getTrips();
  }

  async getTripById(id: string): Promise<Trip> {
    return this.datasource.getTripById(id);
  }

  async createTrip(
    trip: Omit<Trip, "id" | "createdAt" | "bills" | "totalSpend">,
  ): Promise<Trip> {
    return this.datasource.createTrip(trip);
  }

  async updateTrip(id: string, trip: Partial<Trip>): Promise<Trip> {
    return this.datasource.updateTrip(id, trip);
  }

  async getOptimizedTransfers(
    tripId: string,
  ): Promise<TransferOptimizationResult> {
    return this.datasource.getOptimizedTransfers(tripId);
  }

  async finalizeTrip(tripId: string): Promise<void> {
    return this.datasource.finalizeTrip(tripId);
  }
}

export const TripRepositoryImpl = withRepoLogging(
  "TripRepositoryImpl",
  new TripRepositoryBase(),
);
