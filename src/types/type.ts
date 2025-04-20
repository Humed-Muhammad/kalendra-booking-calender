import { CSSProperties } from "react";
import { Availability, Booking, DateOverrides } from "../types";
import { DefaultTheme } from "styled-components";

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
}
