export declare const useCheckDateAllowed: () => {
    isSlotValidWithMinimumNotice: ({ date, slotStartTime, minimumNotice, minimumNoticeType, timezone, pureFullUtcTime, }: {
        date: Date;
        slotStartTime: string;
        minimumNotice: number;
        minimumNoticeType: string;
        timezone: string;
        pureFullUtcTime?: string | undefined;
    }) => boolean;
};
