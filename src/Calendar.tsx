import type {
  Availability,
  Booking,
  BookingDraft,
  DateSlots,
  EventTypeSettings,
  Slot,
} from "./types";
import { addMinutes, addMonths, format } from "date-fns";
import { formatInTimeZone, format as tzFormat } from "date-fns-tz";
import {
  CalendarCheck,
  CalendarX,
  ChevronRight,
  Clock,
  Globe,
  History,
  MapPin,
  Video,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Calendar } from "./SyledCalendar";
import { darkTheme, lightTheme } from "./theme";
import { ThemeProvider } from "styled-components";
import { ConfirmButton, SlotButton, SlotRow, Tab } from "./Tab";
import {
  AvatarWrap,
  DayHeading,
  DetailList,
  DetailRow,
  DetailText,
  DurationChip,
  DurationChips,
  EmptySlots,
  EventTitle,
  FormArea,
  FormInner,
  HostName,
  MainColumn,
  MetaColumn,
  Shell,
  SlotList,
  SlotsColumn,
  SlotsHeader,
  SlotsInner,
  SlotsScroller,
  Skeleton,
  SkeletonStack,
  MonthEmptyOverlay,
  MonthEmptyCard,
  MonthEmptyButton,
  SlotStack,
} from "./BookingLayout";
import {
  browserTimezone,
  collectionNames,
  createRoundRobin,
  formatSlotMinutes,
  formatToTimeZone,
  getImage,
} from "./utils";
import { TimezonePicker } from "./TimezonePicker";
import { LoadingDots } from "./icons";
import { DynamicForm } from "./DynamicForm";
import { useDisclosure } from "./hooks/useDisclosure";
import { Avatar } from "./Core/Avatar";
import type { ContentType } from "./types/type";
import type { Direction } from "./Core/common/types";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { useKalendra } from "./context/context";
import { usePocketBaseEndpointMutation } from "./hooks/usePocketBaseEndpointMutation";
import { useEndpointQuery } from "./hooks/useEndpointQuery";

