import { CSSProperties } from "react";
import { Booking } from "./types";
import { DefaultTheme } from "styled-components";
interface Props {
    kalendra_user_id: string;
    eventTypeId: string;
    responses?: any;
    duration?: number;
    onSuccess?: (fulfilled: Booking | undefined) => void;
    onError?: (error: any) => void;
    theme?: DefaultTheme;
    styles?: CSSProperties;
    bookingToBeRescheduledId?: string;
}
export declare const KalendraCalendar: ({ kalendra_user_id, styles, eventTypeId, responses, theme, duration, bookingToBeRescheduledId, onError, onSuccess, }: Props) => JSX.Element;
export {};
