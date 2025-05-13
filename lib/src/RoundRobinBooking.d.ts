/// <reference types="react" />
import { GetEventTypeRes } from "./types";
import { BookingProps } from "./types/type";
interface Props extends BookingProps {
    eventType: GetEventTypeRes;
    isLoadingRootEventType: boolean;
}
export declare const RoundRobinBooking: ({ eventType, ...rest }: Props) => JSX.Element;
export {};
