import { CSSProperties, useEffect, useMemo, useState } from "react";
import { usePocketBaseQuery } from "./hooks/usePocketBase";
import { collectionNames } from "./utils";
import { Availability, Booking, EventTypeSettings } from "./types";
import { BookingCalendar } from "./Calendar";
import { DefaultTheme } from "styled-components";

import { usePocketBaseEndpoint } from "./hooks/usePocketBaseEndpoint";

interface Props {
  kalendra_user_id: string;
  eventTypeId: string;
  responses?: any;
  duration?: number;
  onSuccess?: (fulfilled: Booking | undefined) => void;
  onError?: (error: any) => void;
  theme?: DefaultTheme;
  styles?: CSSProperties;
  bookingToBeRescheduledId?: string;
}
export const KalendraCalendar = ({
  kalendra_user_id,
  styles,
  eventTypeId,
  responses,
  theme,
  duration,
  bookingToBeRescheduledId,
  onError,
  onSuccess,
}: Props) => {
  const [bookingInitializing, setBookingInitializing] = useState(true);
  const { data: eventTypeSetting, isLoading: isFetchingEventSettings } =
    usePocketBaseQuery<EventTypeSettings>({
      collectionName: collectionNames.event_type_settings,
      single: true,
      options: {
        filter: `event_type = "${eventTypeId}" && user = "${kalendra_user_id}"`,
        expand: "user, event_type",
      },
      skip: !eventTypeId || !kalendra_user_id,
    });
  const { data: availability, isLoading } = usePocketBaseQuery<
    Array<Availability>
  >({
    collectionName: collectionNames.availability,
    options: {
      filter: `user = "${kalendra_user_id}" && organization = "${eventTypeSetting?.expand?.event_type?.organization}"`,
      expand: "user",
    },
    skip:
      !kalendra_user_id || !eventTypeSetting?.expand?.event_type?.organization,
  });
  const {
    data: bookingToBeRescheduled,
    isLoading: isFetchingBookingToReschedule,
  } = usePocketBaseQuery<Booking>({
    collectionName: collectionNames.bookings,
    id: bookingToBeRescheduledId,
    skip: !bookingToBeRescheduledId,
  });
  const { data: bookings, isLoading: isFetchingBooking } =
    usePocketBaseEndpoint<Array<Booking>>({
      url: "/get-user-bookings",
      options: {
        method: "POST",
        body: {
          userId: kalendra_user_id,
          eventTypeId,
        },
      },
      skip: !kalendra_user_id || !eventTypeId,
    });

  const defaultAvailability = useMemo(
    () => availability?.find((item) => item.isDefault),
    [availability]
  );
  useEffect(() => {
    setTimeout(() => {
      setBookingInitializing(false);
    }, 500);
  }, []);

  return (
    <BookingCalendar
      responses={responses}
      eventTypeSetting={eventTypeSetting}
      availability={defaultAvailability ?? availability?.[0]}
      bookings={bookings}
      isFetching={
        isLoading ||
        isFetchingBooking ||
        isFetchingEventSettings ||
        bookingInitializing ||
        isFetchingBookingToReschedule
      }
      onSuccess={onSuccess}
      onError={onError}
      duration={duration}
      theme={theme}
      styles={styles}
      bookingToBeRescheduled={bookingToBeRescheduled}
    />
  );
};
