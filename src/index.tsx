import type { CSSProperties } from "react";
import { BookingCalendar, type BookingCalendarProps } from "./Calendar";
import { KalendraProvider } from "./context/context";
import { usePocketBaseEndpoint } from "./hooks/usePocketBaseEndpoint";
import { EventTypeError } from "./NoEventFoundError";
import type { GetBookingRes, GetEventTypeRes, ThemeMode } from "./types";

export type { Booking, BookingDraft, ThemeMode } from "./types";
export type { ContentType } from "./types/type";
export { MeetingScheduled } from "./MeetingScheduled";
export {
  describeTimezone,
  formatGMTOffset,
  listTimezones,
  matchesTimezone,
  timezoneOffsetLabel,
  zoneOffsetMinutes,
} from "./timezones";
export type { TimezoneOption } from "./timezones";

export type KalendraCalendarProps = Omit<
  BookingCalendarProps,
  "bookingToBeRescheduled" | "orgId" | "userId" | "members" | "isRoundRobin" | "eventTypeId"
> & {
  /** Kalendra's PocketBase URL. */
  calenderUrl: string;
  /** Root of Kalendra's custom routes, when it isn't calenderUrl (a local proxy). */
  apiUrl?: string;
  themeMode?: ThemeMode;
  /** The event to book; not needed when rescheduling. */
  eventTypeId?: string;
  /** Books this host; without it a round-robin event picks one. */
  kalendra_user_id?: string;
  /** Reschedules this Kalendra booking: its event, host and answers are reused. */
  bookingToBeRescheduledId?: string;
  /** Applied to the wrapper around the calendar. */
  styles?: CSSProperties;
  LoadingIndicator?: JSX.Element;
  NoEventError?: JSX.Element;
};

const ResolvedCalendar = ({
  eventTypeId,
  kalendra_user_id,
  bookingToBeRescheduledId,
  LoadingIndicator,
  NoEventError,
  ...props
}: Omit<KalendraCalendarProps, "calenderUrl" | "apiUrl" | "themeMode" | "styles">) => {
  const rescheduling = usePocketBaseEndpoint<GetBookingRes>({
    url: "/bookings/get-one",
    options: { method: "GET", query: { bookingId: bookingToBeRescheduledId }, requestKey: null },
    skip: !bookingToBeRescheduledId,
  });
  const booking = rescheduling.data?.booking;
  const resolvedEventTypeId = booking?.eventType ?? eventTypeId;
  const eventType = usePocketBaseEndpoint<GetEventTypeRes>({
    url: "/event-type/single",
    options: { method: "POST", body: { eventTypeId: resolvedEventTypeId }, requestKey: null },
    skip: !resolvedEventTypeId,
  });

  if (rescheduling.isLoading || eventType.isLoading) {
    return LoadingIndicator ?? null;
  }
  if (rescheduling.isError || eventType.isError || !resolvedEventTypeId) {
    return NoEventError ?? <EventTypeError />;
  }

  // A named host or a reschedule books that host; otherwise a round-robin event picks one.
  const isRoundRobin = eventType.data?.type === "round_robin" && !kalendra_user_id && !booking;
  return (
    <BookingCalendar
      {...props}
      eventTypeId={resolvedEventTypeId}
      orgId={rescheduling.data?.organization ?? eventType.data?.organization}
      userId={booking?.user ?? kalendra_user_id}
      bookingToBeRescheduled={booking}
      responses={booking ? { ...(booking.responses ?? {}), ...(props.responses ?? {}) } : props.responses}
      isRoundRobin={isRoundRobin}
      members={isRoundRobin ? eventType.data?.members : undefined}
      teamName={props.teamName ?? eventType.data?.teamName}
    />
  );
};

/** Kalendra's booking calendar: books an event, or reschedules a booking by id. */
export const KalendraCalendar = ({ calenderUrl, apiUrl, themeMode, styles, ...props }: KalendraCalendarProps) => (
  <KalendraProvider calenderUrl={calenderUrl} apiUrl={apiUrl} themeMode={themeMode}>
    <div style={styles}>
      <ResolvedCalendar {...props} />
    </div>
  </KalendraProvider>
);
