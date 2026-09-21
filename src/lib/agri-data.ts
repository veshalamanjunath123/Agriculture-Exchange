// Mock domain data + the Smart Resource Match engine for AgriXchange.
// All values are demo data for the hackathon prototype.

export type ListingMode = "Rent" | "Buy" | "Sell" | "Exchange";

export type Category =
  | "Machinery"
  | "Seeds"
  | "Fertilizer"
  | "Irrigation"
  | "Energy"
  | "Storage"
  | "Labor"
  | "Data";

export type Resource = {
  id: string;
  title: string;
  category: Category;
  mode: ListingMode[];
  owner: string;
  village: string;
  distanceKm: number;
  price: number;
  unit: string;
  rating: number;
  jobs: number;
  availableFrom: string;
  availableTo: string;
  verified: boolean;
  crops: string[];
  emoji: string;
  condition: "Excellent" | "Good" | "Fair";
  onTimeReturnRate: number;
};

export const resources: Resource[] = [
  {
    id: "AGX-R-101",
    title: "Mahindra 575 DI Tractor",
    category: "Machinery",
    mode: ["Rent"],
    owner: "Ravi Kumar",
    village: "Nandyal",
    distanceKm: 8.4,
    price: 1800,
    unit: "day",
    rating: 4.8,
    jobs: 64,
    availableFrom: "Sep 24",
    availableTo: "Sep 25",
    verified: true,
    crops: ["Cotton", "Maize", "Groundnut"],
    emoji: "🚜",
    condition: "Excellent",
    onTimeReturnRate: 97,
  },
  {
    id: "AGX-R-102",
    title: "John Deere 5050D + Rotavator",
    category: "Machinery",
    mode: ["Rent"],
    owner: "Suresh Patil",
    village: "Kurnool",
    distanceKm: 16.2,
    price: 2400,
    unit: "day",
    rating: 4.6,
    jobs: 41,
    availableFrom: "Sep 23",
    availableTo: "Sep 30",
    verified: true,
    crops: ["Cotton", "Sugarcane"],
    emoji: "🚜",
    condition: "Good",
    onTimeReturnRate: 92,
  },
  {
    id: "AGX-R-103",
    title: "Agri Spray Drone (10L)",
    category: "Machinery",
    mode: ["Rent", "Exchange"],
    owner: "Anitha Reddy",
    village: "Banaganapalle",
    distanceKm: 7.8,
    price: 1200,
    unit: "day",
    rating: 4.9,
    jobs: 28,
    availableFrom: "Sep 22",
    availableTo: "Oct 04",
    verified: true,
    crops: ["Cotton", "Paddy", "Chilli"],
    emoji: "🛩",
    condition: "Excellent",
    onTimeReturnRate: 99,
  },
  {
    id: "AGX-R-104",
    title: "Drip Irrigation Pump Set",
    category: "Irrigation",
    mode: ["Rent"],
    owner: "Mahesh Naik",
    village: "Dhone",
    distanceKm: 6.2,
    price: 700,
    unit: "day",
    rating: 4.7,
    jobs: 33,
    availableFrom: "Sep 22",
    availableTo: "Sep 28",
    verified: true,
    crops: ["Cotton", "Vegetables", "Paddy"],
    emoji: "💧",
    condition: "Good",
    onTimeReturnRate: 95,
  },
  {
    id: "AGX-R-105",
    title: "Surplus BT Cotton Seed (40 kg)",
    category: "Seeds",
    mode: ["Sell", "Exchange"],
    owner: "Lakshmi Devi",
    village: "Nandyal",
    distanceKm: 2.1,
    price: 820,
    unit: "packet",
    rating: 4.5,
    jobs: 17,
    availableFrom: "Sep 21",
    availableTo: "Oct 10",
    verified: true,
    crops: ["Cotton"],
    emoji: "🌱",
    condition: "Excellent",
    onTimeReturnRate: 100,
  },
  {
    id: "AGX-R-106",
    title: "Organic Vermicompost (2 tonne)",
    category: "Fertilizer",
    mode: ["Sell", "Exchange"],
    owner: "Krishna Farms FPO",
    village: "Allagadda",
    distanceKm: 11.5,
    price: 6400,
    unit: "tonne",
    rating: 4.4,
    jobs: 52,
    availableFrom: "Sep 21",
    availableTo: "Nov 01",
    verified: true,
    crops: ["Cotton", "Paddy", "Vegetables"],
    emoji: "🧪",
    condition: "Good",
    onTimeReturnRate: 91,
  },
  {
    id: "AGX-R-107",
    title: "Combine Harvester (Paddy)",
    category: "Machinery",
    mode: ["Rent"],
    owner: "Yadav Agro Services",
    village: "Atmakur",
    distanceKm: 22.4,
    price: 3200,
    unit: "day",
    rating: 4.3,
    jobs: 77,
    availableFrom: "Oct 02",
    availableTo: "Oct 20",
    verified: false,
    crops: ["Paddy", "Wheat"],
    emoji: "🌾",
    condition: "Good",
    onTimeReturnRate: 88,
  },
  {
    id: "AGX-R-108",
    title: "Cold Storage Space (5 tonne)",
    category: "Storage",
    mode: ["Rent"],
    owner: "Sai Storage Co-op",
    village: "Nandyal",
    distanceKm: 4.6,
    price: 450,
    unit: "tonne/week",
    rating: 4.6,
    jobs: 120,
    availableFrom: "Sep 21",
    availableTo: "Dec 31",
    verified: true,
    crops: ["Vegetables", "Chilli", "Onion"],
    emoji: "🏚",
    condition: "Excellent",
    onTimeReturnRate: 98,
  },
  {
    id: "AGX-R-109",
    title: "Solar Pump Surplus Energy (6 kWh/day)",
    category: "Energy",
    mode: ["Exchange", "Sell"],
    owner: "Bhaskar Rao",
    village: "Dhone",
    distanceKm: 9.1,
    price: 60,
    unit: "kWh",
    rating: 4.8,
    jobs: 14,
    availableFrom: "Sep 21",
    availableTo: "Oct 31",
    verified: true,
    crops: ["Any"],
    emoji: "☀️",
    condition: "Excellent",
    onTimeReturnRate: 100,
  },
  {
    id: "AGX-R-110",
    title: "Soil Testing Kit + Technician",
    category: "Labor",
    mode: ["Rent"],
    owner: "AgriLab Collective",
    village: "Kurnool",
    distanceKm: 14.0,
    price: 950,
    unit: "visit",
    rating: 4.7,
    jobs: 61,
    availableFrom: "Sep 22",
    availableTo: "Oct 15",
    verified: true,
    crops: ["Any"],
    emoji: "🔬",
    condition: "Good",
    onTimeReturnRate: 96,
  },
  {
    id: "AGX-R-111",
    title: "Harvest Labour Team (8 workers)",
    category: "Labor",
    mode: ["Rent"],
    owner: "Gopal Sangham",
    village: "Banaganapalle",
    distanceKm: 5.3,
    price: 3600,
    unit: "day",
    rating: 4.2,
    jobs: 89,
    availableFrom: "Sep 26",
    availableTo: "Oct 25",
    verified: false,
    crops: ["Cotton", "Chilli"],
    emoji: "🧑‍🌾",
    condition: "Good",
    onTimeReturnRate: 85,
  },
  {
    id: "AGX-R-112",
    title: "Canal Water Share (3 hrs/day)",
    category: "Irrigation",
    mode: ["Exchange"],
    owner: "Nandyal Water Users Assn.",
    village: "Nandyal",
    distanceKm: 5.4,
    price: 0,
    unit: "exchange",
    rating: 4.5,
    jobs: 46,
    availableFrom: "Sep 21",
    availableTo: "Oct 12",
    verified: true,
    crops: ["Cotton", "Paddy"],
    emoji: "💧",
    condition: "Good",
    onTimeReturnRate: 94,
  },
];

