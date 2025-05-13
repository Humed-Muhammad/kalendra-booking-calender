/// <reference types="react" />
import type { BookingProps } from "./types/type";
interface Props extends BookingProps {
    isLoadingRootEventType: boolean;
    organizationId: string | undefined;
}
export declare const NormalBooking: (props: Props) => JSX.Element;
export {};