export type BookingCalendarProps = {
  onSuccess?: (response: Booking | undefined) => void;
  onError?: (error: unknown) => void;
  /**
   * Takes over the write: the calendar hands its booking body here instead of calling Kalendra,
   * e.g. so a backend can reschedule with its own bookkeeping. Resolve to finish, reject to fail.
   */
  onSubmitBooking?: (draft: BookingDraft) => Promise<Booking | void>;
  /** Kalendra user id recorded as the mover on a direct reschedule. */
  rescheduledBy?: string;
  /** The first duration to show, before the event's own default. */
  duration?: number;
  /** The timezone times are shown in at first (e.g. a signed-in user's); the browser's otherwise. */
  timezone?: string;
  bookingToBeRescheduled?: Booking;
  responses?: Record<string, any>;
  isRoundRobin?: boolean;
  content?: ContentType;
  /**
   * The direction of the calendar.
   */
  direction?: Direction | Direction[] | undefined;
  teamName?: string;
  orgId?: string;
  eventTypeId?: string;
  userId?: string;
  members?: {
    id: string;
    user: string;
  }[];
};
export const BookingCalendar = ({
  bookingToBeRescheduled,
  onSubmitBooking,
  rescheduledBy,
  duration,
  timezone: initialTimezone,
  responses,
  isRoundRobin,
  content,
  direction,
  teamName,
  orgId,
  eventTypeId,
  userId,
  members,
  onError,
  onSuccess,
}: BookingCalendarProps) => {
  const { client, calenderUrl, themeMode: theme } = useKalendra();
  const [bookingQuestions, setBookingQuestions] = useState<any>({});
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [creatingRoundRobinBooking, setCreatingRoundRobinBooking] =
    useState(false);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [isReschedulingLoading, setIsReschedulingLoading] = useState(false);
  const isRescheduling = useMemo(
    () => Boolean(bookingToBeRescheduled),
    [bookingToBeRescheduled],
  );

  const [date, setDate] = useState<Date | undefined>();
  const [slot, setSlot] = useState<Slot | undefined>();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [timezone, setTimezone] = useState<string>(
    initialTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  useEffect(() => {
    if (initialTimezone) setTimezone(initialTimezone);
  }, [initialTimezone]);
  // A rescheduled booking keeps its duration, which is known up front: use it
  // straight away so the first request is not sent without a duration.
  const [chosenStep, setIncrementStep] = useState<number | undefined>(duration);
  const incrementStep = chosenStep ?? bookingToBeRescheduled?.duration;

  const normalQuery = useEndpointQuery<AvailabilityResponse>({
    url: "/availability/single",
    options: {
      method: "POST",
      data: {
        incrementStep: incrementStep,
        timezone,
        orgId,
        eventTypeId,
        userId,
        year: selectedMonth.getFullYear(),
        month: selectedMonth.getMonth(),
      },
    },
    skip: !orgId || !eventTypeId || !userId || isRoundRobin,
  });
  const roundRobinQuery = useEndpointQuery<AvailabilityResponse>({
    url: "/availability/round-robin",
    options: {
      method: "POST",
      data: {
        incrementStep: incrementStep,
        timezone,
        orgId,
        eventTypeId,
        userId,
        year: selectedMonth.getFullYear(),
        month: selectedMonth.getMonth(),
        members,
        roundRobin: true,
      },
    },
    skip: !isRoundRobin || !orgId || !eventTypeId || !members?.length,
  });

  const activeQuery = isRoundRobin ? roundRobinQuery : normalQuery;
  const availableDate = activeQuery.data;
  const isFetching = activeQuery.isLoading;
  const isAvailabilityError = activeQuery.isError;
  // The params the data on hand was fetched with (not the current ones).
  const fetchedWith = activeQuery.dataOptions?.data as unknown as
    | AvailabilityParams
    | undefined;

  const eventTypeSetting = availableDate?.eventTypeSetting;
  const availability = availableDate?.availability;

  // The first request of a new booking goes out before the event's duration is
  // known, so the server answers with its default (1hr) slots. Those are only
  // used for the event settings; slot data is trusted once it was fetched with
  // a real duration, and only for the month it was fetched for.
  const expectsStep = Boolean(
    incrementStep ||
    eventTypeSetting?.settings?.defaultDuration ||
    eventTypeSetting?.settings?.timeSlots?.[0] ||
    eventTypeSetting?.settings?.length,
  );
  const isDataForShownMonth =
    fetchedWith?.year === selectedMonth.getFullYear() &&
    fetchedWith?.month === selectedMonth.getMonth();
  // Kept on screen while the same month refetches (new duration/timezone).
  const slotsData =
    availableDate &&
    isDataForShownMonth &&
    (fetchedWith?.incrementStep != null || !expectsStep)
      ? availableDate
      : undefined;
  // The data matches every current param, so it is safe to act on
  // (auto-pick a day, auto-advance the month).
  const isMonthLoaded =
    !isFetching &&
    Boolean(slotsData) &&
    fetchedWith?.incrementStep === incrementStep &&
    fetchedWith?.timezone === timezone;

  const hasAvailability = useCallback(
    (day: Date) =>
      Boolean(
        slotsData?.availableDates?.includes(day.getDate()) &&
        slotsData?.slots?.[day.getDate()]?.length,
      ),
    [slotsData],
  );
  const [activeTab, setActiveTab] = useState("12hr");
  useEffect(() => {
    if (!incrementStep) {
      if (bookingToBeRescheduled?.duration) {
        // setSlot(new Date(bookingToBeRescheduled?.startTime));
        setIncrementStep(bookingToBeRescheduled.duration);
      } else {
        if (eventTypeSetting?.settings?.defaultDuration) {
          setIncrementStep(
            eventTypeSetting?.settings?.defaultDuration as number,
          );
        } else {
          setIncrementStep(
            eventTypeSetting?.settings?.timeSlots?.[0] ??
              eventTypeSetting?.settings?.length,
          );
        }
      }
    }
  }, [
    eventTypeSetting?.settings?.defaultDuration,
    eventTypeSetting?.settings?.length,
    eventTypeSetting?.settings?.timeSlots,
    bookingToBeRescheduled?.duration,
    incrementStep,
  ]);

  const { mutate, isLoading } =
    usePocketBaseEndpointMutation<Booking>({
      url: "/event/book/managed",
      options: {
        method: "POST",
      },
      willNavigate: true,
    });
  const bookingTitle = useCallback(
    (userResponses: Record<string, any>) => {
      const eventTitle = eventTypeSetting?.settings?.title;
      const attendees = [
        {
          name: eventTypeSetting?.expand?.user?.name,
          email: eventTypeSetting?.expand?.user?.email,
          host: true,
        },
        {
          name: userResponses?.name,
          email: userResponses?.email,
          host: false,
        },
      ];
      const joinedAttendees = attendees
        .map((response) => response.name)
        .join(", ");
      return `${eventTitle} between ${joinedAttendees}`;
    },
    [eventTypeSetting],
  );

  const formatTimeZone = (host: boolean) => {
    const timezone = host
      ? eventTypeSetting?.expand?.user?.timezone
      : browserTimezone;
    let formattedTime = "";
    try {
      formattedTime = `${new Intl.DateTimeFormat("en-US", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: timezone,
      }).format(new Date(slot?.utcTime as string))} (${timezone})`;
    } catch (error) {
      console.log(error);
    }
    return formattedTime;
  };

  // replace with success component later
  const onSubmit = async (responses: Record<string, any> = {}) => {
    const body: BookingDraft = {
      responses,
      eventType: eventTypeSetting?.event_type,
      user: eventTypeSetting?.user,
      attendees: [
        {
          name: eventTypeSetting?.expand?.user?.name,
          email: eventTypeSetting?.expand?.user?.email,
          host: true,
        },
        {
          name: responses.name,
          email: responses.email,
          host: false,
        },
      ],
      startTime: slot?.utcTime,
      endTime: addMinutes(
        new Date(slot?.utcTime as string),
        incrementStep as number,
      ),
      status: isRescheduling ? "rescheduled" : "confirmed",
      ...(isRescheduling ? { bookingId: bookingToBeRescheduled?.id } : {}),
      recurring: false,
      title: bookingTitle(responses),
      description: eventTypeSetting?.settings?.description,
      location: eventTypeSetting?.settings?.location,
      duration: incrementStep,
      inviteesTimezone: browserTimezone,
      inviteeFormattedStartTime: formatTimeZone(false),
      hostFormattedStartTime: formatTimeZone(true),
    };
    if (onSubmitBooking) {
      setIsReschedulingLoading(true);
      await onSubmitBooking(body)
        .then((res) => onSuccess?.(res || undefined))
        .catch((err: any) => onError?.(err))
        .finally(() => setIsReschedulingLoading(false));
    } else if (isRescheduling) {
      setIsReschedulingLoading(true);
      await client
        .send<Booking>("/reschedule-booking", {
          method: "PATCH",
          body: {
            ...body,
            rescheduledBy,
            bookingId: bookingToBeRescheduled?.id,
          },
        })
        .then((res) => {
          onSuccess?.(res);
        })
        .catch((err: any) => onError?.(err?.response))
        .finally(() => {
          setIsReschedulingLoading(false);
        });
    } else {
      if (isRoundRobin) {
        createRoundRobin({
          client,
          body: { ...body, users: slot?.users },
          setCreatingRoundRobinBooking,
          onError,
          onSuccess,
        });
      } else {
        mutate(body)
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
      }
    }
  };

  const isAllAnswered = useMemo(() => {
    const bookingQuestions = eventTypeSetting?.settings?.bookingQuestions;

    if (!Array.isArray(bookingQuestions)) return true;

    return bookingQuestions.every((question) => {
      if (question?.hidden) {
        return true;
      }
      // if (!question?.required) return true;
      const response =
        responses?.[question.identifier as keyof typeof responses];

      // Check for non-empty string, number, or truthy value
      return response !== undefined && response !== null && response !== "";
    });
  }, [responses, eventTypeSetting?.settings?.bookingQuestions]);
  const formatDisplayTime = useCallback(
    (time: Slot) => {
      if (activeTab === "24hr") {
        return formatToTimeZone(time.utcTime, timezone, "HH:mm");
      }
      return formatToTimeZone(time.utcTime, timezone, "h:mmaaa");
    },
    [activeTab, timezone],
  );

  // Slots for the selected date. Derived in the same render as `date` (not in
  // an effect) so a new date never briefly shows the previous date's times.
  const availableTimeSlots = useMemo<Slot[]>(
    () => (date ? slotsData?.slots?.[date.getDate()] || [] : []),
    [date, slotsData?.slots],
  );
  const slotsKey = `${availableTimeSlots[0]?.utcTime}-${availableTimeSlots.at(-1)?.utcTime}-${availableTimeSlots.length}`;

  // Booking Questions state
  useEffect(() => {
    setBookingQuestions({
      ...(bookingToBeRescheduled?.responses ?? {}),
      ...(responses ?? {}),
    });
  }, [bookingToBeRescheduled?.responses, responses]);

  const disableBackNavigation = useMemo(() => {
    return (
      selectedMonth.getMonth() === new Date().getMonth() &&
      selectedMonth.getFullYear() === new Date().getFullYear()
    );
  }, [selectedMonth]);

  const isSubmitting =
    isLoading || isReschedulingLoading || creatingRoundRobinBooking;

  // Auto-select the first available date once per month, after it loads.
  const hasAutoPickedRef = useRef(false);
  // True between a month change and that month's first-available auto-pick.
  // Keeps the times column open (with placeholders) instead of collapsing.
  const [isAutoPicking, setIsAutoPicking] = useState(false);
  useEffect(() => {
    if (isAvailabilityError) {
      setIsAutoPicking(false); // don't leave placeholders up after a failure
    }
  }, [isAvailabilityError]);

  // Auto-advance to the next month while the shown one has no slots. This only
  // applies on first load: it stops for good once a month with availability
  // has loaded, or as soon as the user changes month themselves.
  const [autoAdvanceDone, setAutoAdvanceDone] = useState(false);
  const [autoAdvanceCount, setAutoAdvanceCount] = useState(0);
  const nextRef = useRef<HTMLButtonElement>(null);

  const changeMonth = useCallback((month: Date, isAuto = false) => {
    if (!isAuto) setAutoAdvanceDone(true); // the user is navigating now
    setSelectedMonth(month);
    // reset everything
    setDate(undefined);
    setSlot(undefined);
    setShowSubmitButton(false);
    // Pick the first available day of the new month once it loads.
    hasAutoPickedRef.current = false;
    setIsAutoPicking(true);
  }, []);

  const monthKey = `${selectedMonth.getFullYear()}-${selectedMonth.getMonth()}`;
  const monthHasAvailability = useMemo(
    () =>
      Boolean(
        slotsData?.availableDates?.some(
          (day) => slotsData.slots?.[day]?.length,
        ),
      ),
    [slotsData],
  );
  const isMonthEmpty = isMonthLoaded && !monthHasAvailability;
  // No weekly hours and no date overrides: every month will be empty.
  const hasNoSchedule = Boolean(
    availability &&
    !availability.availability?.some((day) => day.length) &&
    !availability.dateOverrides?.some((o) => o.availability.length),
  );
  const willAutoAdvance =
    isMonthEmpty &&
    !autoAdvanceDone &&
    !hasNoSchedule &&
    autoAdvanceCount < MAX_AUTO_ADVANCE;
  useEffect(() => {
    if (!willAutoAdvance) return;
    setAutoAdvanceCount((count) => count + 1);
    changeMonth(addMonths(selectedMonth, 1), true);
  }, [willAutoAdvance, selectedMonth, changeMonth]);
  useEffect(() => {
    // A month with availability has shown up: never auto-advance again.
    if (isMonthLoaded && monthHasAvailability) setAutoAdvanceDone(true);
  }, [isMonthLoaded, monthHasAvailability]);

  useEffect(() => {
    if (!isMonthLoaded || !slotsData) return;
    if (date) {
      // Fresh data (new duration, timezone, ...) has no times left for the
      // selected day: pick again rather than keep a disabled day selected.
      if (!hasAvailability(date)) {
        setDate(undefined);
        setSlot(undefined);
        setShowSubmitButton(false);
        hasAutoPickedRef.current = false;
        setIsAutoPicking(true);
      }
      return;
    }
    if (hasAutoPickedRef.current) return;
    const firstDay = [...(slotsData.availableDates ?? [])]
      .sort((a, b) => a - b)
      .find((day) => slotsData.slots?.[day]?.length);
    if (!firstDay) {
      // Empty month: close the column; the auto-advance moves on.
      setIsAutoPicking(false);
      return;
    }
    hasAutoPickedRef.current = true;
    setIsAutoPicking(false);
    setDate(
      new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), firstDay),
    );
  }, [isMonthLoaded, slotsData, date, selectedMonth, hasAvailability]);

  const isExpanded = (Boolean(date) || isAutoPicking) && !isOpen;
  // Event details are still on their way (first load only, not on errors).
  const isMetaLoading = !eventTypeSetting && !isAvailabilityError;
  // New date or refreshed times always start at the top of the list.
  const slotsScrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    slotsScrollRef.current?.scrollTo({ top: 0 });
  }, [date, incrementStep, timezone]);
  const slotsRef = useRef<HTMLDivElement>(null);

  const location = useMemo(
    () =>
      describeLocation(
        bookingToBeRescheduled?.location ||
          eventTypeSetting?.settings?.location ||
          eventTypeSetting?.settings?.locationType,
      ),
    [
      bookingToBeRescheduled?.location,
      eventTypeSetting?.settings?.location,
      eventTypeSetting?.settings?.locationType,
    ],
  );

  const selectedRange = useMemo(() => {
    if (!slot?.utcTime) return null;
    const end = addMinutes(
      new Date(slot.utcTime),
      Number(incrementStep ?? 0),
    ).toISOString();
    const timeFormat = activeTab === "24hr" ? "HH:mm" : "h:mmaaa";
    return {
      day: formatToTimeZone(slot.utcTime, timezone, "EEEE, MMMM d, yyyy"),
      time: `${formatToTimeZone(slot.utcTime, timezone, timeFormat)} – ${formatToTimeZone(end, timezone, timeFormat)}`,
    };
  }, [slot?.utcTime, incrementStep, timezone, activeTab]);

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <MotionConfig reducedMotion="user">
        <Shell
          $expanded={isExpanded}
          className="calendar-container"
          style={{
            direction: Array.isArray(direction) ? direction[0] : direction,
          }}
        >
          {/* ---------- Meta ---------- */}
          <MetaColumn>
            <AnimatePresence mode="wait" initial={false}>
              {isMetaLoading ? (
                <motion.div
                  key="meta-skeleton"
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  aria-busy="true"
                  aria-label="Loading event details"
                >
                  <Skeleton $w={44} $h={44} $r="50%" />
                  <SkeletonStack $gap={10} style={{ marginTop: 16 }}>
                    <Skeleton $w={96} $h={12} />
                    <Skeleton $w="85%" $h={20} />
                    <Skeleton $w="55%" $h={20} />
                  </SkeletonStack>
                </motion.div>
              ) : (
                <motion.div
                  key="meta-content"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <AvatarWrap>
                    <Avatar
                      src={
                        !isRoundRobin &&
                        eventTypeSetting?.expand?.user?.id &&
                        eventTypeSetting?.expand?.user?.avatar
                          ? getImage({
                              baseUrl: calenderUrl,
                              collectionName: collectionNames.users,
                              recordId: eventTypeSetting?.expand?.user?.id,
                              imageName: eventTypeSetting?.expand?.user?.avatar,
                            })
                          : ""
                      }
                      fallback={
                        isRoundRobin
                          ? teamName?.substring(0, 2)
                          : eventTypeSetting?.expand?.user?.name?.substring(
                              0,
                              2,
                            )
                      }
                      alt={eventTypeSetting?.expand?.user?.name}
                    />
                  </AvatarWrap>
                  <HostName>
                    {isRoundRobin ? teamName : availableDate?.userName}
                  </HostName>
                  <EventTitle>
                    {/* A reschedule shows the booking's own title ("… between host, attendee"). */}
                    {content?.bookingEventType ??
                      bookingToBeRescheduled?.title ??
                      eventTypeSetting?.settings?.title}
                  </EventTitle>
                </motion.div>
              )}
            </AnimatePresence>

            <DetailList>
              <DetailRow>
                <Clock />
                {isMetaLoading ? (
                  <Skeleton $w={132} $h={14} style={{ marginTop: 3 }} />
                ) : eventTypeSetting?.settings?.timeSlots?.length ? (
                  <DurationPicker
                    isOpen={isOpen}
                    eventTypeSetting={eventTypeSetting}
                    incrementStep={incrementStep}
                    setIncrementStep={setIncrementStep}
                    content={content}
                  />
                ) : (
                  <DetailText>
                    {formatSlotMinutes({
                      minutes: Number(incrementStep ?? 0),
                      ...(content ?? {}),
                    })}
                  </DetailText>
                )}
              </DetailRow>

              {isRescheduling && (
                <DetailRow>
                  <History />
                  <DetailText>
                    <small>Former time</small>
                    <s>
                      {formatToTimeZone(
                        bookingToBeRescheduled?.startTime as string,
                        timezone,
                      )}
                    </s>
                  </DetailText>
                </DetailRow>
              )}

              <AnimatePresence initial={false}>
                {selectedRange && (
                  <motion.div
                    key="selected-time"
                    initial={{ opacity: 0, height: 0, marginTop: -14 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 0 }}
                    exit={{ opacity: 0, height: 0, marginTop: -14 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    style={{ overflow: "hidden" }}
                  >
                    <DetailRow>
                      <CalendarCheck />
                      <DetailText>
                        <span>{selectedRange.day}</span>
                        <small>{selectedRange.time}</small>
                      </DetailText>
                    </DetailRow>
                  </motion.div>
                )}
              </AnimatePresence>

              {isMetaLoading && (
                <DetailRow>
                  <MapPin />
                  <Skeleton $w={112} $h={14} style={{ marginTop: 3 }} />
                </DetailRow>
              )}
              {location && (
                <DetailRow title={location.raw}>
                  {location.isUrl ? <Video /> : <MapPin />}
                  <DetailText>{location.label}</DetailText>
                </DetailRow>
              )}

              <DetailRow style={{ alignItems: "center" }}>
                <Globe style={{ marginTop: 0 }} />
                <TimezonePicker
                  value={timezone}
                  onChange={setTimezone}
                  date={date}
                  disabled={isOpen}
                />
              </DetailRow>
            </DetailList>
          </MetaColumn>

          {/* ---------- Calendar ---------- */}
          <MainColumn $hidden={isOpen} aria-hidden={isOpen}>
            <Calendar
              nextRef={nextRef}
              mode="single"
              selected={date}
              isLoading={isFetching || (Boolean(availableDate) && !slotsData)}
              onSelect={(date) => {
                hasAutoPickedRef.current = true;
                setIsAutoPicking(false);
                setDate(date);
                if (date) {
                  setSlot(undefined);
                  setShowSubmitButton(false);
                }
                // On stacked (mobile) layouts bring the times into view.
                if (
                  date &&
                  typeof window !== "undefined" &&
                  !window.matchMedia("(min-width: 1080px)").matches
                ) {
                  setTimeout(
                    () =>
                      slotsRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      }),
                    50,
                  );
                }
              }}
              fromMonth={new Date()}
              month={selectedMonth}
              onMonthChange={(month) => changeMonth(month)}
              disableBackNavigation={disableBackNavigation}
              overlay={
                isMonthEmpty && !willAutoAdvance ? (
                  <MonthEmptyOverlay
                    key={`empty-${monthKey}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.12 } }}
                    transition={{ duration: 0.25 }}
                  >
                    <MonthEmptyCard
                      as={motion.div}
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.35, ease: EASE, delay: 0.05 }}
                      role="status"
                    >
                      <CalendarX size={26} strokeWidth={1.5} />
                      <h4>
                        {content?.noAvailabilityIn ?? "No availability in"}{" "}
                        {format(selectedMonth, "MMMM")}
                      </h4>
                      <p>
                        {content?.tryNextMonth ??
                          "Try the next month or check back later."}
                      </p>
                      <MonthEmptyButton
                        type="button"
                        onClick={() => nextRef.current?.click()}
                      >
                        {content?.viewNextMonth ?? "View next month"}
                        <ChevronRight size={16} />
                      </MonthEmptyButton>
                    </MonthEmptyCard>
                  </MonthEmptyOverlay>
                ) : null
              }
              disabled={(day) => {
                // Days from neighbouring months are only rendered as spacers.
                if (
                  day.getMonth() !== selectedMonth.getMonth() ||
                  day.getFullYear() !== selectedMonth.getFullYear()
                ) {
                  return true;
                }
                return !hasAvailability(day);
              }}
            />
          </MainColumn>

          {/* ---------- Time slots ---------- */}
          <SlotsColumn
            ref={slotsRef}
            $expanded={isExpanded}
            $hidden={isOpen}
            aria-hidden={!isExpanded}
          >
            <AnimatePresence initial={false}>
              {(date || isAutoPicking) && (
                <SlotsInner
                  key="slots"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  transition={{ duration: 0.35, ease: "easeOut", delay: 0.15 }}
                >
                  <SlotsHeader>
                    {date ? (
                      <DayHeading>
                        {format(date, "EEE")} <span>{format(date, "dd")}</span>
                      </DayHeading>
                    ) : (
                      <Skeleton $w={64} $h={18} />
                    )}
                    <Tab
                      options={["12hr", "24hr"]}
                      activeTab={activeTab}
                      onChange={setActiveTab}
                      content={content}
                    />
                  </SlotsHeader>
                  <SlotsScroller ref={slotsScrollRef}>
                    {/* Crossfade: old and new lists overlap in one grid cell,
                        so there is no blank gap and nothing slides. */}
                    <SlotStack>
                      <AnimatePresence mode="wait">
                        {!date ? null : Number(availableTimeSlots?.length) >
                          0 ? (
                          <SlotList
                            // Keyed by the actual times: the list re-animates
                            // only when the times really change, and current
                            // times stay on screen while new ones load.
                            key={slotsKey}
                            variants={pillList}
                            initial="hidden"
                            animate="show"
                            exit="exit"
                          >
                            {availableTimeSlots?.map((time, index) => {
                              const isSelected = time.utcTime === slot?.utcTime;
                              return (
                                <motion.li
                                  key={time.utcTime}
                                  custom={index}
                                  variants={pill}
                                  style={{ transformOrigin: "50% 0%" }}
                                >
                                  <SlotRow>
                                    <SlotButton
                                      type="button"
                                      $selected={isSelected}
                                      aria-pressed={isSelected}
                                      onClick={() => {
                                        setSlot(time);
                                        // check if all question are answered if not open the form
                                        if (isAllAnswered) {
                                          setShowSubmitButton(true);
                                        } else {
                                          onOpen();
                                        }
                                      }}
                                    >
                                      {formatDisplayTime(time)
                                        .replace("am", content?.am ?? "am")
                                        .replace("pm", content?.pm ?? "pm")}
                                    </SlotButton>
                                    <AnimatePresence initial={false}>
                                      {showSubmitButton && isSelected && (
                                        <motion.div
                                          key="confirm"
                                          initial={{
                                            width: "0%",
                                            opacity: 0,
                                          }}
                                          animate={{
                                            width: "50%",
                                            opacity: 1,
                                          }}
                                          exit={{ width: "0%", opacity: 0 }}
                                          transition={{
                                            duration: 0.32,
                                            ease: [0.32, 0.72, 0, 1],
                                          }}
                                          style={{
                                            flexShrink: 0,
                                            overflow: "hidden",
                                            display: "flex",
                                          }}
                                        >
                                          <ConfirmButton
                                            type="button"
                                            disabled={isSubmitting}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              onSubmit(responses!);
                                            }}
                                          >
                                            {isSubmitting ? (
                                              <LoadingDots color="currentColor" />
                                            ) : (
                                              (content?.book ?? "Book")
                                            )}
                                          </ConfirmButton>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </SlotRow>
                                </motion.li>
                              );
                            })}
                          </SlotList>
                        ) : (
                          <EmptySlots key="slots-empty" {...listFade}>
                            <CalendarX size={28} strokeWidth={1.5} />
                            {content?.noAvailableSlots ??
                              "No available time slots for this date"}
                          </EmptySlots>
                        )}
                      </AnimatePresence>
                    </SlotStack>
                  </SlotsScroller>
                </SlotsInner>
              )}
            </AnimatePresence>
          </SlotsColumn>

          {/* ---------- Booking form ---------- */}
          <AnimatePresence>
            {isOpen && (
              <FormArea
                key="booking-form"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24, transition: { duration: 0.15 } }}
                transition={{ duration: 0.35, ease: EASE, delay: 0.08 }}
              >
                <FormInner>
                  <DynamicForm
                    onBack={() => {
                      setSlot(undefined);
                      onClose();
                    }}
                    fields={eventTypeSetting?.settings?.bookingQuestions!}
                    bookingQuestions={bookingQuestions}
                    onSubmit={onSubmit}
                    isLoading={isSubmitting}
                    content={content}
                    setBookingQuestions={setBookingQuestions}
                  />
                </FormInner>
              </FormArea>
            )}
          </AnimatePresence>
        </Shell>
      </MotionConfig>
    </ThemeProvider>
  );
};

const EASE = [0.22, 1, 0.36, 1] as const;
const MAX_AUTO_ADVANCE = 3;

type AvailabilityResponse = {
  availableDates: Array<number>;
  slots: DateSlots;
  eventTypeSetting: EventTypeSettings;
  availability: Availability;
  currentDate: string;
  userName: string;
};
type AvailabilityParams = {
  year: number;
  month: number;
  incrementStep?: number;
  timezone: string;
};

// Slot pills: on change, the current pills settle away together (fast, no
// stagger); then the new pills rise into place one after another with a small
// scale + blur settle. Lists never overlap, and the exit is short enough that
// it reads as one continuous motion rather than an empty flash.
const wave = (index: number) => Math.min(index, 10) * 0.035;
const pillList = {
  hidden: {},
  show: {},
  exit: {
    opacity: 0,
    scale: 0.98,
    filter: "blur(2px)",
    transition: { duration: 0.12, ease: "easeIn" },
  },
};
const pill = {
  hidden: { opacity: 0, y: 12, scale: 0.96, filter: "blur(3px)" },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      delay: 0.02 + wave(index),
      duration: 0.42,
      ease: EASE,
      filter: { delay: 0.02 + wave(index), duration: 0.3 },
    },
  }),
};

// One calm opacity crossfade for every slot-list swap (date change, refresh,
// loading placeholders). No movement, no per-item stagger.
const listFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.22, ease: "easeOut" } },
  exit: {
    opacity: 0,
    pointerEvents: "none",
    transition: { duration: 0.16, ease: "easeIn" },
  },
} as const;

const describeLocation = (raw?: string) => {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return { raw, isUrl: true, label: url.host.replace(/^www\./, "") };
    }
  } catch {
    // not a URL
  }
  const label = raw
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return { raw, isUrl: false, label };
};

type DurationPickerProps = {
  eventTypeSetting: EventTypeSettings;
  incrementStep: number | undefined;
  setIncrementStep: (step: number) => void;
  isOpen: boolean | undefined;
  content?: ContentType;
};
const DurationPicker = ({
  eventTypeSetting,
  incrementStep,
  isOpen,
  content,
  setIncrementStep,
}: DurationPickerProps) => {
  const durations = useMemo(() => {
    let sorted = [...(eventTypeSetting?.settings?.timeSlots ?? [])].sort(
      (a, b) => a - b,
    );
    if (incrementStep && isOpen) {
      sorted = sorted.filter((slot) => slot === incrementStep);
    }
    return sorted;
  }, [eventTypeSetting?.settings?.timeSlots, incrementStep, isOpen]);

  return (
    <DurationChips>
      {durations.map((minutes) => (
        <DurationChip
          key={minutes}
          type="button"
          $active={incrementStep === minutes}
          aria-pressed={incrementStep === minutes}
          onClick={() => setIncrementStep(minutes)}
        >
          {formatSlotMinutes({ minutes, ...(content ?? {}) })}
        </DurationChip>
      ))}
    </DurationChips>
  );
};