export const categories: Category[] = [
  "Machinery",
  "Seeds",
  "Fertilizer",
  "Irrigation",
  "Energy",
  "Storage",
  "Labor",
  "Data",
];

export const modes: ListingMode[] = ["Buy", "Rent", "Exchange", "Sell"];

/* ---------------- Smart Resource Match engine ---------------- */

export type MatchQuery = {
  text: string;
  radiusKm: number;
  days: number;
  crop: string;
  maxPrice: number;
};

export type MatchResult = {
  resource: Resource;
  score: number;
  reasons: string[];
};

const KEYWORDS: Record<string, Category> = {
  tractor: "Machinery",
  harvester: "Machinery",
  drone: "Machinery",
  machine: "Machinery",
  plough: "Machinery",
  seed: "Seeds",
  cotton: "Seeds",
  fertilizer: "Fertilizer",
  compost: "Fertilizer",
  manure: "Fertilizer",
  irrigation: "Irrigation",
  water: "Irrigation",
  pump: "Irrigation",
  drip: "Irrigation",
  solar: "Energy",
  energy: "Energy",
  storage: "Storage",
  cold: "Storage",
  labour: "Labor",
  labor: "Labor",
  worker: "Labor",
  soil: "Labor",
  test: "Labor",
};

export function detectCategory(text: string): Category | null {
  const q = text.toLowerCase();
  for (const [word, category] of Object.entries(KEYWORDS)) {
    if (q.includes(word)) return category;
  }
  return null;
}

