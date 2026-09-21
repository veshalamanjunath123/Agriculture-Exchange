/**
 * Owner-side resource catalogue for the AgriXchange prototype.
 * Mirrors the shape a real `owner_resources` table would have, including the
 * per-type specification fields, availability blocks and maintenance records.
 */

export type ResourceStatus = "Available" | "Rented" | "Reserved" | "Maintenance" | "Inactive";

export const resourceStatuses: { value: ResourceStatus; dot: string }[] = [
  { value: "Available", dot: "🟢" },
  { value: "Rented", dot: "🔵" },
  { value: "Reserved", dot: "🟡" },
  { value: "Maintenance", dot: "🔧" },
  { value: "Inactive", dot: "⚫" },
];

export type SpecField = {
  key: string;
  label: string;
  placeholder?: string;
  kind?: "text" | "number";
};

export type ResourceTypeDef = {
  key: string;
  label: string;
  emoji: string;
  category: string;
  unit: string;
  fields: SpecField[];
};

/** Each resource type brings only the fields that make sense for it. */
export const resourceTypes: ResourceTypeDef[] = [
  {
    key: "tractor",
    label: "Tractor",
    emoji: "🚜",
    category: "Machinery",
    unit: "day",
    fields: [
      { key: "brand", label: "Brand", placeholder: "Mahindra" },
      { key: "model", label: "Model", placeholder: "575 DI" },
      { key: "year", label: "Manufacturing Year", placeholder: "2021", kind: "number" },
      { key: "hp", label: "Horsepower", placeholder: "45 HP" },
      { key: "fuel", label: "Fuel Type", placeholder: "Diesel" },
      { key: "implements", label: "Implements included", placeholder: "Rotavator, cultivator" },
    ],
  },
  {
    key: "drone",
    label: "Drone",
    emoji: "🛩️",
    category: "Machinery",
    unit: "day",
    fields: [
      { key: "brand", label: "Brand", placeholder: "DJI" },
      { key: "model", label: "Model", placeholder: "Agras T30" },
      { key: "flightTime", label: "Flight time", placeholder: "22 minutes" },
      { key: "camera", label: "Camera", placeholder: "Multispectral 4K" },
      { key: "coverage", label: "Coverage area", placeholder: "16 acres per day" },
    ],
  },
  {
    key: "harvester",
    label: "Harvester",
    emoji: "🌾",
    category: "Machinery",
    unit: "day",
    fields: [
      { key: "brand", label: "Brand", placeholder: "John Deere" },
      { key: "model", label: "Model", placeholder: "W70" },
      { key: "cropTypes", label: "Suitable crops", placeholder: "Paddy, wheat" },
      { key: "capacity", label: "Capacity", placeholder: "4 acres per day" },
    ],
  },
  {
    key: "pump",
    label: "Irrigation Pump",
    emoji: "💧",
    category: "Water",
    unit: "day",
    fields: [
      { key: "pumpType", label: "Pump type", placeholder: "Submersible" },
      { key: "capacity", label: "Capacity", placeholder: "7.5 HP" },
      { key: "power", label: "Power source", placeholder: "Electric / Diesel" },
      { key: "flowRate", label: "Flow rate", placeholder: "1,200 litres per minute" },
    ],
  },
  {
    key: "seeds",
    label: "Seeds",
    emoji: "🌱",
    category: "Inputs",
    unit: "quintal",
    fields: [
      { key: "crop", label: "Crop", placeholder: "Cotton" },
      { key: "variety", label: "Variety", placeholder: "BT-II" },
      { key: "quantity", label: "Quantity", placeholder: "12", kind: "number" },
      { key: "unitName", label: "Unit", placeholder: "quintal" },
      { key: "germination", label: "Germination rate", placeholder: "92%" },
      { key: "expiry", label: "Expiry", placeholder: "Mar 2027" },
    ],
  },
  {
    key: "fertilizer",
    label: "Fertilizer",
    emoji: "🧪",
    category: "Inputs",
    unit: "bag",
    fields: [
      { key: "kind", label: "Type", placeholder: "Organic compost" },
      { key: "quantity", label: "Quantity", placeholder: "40", kind: "number" },
      { key: "unitName", label: "Unit", placeholder: "bag" },
      { key: "composition", label: "Composition", placeholder: "N-P-K 10:26:26" },
    ],
  },
  {
    key: "iot",
    label: "IoT Device",
    emoji: "📡",
    category: "Data",
    unit: "week",
    fields: [
      { key: "deviceType", label: "Device type", placeholder: "Soil moisture sensor" },
      { key: "metrics", label: "Metrics captured", placeholder: "Moisture, temperature, EC" },
      { key: "connectivity", label: "Connectivity", placeholder: "LoRaWAN" },
    ],
  },
  {
    key: "solar",
    label: "Solar Equipment",
    emoji: "☀️",
    category: "Energy",
    unit: "day",
    fields: [
      { key: "capacity", label: "Capacity", placeholder: "5 kW" },
      { key: "panelType", label: "Panel type", placeholder: "Monocrystalline" },
      { key: "storage", label: "Battery storage", placeholder: "10 kWh" },
    ],
  },
  {
    key: "storage",
    label: "Storage",
    emoji: "🏭",
    category: "Storage",
    unit: "day",
    fields: [
      { key: "storageType", label: "Storage type", placeholder: "Cold storage" },
      { key: "capacity", label: "Capacity", placeholder: "120 tonnes" },
      { key: "temperature", label: "Temperature", placeholder: "4 °C" },
    ],
  },
  {
    key: "transport",
    label: "Transport",
    emoji: "🚚",
    category: "Machinery",
    unit: "trip",
    fields: [
      { key: "vehicle", label: "Vehicle", placeholder: "Tata 407" },
      { key: "capacity", label: "Load capacity", placeholder: "2.5 tonnes" },
      { key: "range", label: "Service range", placeholder: "60 km" },
    ],
  },
  {
    key: "other",
    label: "Other",
    emoji: "🔧",
    category: "Machinery",
    unit: "day",
    fields: [
      { key: "detail", label: "What is it?", placeholder: "Describe the resource" },
      { key: "capacity", label: "Capacity / size", placeholder: "Optional" },
    ],
  },
];

