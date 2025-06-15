import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
} from "date-fns";
import { format } from "date-fns-tz";
import { convertUTCTimeToZonedTime } from "./utils";
import { browserTimezone } from "./utils";

export const useCheckDateAllowed = () => {
  function isSlotValidWithMinimumNotice({
    date,
    slotStartTime, // e.g., "16:00" (4PM in user’s timezone)
    minimumNotice,
    minimumNoticeType,
    timezone,
    pureFullUtcTime,
  }: {
    date: Date;
    slotStartTime: string;
    minimumNotice: number;
    minimumNoticeType: string;
    timezone: string;
    pureFullUtcTime?: string;
  }): boolean {
    const formatted = convertUTCTimeToZonedTime({
      slotStartTime,
      timezone,
    });
    const [hour, minute] = formatted.split(":").map(Number);

    // Step 1: Get the UTC time for the slot
    const slotInUserTZ = format(
      pureFullUtcTime ?? date.setHours(hour, minute, 0, 0),
      "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
      {
        timeZone: "UTC",
      }
    );

    // Step 2: Get now in user's timezone
    const utcNow = format(
      new Date().toISOString(),
      "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
      {
        timeZone: browserTimezone,
      }
    );

    // Step 3: Compare time difference
    let diff = 0;

    switch (minimumNoticeType) {
      case "minutes":
        diff = differenceInMinutes(slotInUserTZ, utcNow);
        break;
      case "hours":
        diff = differenceInHours(slotInUserTZ, utcNow);
        break;
      case "days":
        diff = differenceInDays(slotInUserTZ, utcNow);
        break;
      case "weeks":
        diff = differenceInWeeks(slotInUserTZ, utcNow);
        break;
      case "months":
        diff = differenceInMonths(slotInUserTZ, utcNow);
        break;
    }
    // if (new Date().getDate() == 15) {
    //   //   console.log("today is 15th");
    //   console.log(diff, slotInUserTZ, utcNow);
    //   //   console.log(minimumNotice);
    // }
    return diff >= minimumNotice;
  }
  return { isSlotValidWithMinimumNotice };
};
