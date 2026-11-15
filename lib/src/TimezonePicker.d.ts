/// <reference types="react" />
/** "GMT+3", "GMT+5:30", "GMT-3:30", "GMT+0". */
export declare const formatGMTOffset: (offsetMinutes: number) => string;
/** The zone's offset on `date` (minutes), so a day after a DST change gets that day's offset. */
export declare const zoneOffsetMinutes: (timezone: string, date: Date) => number;
type Props = {
    value: string;
    onChange: (timezone: string) => void;
    /** The day being booked: offsets are shown for that day. Defaults to today. */
    date?: Date;
    disabled?: boolean;
};
/** Timezone picker: country, city and the GMT offset on the booked day; A–Z by country, searchable. */
export declare const TimezonePicker: ({ value, onChange, date, disabled }: Props) => JSX.Element;
export {};
