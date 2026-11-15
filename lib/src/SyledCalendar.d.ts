import * as React from "react";
import { DayPicker } from "react-day-picker";
export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
    nextRef?: React.Ref<HTMLButtonElement>;
    disableBackNavigation?: boolean;
    isLoading?: boolean;
    /** Keyed element shown over the month grid (e.g. an empty-month notice). */
    overlay?: React.ReactNode;
};
declare function Calendar({ nextRef, disableBackNavigation, isLoading, overlay, month, onMonthChange, ...props }: CalendarProps): JSX.Element;
declare namespace Calendar {
    var displayName: string;
}
export { Calendar };