export function smartMatch(query: MatchQuery): MatchResult[] {
  const wanted = detectCategory(query.text);
  const q = query.text.toLowerCase();

  return resources
    .map((resource) => {
      const reasons: string[] = [];
      let score = 40;

      // Distance
      if (resource.distanceKm <= query.radiusKm) {
        const closeness = 1 - resource.distanceKm / Math.max(query.radiusKm, 1);
        score += 22 * closeness + 8;
        reasons.push(`${resource.distanceKm} km away — inside your ${query.radiusKm} km radius`);
      } else {
        score -= 45;
      }

      // Category / keyword relevance
      if (wanted && resource.category === wanted) {
        score += 18;
        reasons.push(`Matches resource type: ${resource.category.toLowerCase()}`);
      }
      if (q.length > 2 && resource.title.toLowerCase().includes(q.split(" ")[0] ?? q)) {
        score += 6;
      }

      // Crop compatibility
      if (resource.crops.includes(query.crop) || resource.crops.includes("Any")) {
        score += 8;
        reasons.push(`Compatible with ${query.crop} operations`);
      }

      // Price
      const total = resource.price * (resource.unit === "day" ? query.days : 1);
      if (total <= query.maxPrice) {
        score += 10;
        reasons.push(
          resource.price === 0
            ? "Exchange listing — no cash payment needed"
            : `₹${total.toLocaleString("en-IN")} for ${resource.unit === "day" ? `${query.days} day(s)` : `1 ${resource.unit}`}`,
        );
      } else {
        score -= 12;
      }

      // Trust
      score += (resource.rating - 4) * 12;
      if (resource.verified) {
        score += 5;
        reasons.push("Verified farmer with KYC + farm check");
      }
      score += (resource.onTimeReturnRate - 85) / 6;

      return {
        resource,
        score: Math.max(4, Math.min(99, Math.round(score))),
        reasons: reasons.slice(0, 4),
      };
    })
    .filter((m) => m.score > 45)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}

/* ---------------- AgriPulse regional intelligence ---------------- */

