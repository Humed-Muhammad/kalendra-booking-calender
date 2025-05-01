import { usePocketBaseQuery } from "./hooks/usePocketBase";
import { collectionNames } from "./utils";
import { EventType } from "./types";
import { RoundRobinBooking } from "./RoundRobinBooking";
import { BookingProps } from "./types/type";
import { NormalBooking } from "./NormalBooking";
import { KalendraContext, KalendraProvider } from "./context/context";
import { useContext, useEffect, useState } from "react";
import { Container } from "./Core/index";
import { KalendraLoader } from "./icons/KalendraLoader";

interface Props extends BookingProps {
  calenderUrl: string;
}
const BookingCalendar = (props: Props) => {
  const [loadingData, setLoadingData] = useState(false);
  const {
    data: eventType,
    isError,
    isLoading,
  } = usePocketBaseQuery<EventType>({
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

  if (isLoading || loadingData) {
    return (
      <Container width={["100%"]} maxWidth={["100%"]} height={"440px"}>
        {props.LoadingIndicator ? props.LoadingIndicator : <KalendraLoader />}
      </Container>
    );
  }

  if (
    eventType?.type === "round_robin" &&
    !props.kalendra_user_id &&
    !props.bookingToBeRescheduledId
  ) {
    return (
      <RoundRobinBooking
        eventType={eventType}
        {...props}
        isError={isError}
        isLoadingRootEventType={isLoading}
        setLoadingData={setLoadingData}
      />
    );
  }
  return (
    <NormalBooking
      {...props}
      isError={isError}
      isLoadingRootEventType={isLoading}
      setLoadingData={setLoadingData}
    />
  );
};

export const KalendraCalendar = (props: Props) => {
  return (
    <KalendraProvider>
      <BookingCalendar {...props} />
    </KalendraProvider>
  );
};