export function typeDef(key: string): ResourceTypeDef {
  return resourceTypes.find((r) => r.key === key) ?? resourceTypes[resourceTypes.length - 1]!;
}

export type MaintenanceRecord = {
  date: string;
  kind: string;
  cost: number;
  notes: string;
  nextService: string;
};

export type OwnedResource = {
  id: string;
  type: string;
  name: string;
  emoji: string;
  category: string;
  price: number;
  unit: string;
  deposit: number;
  condition: string;
  status: ResourceStatus;
  locationLabel: string;
  distanceKm: number;
  description: string;
  photos: string[];
  specs: Record<string, string>;
  blockedDates: string[];
  maintenance: MaintenanceRecord[];
  nextServiceHours: number;
  published: boolean;
  active: boolean;
  activeBookings: number;
  stats: {
    rating: number;
    rentals: number;
    earned: number;
    utilization: number;
    maintenanceEvents: number;
    avgDays: number;
  };
};

export type BookingRequestStatus = "Pending" | "Accepted" | "Active" | "Completed" | "Cancelled";

export type OwnerBookingRequest = {
  id: string;
  resourceId: string;
  resourceName: string;
  emoji: string;
  farmer: string;
  farmerMobile: string;
  from: string;
  to: string;
  days: number;
  amount: number;
  status: BookingRequestStatus;
};

const stats = (
  rating: number,
  rentals: number,
  earned: number,
  utilization: number,
  maintenanceEvents: number,
  avgDays: number,
) => ({ rating, rentals, earned, utilization, maintenanceEvents, avgDays });

