import {
  collectionNames,
  formatToTimeZone,
  minimumNoticeTypeValue,
} from "./utils";
import { usePocketBaseMutation } from "./hooks/usePocketBase";
import { Availability, Booking, EventTypeSettings } from "./types";
import { addMinutes, format } from "date-fns";
import { CalendarIcon, Globe, Link, TimerIcon } from "lucide-react";
import {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Calendar } from "./SyledCalendar";
import { numuwTheme } from "./theme";
import {
  Box,
  CenterColumn,
  CenterRow,
  Container,
  Flex,
  Text,
} from "./Core/index";
import { DefaultTheme, ThemeProvider } from "styled-components";
import {
  Tab,
  TabsContainer,
  TabsContent,
  TabsHeader,
  TimeSlot,
  TimeSlotContainer,
  Title,
} from "./Tab";
import { formatSlotMinutes, getGMTOffset, getImage } from "./utils";
import { SearchableSelector } from "./Core/SearchableSelector";
import { timezones } from "./timezone";
import { LoadingDots } from "./icons/index";
import { Tooltip } from "./Core/Tooltip";
import { DynamicForm } from "./DynamicForm";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Core/Button/Button";
import { useDisclosure } from "./hooks/useDisclosure";
import { Avatar } from "./Core/Avatar/index";
import { useGetTimeSlots } from "./hooks/useGetTimeSlots";
import { EventTypeError } from "./NoEventFoundError";
import { KalendraLoader } from "./icons/KalendraLoader";

