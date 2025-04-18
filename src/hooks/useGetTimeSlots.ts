import { useCallback } from "react";

import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import { Availability, Booking, EventTypeSettings } from "../types";
import { setHours, setMinutes } from "date-fns";
import { formatToTimeZone } from "../utils";

type Props = {
  availability: Partial<Availability> | undefined;
  eventTypeSetting: EventTypeSettings | undefined;
  timezone: string;
  incrementStep: number | undefined;
  bookings: Booking[] | undefined;
};
export const useGetTimeSlots = ({
  availability,
  eventTypeSetting,
  timezone,
  bookings,
  incrementStep,
}: Props) => {
  const getTimeSlots = useCallback(
    (selectedDate: Date, userTimezone: string = "UTC") => {
      const incrementTime = Number(incrementStep) * 60 * 1000;
      if (!availability) return [];
      const formattedDate = formatInTimeZone(
        selectedDate,
        timezone,
        "yyyy-MM-dd"
      );

      // Convert selected date to the availability timezone
      const selectedDateInAvailabilityTZ = toZonedTime(
        selectedDate,
        userTimezone
      );
      const dayOfWeek = selectedDateInAvailabilityTZ.getDay();

      // Check if there's a date override
      const dateOverride = availability.dateOverrides?.find(
        (override) => override.date === formattedDate
      );

      let availabilityForDay = availability.availability?.[dayOfWeek];
      // Add the date override to the availabilityForDay
      if (availabilityForDay && dateOverride) {
        availabilityForDay = [
          ...availabilityForDay,
          ...dateOverride.availability,
        ];
      }
      // }
      if (!availabilityForDay || availabilityForDay.length === 0) return [];

      // Generate time slots based on availability
      const slots: { formattedTime: string; utcTime: Date }[] = [];

      availabilityForDay.forEach((slot) => {
        const [startHour, startMinute] = slot.start.split(":").map(Number);
        const [endHour, endMinute] = slot.end.split(":").map(Number);
        // Convert start time to UTC

        const startTime = setHours(
          setMinutes(selectedDateInAvailabilityTZ, startMinute),
          startHour
        )?.toISOString();
        const endTime = setHours(
          setMinutes(selectedDateInAvailabilityTZ, endMinute),
          endHour
        )?.toISOString();
        const bufferAfter = eventTypeSetting?.settings?.bufferTimeAfter || 0;
        const adjustedEndTime = new Date(
          new Date(endTime).getTime() - bufferAfter * 60 * 1000
        ).toISOString();
        let currentTime = startTime;
        while (currentTime < adjustedEndTime) {
          // Convert to user timezone for display
          const formattedTime = formatToTimeZone(
            currentTime,
            timezone,
            "h:mmaaa"
          ); // e.g., "10:30am"
          // skip already booked slots
          const slotExist = slots.find(
            (s) => s.formattedTime === formattedTime
          );
          // const noEnoughTime = new Date(currentTime) + incrementStep
          const timeGap =
            new Date(adjustedEndTime).getTime() -
            new Date(currentTime).getTime();
          if (!slotExist && timeGap >= incrementTime) {
            slots.push({ formattedTime, utcTime: new Date(currentTime) });
          }

          // Increment time
          currentTime = new Date(
            new Date(currentTime).getTime() + incrementTime
          ).toISOString();
        }
      });
      return slots
        .sort((a, b) => (a.utcTime > b.utcTime ? 1 : -1))
        .filter((slot) => {
          const slotStart = new Date(slot.utcTime);
          const slotEnd = new Date(slotStart.getTime() + incrementTime);

          const isOverlapping = bookings?.some((booking) => {
            const bookingStart = new Date(booking.startTime);
            const bookingEnd = new Date(booking.endTime);

            // Add buffer time
            const bufferBefore =
              eventTypeSetting?.settings?.bufferTimeBefore || 0;
            const bufferAfter =
              eventTypeSetting?.settings?.bufferTimeAfter || 0;
            const bufferedStart = new Date(
              bookingStart.getTime() - bufferBefore * 60 * 1000
            );
            const bufferedEnd = new Date(
              bookingEnd.getTime() + bufferAfter * 60 * 1000
            );

            return slotStart < bufferedEnd && slotEnd > bufferedStart;
          });

          return !isOverlapping;
        });
    },
    [
      availability,
      incrementStep,
      timezone,
      bookings,
      eventTypeSetting?.settings,
    ]
  );

  return { getTimeSlots };
};
