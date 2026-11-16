/** One zone as pickers show it, with its offset on a given day. */
export type TimezoneOption = {
    value: string;
    city: string;
    country: string;
    /** City, plus tzdb's note where a country has several zones ("New York · Eastern (most areas)"). */
    detail: string;
    offsetMinutes: number;
    offsetLabel: string;
    searchText: string;
};
/** "GMT+3", "GMT+5:30", "GMT-3:30", "GMT+0". */
export declare const formatGMTOffset: (offsetMinutes: number) => string;
/** The zone's offset on `date` (minutes), so a day after a DST change gets that day's offset. NaN for an unknown zone. */
export declare const zoneOffsetMinutes: (timezone: string, date?: Date) => number;
/** "GMT+3" for the zone on `date` (today by default); "GMT" when the zone is unknown. */
export declare const timezoneOffsetLabel: (timezone: string, date?: Date) => string;
/** A zone's country, city and offset on `date`; null when this browser doesn't know the zone. */
export declare const describeTimezone: (value: string, date?: Date) => TimezoneOption | null;
/**
 * The tzdata zones (zone.tab) plus UTC and any `extras` (e.g. a saved alias), A–Z by country then city,
 * with offsets for `date` so daylight saving is right for that day.
 */
export declare const listTimezones: (date?: Date, extras?: Array<string | undefined | null>) => TimezoneOption[];
/** Every search term must match the zone's id, country, note or offset ("egypt", "new york", "gmt+5:30", "+3"). */
export declare const matchesTimezone: (zone: TimezoneOption, query: string) => boolean;
