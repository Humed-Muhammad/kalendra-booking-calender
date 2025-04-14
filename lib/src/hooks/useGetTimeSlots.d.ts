import { Availability, Booking, EventTypeSettings } from "../types";
type Props = {
    availability: Availability | undefined;
    eventTypeSetting: EventTypeSettings | undefined;
    timezone: string;
    incrementStep: number | undefined;
    bookings: Booking[] | undefined;
};
export declare const useGetTimeSlots: ({ availability, eventTypeSetting, timezone, bookings, incrementStep, }: Props) => {
    getTimeSlots: (selectedDate: Date, userTimezone?: string) => {
        formattedTime: string;
        utcTime: Date;
    }[];
};
export {};