export const agriPulse = {
  region: "Nandyal Block, Andhra Pradesh",
  farmsContributing: 128,
  sensors: 412,
  confidence: 89,
  metrics: [
    { label: "Soil Moisture", value: "38%", trend: "-4% (48h)", tone: "water" as const },
    { label: "Rain Probability", value: "72%", trend: "next 18 hrs", tone: "water" as const },
    { label: "Pest Risk", value: "MEDIUM", trend: "3 farms affected", tone: "warn" as const },
    { label: "Water Availability", value: "GOOD", trend: "canal cycle on time", tone: "primary" as const },
  ],
  alerts: [
    {
      icon: "🌧",
      title: "Rain expected in 18 hours",
      body: "Regional models agree at 72% probability, 14–22 mm over the block.",
    },
    {
      icon: "💧",
      title: "Delay irrigation by ~12 hours",
      body: "Pooled soil-moisture curves show the profile will refill naturally. Est. saving 1,240 L/acre.",
    },
    {
      icon: "🐛",
      title: "Fall armyworm activity detected",
      body: "Confirmed on 3 nearby farms within 9 km. Scout whorls in maize and young cotton.",
    },
  ],
  moistureSeries: [
    { day: "Mon", moisture: 52, rain: 5 },
    { day: "Tue", moisture: 49, rain: 0 },
    { day: "Wed", moisture: 46, rain: 0 },
    { day: "Thu", moisture: 43, rain: 2 },
    { day: "Fri", moisture: 40, rain: 8 },
    { day: "Sat", moisture: 38, rain: 22 },
    { day: "Sun", moisture: 47, rain: 12 },
  ],
  pestSeries: [
    { week: "W1", risk: 22 },
    { week: "W2", risk: 31 },
    { week: "W3", risk: 44 },
    { week: "W4", risk: 58 },
    { week: "W5", risk: 51 },
  ],
};

/* ---------------- Data permissions ---------------- */

export type Visibility = "Private" | "Cooperative" | "Regional" | "Public";

export const visibilityLevels: Visibility[] = ["Private", "Cooperative", "Regional", "Public"];

export const dataStreams = [
  { id: "soil", name: "Soil moisture", visibility: "Regional" as Visibility, sharedWith: "12 farms" },
  { id: "weather", name: "Weather station", visibility: "Public" as Visibility, sharedWith: "Everyone" },
  { id: "crop", name: "Crop health scans", visibility: "Private" as Visibility, sharedWith: "—" },
  { id: "drone", name: "Drone imagery", visibility: "Cooperative" as Visibility, sharedWith: "5 farms" },
  { id: "yield", name: "Yield history", visibility: "Regional" as Visibility, sharedWith: "Research pool" },
  { id: "pest", name: "Pest sightings", visibility: "Public" as Visibility, sharedWith: "Everyone" },
];

/* ---------------- Ledger ---------------- */

export const ledger = [
  {
    id: "AGX-20481",
    from: "Anitha Reddy",
    to: "Mahesh Naik",
    item: "Drip Irrigation Pump Set",
    amount: 1400,
    status: "Payment released",
    hash: "0x7a41…c92f",
    steps: ["Request created", "Smart contract locked", "Equipment handed over", "Returned on time", "Payment released"],
    date: "Sep 20, 2026",
  },
  {
    id: "AGX-20477",
    from: "Rajesh Gowda",
    to: "Ravi Kumar",
    item: "Mahindra 575 DI Tractor",
    amount: 3600,
    status: "In escrow",
    hash: "0x21be…4d70",
    steps: ["Request created", "Smart contract locked", "Equipment handed over"],
    date: "Sep 21, 2026",
  },
  {
    id: "AGX-20465",
    from: "Lakshmi Devi",
    to: "Krishna Farms FPO",
    item: "Vermicompost 2 tonne",
    amount: 12800,
    status: "Payment released",
    hash: "0x9cd3…11aa",
    steps: ["Request created", "Smart contract locked", "Delivered", "Quality confirmed", "Payment released"],
    date: "Sep 18, 2026",
  },
  {
    id: "AGX-20452",
    from: "Bhaskar Rao",
    to: "Nandyal Water Users Assn.",
    item: "Solar energy ↔ canal water swap",
    amount: 0,
    status: "Exchange settled",
    hash: "0x4ff0…8e13",
    steps: ["Exchange proposed", "Both parties signed", "Swap completed"],
    date: "Sep 16, 2026",
  },
];

/* ---------------- Community ---------------- */

