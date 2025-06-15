import { Booking } from "./types";
import Pocketbase from "pocketbase";
type FormatSlotType = {
    minutes: number;
    m?: string;
    hr?: string;
    hrs?: string;
};
export declare const formatSlotMinutes: ({ minutes, hr, hrs, m }: FormatSlotType) => string;
export declare function getGMTOffset(timezone: string): string;
export declare const getImage: ({ imageName, collectionName, recordId, pbUrl, }: {
    imageName: string;
    collectionName: string;
    recordId: string;
    pbUrl: string;
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
    db: Pocketbase;
};
export declare const createRoundRobin: ({ body, setCreatingRoundRobinBooking, onError, onSuccess, db, }: CreateRoundRobinProps) => Promise<Booking>;
export declare const convertUTCTimeToZonedTime: ({ timezone, slotStartTime, }: {
    timezone: string;
    slotStartTime: string;
}) => string;
export {};
