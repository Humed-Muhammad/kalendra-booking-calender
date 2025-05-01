/// <reference types="react" />
import type { BookingProps } from "./types/type";
interface Props extends BookingProps {
    isLoadingRootEventType: boolean;
}
export declare const NormalBooking: (props: Props) => JSX.Element;
export {};
