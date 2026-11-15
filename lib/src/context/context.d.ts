/// <reference types="react" />
import Pocketbase from "pocketbase";
import type { ThemeMode } from "../types";
export type KalendraContextType = {
    /** PocketBase client for Kalendra (bookings, event types, users). */
    client: Pocketbase;
    /** Kalendra's PocketBase URL (files are served from it). */
    calenderUrl: string;
    /** Root of Kalendra's custom routes (/availability/...). */
    apiUrl: string;
    themeMode: ThemeMode;
};
export declare const KalendraContext: import("react").Context<KalendraContextType | null>;
export declare const KalendraProvider: ({ calenderUrl, apiUrl, themeMode, children, }: {
    calenderUrl: string;
    apiUrl?: string | undefined;
    themeMode?: ThemeMode | undefined;
    children: React.ReactNode;
}) => JSX.Element;
export declare const useKalendra: () => KalendraContextType;
