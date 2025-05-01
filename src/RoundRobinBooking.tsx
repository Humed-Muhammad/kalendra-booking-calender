import { type Dispatch, type SetStateAction, useEffect, useMemo } from "react";
import { Availability, Booking, EventType, EventTypeSettings } from "./types";
import { usePocketBaseQuery } from "./hooks/usePocketBase";
import { collectionNames } from "./utils";
import { usePocketBaseEndpoint } from "./hooks/usePocketBaseEndpoint";
import { Accumulator, BookingProps } from "./types/type";
import { BookingCalendar } from "./Calendar";

interface Props extends BookingProps {
  eventType: EventType;
  isLoadingRootEventType: boolean;
  setLoadingData: Dispatch<SetStateAction<boolean>>;
}

export const RoundRobinBooking = ({
  eventType,
  setLoadingData,
  ...rest
}: Props) => {
  const membersUsers = useMemo(() => {
    return eventType?.expand?.members?.map((member) => member.user);
  }, [eventType]);
  const {
    data: eventTypeSetting,
    isLoading: isFetchingEventTypeSettings,
    // isError: eventTypeSettingError,
  } = usePocketBaseQuery<EventTypeSettings>({
    collectionName: collectionNames.event_type_settings,
    single: true,
    options: {
      filter: `event_type = "${eventType?.id}"`,
      expand: "user, event_type, event_type.team",
    },
    skip: !eventType?.id,
  });
  const userFilter = membersUsers?.map((id) => `user="${id}"`).join(" || ");
  const {
    data: availabilities,
    isLoading,
    // isError: availabilityError,
  } = usePocketBaseQuery<Array<Availability>>({
    collectionName: collectionNames.availability,
    options: {
      filter: `(${userFilter}) && organization = "${eventType?.organization}"`,
      expand: "user",
    },
    skip: !eventType,
  });

  const {
    data: bookings,
    isLoading: isFetchingBooking,
    // isError: isFetchingBookingError,
  } = usePocketBaseEndpoint<Array<Booking>>({
    url: "/get-round-robin-bookings",
    options: {
      method: "POST",
      body: {
        eventTypeId: eventType?.id,
      },
    },
    skip: !eventType?.id,
  });
  // const { toast } = useToast();
  // const { push } = useRouter();
  const combinedAvailability = useMemo(() => {
    return availabilities
      ?.filter((av) => av.isDefault)
      .reduce(
        (acc: Accumulator, curr) => {
          curr?.availability?.map((a, index) => {
            if (a.length) {
              // @ts-ignore
              const afterUserAdd = a?.map((a) => ({
                ...a,
                user: curr.user,
              }));
              acc.availability[index] = [
                ...acc.availability[index],
                ...afterUserAdd,
              ];
            }
          });
          curr.dateOverrides?.map((a) => {
            const afterUserAdd = a.availability?.map((a) => ({
              ...a,
              user: curr.user,
            }));
            acc.dateOverrides.push({
              availability: afterUserAdd,
              date: a.date,
            });
          });

          return acc;
        },
        {
          availability: [[], [], [], [], [], [], []],
          dateOverrides: [],
        }
      );
  }, [availabilities]);

  const isFetching = useMemo(
    () => isFetchingEventTypeSettings || isFetchingBooking,
    [isFetchingEventTypeSettings, isFetchingBooking]
  );

  useEffect(() => {
    if (!isFetching) {
      setLoadingData(false);
    }
  }, [isFetching]);

  return (
    <div className="flex h-screen w-full items-center justify-center p-3">
      <BookingCalendar
        isRoundRobin
        eventTypeSetting={eventTypeSetting}
        availability={combinedAvailability}
        isFetching={
          isLoading || isFetchingEventTypeSettings || isFetchingBooking
        }
        bookings={bookings}
        {...rest}
        // isError={
        //   rest.isError ||
        //   availabilityError ||
        //   eventTypeSettingError ||
        //   isFetchingBookingError
        // }
      />
    </div>
  );
};
