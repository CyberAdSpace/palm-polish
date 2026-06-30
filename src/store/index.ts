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

const SEED_USERS: User[] = [
  {
    id: "user-1",
    email: "john@example.com",
    name: "John Rivera",
    role: "CLEAN_NEEDER",
    createdAt: new Date("2025-01-15").toISOString(),
  },
  {
    id: "user-2",
    email: "maria@example.com",
    name: "Maria Santos",
    role: "DETAILER",
    createdAt: new Date("2025-02-01").toISOString(),
  },
  {
    id: "user-3",
    email: "tom@example.com",
    name: "Tom Bradley",
    role: "HOST",
    createdAt: new Date("2025-03-10").toISOString(),
  },
];

const SEED_POSTINGS: Posting[] = [
  {
    id: "post-1",
    userId: "user-1",
    userName: "John Rivera",
    title: "2021 Honda Civic — Full Detail Needed",
    description:
      "Daily driver that needs a thorough interior and exterior clean. Some pet hair inside.",
    photos: ["/demo/car1.jpg", "/demo/car2.jpg", "/demo/car3.jpg"],
    targetPrice: 120,
    locationType: "ON_SITE",
    address: "4521 Palm Beach Blvd, Fort Myers, FL 33905",
    lat: 26.6406,
    lng: -81.8203,
    vehicleType: "Sedan",
    vehicleYear: "2021",
    waterHookup: true,
    electricalOut: true,
    shadeCanopy: false,
    pavedFlat: true,
    status: "OPEN",
    createdAt: new Date("2025-06-20").toISOString(),
    bids: [],
  },
  {
    id: "post-2",
    userId: "user-1",
    userName: "John Rivera",
    title: "2019 Toyota Tacoma — Exterior Wash & Wax",
    description:
      "Truck is muddy from a weekend trip. Just needs exterior wash and a good wax coat.",
    photos: ["/demo/truck1.jpg", "/demo/truck2.jpg", "/demo/truck3.jpg"],
    targetPrice: 85,
    locationType: "MEET_UP",
    address: "1200 Colonial Blvd, Fort Myers, FL 33907",
    lat: 26.6312,
    lng: -81.8654,
    vehicleType: "Truck",
    vehicleYear: "2019",
    waterHookup: false,
    electricalOut: false,
    shadeCanopy: false,
    pavedFlat: true,
    status: "OPEN",
    createdAt: new Date("2025-06-19").toISOString(),
    bids: [
      {
        id: "bid-1",
        postingId: "post-2",
        detailerId: "user-2",
        detailerName: "Maria Santos",
        amount: 95,
        message:
          "I can do a premium wash and ceramic spray wax for just $10 more.",
        status: "PENDING",
        createdAt: new Date("2025-06-19").toISOString(),
      },
    ],
  },
  {
    id: "post-3",
    userId: "user-1",
    userName: "John Rivera",
    title: "2023 Tesla Model 3 — Paint Correction",
    description:
      "Minor swirl marks from automatic car washes. Looking for a detailer with paint correction experience.",
    photos: ["/demo/tesla1.jpg", "/demo/tesla2.jpg", "/demo/tesla3.jpg"],
    targetPrice: 250,
    locationType: "NEED_A_PLACE",
    address: "Cape Coral, FL",
    lat: 26.5629,
    lng: -81.9495,
    vehicleType: "Sedan",
    vehicleYear: "2023",
    waterHookup: true,
    electricalOut: true,
    shadeCanopy: true,
    pavedFlat: true,
    status: "OPEN",
    createdAt: new Date("2025-06-18").toISOString(),
    bids: [],
  },
];

const SEED_HOST_LISTINGS: HostListing[] = [
  {
    id: "host-1",
    hostId: "user-3",
    hostName: "Tom Bradley",
    title: "Shaded Driveway — Great for Detailing",
    description:
      "Large concrete driveway with a carport. Hose bib and outdoor outlet available. Quiet residential area.",
    spaceType: "DRIVEWAY",
    address: "789 Sunset Dr, Cape Coral, FL 33991",
    lat: 26.5629,
    lng: -81.9495,
    hourlyRate: 15,
    rateType: "HOURLY",
    waterHookup: true,
    electricalOut: true,
    shadeCanopy: true,
    pavedFlat: true,
    available: true,
    createdAt: new Date("2025-04-01").toISOString(),
  },
  {
    id: "host-2",
    hostId: "user-3",
    hostName: "Tom Bradley",
    title: "2-Car Garage Bay — Full Amenities",
    description:
      "Enclosed garage with drainage, bright LED lighting, and 240V outlet for buffers.",
    spaceType: "GARAGE",
    address: "456 Industrial Pkwy, Fort Myers, FL 33916",
    lat: 26.6195,
    lng: -81.8303,
    flatRate: 50,
    rateType: "FLAT",
    waterHookup: true,
    electricalOut: true,
    shadeCanopy: true,
    pavedFlat: true,
    available: true,
    createdAt: new Date("2025-05-15").toISOString(),
  },
];

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: loadFromStorage<User | null>("shine_currentUser", null),
  users: loadFromStorage<User[]>("shine_users", SEED_USERS),
  postings: loadFromStorage<Posting[]>("shine_postings", SEED_POSTINGS),
  hostListings: loadFromStorage<HostListing[]>(
    "shine_hostListings",
    SEED_HOST_LISTINGS
  ),

  setCurrentUser: (user) => {
    set({ currentUser: user });
    saveToStorage("shine_currentUser", user);
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
    saveToStorage("shine_users", updatedUsers);
    saveToStorage("shine_currentUser", newUser);
    return newUser;
  },

  login: (email, _password) => {
    const user = get().users.find((u) => u.email === email);
    if (!user) return null;
    set({ currentUser: user });
    saveToStorage("shine_currentUser", user);
    return user;
  },

  logout: () => {
    set({ currentUser: null });
    saveToStorage("shine_currentUser", null);
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
    saveToStorage("shine_postings", updated);
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
    saveToStorage("shine_postings", updatedPostings);
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
    saveToStorage("shine_postings", updatedPostings);
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
    saveToStorage("shine_postings", updatedPostings);
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
    saveToStorage("shine_hostListings", updated);
    return listing;
  },

  getHostListings: () => {
    return get().hostListings.filter((l) => l.available);
  },
}));
