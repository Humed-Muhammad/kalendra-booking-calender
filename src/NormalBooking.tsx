import { useMemo } from "react";
import { usePocketBaseQuery } from "./hooks/usePocketBase";
import type { Availability, Booking, EventTypeSettings } from "./types";
import type { BookingProps } from "./types/type";
import { collectionNames } from "./utils";
import { usePocketBaseEndpoint } from "./hooks/usePocketBaseEndpoint";
import { BookingCalendar } from "./Calendar";
import { Container } from "./Core/index";
import { KalendraLoader } from "./icons/KalendraLoader";

interface Props extends BookingProps {
  isLoadingRootEventType: boolean;
  organizationId: string | undefined;
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
  const userId = useMemo(
    () => bookingToBeRescheduled?.user || kalendra_user_id,
    [bookingToBeRescheduled, kalendra_user_id]
  );
  const eventId = useMemo(
    () => bookingToBeRescheduled?.eventType || eventTypeId,
    [bookingToBeRescheduled, eventTypeId]
  );
  const {
    data: eventTypeSetting,
    isLoading: isFetchingEventSettings,
    // isError: eventTypeSettingError,
  } = usePocketBaseQuery<EventTypeSettings>({
    collectionName: collectionNames.event_type_settings,
    single: true,
    options: {
      filter: `event_type = "${eventId}" && user = "${userId}"`,
      expand: "user, event_type",
    },
    skip: !eventId || !userId,
  });
  const {
    data: availability,
    isLoading,
    // isError: availabilityError,
  } = usePocketBaseQuery<Array<Availability>>({
    collectionName: collectionNames.availability,
    options: {
      filter: `user = "${userId}" && organization = "${props.organizationId}"`,
      expand: "user",
    },
    skip: !userId || !props.organizationId,
  });

  const {
    data: bookings,
    isLoading: isFetchingBooking,
    // isError: isFetchingBookingError,
  } = usePocketBaseEndpoint<Array<Booking>>({
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
  const linkedAvailability = useMemo(
    () =>
      availability?.find(
        (item) => item.id === String(eventTypeSetting?.settings?.availability)
      ),
    [availability, eventTypeSetting?.settings?.availability]
  );
  // useEffect(() => {
  //   setTimeout(() => {
  //     setBookingInitializing(false);
  //   }, 500);
  // }, []);
  const isFetching = useMemo(
    () =>
      isFetchingBooking ||
      isFetchingEventSettings ||
      isFetchingBookingToReschedule,
    [isFetchingBooking, isFetchingEventSettings, isFetchingBookingToReschedule]
  );

  if (isFetching || props.isLoadingRootEventType) {
    return (
      <Container width={["100%"]} maxWidth={["100%"]} height={"440px"}>
        {props.LoadingIndicator ? props.LoadingIndicator : <KalendraLoader />}
      </Container>
    );
  }

  return (
    <BookingCalendar
      eventTypeSetting={eventTypeSetting}
      availability={
        linkedAvailability ?? defaultAvailability ?? availability?.[0]
      }
      bookings={bookings}
      isFetching={isLoading || isFetching}
      bookingToBeRescheduled={bookingToBeRescheduled}
      {...props}
      // isError={
      //   props.isError ||
      //   availabilityError ||
      //   eventTypeSettingError ||
      //   isFetchingBookingError
      // }
    />
  );
};
