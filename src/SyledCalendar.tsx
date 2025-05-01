import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import styled from "styled-components";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  nextRef?: React.Ref<HTMLButtonElement>;
};

const CalendarContainer = styled.div`
  border-radius: 12px;
  background-color: ${(props: any) => props.theme.colors.background};
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  @media (max-width: 640px) {
    max-width: 320px;
    scale: 0.8;
  }
`;

const StyledDayPicker = styled(DayPicker)`
  .rdp-table,
  .rdp-tbody,
  .rdp-head {
    background-color: ${(props: any) => props.theme.colors.background};
  }
  .rdp-months {
    display: flex;
    flex-direction: column;
    gap: 16px;
    @media (min-width: 640px) {
      flex-direction: row;
    }
    justify-content: center;
  }

  .rdp-day_today {
    position: relative;
  }
  .rdp-day_today::after {
    content: "";
    position: absolute;
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${(props: any) =>
      props.theme.colors.currentDayIndicator} !important;
  }

  .rdp-caption {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 4px 0;
    font-size: 1rem;
    font-weight: 500;
    color: ${(props: any) => props.theme.colors.text};
  }

  .rdp-nav {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .rdp-nav-button {
    width: 28px;
    height: 28px;
    background: transparent;
    border: none;
    cursor: pointer;
    opacity: 0.5;
    &:hover {
      opacity: 1;
    }
  }

  .rdp-table {
    width: 100%;
    border-collapse: collapse;
  }

  .rdp-cell {
    text-align: center;
    font-size: 0.875rem;
    padding: 0;
    height: 48px;
  }
  .rdp-row,
  .rdp-head_row {
    border-bottom: none;
  }
  .rdp-day {
    width: 48px;
    height: 48px;
    margin: 4px;
    border-radius: 6px;
    border: none;
    font-size: 1.125rem;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    color: ${(props: any) => props.theme.colors.text};
    background-color: ${(props: any) => props.theme.colors.dayBg};
    border: 1px solid ${(props: any) => props.theme.colors.transparent};
    &:hover {
      border: 1px solid ${(props: any) => props.theme.colors.dayHoverBg};
      // color: ${(props: any) => props.theme.colors.dayHoverText};
    }
    @media (max-width: 640px) {
      width: 35px;
      height: 35px;
    }
  }

  .rdp-day_selected {
    background-color: ${(props: any) => props.theme.colors.daySelectedBg};
    color: ${(props: any) => props.theme.colors.daySelectedText};
    font-weight: bold;
  }

  .rdp-head_cell {
    color: ${(props: any) => props.theme.colors.text};
  }

  .rdp-day_disabled {
    color: ${(props: any) => props.theme.colors.text};
    opacity: 0.5;
    cursor: default;
    background-color: ${(props: any) => props.theme.colors.transparent};
    border: none;
    &:hover {
      background-color: ${(props: any) => props.theme.colors.transparent};
      color: ${(props: any) => props.theme.colors.text};
      border: none;
    }
  }

  .rdp-day_range_middle {
    background-color: ${(props: any) => props.theme.colors.dayRangeMiddle};
    color: ${(props: any) => props.theme.colors.daySelectedText};
  }
  .rdp-nav_button_next {
    position: absolute;
    right: 4px;
    border: none;
    background-color: ${(props: any) => props.theme.colors.transparent};
    border-radius: 8px;
    padding: 2px;
    transition: all 0.2s ease-in-out;
    &:hover {
      background-color: ${(props: any) => props.theme.colors.dayBg};
      transition: all 0.2s ease-in-out;
    }
    color: ${(props: any) => props.theme.colors.text};
    cursor: pointer;
  }
  .rdp-nav_button_previous {
    position: absolute;
    left: 4px;
    border: none;
    background-color: ${(props: any) => props.theme.colors.transparent};
    padding: 2px;
    border-radius: 8px;
    &:hover {
      background-color: ${(props: any) => props.theme.colors.dayBg};
      transition: all 0.2s ease-in-out;
    }
    color: ${(props: any) => props.theme.colors.text};
    cursor: pointer;
  }
`;

function Calendar({ className, nextRef, ...props }: CalendarProps) {
  return (
    <CalendarContainer>
      <StyledDayPicker
        {...props}
        components={{
          // @ts-ignore
          IconLeft: ({ className, ...props }: any) => (
            <ChevronLeft className={className} {...props} />
          ),
          IconRight: ({ className, ...props }: any) => (
            <button
              className={className}
              {...props}
              ref={nextRef}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "2px",
              }}
            >
              <ChevronRight />
            </button>
          ),
        }}
      />
    </CalendarContainer>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
