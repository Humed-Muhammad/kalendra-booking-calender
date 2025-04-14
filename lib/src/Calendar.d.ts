import { Availability, Booking, EventTypeSettings } from "./types";
import { CSSProperties } from "react";
import { DefaultTheme } from "styled-components";
type Props = {
    availability: Availability;
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
};
export declare const BookingCalendar: ({ availability, isFetching, theme, styles, eventTypeSetting, bookingToBeRescheduled, duration, responses, bookings, onError, onSuccess, }: Props) => JSX.Element;
export {};
