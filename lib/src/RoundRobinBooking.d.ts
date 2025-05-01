import { type Dispatch, type SetStateAction } from "react";
import { EventType } from "./types";
import { BookingProps } from "./types/type";
interface Props extends BookingProps {
    eventType: EventType;
    isLoadingRootEventType: boolean;
    setLoadingData: Dispatch<SetStateAction<boolean>>;
}
export declare const RoundRobinBooking: ({ eventType, setLoadingData, ...rest }: Props) => JSX.Element;
export {};