export const demoOwnedResources: OwnedResource[] = [
  {
    id: "AGX-R-101",
    type: "tractor",
    name: "Mahindra 575 DI Tractor",
    emoji: "🚜",
    category: "Machinery",
    price: 1800,
    unit: "day",
    deposit: 5000,
    condition: "Excellent",
    status: "Available",
    locationLabel: "Nandyal, Andhra Pradesh",
    distanceKm: 8.4,
    description:
      "Well-maintained 45 HP tractor with rotavator and cultivator. Serviced every 180 hours.",
    photos: [],
    specs: {
      brand: "Mahindra",
      model: "575 DI",
      year: "2021",
      hp: "45 HP",
      fuel: "Diesel",
      implements: "Rotavator, cultivator",
    },
    blockedDates: [],
    maintenance: [
      {
        date: "2026-09-25",
        kind: "Routine service",
        cost: 2400,
        notes: "Oil, filter and hydraulic check.",
        nextService: "2026-11-10",
      },
    ],
    nextServiceHours: 32,
    published: true,
    active: true,
    activeBookings: 2,
    stats: stats(4.8, 47, 82600, 92, 2, 2.4),
  },
  {
    id: "AGX-R-102",
    type: "drone",
    name: "DJI Agricultural Spray Drone",
    emoji: "🛩️",
    category: "Machinery",
    price: 3500,
    unit: "day",
    deposit: 8000,
    condition: "Excellent",
    status: "Rented",
    locationLabel: "Nandyal, Andhra Pradesh",
    distanceKm: 8.4,
    description: "30 litre spray drone with multispectral camera and trained pilot on request.",
    photos: [],
    specs: {
      brand: "DJI",
      model: "Agras T30",
      flightTime: "22 minutes",
      camera: "Multispectral 4K",
      coverage: "16 acres per day",
    },
    blockedDates: [],
    maintenance: [],
    nextServiceHours: 96,
    published: true,
    active: true,
    activeBookings: 1,
    stats: stats(4.9, 31, 64200, 78, 1, 1.8),
  },
  {
    id: "AGX-R-103",
    type: "pump",
    name: "7.5 HP Submersible Pump Set",
    emoji: "💧",
    category: "Water",
    price: 600,
    unit: "day",
    deposit: 1500,
    condition: "Good",
    status: "Available",
    locationLabel: "Nandyal, Andhra Pradesh",
    distanceKm: 8.4,
    description: "Submersible pump with 120 m cable, suitable for bore wells up to 200 feet.",
    photos: [],
    specs: {
      pumpType: "Submersible",
      capacity: "7.5 HP",
      power: "Electric",
      flowRate: "1,200 litres per minute",
    },
    blockedDates: [],
    maintenance: [],
    nextServiceHours: 210,
    published: true,
    active: true,
    activeBookings: 0,
    stats: stats(4.6, 22, 13800, 61, 0, 3.1),
  },
  {
    id: "AGX-R-104",
    type: "harvester",
    name: "Paddy Harvester W70",
    emoji: "🌾",
    category: "Machinery",
    price: 6500,
    unit: "day",
    deposit: 12000,
    condition: "Fair",
    status: "Maintenance",
    locationLabel: "Nandyal, Andhra Pradesh",
    distanceKm: 8.4,
    description: "Track harvester for paddy and wheat. Currently in the workshop for belt work.",
    photos: [],
    specs: {
      brand: "John Deere",
      model: "W70",
      cropTypes: "Paddy, wheat",
      capacity: "4 acres per day",
    },
    blockedDates: [],
    maintenance: [
      {
        date: "2026-09-20",
        kind: "Belt replacement",
        cost: 8800,
        notes: "Threshing belt and bearings replaced.",
        nextService: "2026-12-01",
      },
    ],
    nextServiceHours: 12,
    published: true,
    active: true,
    activeBookings: 0,
    stats: stats(4.5, 18, 96400, 54, 3, 2.9),
  },
  {
    id: "AGX-R-105",
    type: "storage",
    name: "Cold Storage Unit — 120 t",
    emoji: "🏭",
    category: "Storage",
    price: 900,
    unit: "day",
    deposit: 2000,
    condition: "Good",
    status: "Reserved",
    locationLabel: "Nandyal, Andhra Pradesh",
    distanceKm: 8.4,
    description: "Temperature controlled storage for onion, chilli and fruit consignments.",
    photos: [],
    specs: { storageType: "Cold storage", capacity: "120 tonnes", temperature: "4 °C" },
    blockedDates: [],
    maintenance: [],
    nextServiceHours: 320,
    published: true,
    active: true,
    activeBookings: 1,
    stats: stats(4.7, 14, 28900, 70, 1, 6.2),
  },
  {
    id: "AGX-R-106",
    type: "solar",
    name: "5 kW Portable Solar Set",
    emoji: "☀️",
    category: "Energy",
    price: 750,
    unit: "day",
    deposit: 2500,
    condition: "Excellent",
    status: "Inactive",
    locationLabel: "Nandyal, Andhra Pradesh",
    distanceKm: 8.4,
    description: "Portable solar array with battery storage for pump sets and cold rooms.",
    photos: [],
    specs: { capacity: "5 kW", panelType: "Monocrystalline", storage: "10 kWh" },
    blockedDates: [],
    maintenance: [],
    nextServiceHours: 400,
    published: false,
    active: true,
    activeBookings: 0,
    stats: stats(4.4, 6, 9200, 22, 0, 4.0),
  },
];

