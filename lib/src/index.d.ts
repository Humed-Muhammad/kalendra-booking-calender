import type { CSSProperties } from "react";
import { type BookingCalendarProps } from "./Calendar";
import type { ThemeMode } from "./types";
export type { Booking, BookingDraft, ThemeMode } from "./types";
export type { ContentType } from "./types/type";
export { MeetingScheduled } from "./MeetingScheduled";
export { describeTimezone, formatGMTOffset, listTimezones, matchesTimezone, timezoneOffsetLabel, zoneOffsetMinutes, } from "./timezones";
export type { TimezoneOption } from "./timezones";
export type KalendraCalendarProps = Omit<BookingCalendarProps, "bookingToBeRescheduled" | "orgId" | "userId" | "members" | "isRoundRobin" | "eventTypeId"> & {
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
/** Kalendra's booking calendar: books an event, or reschedules a booking by id. */
export declare const KalendraCalendar: ({ calenderUrl, apiUrl, themeMode, styles, ...props }: KalendraCalendarProps) => JSX.Element;
