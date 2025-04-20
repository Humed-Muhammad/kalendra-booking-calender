/// <reference types="react" />
import { EventType } from "./types";
import { BookingProps } from "./types/type";
interface Props extends BookingProps {
    eventType: EventType;
}
export declare const RoundRobinBooking: ({ eventType, ...rest }: Props) => JSX.Element;
export {};
