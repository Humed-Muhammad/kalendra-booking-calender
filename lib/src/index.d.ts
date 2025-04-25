/// <reference types="react" />
import { BookingProps } from "./types/type";
interface Props extends BookingProps {
    calenderUrl: string;
}
export declare const KalendraCalendar: (props: Props) => JSX.Element;
export {};
