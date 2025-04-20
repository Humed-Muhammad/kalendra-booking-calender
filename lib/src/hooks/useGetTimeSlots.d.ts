import { Availability, Booking, EventTypeSettings, Slot } from "../types";
type Props = {
    availability: Partial<Availability> | undefined;
    eventTypeSetting: EventTypeSettings | undefined;
    timezone: string;
    incrementStep: number | undefined;
    bookings: Booking[] | undefined;
};
export declare const useGetTimeSlots: ({ availability, eventTypeSetting, timezone, bookings, incrementStep, }: Props) => {
    getTimeSlots: (selectedDate: Date, userTimezone?: string) => Slot[];
};
export {};