type Props = {
  availability: Availability;
  isFetching: boolean;
  eventTypeSetting: EventTypeSettings;
  bookings: Booking[] | undefined;
  onSuccess?: (response: Booking | undefined) => void;
  onError?: (error: unknown) => void;
  bookingToBeRescheduled?: Booking;
  responses?: Record<string, any>;
  duration?: number;
  theme?: DefaultTheme;
  styles?: CSSProperties | undefined;
};
export const BookingCalendar = ({
  availability,
  isFetching,
  theme,
  styles,
  eventTypeSetting,
  bookingToBeRescheduled,
  duration,
  responses,
  bookings,
  onError,
  onSuccess,
}: Props) => {
  const isRescheduling = useMemo(
    () => Boolean(bookingToBeRescheduled),
    [bookingToBeRescheduled]
  );

  const [date, setDate] = useState<Date | undefined>();
  const [slot, setSlot] = useState<Date | undefined>();
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [timezone, setTimezone] = useState<string>(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [incrementStep, setIncrementStep] = useState<number | undefined>();
  const [availableTimeSlots, setAvailableTimeSlots] = useState<
    {
      formattedTime: string;
      utcTime: Date;
    }[]
  >([]);

  // Defaults
  useEffect(() => {
    if (bookingToBeRescheduled) {
      // setSlot(new Date(bookingToBeRescheduled?.startTime));
      setIncrementStep(
        bookingToBeRescheduled?.duration ??
          eventTypeSetting?.settings?.defaultDuration
      );
    }
  }, [bookingToBeRescheduled, eventTypeSetting]);

  const { getTimeSlots } = useGetTimeSlots({
    availability,
    bookings,
    eventTypeSetting,
    incrementStep,
    timezone,
  });

  // Function to check if a date has availability
  const hasAvailability = useCallback(
    (date: Date) => {
      if (date.getDate() < new Date().getDate()) {
        return false;
      }

      if (!availability) return false;

      const dayOfWeek = date.getDay(); // 0 is Sunday, 1 is Monday, etc.
      const formattedDate = format(date, "yyyy-MM-dd");

      // Check if there's a date override for this specific date
      const dateOverride = availability.dateOverrides?.find(
        (override) => override.date === formattedDate
      );

      if (dateOverride) {
        return (
          dateOverride.availability && dateOverride.availability.length > 0
        );
      }

      // Otherwise check the regular weekly availability
      if (eventTypeSetting?.settings?.minimumNotice) {
        const minimumNotice = eventTypeSetting?.settings?.minimumNotice;
        const minimumNoticeType = eventTypeSetting?.settings?.minimumNoticeType;
        let noticeDate;
        if (minimumNoticeType == minimumNoticeTypeValue.minutes) {
          noticeDate = addMinutes(new Date(), minimumNotice);
        } else if (minimumNoticeType == minimumNoticeTypeValue.hours) {
          noticeDate = addMinutes(new Date(), minimumNotice * 60);
        } else if (minimumNoticeType == minimumNoticeTypeValue.days) {
          noticeDate = addMinutes(new Date(), minimumNotice * 60 * 24);
        } else if (minimumNoticeType == minimumNoticeTypeValue.weeks) {
          noticeDate = addMinutes(new Date(), minimumNotice * 60 * 24 * 7);
        } else if (minimumNoticeType == minimumNoticeTypeValue.months) {
          noticeDate = addMinutes(new Date(), minimumNotice * 60 * 24 * 30);
        }

        if (noticeDate) {
          return (
            date >= noticeDate &&
            availability.availability?.[dayOfWeek]?.length > 0
          );
        }
      }
      return availability.availability?.[dayOfWeek]?.length > 0;
    },
    [availability, eventTypeSetting]
  );

  // Update time slots when date changes
  useEffect(() => {
    if (date) {
      const slots = getTimeSlots(
        date,
        Intl.DateTimeFormat().resolvedOptions().timeZone
      );
      setAvailableTimeSlots(slots);
    } else {
      setAvailableTimeSlots([]);
    }
  }, [date, getTimeSlots]);

  // useEffect(() => {
  //   if (user?.timezone) {
  //     setTimezone(user?.timezone);
  //   }
  // }, [user?.timezone]);

  const [activeTab, setActiveTab] = useState("12h");
  useEffect(() => {
    if (duration) {
      setIncrementStep(Number(duration));
    } else {
      if (eventTypeSetting?.settings?.defaultDuration) {
        setIncrementStep(eventTypeSetting?.settings?.defaultDuration as number);
      } else {
        setIncrementStep(
          eventTypeSetting?.settings?.timeSlots?.[0] ??
            eventTypeSetting?.settings?.length
        );
      }
    }
  }, [
    eventTypeSetting?.settings?.defaultDuration,
    eventTypeSetting?.settings?.length,
    eventTypeSetting?.settings?.timeSlots,
    duration,
  ]);
  // Use booking  settings them not this
  // const { theme } = useTheme();
  const { mutate, isLoading } = usePocketBaseMutation<Booking>({
    collectionName: collectionNames.bookings,
  });
  // replace with success component later

  const onSubmit = (responses: Record<string, any>) => {
    mutate(
      {
        responses,
        eventType: eventTypeSetting?.event_type,
        user: eventTypeSetting?.user,
        attendees: [
          {
            name: eventTypeSetting?.expand.user?.name,
            email: eventTypeSetting?.expand.user?.email,
            host: true,
          },
          {
            name: responses.name,
            email: responses.email,
            host: false,
          },
        ],
        startTime: slot,
        endTime: addMinutes(slot as Date, incrementStep as number),
        status: isRescheduling ? "rescheduled" : "confirmed",
        recurring: false,
        title: eventTypeSetting?.settings?.title,
        description: eventTypeSetting?.settings?.description,
        location: eventTypeSetting?.settings?.location,
        // rescheduledBy: user?.id,
        duration: incrementStep,
      },
      {
        update: isRescheduling,
        id: bookingToBeRescheduled?.id,
      }
    )
      .then((fulfilled) => {
        if (fulfilled) {
          if (onSuccess) {
            onSuccess(fulfilled);
          }
        }
      })
      .catch((error) => {
        if (onError) {
          onError(error);
        }
      });
  };

  const isAllAnswered = useMemo(() => {
    const bookingQuestions = eventTypeSetting?.settings?.bookingQuestions;

    if (!Array.isArray(bookingQuestions)) return true;

    return bookingQuestions.every((question) => {
      if (question?.hidden) return true;
      if (!question?.required) return true;

      const response =
        responses?.[question.identifier as keyof typeof responses];

      // Check for non-empty string, number, or truthy value depending on your design
      return response !== undefined && response !== null && response !== "";
    });
  }, [responses, eventTypeSetting?.settings?.bookingQuestions]);

  if (isFetching) {
    return (
      <Container height={440}>
        <KalendraLoader />
      </Container>
    );
  }

  if ((!eventTypeSetting || !availability) && !isFetching)
    return <EventTypeError />;

  return (
    <ThemeProvider theme={theme ?? numuwTheme}>
      <Container
        style={{
          transition: "all 0.3s ease-in-out",
          ...styles,
        }}
        boxShadow="md"
        flexWrap={["wrap", "wrap", "wrap", "nowrap"]}
        height={["100%", "100%", "100%", 440]}
        width={["100%"]}
        maxWidth={["100%", "100%", "100%", isOpen ? "fit-content" : "100%"]}
        overflowY="scroll"
        className="calendar-container"
        hideScrollBar
        justifyContent="flex-start"
      >
        <Flex
          flexDirection="column"
          gap={"4px"}
          bg="background"
          borderTopLeftRadius={[styles?.borderRadius || "6px"]}
          borderBottomLeftRadius={[
            "0px",
            "0px",
            "0px",
            styles?.borderRadius || "6px",
          ]}
          borderTopRightRadius={["6px", "6px", "6px", "0px"]}
          padding={"24px"}
          height={"100%"}
          // width={"20rem"}
          flexGrow={[1]}
          // width={['100%', '100%', '100%', '20rem']}
          maxWidth={["100%", "100%", "100%", "20rem"]}
          maxHeight="440px"
          hideScrollBar
          // overflowY="scroll"
        >
          <CenterRow gap={"8px"}>
            <Avatar
              src={
                eventTypeSetting?.expand?.user?.id &&
                eventTypeSetting?.expand?.user?.avatar
                  ? getImage({
                      collectionName: collectionNames.users,
                      recordId: eventTypeSetting?.expand?.user?.id,
                      imageName: eventTypeSetting?.expand?.user?.avatar,
                    })
                  : ""
              }
              fallback={eventTypeSetting?.expand?.user?.name?.substring(0, 2)}
              alt={eventTypeSetting?.expand?.user?.name}
            />
          </CenterRow>

          <Text color="#A3A3A3" fontSize={14}>
            {availability?.expand?.user?.name}
          </Text>
          <Text fontSize={20}>{eventTypeSetting?.settings?.title}</Text>
          <CenterColumn gap={16}>
            <CenterRow gap={"8px"}>
              <Text>
                <TimerIcon
                  style={{
                    width: "22px",
                    height: "22px",
                  }}
                />
              </Text>
              {/* slot selector */}
              {eventTypeSetting?.settings?.timeSlots?.length ? (
                <ScrollableRow
                  isOpen={isOpen}
                  eventTypeSetting={eventTypeSetting}
                  incrementStep={incrementStep}
                  setIncrementStep={setIncrementStep}
                />
              ) : (
                <Text>
                  {formatSlotMinutes(eventTypeSetting?.settings?.length)}
                </Text>
              )}
            </CenterRow>
            {isRescheduling && (
              <CenterColumn>
                <Flex gap={"8px"}>
                  <Text>
                    <CalendarIcon
                      style={{
                        width: "18px",
                        height: "18px",
                      }}
                    />
                  </Text>
                  <Text fontSize="15px">Former time</Text>
                </Flex>
                <Text
                  ml={"25px"}
                  fontSize="14px"
                  fontWeight="normal"
                  textDecoration="line-through"
                  variant="light"
                >
                  {formatToTimeZone(
                    bookingToBeRescheduled?.startTime as string,
                    timezone
                  )}
                </Text>
              </CenterColumn>
            )}
            {slot && (
              <>
                <CenterRow gap={"8px"}>
                  <Text>
                    <CalendarIcon
                      style={{
                        width: "18px",
                        height: "18px",
                      }}
                    />
                  </Text>
                  <Text variant="light">
                    {formatToTimeZone(slot.toISOString(), timezone)}
                  </Text>
                </CenterRow>
              </>
            )}
            <CenterRow gap={"8px"}>
              <Text>
                <Link
                  style={{
                    width: "18px",
                    height: "18px",
                  }}
                />
              </Text>
              <Tooltip text={eventTypeSetting?.settings?.location}>
                <Text truncate variant="light">
                  {eventTypeSetting?.settings?.location}
                </Text>
              </Tooltip>
            </CenterRow>
            <CenterRow gap={"8px"}>
              <Text>
                <Globe
                  style={{
                    width: "18px",
                    height: "18px",
                  }}
                />
              </Text>
              <CenterRow maxWidth={["85%"]}>
                <SearchableSelector
                  disabled={isOpen}
                  onChange={(value) => {
                    setTimezone(value);
                  }}
                  options={timezones}
                  value={timezone}
                  placeholder="Search timezone"
                  showSuffix={(timezone) => getGMTOffset(timezone)}
                />
              </CenterRow>
            </CenterRow>
          </CenterColumn>
        </Flex>
        <Box
          height="100%"
          width={"0.5px"}
          borderLeft="1px solid"
          borderColor="border"
          display={["none", "none", "none", "block"]}
        />
        {isOpen ? (
          <Flex
            hideScrollBar
            bg="background"
            padding={"24px"}
            height={"440px"}
            // flexGrow={1}
            maxWidth={["100%", "100%", "100%", "40rem"]}
            borderTopRightRadius={[
              "0px",
              "0px",
              "0px",
              styles?.borderRadius || "6px",
            ]}
            borderBottomRightRadius={[
              "0px",
              "0px",
              "0px",
              styles?.borderRadius || "6px",
            ]}
            flexDirection="column"
          >
            <DynamicForm
              onBack={() => {
                setSlot(undefined);
                onClose();
              }}
              fields={eventTypeSetting?.settings?.bookingQuestions}
              bookingQuestions={{
                ...(bookingToBeRescheduled?.responses ?? {}),
                ...(responses ?? {}),
              }}
              onSubmit={onSubmit}
              isLoading={isLoading}
            />
          </Flex>
        ) : (
          <>
            <CenterColumn
              bg="background"
              padding={[0, 0, "24px"]}
              height={["440px", "440px", "440px", "100%"]}
              flexGrow={1}
              justifyContent="center"
            >
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => !hasAvailability(date)}
              />
            </CenterColumn>
            <Box
              height="100%"
              width={"0.5px"}
              borderLeft="1px solid"
              borderColor="border"
              display={["none", "none", "none", "block"]}
            />
            <Box
              bg="background"
              borderTopRightRadius={[
                "0px",
                "0px",
                "0px",
                styles?.borderRadius || "6px",
              ]}
              borderBottomRightRadius={[
                "0px",
                "0px",
                "0px",
                styles?.borderRadius || "6px",
              ]}
              padding={"24px"}
              height={"100%"}
              flexGrow={[1]}
              width={["100%", "100%", "100%", "20rem"]}
            >
              <TabsContainer>
                {date && (
                  <TabsHeader>
                    <Title>
                      <Text>
                        {date ? format(date, "EEE dd") : "Select a date"}
                      </Text>
                    </Title>
                    <Tab
                      options={["12h", "24h"]}
                      activeTab={activeTab}
                      onChange={setActiveTab}
                    />
                  </TabsHeader>
                )}
                <TabsContent>
                  <TimeSlotContainer>
                    {availableTimeSlots.length > 0 ? (
                      availableTimeSlots.map((time) => {
                        let displayTime = time.formattedTime;

                        if (activeTab === "24h") {
                          const [hourMin, period] =
                            time.formattedTime.split(/([ap]m)$/);
                          const [hour, minute] = hourMin.split(":").map(Number);
                          let hour24 = hour;

                          if (period === "pm" && hour !== 12) {
                            hour24 += 12;
                          } else if (period === "am" && hour === 12) {
                            hour24 = 0;
                          }

                          displayTime = `${hour24
                            .toString()
                            .padStart(2, "0")}:${minute
                            .toString()
                            .padStart(2, "0")}`;
                        }

                        return (
                          <CenterRow width="100%" gap={"8px"}>
                            <TimeSlot
                              bg={
                                time.utcTime === slot
                                  ? "lightGray"
                                  : "transparent"
                              }
                              onClick={() => {
                                setSlot(time.utcTime);
                                // check if all question are answered if not open the form
                                if (isAllAnswered) {
                                  setShowSubmitButton(true);
                                } else {
                                  onOpen();
                                }
                              }}
                              key={time.formattedTime}
                              selected={time.utcTime === slot}
                            >
                              <Text variant="light">{displayTime}</Text>
                            </TimeSlot>
                            {showSubmitButton && time.utcTime === slot && (
                              <Button
                                flexGrow={1}
                                bg="dayHoverBg"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSubmit(responses!);
                                }}
                              >
                                <Text color="background" variant="light">
                                  {isLoading ? <LoadingDots /> : "Book"}
                                </Text>
                              </Button>
                            )}
                          </CenterRow>
                        );
                      })
                    ) : (
                      <Text overflowY="hidden" height="max-content">
                        {date
                          ? "No available time slots for this date"
                          : "Please select a date"}
                      </Text>
                    )}
                  </TimeSlotContainer>
                </TabsContent>
              </TabsContainer>
            </Box>
          </>
        )}
      </Container>
    </ThemeProvider>
  );
};

