import { format, toZonedTime } from "date-fns-tz";
import type Pocketbase from "pocketbase";
import type { Booking, BookingDraft, Slot } from "./types";

export const collectionNames = {
  users: "users",
};

export const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const formatToTimeZone = (time: string, timezone?: string | undefined, formatType?: string) => {
  if (!time) return "";
  const formattedTime = toZonedTime(time, timezone ?? browserTimezone);
  return format(formattedTime, formatType ?? "EEEE, MMMM d, yyyy, h:mm a");
};

/** Books a round-robin slot with one of the members free at that time. */
export const createRoundRobin = async ({
  client,
  body,
  setCreatingRoundRobinBooking,
  onError,
  onSuccess,
}: {
  client: Pocketbase;
  body: BookingDraft & { users: Slot["users"] };
  setCreatingRoundRobinBooking: (value: boolean) => void;
  onError?: (error: unknown) => void;
  onSuccess?: (booking: Booking | undefined) => void;
}) => {
  try {
    setCreatingRoundRobinBooking(true);
    const response = await client.send<Booking>("/event/book/round-robin", { method: "POST", body });
    onSuccess?.(response);
  } catch (error: any) {
    onError?.(error?.response || error);
  } finally {
    setCreatingRoundRobinBooking(false);
  }
};

type FormatSlotType = {
  minutes: number;
  m?: string;
  hr?: string;
  hrs?: string;
};
export const formatSlotMinutes = ({ minutes, hr, hrs, m }: FormatSlotType) => {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      return hours === 1 ? `${hours}${hr ?? "hr"}` : `${hours}${hrs ?? "hrs"}`;
    } else {
      return `${hours}${
        hours === 1 ? (hr ?? "hr") : (hrs ?? "hrs")
      } ${remainingMinutes}${m ?? "m"}`;
    }
  }

  return `${minutes}${m ?? "m"}`;
};

export const getImage = ({
  baseUrl,
  imageName,
  collectionName,
  recordId,
}: {
  baseUrl: string;
  imageName: string;
  collectionName: string;
  recordId: string;
}) => {
  return `${baseUrl}/api/files/${collectionName}/${recordId}/${imageName}`;
};

export const convertUTCTimeToZonedTime = ({
  timezone,
  slotStartTime,
}: {
  timezone: string;
  slotStartTime: string;
}) => {
  // import { utcToZonedTime, format } from 'date-fns-tz';

  // Given:
  const today = new Date(); // or any specific date you want

  // 1. Create a UTC Date from today's date + slotStartTime
  const [hour, minute] = slotStartTime.split(":").map(Number);
  const slotInUTC = new Date(
    Date.UTC(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      hour,
      minute,
    ),
  );

  // 2. Convert it to user's timezone
  const slotInUserTZ = toZonedTime(slotInUTC, timezone);

  // 3. (Optional) Format to readable time string in user's timezone
  const formatted = format(slotInUserTZ, "HH:mm", { timeZone: timezone });

  return formatted;
};
