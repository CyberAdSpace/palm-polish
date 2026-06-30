export function generateId(): string {
  return crypto.randomUUID();
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getLocationLabel(type: string): string {
  switch (type) {
    case "ON_SITE":
      return "On-Site (My Location)";
    case "MEET_UP":
      return "Meet Up (Go to Detailer)";
    case "NEED_A_PLACE":
      return "Need a Place";
    default:
      return type;
  }
}

export function getSpaceTypeLabel(type: string): string {
  switch (type) {
    case "DRIVEWAY":
      return "Driveway";
    case "GARAGE":
      return "Garage";
    case "COMMERCIAL_BAY":
      return "Commercial Bay";
    default:
      return type;
  }
}
