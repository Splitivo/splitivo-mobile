import { create } from "zustand";
import { Bill, BillItem, PersonBreakdown } from "../../domain/entities/bill";
import { Participant } from "../../domain/entities/user";
import { BillRepositoryImpl } from "../../data/repositories/BillRepositoryImpl";

const billRepo = BillRepositoryImpl;

interface BillState {
  bills: Bill[];
  currentBill: Bill | null;
  breakdown: PersonBreakdown[];
  isLoading: boolean;
  error: string | null;

  // Draft bill state (for creating)
  draftItems: BillItem[];
  draftParticipants: Participant[];
  draftMerchant: string;
  draftDate: string;
  draftCurrency: string;
  draftTax: number;
  draftServiceCharge: number;
  draftDiscount: number;

  fetchBills: () => Promise<void>;
  fetchBillById: (id: string) => Promise<void>;
  fetchBreakdown: (billId: string) => Promise<void>;
  createBill: (tripId?: string) => Promise<Bill>;
  settlePerson: (billId: string, participantId: string) => Promise<void>;
  finalizeBill: (billId: string) => Promise<void>;

  // Draft actions
  setDraftMerchant: (name: string) => void;
  setDraftDate: (date: string) => void;
  setDraftCurrency: (currency: string) => void;
  addDraftItem: (item: BillItem) => void;
  removeDraftItem: (itemId: string) => void;
  updateDraftItem: (itemId: string, update: Partial<BillItem>) => void;
  addDraftParticipant: (participant: Participant) => void;
  removeDraftParticipant: (participantId: string) => void;
  setDraftTax: (tax: number) => void;
  setDraftServiceCharge: (charge: number) => void;
  setDraftDiscount: (discount: number) => void;
  resetDraft: () => void;
}

export const useBillStore = create<BillState>((set, get) => ({
  bills: [],
  currentBill: null,
  breakdown: [],
  isLoading: false,
  error: null,

  draftItems: [],
  draftParticipants: [],
  draftMerchant: "",
  draftDate: new Date().toISOString().split("T")[0],
  draftCurrency: "USD",
  draftTax: 0,
  draftServiceCharge: 0,
  draftDiscount: 0,

  fetchBills: async () => {
    set({ isLoading: true, error: null });
    try {
      const bills = await billRepo.getBills();
      set({ bills, isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  fetchBillById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const bill = await billRepo.getBillById(id);
      set({ currentBill: bill, isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  fetchBreakdown: async (billId) => {
    try {
      const breakdown = await billRepo.getPersonBreakdown(billId);
      set({ breakdown });
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },

  createBill: async (tripId) => {
    const state = get();
    const itemsTotal = state.draftItems.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );
    const totalAmount =
      itemsTotal +
      state.draftTax +
      state.draftServiceCharge -
      state.draftDiscount;

    const bill = await billRepo.createBill({
      tripId,
      merchantName: state.draftMerchant,
      date: state.draftDate,
      currency: state.draftCurrency,
      items: state.draftItems,
      tax: state.draftTax,
      serviceCharge: state.draftServiceCharge,
      discount: state.draftDiscount,
      totalAmount,
      participants: state.draftParticipants,
      splitType: tripId ? "trip" : "single",
      status: "pending",
      createdBy: "u1",
      isFinalized: false,
    });

    set((s) => ({ bills: [...s.bills, bill] }));
    get().resetDraft();
    return bill;
  },

  settlePerson: async (billId, participantId) => {
    await billRepo.settlePerson(billId, participantId);
    await get().fetchBillById(billId);
  },

  finalizeBill: async (billId) => {
    await billRepo.finalizeBill(billId);
    await get().fetchBills();
  },

  setDraftMerchant: (name) => set({ draftMerchant: name }),
  setDraftDate: (date) => set({ draftDate: date }),
  setDraftCurrency: (currency) => set({ draftCurrency: currency }),

  addDraftItem: (item) => set((s) => ({ draftItems: [...s.draftItems, item] })),

  removeDraftItem: (itemId) =>
    set((s) => ({ draftItems: s.draftItems.filter((i) => i.id !== itemId) })),

  updateDraftItem: (itemId, update) =>
    set((s) => ({
      draftItems: s.draftItems.map((i) =>
        i.id === itemId ? { ...i, ...update } : i,
      ),
    })),

  addDraftParticipant: (participant) =>
    set((s) => ({ draftParticipants: [...s.draftParticipants, participant] })),

  removeDraftParticipant: (participantId) =>
    set((s) => ({
      draftParticipants: s.draftParticipants.filter(
        (p) => p.id !== participantId,
      ),
    })),

  setDraftTax: (tax) => set({ draftTax: tax }),
  setDraftServiceCharge: (charge) => set({ draftServiceCharge: charge }),
  setDraftDiscount: (discount) => set({ draftDiscount: discount }),

  resetDraft: () =>
    set({
      draftItems: [],
      draftParticipants: [],
      draftMerchant: "",
      draftDate: new Date().toISOString().split("T")[0],
      draftCurrency: "USD",
      draftTax: 0,
      draftServiceCharge: 0,
      draftDiscount: 0,
    }),
}));
