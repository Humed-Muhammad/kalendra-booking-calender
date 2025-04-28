import { useEffect, useMemo, useState } from "react";
import { usePocketBaseQuery } from "./hooks/usePocketBase";
import type { Availability, Booking, EventTypeSettings } from "./types";
import type { BookingProps } from "./types/type";
import { collectionNames } from "./utils";
import { usePocketBaseEndpoint } from "./hooks/usePocketBaseEndpoint";
import { BookingCalendar } from "./Calendar";

interface Props extends BookingProps {
  isLoadingRootEventType: boolean;
}
export const NormalBooking = (props: Props) => {
  const { kalendra_user_id, eventTypeId, bookingToBeRescheduledId } = props;
  const {
    data: bookingToBeRescheduled,
    isLoading: isFetchingBookingToReschedule,
  } = usePocketBaseQuery<Booking>({
    collectionName: collectionNames.bookings,
    id: bookingToBeRescheduledId,
    skip: !bookingToBeRescheduledId,
  });
  const [bookingInitializing, setBookingInitializing] = useState(true);
  const userId = useMemo(
    () => bookingToBeRescheduled?.user || kalendra_user_id,
    [bookingToBeRescheduled, kalendra_user_id]
  );
  const eventId = useMemo(
    () => bookingToBeRescheduled?.eventType || eventTypeId,
    [bookingToBeRescheduled, eventTypeId]
  );
  const { data: eventTypeSetting, isLoading: isFetchingEventSettings } =
    usePocketBaseQuery<EventTypeSettings>({
      collectionName: collectionNames.event_type_settings,
      single: true,
      options: {
        filter: `event_type = "${eventId}" && user = "${userId}"`,
        expand: "user, event_type",
      },
      skip: !eventId || !userId,
    });
  const { data: availability, isLoading } = usePocketBaseQuery<
    Array<Availability>
  >({
    collectionName: collectionNames.availability,
    options: {
      filter: `user = "${userId}" && organization = "${eventTypeSetting?.expand?.event_type?.organization}"`,
      expand: "user",
    },
    skip: !userId || !eventTypeSetting?.expand?.event_type?.organization,
  });

  const { data: bookings, isLoading: isFetchingBooking } =
    usePocketBaseEndpoint<Array<Booking>>({
      url: "/get-user-bookings",
      options: {
        method: "POST",
        body: {
          userId,
          eventTypeId: eventId,
        },
      },
      skip: !userId || !eventId,
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
      bookingToBeRescheduled={bookingToBeRescheduled}
      {...props}
    />
  );
};
