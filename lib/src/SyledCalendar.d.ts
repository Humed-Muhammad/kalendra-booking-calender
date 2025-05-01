import * as React from "react";
import { DayPicker } from "react-day-picker";
export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
    nextRef?: React.Ref<HTMLButtonElement>;
};
declare function Calendar({ className, nextRef, ...props }: CalendarProps): JSX.Element;
declare namespace Calendar {
    var displayName: string;
}
export { Calendar };
