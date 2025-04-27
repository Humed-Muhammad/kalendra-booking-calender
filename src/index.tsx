import { usePocketBaseQuery } from "./hooks/usePocketBase";
import { collectionNames } from "./utils";
import { EventType } from "./types";
import { RoundRobinBooking } from "./RoundRobinBooking";
import { BookingProps } from "./types/type";
import { NormalBooking } from "./NormalBooking";
import { KalendraContext, KalendraProvider } from "./context/context";
import { useContext, useEffect } from "react";

interface Props extends BookingProps {
  calenderUrl: string;
}
const BookingCalendar = (props: Props) => {
  const { data: eventType } = usePocketBaseQuery<EventType>({
    collectionName: collectionNames.event_types,
    id: props.eventTypeId as string,
    skip: !props.eventTypeId,
    options: {
      expand: "members",
    },
  });

  const { setPbUrl } = useContext(KalendraContext);

  useEffect(() => {
    setPbUrl?.(props.calenderUrl);
  }, [props.calenderUrl]);

  if (
    eventType?.type === "round_robin" &&
    !props.kalendra_user_id &&
    !props.bookingToBeRescheduledId
  ) {
    return <RoundRobinBooking eventType={eventType} {...props} />;
  }
  return <NormalBooking {...props} />;
};

export const KalendraCalendar = (props: Props) => {
  return (
    <KalendraProvider>
      <BookingCalendar {...props} />
    </KalendraProvider>
  );
};
