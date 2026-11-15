// Booking types, trimmed from the Kalendra frontend's utils/types.ts to what the calendar reads.

export type User = {
  collectionId: string;
  collectionName: string;
  created: string;
  email: string;
  emailVisibility: boolean;
  id: string;
  name: string;
  updated: string;
  username: string;
  verified: boolean;
  avatar: string;
  timezone: string;
  bio: string;
  theme: string;
  weekStart: string;
};

export type EventType = {
  id: string;
  title: string;
  description: string;
  length: number;
  minimumNotice: number;
  minimumNoticeType: string;
  location: string;
  locationType: "google-meet" | "link";
  timeSlots: number[];
  bookingQuestions: Array<any>;
  defaultDuration?: number | string;
  organization: string;
  type: string;
  limitFutureBookingsEnabled?: boolean;
  limitFutureBookingsMode?: "rolling" | "dateRange";
  limitFutureBookingsValue?: number;
  limitFutureBookingsUnit?: "calendar_days" | "business_days" | "weeks" | "months";
  businessWeekStartDay?: number;
  businessWeekEndDay?: number;
  limitFutureBookingsAlwaysAvailable?: boolean;
  limitFutureBookingsStartDate?: string;
  limitFutureBookingsEndDate?: string;
};

export type EventTypeSettings = {
  id: string;
  event_type: string;
  expand: {
    user: User;
  };
  user: string;
  settings: EventType;
  member: string;
};

export type DateOverrides = {
  availability: {
    start: string;
    end: string;
  }[];
  date: string;
};

export type Availability = {
  id: string;
  name: string;
  availability: {
    start: string;
    end: string;
    user?: string;
  }[][];
  timezone: string;
  isDefault: boolean;
  isLastSchedule: boolean;
  readOnly: boolean;
  isActive: boolean;
  incrementStep: number;
  isManaged: boolean;
  dateOverrides: DateOverrides[];
  expand: {
    user: User;
  };
  user: string;
};

export type QuestionType =
  | "text"
  | "textarea"
  | "dropdown"
  | "multipleChoice"
  | "checkbox"
  | "number"
  | "phone"
  | "email"
  | "color";

export interface BookingQuestionOption {
  id: string;
  value: string;
}

export interface BookingQuestionType {
  id: string;
  type: QuestionType;
  label: string;
  required: boolean;
  placeholder?: string;
  defaultValue?: string;
  options?: BookingQuestionOption[];
  identifier?: string;
  disableIfPrefilled?: boolean;
  platformMandatory?: boolean;
  hidden?: boolean;
}

export type Booking = {
  attendees: Array<{ email: string; name: string; host: boolean }>;
  cancelReason: string;
  collectionId: string;
  collectionName: string;
  created: string;
  description: string;
  endTime: string;
  eventType: string;
  id: string;
  location: string;
  recurring: boolean;
  responses: object;
  startTime: string;
  status: "confirmed" | "cancelled" | "unconfirmed" | "rescheduled";
  title: string;
  updated: string;
  user: string;
  expand: {
    availability_via_user: Availability;
  };
  duration: number;
  rescheduledBy: string;
  meetingStartTime: string;
};

/** The booking body the calendar sends to Kalendra, or hands to onSubmitBooking. */
export type BookingDraft = {
  responses: Record<string, any>;
  eventType: string | undefined;
  user: string | undefined;
  attendees: Array<{ email: string | undefined; name: string | undefined; host: boolean }>;
  startTime: string | undefined;
  endTime: Date;
  status: Booking["status"];
  recurring: boolean;
  title: string;
  description: string | undefined;
  location: string | undefined;
  duration: number | undefined;
  inviteesTimezone: string;
  inviteeFormattedStartTime: string;
  hostFormattedStartTime: string;
  /** The booking being moved, when rescheduling. */
  bookingId?: string;
};

export type Slot = {
  formattedTime: string;
  utcTime: string;
  user: string | undefined;
  users?: string[];
  available?: boolean;
  unavailableReason?: "external_calendar_conflict";
};

export type Option = {
  label: string;
  value: string;
};

export type DateSlots = {
  [key: string]: {
    formattedTime: string;
    utcTime: string;
    originalDate: string;
    user: string | undefined;
    users?: string[];
    available?: boolean;
    unavailableReason?: "external_calendar_conflict";
  }[];
};

/** Kalendra's /event-type/single answer. */
export type GetEventTypeRes = {
  type: string;
  members: {
    id: string;
    user: string;
  }[];
  organization: string;
  teamName: string;
};

/** Kalendra's /bookings/get-one answer. */
export type GetBookingRes = {
  booking: Booking;
  organization: string;
};

export type ThemeMode = "light" | "dark";