export const demoBookingRequests: OwnerBookingRequest[] = [
  {
    id: "AGX-20481",
    resourceId: "AGX-R-101",
    resourceName: "Mahindra 575 DI Tractor",
    emoji: "🚜",
    farmer: "Anitha Reddy",
    farmerMobile: "+91 98•••• ••21",
    from: "Sep 24",
    to: "Sep 25",
    days: 2,
    amount: 3600,
    status: "Pending",
  },
  {
    id: "AGX-20476",
    resourceId: "AGX-R-102",
    resourceName: "DJI Agricultural Spray Drone",
    emoji: "🛩️",
    farmer: "Bhaskar Rao",
    farmerMobile: "+91 90•••• ••07",
    from: "Sep 22",
    to: "Sep 23",
    days: 1,
    amount: 3500,
    status: "Active",
  },
  {
    id: "AGX-20468",
    resourceId: "AGX-R-105",
    resourceName: "Cold Storage Unit — 120 t",
    emoji: "🏭",
    farmer: "Suresh Naidu",
    farmerMobile: "+91 99•••• ••44",
    from: "Sep 18",
    to: "Sep 24",
    days: 6,
    amount: 5400,
    status: "Accepted",
  },
  {
    id: "AGX-20452",
    resourceId: "AGX-R-103",
    resourceName: "7.5 HP Submersible Pump Set",
    emoji: "💧",
    farmer: "Lakshmi Devi",
    farmerMobile: "+91 97•••• ••18",
    from: "Sep 09",
    to: "Sep 12",
    days: 3,
    amount: 1800,
    status: "Completed",
  },
];

export const monthlyEarnings = [
  { month: "Apr", amount: 9400 },
  { month: "May", amount: 12600 },
  { month: "Jun", amount: 15800 },
  { month: "Jul", amount: 11200 },
  { month: "Aug", amount: 16400 },
  { month: "Sep", amount: 18500 },
];

export function newResourceId(existing: OwnedResource[]): string {
  const max = existing.reduce((acc, r) => {
    const n = Number(r.id.replace("AGX-R-", ""));
    return Number.isFinite(n) ? Math.max(acc, n) : acc;
  }, 100);
  return `AGX-R-${max + 1}`;
}
