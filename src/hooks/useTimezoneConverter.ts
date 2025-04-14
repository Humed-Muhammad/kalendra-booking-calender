import { useState, useEffect } from "react";
import { toZonedTime, format } from "date-fns-tz";

/**
 * Custom Hook for handling time zone conversion
 * @param {string} bookingTime - The booking time in UTC
 * @param {string} clientTimezone - Client's time zone (e.g., 'Asia/Bahrain')
 * @param {string} providerTimezone - Provider's time zone (e.g., 'Europe/Amsterdam')
 * @returns {Object} - { clientTimeFormatted, providerTimeFormatted }
 */
const useTimeZoneConversion = (
  bookingTime: string, // UTC time
  clientTimezone: string,
  providerTimezone: string
) => {
  const [clientTimeFormatted, setClientTimeFormatted] = useState<string | null>(
    null
  );
  const [providerTimeFormatted, setProviderTimeFormatted] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (bookingTime && clientTimezone && providerTimezone) {
      // Convert the booking time (which is in UTC) to the client's time zone
      const clientTime = toZonedTime(bookingTime, clientTimezone);

      // Convert the booking time (in UTC) to the provider's time zone
      const providerTime = toZonedTime(bookingTime, providerTimezone);

      // Format both times
      const formattedClientTime = format(clientTime, "yyyy-MM-dd HH:mm:ssXXX", {
        timeZone: clientTimezone,
      });
      const formattedProviderTime = format(
        providerTime,
        "yyyy-MM-dd HH:mm:ssXXX",
        {
          timeZone: providerTimezone,
        }
      );

      // Update state with formatted times
      setClientTimeFormatted(formattedClientTime);
      setProviderTimeFormatted(formattedProviderTime);
    }
  }, [bookingTime, clientTimezone, providerTimezone]);

  return { clientTimeFormatted, providerTimeFormatted };
};

export default useTimeZoneConversion;
