import { create } from "zustand";
import type { User, Posting, Bid, HostListing, UserRole } from "@/lib/types";
import { generateId } from "@/lib/utils";

interface AppState {
  currentUser: User | null;
  users: User[];
  postings: Posting[];
  hostListings: HostListing[];

  setCurrentUser: (user: User | null) => void;
  register: (
    email: string,
    name: string,
    password: string,
    role: UserRole
  ) => User;
  login: (email: string, password: string) => User | null;
  logout: () => void;

  addPosting: (
    posting: Omit<Posting, "id" | "createdAt" | "bids" | "status">
  ) => Posting;
  getPostings: (filters?: PostingFilters) => Posting[];

  addBid: (bid: Omit<Bid, "id" | "createdAt" | "status">) => Bid;
  acceptBid: (postingId: string, bidId: string) => void;
  rejectBid: (postingId: string, bidId: string) => void;

  addHostListing: (
    listing: Omit<HostListing, "id" | "createdAt" | "available">
  ) => HostListing;
  getHostListings: () => HostListing[];
}

export interface PostingFilters {
  maxDistance?: number;
  minPrice?: number;
  maxPrice?: number;
  waterHookup?: boolean;
  electricalOut?: boolean;
  shadeCanopy?: boolean;
  pavedFlat?: boolean;
}

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const data = localStorage.getItem(key);
    return data ? (JSON.parse(data) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, data: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // storage full or unavailable
  }
}

// No sample users, jobs or listings: the board only shows what real visitors add.
const SEED_USERS: User[] = [];
const SEED_POSTINGS: Posting[] = [];
const SEED_HOST_LISTINGS: HostListing[] = [];

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: loadFromStorage<User | null>("pp2_currentUser", null),
  users: loadFromStorage<User[]>("pp2_users", SEED_USERS),
  postings: loadFromStorage<Posting[]>("pp2_postings", SEED_POSTINGS),
  hostListings: loadFromStorage<HostListing[]>(
    "pp2_hostListings",
    SEED_HOST_LISTINGS
  ),

  setCurrentUser: (user) => {
    set({ currentUser: user });
    saveToStorage("pp2_currentUser", user);
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  register: (email, name, _password, role) => {
    const existingUsers = get().users;
    const existing = existingUsers.find((u) => u.email === email);
    if (existing) throw new Error("Email already registered");

    const newUser: User = {
      id: generateId(),
      email,
      name,
      role,
      createdAt: new Date().toISOString(),
    };
    const updatedUsers = [...existingUsers, newUser];
    set({ users: updatedUsers, currentUser: newUser });
    saveToStorage("pp2_users", updatedUsers);
    saveToStorage("pp2_currentUser", newUser);
    return newUser;
  },

  login: (email, _password) => {
    const user = get().users.find((u) => u.email === email);
    if (!user) return null;
    set({ currentUser: user });
    saveToStorage("pp2_currentUser", user);
    return user;
  },

  logout: () => {
    set({ currentUser: null });
    saveToStorage("pp2_currentUser", null);
  },

  addPosting: (data) => {
    const posting: Posting = {
      ...data,
      id: generateId(),
      status: "OPEN",
      createdAt: new Date().toISOString(),
      bids: [],
    };
    const updated = [posting, ...get().postings];
    set({ postings: updated });
    saveToStorage("pp2_postings", updated);
    return posting;
  },

  getPostings: (filters) => {
    let result = get().postings.filter((p) => p.status === "OPEN");
    if (!filters) return result;
    if (filters.minPrice !== undefined)
      result = result.filter((p) => p.targetPrice >= filters.minPrice!);
    if (filters.maxPrice !== undefined)
      result = result.filter((p) => p.targetPrice <= filters.maxPrice!);
    if (filters.waterHookup)
      result = result.filter((p) => p.waterHookup);
    if (filters.electricalOut)
      result = result.filter((p) => p.electricalOut);
    if (filters.shadeCanopy)
      result = result.filter((p) => p.shadeCanopy);
    if (filters.pavedFlat)
      result = result.filter((p) => p.pavedFlat);
    return result;
  },

  addBid: (data) => {
    const bid: Bid = {
      ...data,
      id: generateId(),
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };
    const updatedPostings = get().postings.map((p) =>
      p.id === data.postingId ? { ...p, bids: [...p.bids, bid] } : p
    );
    set({ postings: updatedPostings });
    saveToStorage("pp2_postings", updatedPostings);
    return bid;
  },

  acceptBid: (postingId, bidId) => {
    const updatedPostings = get().postings.map((p) => {
      if (p.id !== postingId) return p;
      return {
        ...p,
        status: "ACCEPTED" as const,
        bids: p.bids.map((b) =>
          b.id === bidId
            ? { ...b, status: "ACCEPTED" as const }
            : { ...b, status: "REJECTED" as const }
        ),
      };
    });
    set({ postings: updatedPostings });
    saveToStorage("pp2_postings", updatedPostings);
  },

  rejectBid: (postingId, bidId) => {
    const updatedPostings = get().postings.map((p) => {
      if (p.id !== postingId) return p;
      return {
        ...p,
        bids: p.bids.map((b) =>
          b.id === bidId ? { ...b, status: "REJECTED" as const } : b
        ),
      };
    });
    set({ postings: updatedPostings });
    saveToStorage("pp2_postings", updatedPostings);
  },

  addHostListing: (data) => {
    const listing: HostListing = {
      ...data,
      id: generateId(),
      available: true,
      createdAt: new Date().toISOString(),
    };
    const updated = [listing, ...get().hostListings];
    set({ hostListings: updated });
    saveToStorage("pp2_hostListings", updated);
    return listing;
  },

  getHostListings: () => {
    return get().hostListings.filter((l) => l.available);
  },
}));
