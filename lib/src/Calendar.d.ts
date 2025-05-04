import type { Availability, Booking, EventTypeSettings, ContentType } from "./types";
import { CSSProperties } from "react";
import { DefaultTheme } from "styled-components";
import { type Direction } from "./Core/common/types";
type Props = {
    availability: Partial<Availability>;
    isFetching: boolean;
    eventTypeSetting: EventTypeSettings;
    bookings: Booking[] | undefined;
    onSuccess?: (response: Booking | undefined) => void;
    onError?: (error: unknown) => void;
    bookingToBeRescheduled?: Booking;
    responses?: Record<string, any>;
    duration?: number;
    theme?: DefaultTheme;
    styles?: CSSProperties | undefined;
    LoadingIndicator?: JSX.Element | undefined;
    NoEventError?: JSX.Element | undefined;
    isRoundRobin?: boolean;
    isError?: boolean;
    content?: ContentType;
    /**
     * The direction of the calendar.
     */
    direction?: Direction | Array<Direction> | undefined;
};
export declare const BookingCalendar: ({ availability, isFetching, theme, styles, eventTypeSetting, bookingToBeRescheduled, duration, responses, bookings, NoEventError, isRoundRobin, isError, direction, content, onError, onSuccess, }: Props) => JSX.Element;
export {};
