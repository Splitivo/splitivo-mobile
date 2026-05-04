import { TripRepository } from "../../domain/repositories/TripRepository";
import { Trip, TransferOptimizationResult } from "../../domain/entities/trip";
import { MockTripDatasource } from "../datasources/mock/MockTripDatasource";
import { withRepoLogging } from "../utils/withRepoLogging";

const datasource = new MockTripDatasource();

class TripRepositoryBase implements TripRepository {
  async getTrips(): Promise<Trip[]> {
    return datasource.getTrips();
  }

  async getTripById(id: string): Promise<Trip> {
    return datasource.getTripById(id);
  }

  async createTrip(
    trip: Omit<Trip, "id" | "createdAt" | "bills" | "totalSpend">,
  ): Promise<Trip> {
    return datasource.createTrip(trip);
  }

  async updateTrip(id: string, trip: Partial<Trip>): Promise<Trip> {
    return datasource.updateTrip(id, trip);
  }

  async getOptimizedTransfers(
    tripId: string,
  ): Promise<TransferOptimizationResult> {
    return datasource.getOptimizedTransfers(tripId);
  }

  async finalizeTrip(tripId: string): Promise<void> {
    return datasource.finalizeTrip(tripId);
  }
}

export const TripRepositoryImpl = withRepoLogging(
  "TripRepositoryImpl",
  new TripRepositoryBase(),
);
