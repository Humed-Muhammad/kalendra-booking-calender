import { type Dispatch, type SetStateAction } from "react";
import type { BookingProps } from "./types/type";
interface Props extends BookingProps {
    isLoadingRootEventType: boolean;
    setLoadingData: Dispatch<SetStateAction<boolean>>;
}
export declare const NormalBooking: (props: Props) => JSX.Element;
export {};
