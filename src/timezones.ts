import { getTimezoneOffset } from "date-fns-tz";
import { zoneCountries } from "./timezoneCountries";

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

const UTC = "UTC";

/** "GMT+3", "GMT+5:30", "GMT-3:30", "GMT+0". */
export const formatGMTOffset = (offsetMinutes: number) => {
  const sign = offsetMinutes < 0 ? "-" : "+";
  const abs = Math.abs(offsetMinutes);
  const minutes = abs % 60;
  return `GMT${sign}${Math.floor(abs / 60)}${minutes ? `:${String(minutes).padStart(2, "0")}` : ""}`;
};

/** The zone's offset on `date` (minutes), so a day after a DST change gets that day's offset. NaN for an unknown zone. */
export const zoneOffsetMinutes = (timezone: string, date: Date = new Date()) =>
  Math.round(getTimezoneOffset(timezone, date) / 60000);

/** "GMT+3" for the zone on `date` (today by default); "GMT" when the zone is unknown. */
export const timezoneOffsetLabel = (timezone: string, date: Date = new Date()) => {
  const minutes = timezone ? zoneOffsetMinutes(timezone, date) : NaN;
  return Number.isNaN(minutes) ? "GMT" : formatGMTOffset(minutes);
};

const normalize = (text: string) => text.toLowerCase().replace(/_/g, " ");

// Country names from the browser ("ET" -> "Ethiopia"); the code itself where unsupported.
const regionNames = (() => {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" });
  } catch {
    return undefined;
  }
})();

const countryName = (code: string) => {
  try {
    return regionNames?.of(code) ?? code;
  } catch {
    return code;
  }
};

/** A zone's country, city and offset on `date`; null when this browser doesn't know the zone. */
export const describeTimezone = (value: string, date: Date = new Date()): TimezoneOption | null => {
  const offsetMinutes = zoneOffsetMinutes(value, date);
  if (Number.isNaN(offsetMinutes)) return null;
  const parts = value.split("/");
  const city = parts[parts.length - 1].replace(/_/g, " ");
  const known = zoneCountries[value];
  // A zone outside zone.tab (an alias such as Asia/Calcutta) falls back to its region.
  const country = known
    ? countryName(known.country)
    : value === UTC
      ? UTC
      : parts.slice(0, -1).join(" / ").replace(/_/g, " ") || city;
  const detail =
    value === UTC
      ? "Coordinated Universal Time"
      : known?.note
        ? `${city} · ${known.note}`
        : city;
  const offsetLabel = formatGMTOffset(offsetMinutes);
  return {
    value,
    city,
    country,
    detail,
    offsetMinutes,
    offsetLabel,
    searchText: normalize(
      `${value} ${country} ${known?.note ?? ""} ${offsetLabel} UTC${offsetLabel.slice(3)}`,
    ),
  };
};

/**
 * The tzdata zones (zone.tab) plus UTC and any `extras` (e.g. a saved alias), A–Z by country then city,
 * with offsets for `date` so daylight saving is right for that day.
 */
export const listTimezones = (date: Date = new Date(), extras: Array<string | undefined | null> = []) => {
  const values = [...Object.keys(zoneCountries), UTC];
  for (const extra of extras) {
    if (extra && !values.includes(extra)) values.push(extra);
  }
  return values
    .map((value) => describeTimezone(value, date))
    .filter((zone): zone is TimezoneOption => zone !== null)
    .sort((a, b) => a.country.localeCompare(b.country) || a.city.localeCompare(b.city));
};

/** Every search term must match the zone's id, country, note or offset ("egypt", "new york", "gmt+5:30", "+3"). */
export const matchesTimezone = (zone: TimezoneOption, query: string) =>
  normalize(query)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => zone.searchText.includes(term));
