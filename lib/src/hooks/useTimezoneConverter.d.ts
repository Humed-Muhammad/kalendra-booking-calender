/**
 * Custom Hook for handling time zone conversion
 * @param {string} bookingTime - The booking time in UTC
 * @param {string} clientTimezone - Client's time zone (e.g., 'Asia/Bahrain')
 * @param {string} providerTimezone - Provider's time zone (e.g., 'Europe/Amsterdam')
 * @returns {Object} - { clientTimeFormatted, providerTimeFormatted }
 */
declare const useTimeZoneConversion: (bookingTime: string, clientTimezone: string, providerTimezone: string) => {
    clientTimeFormatted: string | null;
    providerTimeFormatted: string | null;
};
export default useTimeZoneConversion;
