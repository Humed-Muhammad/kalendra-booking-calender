import PocketBase from "pocketbase";
import { Booking } from "./types";
export declare const pbUrl = "http://127.0.0.1:8090";
export declare const formatSlotMinutes: (minutes: number) => string;
export declare function getGMTOffset(timezone: string): string;
export declare const getImage: ({ imageName, collectionName, recordId, }: {
    imageName: string;
    collectionName: string;
    recordId: string;
}) => string;
export declare const collectionNames: {
    organizations: string;
    invites: string;
    event_types: string;
    event_type_settings: string;
    availability: string;
    organization_membership: string;
    teams: string;
    bookings: string;
    users: string;
    webhooks: string;
    api_keys: string;
};
export declare const db: PocketBase;
export declare const statusColors: {
    success: {
        bg: string;
        color: string;
    };
    info: {
        bg: string;
        color: string;
    };
    warning: {
        bg: string;
        color: string;
    };
    error: {
        bg: string;
        color: string;
    };
    stale: {
        bg: string;
        color: string;
    };
};
export declare const generateInviteToken: () => `${string}-${string}-${string}-${string}-${string}`;
export declare const generateUsernameFromEmail: (email: string) => string;
type ExpandedRecord = {
    expand?: Record<string, any>;
    [key: string]: any;
};
export declare const flattenPocketBaseData: <T>(data: ExpandedRecord | ExpandedRecord[] | null) => T | T[];
export declare const browserTimezone: string;
export declare const formatToTimeZone: (time: string, timezone?: string | undefined, formatType?: string) => string;
export declare const minimumNoticeTypeValue: {
    minutes: string;
    hours: string;
    days: string;
    weeks: string;
    months: string;
};
type CreateRoundRobinProps = {
    body: any;
    setCreatingRoundRobinBooking: (value: boolean) => void;
    onSuccess?: (response: Booking) => void;
    onError?: (error: any) => void;
};
export declare const createRoundRobin: ({ body, setCreatingRoundRobinBooking, onError, onSuccess, }: CreateRoundRobinProps) => Promise<Booking>;
export {};
