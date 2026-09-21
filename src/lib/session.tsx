/**
 * Client-side session, booking and notification store for the AgriXchange prototype.
 * Persisted in localStorage so the demo survives reloads. Replace with server
 * functions + database tables (users, user_locations, bookings, equipment_tracking,
 * reviews, notifications, data_permissions) when a real backend is added.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Resource } from "@/lib/agri-data";
import type { Visibility } from "@/lib/agri-data";
import {
  demoBookingRequests,
  demoOwnedResources,
  newResourceId,
  type BookingRequestStatus,
  type MaintenanceRecord,
  type OwnedResource,
  type OwnerBookingRequest,
  type ResourceStatus,
} from "@/lib/owner-resources";

export type Role = "farmer" | "owner" | "both";

export type GeoLocation = {
  label: string;
  lat: number;
  lng: number;
  precise: boolean;
};

export type Profile = {
  mobile: string;
  countryCode: string;
  role: Role;
  name: string;
  farmName: string;
  farmSize: number;
  crop: string;
  farmingType: string;
  language: string;
  location: GeoLocation | null;
  businessName?: string;
  categories?: string[];
  onboarded: boolean;
};

export const bookingStages = [
  "Booking confirmed",
  "Owner preparing equipment",
  "Equipment on the way",
  "Arrived at farm",
  "Rental active",
  "Return initiated",
  "Returned",
  "Completed",
] as const;

export type BookingStage = (typeof bookingStages)[number];

export type Review = {
  overall: number;
  condition: number;
  communication: number;
  timeliness: number;
  rentAgain: boolean;
  feedback: string;
};

export type Booking = {
  id: string;
  resourceId: string;
  title: string;
  emoji: string;
  owner: string;
  ownerLocation: GeoLocation;
  farmLocation: GeoLocation;
  distanceKm: number;
  from: string;
  to: string;
  days: number;
  amount: number;
  deposit: number;
  stage: number;
  etaMinutes: number;
  updatedAt: number;
  returnCondition?: string;
  returnComments?: string;
  review?: Review;
  ownerReview?: Review;
  damageReport?: { issue: string; description: string };
};

export type Notification = {
  id: string;
  icon: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
};

export type LocationPermissions = {
  marketplace: "approximate" | "precise" | "hidden";
  activeBooking: "precise" | "approximate";
  publicProfile: "hidden" | "approximate";
};

export type NotificationPrefs = {
  booking: boolean;
  tracking: boolean;
  ai: boolean;
  weather: boolean;
  pest: boolean;
  community: boolean;
  marketing: boolean;
};

type State = {
  profile: Profile | null;
  bookings: Booking[];
  notifications: Notification[];
  locationPermissions: LocationPermissions;
  dataPermissions: Record<string, Visibility>;
  notificationPrefs: NotificationPrefs;
  ownedResources: OwnedResource[];
  bookingRequests: OwnerBookingRequest[];
};

const DEMO_OWNER_LOCATION: GeoLocation = {
  label: "Nandyal, Andhra Pradesh",
  lat: 17.41,
  lng: 78.47,
  precise: true,
};

const DEMO_FARM_LOCATION: GeoLocation = {
  label: "Banaganapalle, Andhra Pradesh",
  lat: 17.385,
  lng: 78.4867,
  precise: true,
};

const demoBooking: Booking = {
  id: "AGX-20481",
  resourceId: "AGX-R-101",
  title: "Mahindra 575 DI Tractor",
  emoji: "🚜",
  owner: "Ravi Kumar",
  ownerLocation: DEMO_OWNER_LOCATION,
  farmLocation: DEMO_FARM_LOCATION,
  distanceKm: 8.4,
  from: "Sep 24",
  to: "Sep 25",
  days: 2,
  amount: 3600,
  deposit: 5000,
  stage: 2,
  etaMinutes: 25,
  updatedAt: Date.now(),
};

const demoNotifications: Notification[] = [
  {
    id: "n1",
    icon: "🚜",
    title: "Equipment request accepted",
    body: "Your tractor request was accepted by Ravi Kumar.",
    time: "4 min ago",
    read: false,
  },
  {
    id: "n2",
    icon: "📍",
    title: "Equipment is on the way",
    body: "Estimated arrival: 25 minutes.",
    time: "2 min ago",
    read: false,
  },
  {
    id: "n3",
    icon: "🌧",
    title: "Weather alert",
    body: "Heavy rainfall expected tomorrow across Nandyal block.",
    time: "1 hr ago",
    read: false,
  },
  {
    id: "n4",
    icon: "🐛",
    title: "Pest alert",
    body: "Elevated fall armyworm activity detected on 3 farms within 9 km.",
    time: "3 hrs ago",
    read: true,
  },
  {
    id: "n5",
    icon: "🤖",
    title: "New AI recommendation",
    body: "AgriPulse generated a new irrigation recommendation for your cotton block.",
    time: "5 hrs ago",
    read: true,
  },
];

const initialState: State = {
  profile: null,
  bookings: [demoBooking],
  notifications: demoNotifications,
  locationPermissions: {
    marketplace: "approximate",
    activeBooking: "precise",
    publicProfile: "hidden",
  },
  dataPermissions: {
    soil: "Regional",
    weather: "Public",
    crop: "Private",
    drone: "Cooperative",
    yield: "Regional",
    pest: "Public",
  },
  notificationPrefs: {
    booking: true,
    tracking: true,
    ai: true,
    weather: true,
    pest: true,
    community: false,
    marketing: false,
  },
  ownedResources: demoOwnedResources,
  bookingRequests: demoBookingRequests,
};

type SessionValue = State & {
  ready: boolean;
  signIn: (mobile: string, countryCode: string) => void;
  updateProfile: (patch: Partial<Profile>) => void;
  signOut: () => void;
  createBooking: (resource: Resource, days: number) => Booking;
  updateBooking: (id: string, patch: Partial<Booking>) => void;
  advanceBooking: (id: string) => void;
  addNotification: (n: Omit<Notification, "id" | "time" | "read">) => void;
  markNotificationsRead: () => void;
  setLocationPermissions: (patch: Partial<LocationPermissions>) => void;
  setDataPermission: (streamId: string, visibility: Visibility) => void;
  setNotificationPref: (key: keyof NotificationPrefs, value: boolean) => void;
  addResource: (r: OwnedResource) => void;
  updateResource: (id: string, patch: Partial<OwnedResource>) => void;
  removeResource: (id: string) => void;
  setResourceStatus: (id: string, status: ResourceStatus) => void;
  toggleBlockedDate: (id: string, isoDate: string) => void;
  addMaintenance: (id: string, record: MaintenanceRecord) => void;
  setRequestStatus: (id: string, status: BookingRequestStatus) => void;
  nextResourceId: () => string;
};

const SessionContext = createContext<SessionValue | null>(null);

const STORAGE_KEY = "agx.session.v1";

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initialState);
  const [ready, setReady] = useState(false);
  const stateRef = useRef<State>(initialState);
  stateRef.current = state;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState, ...(JSON.parse(raw) as State) });
    } catch {
      /* ignore corrupt demo state */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, ready]);

  const signIn = useCallback((mobile: string, countryCode: string) => {
    setState((s) => ({
      ...s,
      profile: {
        mobile,
        countryCode,
        role: "farmer",
        name: "",
        farmName: "",
        farmSize: 25,
        crop: "Cotton",
        farmingType: "Conventional",
        language: "English",
        location: null,
        onboarded: false,
        ...(s.profile ?? {}),
      },
    }));
  }, []);

  const updateProfile = useCallback((patch: Partial<Profile>) => {
    setState((s) => (s.profile ? { ...s, profile: { ...s.profile, ...patch } } : s));
  }, []);

  const signOut = useCallback(() => setState((s) => ({ ...s, profile: null })), []);

  const addNotification = useCallback((n: Omit<Notification, "id" | "time" | "read">) => {
    setState((s) => ({
      ...s,
      notifications: [
        { ...n, id: `n-${Date.now()}`, time: "just now", read: false },
        ...s.notifications,
      ],
    }));
  }, []);

  const createBooking = useCallback((resource: Resource, days: number) => {
    const booking: Booking = {
      id: `AGX-${20482 + Math.floor(Math.random() * 400)}`,
      resourceId: resource.id,
      title: resource.title,
      emoji: resource.emoji,
      owner: resource.owner,
      ownerLocation: {
        label: `${resource.village}, Andhra Pradesh`,
        lat: 17.41 + resource.distanceKm / 400,
        lng: 78.47 + resource.distanceKm / 500,
        precise: true,
      },
      farmLocation: DEMO_FARM_LOCATION,
      distanceKm: resource.distanceKm,
      from: resource.availableFrom,
      to: resource.availableTo,
      days,
      amount: resource.price * (resource.unit === "day" ? days : 1),
      deposit: resource.category === "Machinery" ? 5000 : 1000,
      stage: 0,
      etaMinutes: Math.max(10, Math.round(resource.distanceKm * 3)),
      updatedAt: Date.now(),
    };
    setState((s) => ({
      ...s,
      bookings: [booking, ...s.bookings],
      notifications: [
        {
          id: `n-${Date.now()}`,
          icon: "🚜",
          title: "Equipment request accepted",
          body: `${resource.owner} accepted your request for ${resource.title}.`,
          time: "just now",
          read: false,
        },
        ...s.notifications,
      ],
    }));
    return booking;
  }, []);

  const updateBooking = useCallback((id: string, patch: Partial<Booking>) => {
    setState((s) => ({
      ...s,
      bookings: s.bookings.map((b) => (b.id === id ? { ...b, ...patch, updatedAt: Date.now() } : b)),
    }));
  }, []);

  const advanceBooking = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      bookings: s.bookings.map((b) =>
        b.id === id
          ? {
              ...b,
              stage: Math.min(bookingStages.length - 1, b.stage + 1),
              etaMinutes: b.stage >= 2 ? 0 : b.etaMinutes,
              updatedAt: Date.now(),
            }
          : b,
      ),
    }));
  }, []);

  const markNotificationsRead = useCallback(() => {
    setState((s) => ({
      ...s,
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    }));
  }, []);

  const setLocationPermissions = useCallback((patch: Partial<LocationPermissions>) => {
    setState((s) => ({ ...s, locationPermissions: { ...s.locationPermissions, ...patch } }));
  }, []);

  const setDataPermission = useCallback((streamId: string, visibility: Visibility) => {
    setState((s) => ({
      ...s,
      dataPermissions: { ...s.dataPermissions, [streamId]: visibility },
    }));
  }, []);

  const setNotificationPref = useCallback((key: keyof NotificationPrefs, value: boolean) => {
    setState((s) => ({ ...s, notificationPrefs: { ...s.notificationPrefs, [key]: value } }));
  }, []);

  const addResource = useCallback((r: OwnedResource) => {
    setState((s) => ({ ...s, ownedResources: [r, ...s.ownedResources] }));
  }, []);

  const updateResource = useCallback((id: string, patch: Partial<OwnedResource>) => {
    setState((s) => ({
      ...s,
      ownedResources: s.ownedResources.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    }));
  }, []);

  /** Soft delete — the listing leaves the marketplace but its history is kept. */
  const removeResource = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      ownedResources: s.ownedResources.map((r) =>
        r.id === id ? { ...r, active: false, published: false, status: "Inactive" } : r,
      ),
    }));
  }, []);

  const setResourceStatus = useCallback((id: string, status: ResourceStatus) => {
    setState((s) => ({
      ...s,
      ownedResources: s.ownedResources.map((r) => (r.id === id ? { ...r, status } : r)),
    }));
  }, []);

  const toggleBlockedDate = useCallback((id: string, isoDate: string) => {
    setState((s) => ({
      ...s,
      ownedResources: s.ownedResources.map((r) =>
        r.id === id
          ? {
              ...r,
              blockedDates: r.blockedDates.includes(isoDate)
                ? r.blockedDates.filter((d) => d !== isoDate)
                : [...r.blockedDates, isoDate],
            }
          : r,
      ),
    }));
  }, []);

  const addMaintenance = useCallback((id: string, record: MaintenanceRecord) => {
    setState((s) => ({
      ...s,
      ownedResources: s.ownedResources.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "Maintenance",
              maintenance: [record, ...r.maintenance],
              stats: { ...r.stats, maintenanceEvents: r.stats.maintenanceEvents + 1 },
            }
          : r,
      ),
    }));
  }, []);

  const setRequestStatus = useCallback((id: string, status: BookingRequestStatus) => {
    setState((s) => ({
      ...s,
      bookingRequests: s.bookingRequests.map((b) => (b.id === id ? { ...b, status } : b)),
    }));
  }, []);

  const nextResourceId = useCallback(
    () => newResourceId(stateRef.current.ownedResources),
    [],
  );

  const value = useMemo<SessionValue>(
    () => ({
      ...state,
      ready,
      signIn,
      updateProfile,
      signOut,
      createBooking,
      updateBooking,
      advanceBooking,
      addNotification,
      markNotificationsRead,
      setLocationPermissions,
      setDataPermission,
      setNotificationPref,
      addResource,
      updateResource,
      removeResource,
      setResourceStatus,
      toggleBlockedDate,
      addMaintenance,
      setRequestStatus,
      nextResourceId,
    }),
    [
      state,
      ready,
      signIn,
      updateProfile,
      signOut,
      createBooking,
      updateBooking,
      advanceBooking,
      addNotification,
      markNotificationsRead,
      setLocationPermissions,
      setDataPermission,
      setNotificationPref,
      addResource,
      updateResource,
      removeResource,
      setResourceStatus,
      toggleBlockedDate,
      addMaintenance,
      setRequestStatus,
      nextResourceId,
    ],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside SessionProvider");
  return ctx;
}

export function activeBooking(bookings: Booking[]): Booking | null {
  return bookings.find((b) => b.stage < bookingStages.length - 1) ?? null;
}
