/// <reference types="react" />
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
