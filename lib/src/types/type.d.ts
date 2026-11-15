export type DynamicFormTypes = {
    disableIfPrefilled: boolean;
    id: string;
    identifier: string;
    label: string;
    options: {
        id: string;
        value: string;
    }[];
    required: boolean;
    type: string;
    placeholder: string;
    hidden?: boolean;
    maxLength?: number;
    disallowSpecialChars?: boolean;
};
export type ContentType = {
    pleaseSelectDate: string;
    bookingEventType: string;
    m: string;
    hr: string;
    "12hr": string;
    "24hr": string;
    am: string;
    pm: string;
    submit: string;
    back: string;
    book: string;
    noAvailableSlots: string;
    required: string;
    noAvailabilityIn?: string;
    tryNextMonth?: string;
    viewNextMonth?: string;
};
