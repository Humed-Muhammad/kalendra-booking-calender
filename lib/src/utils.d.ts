import type Pocketbase from "pocketbase";
import type { Booking, BookingDraft, Slot } from "./types";
export declare const collectionNames: {
    users: string;
};
export declare const browserTimezone: string;
export declare const formatToTimeZone: (time: string, timezone?: string | undefined, formatType?: string) => string;
/** Books a round-robin slot with one of the members free at that time. */
export declare const createRoundRobin: ({ client, body, setCreatingRoundRobinBooking, onError, onSuccess, }: {
    client: Pocketbase;
    body: BookingDraft & {
        users: Slot["users"];
    };
    setCreatingRoundRobinBooking: (value: boolean) => void;
    onError?: ((error: unknown) => void) | undefined;
    onSuccess?: ((booking: Booking | undefined) => void) | undefined;
}) => Promise<void>;
type FormatSlotType = {
    minutes: number;
    m?: string;
    hr?: string;
    hrs?: string;
};
export declare const formatSlotMinutes: ({ minutes, hr, hrs, m }: FormatSlotType) => string;
export declare const getImage: ({ baseUrl, imageName, collectionName, recordId, }: {
    baseUrl: string;
    imageName: string;
    collectionName: string;
    recordId: string;
}) => string;
export declare const convertUTCTimeToZonedTime: ({ timezone, slotStartTime, }: {
    timezone: string;
    slotStartTime: string;
}) => string;
export {};
