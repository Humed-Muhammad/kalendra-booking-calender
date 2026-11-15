/// <reference types="react" />
import type { Booking, BookingDraft } from "./types";
import type { ContentType } from "./types/type";
import type { Direction } from "./Core/common/types";
export type BookingCalendarProps = {
    onSuccess?: (response: Booking | undefined) => void;
    onError?: (error: unknown) => void;
    /**
     * Takes over the write: the calendar hands its booking body here instead of calling Kalendra,
     * e.g. so a backend can reschedule with its own bookkeeping. Resolve to finish, reject to fail.
     */
    onSubmitBooking?: (draft: BookingDraft) => Promise<Booking | void>;
    /** Kalendra user id recorded as the mover on a direct reschedule. */
    rescheduledBy?: string;
    /** The first duration to show, before the event's own default. */
    duration?: number;
    /** The timezone times are shown in at first (e.g. a signed-in user's); the browser's otherwise. */
    timezone?: string;
    bookingToBeRescheduled?: Booking;
    responses?: Record<string, any>;
    isRoundRobin?: boolean;
    content?: ContentType;
    /**
     * The direction of the calendar.
     */
    direction?: Direction | Direction[] | undefined;
    teamName?: string;
    orgId?: string;
    eventTypeId?: string;
    userId?: string;
    members?: {
        id: string;
        user: string;
    }[];
};
export declare const BookingCalendar: ({ bookingToBeRescheduled, onSubmitBooking, rescheduledBy, duration, timezone: initialTimezone, responses, isRoundRobin, content, direction, teamName, orgId, eventTypeId, userId, members, onError, onSuccess, }: BookingCalendarProps) => JSX.Element;