// create a ghost button component when act
// const Button = styled("button")<{ selected?: boolean }>`
//   borer: none;
//   padding: 2px 8px;
//   border-radius: 6px;
//   background: ${(props) =>
//   props.selected ? props.theme.colors.dayBg : `none`};
//   ${commonComposes()}
// `;

type ScrollableRowProps = {
  eventTypeSetting: EventTypeSettings;
  incrementStep: number | undefined;
  setIncrementStep: (step: number) => void;
  isOpen: boolean | undefined;
};
const ScrollableRow = ({
  eventTypeSetting,
  incrementStep,
  isOpen,
  setIncrementStep,
}: ScrollableRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const activeTab = scrollRef.current?.getElementsByClassName("active-slot");
    activeTab?.[0]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  }, [incrementStep]);

  // Function to update scroll visibility state
  const updateScrollState = () => {
    if (scrollRef.current) {
      setCanScrollLeft(scrollRef.current.scrollLeft > 0);
      setCanScrollRight(
        scrollRef.current.scrollLeft <
          scrollRef.current.scrollWidth - scrollRef.current.clientWidth
      );
    }
  };

  // Scroll function
  const scroll = (direction: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction * 100, behavior: "smooth" });
    }
  };

  useEffect(() => {
    updateScrollState();
    const handleScroll = () => updateScrollState();
    const scrollElement = scrollRef.current;

    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      return () => scrollElement.removeEventListener("scroll", handleScroll);
    }
    return undefined;
  }, []);
  const filteredSlots = useMemo(() => {
    let sorted = eventTypeSetting?.settings?.timeSlots?.sort((a, b) => a - b);
    if (incrementStep && isOpen) {
      sorted = sorted.filter((slot) => slot === incrementStep);
    }
    return sorted;
  }, [eventTypeSetting?.settings?.timeSlots, incrementStep, isOpen]);

  return (
    <Flex position="relative" alignItems="center" flexGrow={1} maxWidth="90%">
      {canScrollLeft && !isOpen && (
        <CenterColumn
          onClick={() => scroll(-1)}
          position="absolute"
          left={"1px"}
          zIndex={10}
          border="none"
          bg="background"
          height="95%"
          p={0}
          borderRadius={0}
          borderTopLeftRadius={"6px"}
          borderBottomLeftRadius={"6px"}
          opacity={0.9}
          cursor="pointer"
          color="text"
        >
          <ChevronLeft size={18} />
        </CenterColumn>
      )}

      <CenterRow
        ref={scrollRef}
        border={"0.5px solid"}
        borderColor="border"
        p={1}
        borderRadius={"6px"}
        width={incrementStep ? "max-content" : "100%"}
        overflowX="auto"
        gap={"8px"}
        hideScrollBar
      >
        {filteredSlots?.map((slot) => (
          <Button
            key={slot}
            onClick={() => setIncrementStep(slot)}
            className={`${incrementStep === slot ? "active-slot" : ""}`}
            selected={incrementStep === slot}
          >
            <Text
              width="max-content"
              variant="light"
              fontSize={13}
              fontWeight="normal"
            >
              {formatSlotMinutes(slot)}
            </Text>
          </Button>
        ))}
      </CenterRow>

      {canScrollRight && !isOpen && (
        <CenterColumn
          onClick={() => scroll(1)}
          position="absolute"
          right={"1px"}
          zIndex={10}
          border="none"
          bg="background"
          opacity={0.9}
          height="95%"
          p={0}
          borderTopRightRadius={6}
          borderBottomRightRadius={6}
          cursor="pointer"
          color="text"
        >
          <ChevronRight size={18} />
        </CenterColumn>
      )}
    </Flex>
  );
};
