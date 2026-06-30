export type UserRole = "CLEAN_NEEDER" | "DETAILER" | "HOST";

export type LocationType = "ON_SITE" | "MEET_UP" | "NEED_A_PLACE";

export type PostingStatus = "OPEN" | "ACCEPTED" | "COMPLETED" | "CANCELLED";

export type BidStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export type SpaceType = "DRIVEWAY" | "GARAGE" | "COMMERCIAL_BAY";

export type RateType = "HOURLY" | "FLAT";

export interface Amenities {
  waterHookup: boolean;
  electricalOut: boolean;
  shadeCanopy: boolean;
  pavedFlat: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Posting {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description?: string;
  photos: string[];
  targetPrice: number;
  locationType: LocationType;
  address?: string;
  lat?: number;
  lng?: number;
  vehicleType?: string;
  vehicleYear?: string;
  waterHookup: boolean;
  electricalOut: boolean;
  shadeCanopy: boolean;
  pavedFlat: boolean;
  status: PostingStatus;
  createdAt: string;
  bids: Bid[];
  hostListingId?: string;
}

export interface Bid {
  id: string;
  postingId: string;
  detailerId: string;
  detailerName: string;
  amount: number;
  message?: string;
  status: BidStatus;
  createdAt: string;
}

export interface HostListing {
  id: string;
  hostId: string;
  hostName: string;
  title: string;
  description?: string;
  spaceType: SpaceType;
  address: string;
  lat?: number;
  lng?: number;
  photos?: string[];
  hourlyRate?: number;
  flatRate?: number;
  rateType: RateType;
  waterHookup: boolean;
  electricalOut: boolean;
  shadeCanopy: boolean;
  pavedFlat: boolean;
  available: boolean;
  createdAt: string;
}
