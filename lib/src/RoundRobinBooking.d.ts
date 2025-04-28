/// <reference types="react" />
import { EventType } from "./types";
import { BookingProps } from "./types/type";
interface Props extends BookingProps {
    eventType: EventType;
    isLoadingRootEventType: boolean;
}
export declare const RoundRobinBooking: ({ eventType, ...rest }: Props) => JSX.Element;
export {};
