import { useCallback } from "react";

import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import { Availability, Booking, EventTypeSettings, Slot } from "../types";
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
  function filterSlotsAndAddUsers(slots: Array<Slot>): Array<Slot> {
    const slotMap = new Map();

    for (const slot of slots) {
      const key = slot.formattedTime;
      if (!slotMap.has(key)) {
        slot["users"] = [];
        if (slot.user) {
          slot["users"].push(slot.user);
        }
        slotMap.set(key, slot);
        delete slot["user"];
      } else {
        const existingSlot = slotMap.get(key);
        existingSlot["users"].push(slot.user);
        slotMap.set(key, existingSlot);
      }
    }

    return Array.from(slotMap.values());
  }

  const getTimeSlots = useCallback(
    (selectedDate: Date, userTimezone: string = "UTC") => {
      if (!incrementStep) return [];
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
      if (dateOverride?.availability) {
        availabilityForDay = dateOverride.availability;
      }
      // }
      if (!availabilityForDay || availabilityForDay.length === 0) return [];

      // Generate time slots based on availability
      const slots: {
        formattedTime: string;
        utcTime: Date;
        user: string | undefined;
        users?: string[];
      }[] = [];
      // let users = new Set<string>();

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
          const timeGap =
            new Date(adjustedEndTime).getTime() -
            new Date(currentTime).getTime();
          if (timeGap >= incrementTime) {
            slots.push({
              formattedTime,
              utcTime: new Date(currentTime),
              user: slot.user,
            });
          }
          // Increment time
          currentTime = new Date(
            new Date(currentTime).getTime() + incrementTime
          ).toISOString();
        }
      });
      const filteredSlots = slots
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

      // filter repeated slots and return
      const newFormatted = filterSlotsAndAddUsers(filteredSlots);
      return newFormatted;
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
