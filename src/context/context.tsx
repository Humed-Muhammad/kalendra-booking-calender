import { createContext, useContext, useMemo } from "react";
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

export const KalendraContext = createContext<KalendraContextType | null>(null);

export const KalendraProvider = ({
  calenderUrl,
  apiUrl,
  themeMode = "light",
  children,
}: {
  calenderUrl: string;
  apiUrl?: string;
  themeMode?: ThemeMode;
  children: React.ReactNode;
}) => {
  // Built in render so the first request already has a client.
  const client = useMemo(() => new Pocketbase(calenderUrl), [calenderUrl]);
  const value = useMemo(
    () => ({ client, calenderUrl, apiUrl: apiUrl ?? calenderUrl, themeMode }),
    [client, apiUrl, calenderUrl, themeMode],
  );
  return <KalendraContext.Provider value={value}>{children}</KalendraContext.Provider>;
};

export const useKalendra = () => {
  const context = useContext(KalendraContext);
  if (!context) {
    throw new Error("Kalendra components must be rendered inside KalendraCalendar.");
  }
  return context;
};
