/**
 * IANA zone -> ISO 3166 country code, plus tzdb's note for countries with several zones.
 * Generated from tzdata zone.tab (418 zones); regenerate from a newer tzdata when zones change.
 */
export declare const zoneCountries: Record<string, {
    country: string;
    note?: string;
}>;
