import { create } from "zustand";
import { Trip, TransferOptimizationResult } from "../../domain/entities/trip";
import { TripRepositoryImpl } from "../../data/repositories/TripRepositoryImpl";

const tripRepo = new TripRepositoryImpl();

interface TripState {
  trips: Trip[];
  currentTrip: Trip | null;
  transfers: TransferOptimizationResult | null;
  isLoading: boolean;
  error: string | null;

  fetchTrips: () => Promise<void>;
  fetchTripById: (id: string) => Promise<void>;
  createTrip: (
    trip: Omit<Trip, "id" | "createdAt" | "bills" | "totalSpend">,
  ) => Promise<Trip>;
  fetchOptimizedTransfers: (tripId: string) => Promise<void>;
  finalizeTrip: (tripId: string) => Promise<void>;
}

export const useTripStore = create<TripState>((set, get) => ({
  trips: [],
  currentTrip: null,
  transfers: null,
  isLoading: false,
  error: null,

  fetchTrips: async () => {
    set({ isLoading: true, error: null });
    try {
      const trips = await tripRepo.getTrips();
      set({ trips, isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  fetchTripById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const trip = await tripRepo.getTripById(id);
      set({ currentTrip: trip, isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  createTrip: async (trip) => {
    set({ isLoading: true, error: null });
    try {
      const newTrip = await tripRepo.createTrip(trip);
      set((s) => ({ trips: [...s.trips, newTrip], isLoading: false }));
      return newTrip;
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
      throw e;
    }
  },

  fetchOptimizedTransfers: async (tripId) => {
    try {
      const transfers = await tripRepo.getOptimizedTransfers(tripId);
      set({ transfers });
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },

  finalizeTrip: async (tripId) => {
    await tripRepo.finalizeTrip(tripId);
    await get().fetchTrips();
  },
}));