export const communityPosts = [
  {
    id: "c1",
    author: "Lakshmi Devi",
    village: "Nandyal",
    time: "2 hrs ago",
    tag: "Pest control",
    title: "Fall armyworm in young cotton — what worked for me",
    body: "Early morning scouting plus neem-based spray at 5 ml/L stopped spread in 4 days. Sharing my scouting sheet with the cooperative.",
    replies: 14,
    likes: 62,
  },
  {
    id: "c2",
    author: "Suresh Patil",
    village: "Kurnool",
    time: "6 hrs ago",
    tag: "Equipment",
    title: "Rotavator depth settings for black cotton soil?",
    body: "After last week's rain the soil is sticky. Anyone running a 7-ft rotavator behind a 50 HP tractor — what depth are you using?",
    replies: 9,
    likes: 21,
  },
  {
    id: "c3",
    author: "Krishna Farms FPO",
    village: "Allagadda",
    time: "1 day ago",
    tag: "Cooperative",
    title: "Group booking: harvester for 18 farms in October",
    body: "We are pooling 18 farms to negotiate ₹2,700/day instead of ₹3,200. Two slots left — comment your acreage.",
    replies: 27,
    likes: 104,
  },
  {
    id: "c4",
    author: "Anitha Reddy",
    village: "Banaganapalle",
    time: "2 days ago",
    tag: "Water",
    title: "Delayed irrigation by 12 hrs on AgriPulse advice — saved 1,240 L",
    body: "The rain came exactly as predicted. My moisture sensor never dropped below 34%. Regional data sharing genuinely works.",
    replies: 31,
    likes: 188,
  },
];

export const groups = [
  { name: "Nandyal Cotton Collective", members: 128, focus: "Cotton • machinery pooling" },
  { name: "Drone Spray Circle", members: 46, focus: "Shared drone operators" },
  { name: "Water Users Association", members: 210, focus: "Canal scheduling" },
  { name: "Organic Inputs Group", members: 74, focus: "Compost & bio-inputs" },
];

/* ---------------- Map points ---------------- */

export type MapPoint = {
  id: string;
  label: string;
  kind: "Machinery" | "Water" | "Seeds" | "Farmer" | "Storage" | "Energy";
  emoji: string;
  x: number;
  y: number;
  distanceKm: number;
  detail: string;
};

export const mapPoints: MapPoint[] = [
  { id: "m1", label: "Mahindra 575 DI", kind: "Machinery", emoji: "🚜", x: 28, y: 34, distanceKm: 8.4, detail: "₹1,800/day • Ravi Kumar" },
  { id: "m2", label: "Spray Drone 10L", kind: "Machinery", emoji: "🛩", x: 62, y: 24, distanceKm: 7.8, detail: "₹1,200/day • Anitha Reddy" },
  { id: "m3", label: "Canal water share", kind: "Water", emoji: "💧", x: 44, y: 62, distanceKm: 5.4, detail: "3 hrs/day • exchange only" },
  { id: "m4", label: "BT cotton seed", kind: "Seeds", emoji: "🌱", x: 18, y: 68, distanceKm: 2.1, detail: "₹820/packet • Lakshmi Devi" },
  { id: "m5", label: "Sai cold storage", kind: "Storage", emoji: "🏚", x: 74, y: 58, distanceKm: 4.6, detail: "₹450/tonne/week" },
  { id: "m6", label: "Solar surplus", kind: "Energy", emoji: "☀️", x: 82, y: 38, distanceKm: 9.1, detail: "6 kWh/day • Bhaskar Rao" },
  { id: "m7", label: "Gopal Sangham", kind: "Farmer", emoji: "🧑‍🌾", x: 36, y: 80, distanceKm: 5.3, detail: "Labour team of 8" },
  { id: "m8", label: "Combine harvester", kind: "Machinery", emoji: "🌾", x: 88, y: 76, distanceKm: 22.4, detail: "₹3,200/day • Atmakur" },
  { id: "m9", label: "AgriLab soil testing", kind: "Farmer", emoji: "🔬", x: 12, y: 46, distanceKm: 14, detail: "₹950/visit" },
];

export const impactStats = [
  { value: "₹4.2 Cr", label: "Idle machinery value activated" },
  { value: "18,400", label: "Farmers on the exchange" },
  { value: "2.1 M L", label: "Irrigation water saved" },
  { value: "31%", label: "Average input cost reduction" },
];
