import { format, toZonedTime } from "date-fns-tz";
import { Booking } from "./types";
import Pocketbase from "pocketbase";

export const formatSlotMinutes = (minutes: number) => {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      return hours === 1 ? `${hours}hr` : `${hours}hrs`;
    } else {
      return `${hours}${hours === 1 ? "hr" : "hrs"} ${remainingMinutes}${"m"}`;
    }
  }

  return `${minutes}m`;
};

export function getGMTOffset(timezone: string) {
  const now = new Date();
  if (!timezone) return "GMT";
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    timeZoneName: "shortOffset",
  });

  const parts = formatter.formatToParts(now);
  const offsetPart = parts.find((part) => part.type === "timeZoneName");

  return offsetPart ? offsetPart.value.replace("UTC", "GMT") : "GMT";
}

export const getImage = ({
  imageName,
  collectionName,
  recordId,
  pbUrl,
}: {
  imageName: string;
  collectionName: string;
  recordId: string;
  pbUrl: string;
}) => {
  return `${pbUrl}/api/files/${collectionName}/${recordId}/${imageName}`;
};

export const collectionNames = {
  organizations: "organizations",
  invites: "invites",
  event_types: "event_types",
  event_type_settings: "event_type_settings",
  availability: "availability",
  organization_membership: "organization_membership",
  teams: "teams",
  bookings: "bookings",
  users: "users",
  webhooks: "webhooks",
  api_keys: "api_keys",
};

export const statusColors = {
  success: {
    bg: "#D3FBAF",
    color: "#177F11",
  },
  info: { bg: "rgba(184, 233, 245, 0.43)", color: "#0F3844" },
  warning: { bg: "#F5EA6E", color: "#0F3844" },
  error: {
    bg: "#FEEAEE",
    color: "#F12A4E",
  },
  stale: {
    bg: "#D3FBAF",
    color: "#02151A",
  },
};

export const generateInviteToken = () => {
  return crypto.randomUUID();
};

// Function that generate human readable user name from the email
export const generateUsernameFromEmail = (email: string): string => {
  // Remove @ and replace dots/special chars with hyphens
  const username = email
    .toLowerCase()
    .replace(/@/g, "-")
    .replace(/\./g, "-")
    .replace(/[^a-z0-9-]/g, "-")
    // Remove consecutive hyphens
    .replace(/-+/g, "-")
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, "");

  return username;
};

type ExpandedRecord = {
  expand?: Record<string, any>;
  [key: string]: any;
};

export const flattenPocketBaseData = <T>(
  data: ExpandedRecord | ExpandedRecord[] | null
): T | T[] => {
  if (!data) return [] as T[];

  const flatten = (item: ExpandedRecord): any => {
    const result = { ...item };

    if (result.expand) {
      Object.entries(result.expand).forEach(([key, value]) => {
        result[key] = Array.isArray(value)
          ? value.map((v) => flatten(v))
          : value && typeof value === "object"
          ? flatten(value)
          : value;
      });
      delete result.expand;
    }

    return result;
  };
  return Array.isArray(data)
    ? data.map((item) => flatten(item))
    : flatten(data);
};

export const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const formatToTimeZone = (
  time: string,
  timezone?: string | undefined,
  formatType?: string
) => {
  if (!time) return "";
  const formattedTime = toZonedTime(time, timezone ?? browserTimezone);
  return format(formattedTime, formatType ?? "EEEE, MMMM d, yyyy, h:mm a");
};

export const minimumNoticeTypeValue = {
  minutes: "minutes",
  hours: "hours",
  days: "days",
  weeks: "weeks",
  months: "months",
};

type CreateRoundRobinProps = {
  body: any;
  setCreatingRoundRobinBooking: (value: boolean) => void;
  onSuccess?: (response: Booking) => void;
  onError?: (error: any) => void;
  db: Pocketbase;
};
export const createRoundRobin = async ({
  body,
  setCreatingRoundRobinBooking,
  onError,
  onSuccess,
  db,
}: CreateRoundRobinProps) => {
  try {
    setCreatingRoundRobinBooking(true);
    const response = await db?.send<Booking>("/round-robin", {
      method: "POST",
      body,
    });
    onSuccess?.(response!);
    return response;
  } catch (error) {
    onError?.(error);
    throw error;
  } finally {
    setCreatingRoundRobinBooking(false);
  }
};
