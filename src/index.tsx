import { usePocketBaseQuery } from "./hooks/usePocketBase";
import { collectionNames } from "./utils";
import { EventType } from "./types";
import { RoundRobinBooking } from "./RoundRobinBooking";
import { BookingProps } from "./types/type";
import { NormalBooking } from "./NormalBooking";

export const KalendraCalendar = (props: BookingProps) => {
  const { data: eventType } = usePocketBaseQuery<EventType>({
    collectionName: collectionNames.event_types,
    id: props.eventTypeId as string,
    skip: !props.eventTypeId,
    options: {
      expand: "members",
    },
  });
  if (
    eventType?.type === "round_robin" &&
    !props.kalendra_user_id &&
    !props.bookingToBeRescheduledId
  ) {
    return <RoundRobinBooking eventType={eventType} {...props} />;
  }
  return <NormalBooking {...props} />;
};
