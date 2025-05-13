import type { CSSProperties } from "react";
import type {
  Availability,
  Booking,
  ContentType,
  DateOverrides,
} from "../types";
import type { DefaultTheme } from "styled-components";
import type { Direction } from "src/Core/common/types";

export type DynamicFormTypes = {
  disableIfPrefilled: boolean;
  id: string;
  identifier: string;
  label: string;
  options: {
    id: string;
    value: string;
  }[];
  required: boolean;
  type: string;
  placeholder: string;
  hidden?: boolean;
  disallowSpecialChars?: boolean;
  maxLength?: number;
};

export interface Accumulator extends Partial<Availability> {
  availability: {
    start: string;
    end: string;
    user?: string;
  }[][];
  dateOverrides: Array<DateOverrides>;
}

export interface BookingProps {
  kalendra_user_id?: string;
  eventTypeId: string;
  responses?: any;
  duration?: number;
  onSuccess?: (fulfilled: Booking | undefined) => void;
  onError?: (error: any) => void;
  theme?: DefaultTheme;
  styles?: CSSProperties;
  bookingToBeRescheduledId?: string;
  LoadingIndicator?: JSX.Element;
  NoEventError?: JSX.Element;
  isError?: boolean;
  content?: ContentType | undefined;
  direction?: Direction | Array<Direction> | undefined;
  teamName: string | undefined;
}
