"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import styled from "styled-components";
import { addMonths, format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  nextRef?: React.Ref<HTMLButtonElement>;
  disableBackNavigation?: boolean;
  isLoading?: boolean;
  /** Keyed element shown over the month grid (e.g. an empty-month notice). */
  overlay?: React.ReactNode;
};

const EASE = [0.22, 1, 0.36, 1] as const;

const CalendarRoot = styled.div`
  width: 100%;
  direction: ltr;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  margin-bottom: 20px;
`;

const MonthLabelWrap = styled.div`
  position: relative;
  overflow: hidden;
  height: 24px;
  flex: 1;
`;

const MonthLabel = styled(motion.h2)`
  position: absolute;
  inset: 0;
  margin: 0;
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
  letter-spacing: -0.01em;
  white-space: nowrap;
  color: ${(p) => p.theme.colors.text};
  span {
    font-weight: 500;
    color: ${(p) => p.theme.colors.textMuted};
  }
`;

const Nav = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const NavButton = styled.button`
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: ${(p) => p.theme.colors.text};
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    opacity 0.15s ease,
    transform 0.1s ease;
  &:hover:not(:disabled) {
    background: ${(p) => p.theme.colors.subtle};
  }
  &:active:not(:disabled) {
    transform: scale(0.92);
  }
  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.primary};
    outline-offset: 2px;
  }
`;

const StyledDayPicker = styled(DayPicker)(
  (props) => `
  margin: 0;
  .rdp-months, .rdp-month { width: 100%; }
  .rdp-table {
    width: 100%;
    max-width: none;
    border-collapse: separate;
    border-spacing: 0;
    table-layout: fixed;
  }
  .rdp-head_cell {
    padding-bottom: 10px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-align: center;
    color: ${props.theme.colors.textMuted};
  }
  .rdp-cell {
    padding: 3px;
    text-align: center;
  }
  .rdp-day {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 56px;
    aspect-ratio: 1 / 1;
    margin: 0 auto;
    border: 1.5px solid transparent;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: ${props.theme.colors.text};
    background-color: ${props.theme.colors.available};
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      color 0.2s ease,
      border-color 0.15s ease,
      box-shadow 0.2s ease,
      transform 0.12s ease;
  }
  .rdp-day:not([disabled]):hover {
    border-color: ${props.theme.colors.primary};
  }
  .rdp-day:not([disabled]):active {
    transform: scale(0.93);
  }
  .rdp-day:focus-visible {
    outline: 2px solid ${props.theme.colors.primary};
    outline-offset: 2px;
  }
  .rdp-day[disabled],
  .rdp-day_disabled {
    background-color: transparent;
    color: ${props.theme.colors.textSubtle};
    font-weight: 400;
    cursor: default;
  }
  .rdp-day_selected,
  .rdp-day_selected:not([disabled]):hover {
    background-color: ${props.theme.colors.primary};
    border-color: ${props.theme.colors.primary};
    color: ${props.theme.colors.primaryText};
    box-shadow: ${props.theme.shadows.pop};
    animation: rdpDayPop 0.32s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .rdp-day_today::after {
    content: "";
    position: absolute;
    bottom: 15%;
    left: 50%;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    transform: translateX(-50%);
    background-color: ${props.theme.colors.todayIndicator};
  }
  .rdp-day_today.rdp-day_selected::after {
    background-color: ${props.theme.colors.primaryText};
  }
  .rdp-day_outside {
    visibility: hidden;
  }
  @keyframes rdpDayPop {
    0% { transform: scale(0.9); }
    60% { transform: scale(1.04); }
    100% { transform: scale(1); }
  }
  @keyframes rdpDayPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.45; }
  }
  @media (prefers-reduced-motion: reduce) {
    .rdp-day, .rdp-day_selected { transition: none; animation: none; }
  }
`,
);

const MonthViewport = styled.div<{ $loading?: boolean }>`
  position: relative;
  ${(p) =>
    p.$loading
      ? `
    .rdp-row:nth-child(2) { --r: 1; } .rdp-row:nth-child(3) { --r: 2; }
    .rdp-row:nth-child(4) { --r: 3; } .rdp-row:nth-child(5) { --r: 4; }
    .rdp-row:nth-child(6) { --r: 5; }
    .rdp-cell:nth-child(2) { --c: 1; } .rdp-cell:nth-child(3) { --c: 2; }
    .rdp-cell:nth-child(4) { --c: 3; } .rdp-cell:nth-child(5) { --c: 4; }
    .rdp-cell:nth-child(6) { --c: 5; } .rdp-cell:nth-child(7) { --c: 6; }
    .rdp-day:not(.rdp-day_outside) {
      background-color: ${p.theme.colors.subtle};
      color: ${p.theme.colors.textSubtle};
      animation: rdpDayPulse 1.4s ease-in-out infinite;
      animation-delay: calc((var(--r, 0) + var(--c, 0)) * 70ms);
    }
  `
      : ""}
`;

function Calendar({
  nextRef,
  disableBackNavigation,
  isLoading,
  overlay,
  month,
  onMonthChange,
  ...props
}: CalendarProps) {
  const current = month ?? new Date();
  const monthKey = format(current, "yyyy-MM");

  // Direction of the last month change: drives the slide direction.
  const prevMonth = React.useRef(current);
  const direction =
    current > prevMonth.current ? 1 : current < prevMonth.current ? -1 : 0;
  React.useEffect(() => {
    prevMonth.current = current;
  }, [monthKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const go = (delta: number) => onMonthChange?.(addMonths(current, delta));

  return (
    <CalendarRoot>
      <Header>
        <MonthLabelWrap>
          <AnimatePresence initial={false} custom={direction}>
            <MonthLabel
              key={monthKey}
              initial={{ opacity: 0, y: direction >= 0 ? 10 : -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: direction >= 0 ? -10 : 10 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              {format(current, "MMMM")} <span>{format(current, "yyyy")}</span>
            </MonthLabel>
          </AnimatePresence>
        </MonthLabelWrap>
        <Nav>
          <NavButton
            type="button"
            aria-label="Previous month"
            disabled={disableBackNavigation}
            onClick={() => go(-1)}
          >
            <ChevronLeft size={18} />
          </NavButton>
          <NavButton
            ref={nextRef}
            type="button"
            aria-label="Next month"
            onClick={() => go(1)}
          >
            <ChevronRight size={18} />
          </NavButton>
        </Nav>
      </Header>
      <MonthViewport $loading={isLoading}>
        <motion.div
          key={monthKey}
          initial={{ opacity: 0, x: direction * 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          <StyledDayPicker
            {...props}
            month={current}
            onMonthChange={onMonthChange}
            fixedWeeks
            showOutsideDays
            formatters={{ formatWeekdayName: (d) => format(d, "EEE") }}
            components={{ Caption: () => null }}
          />
        </motion.div>
        <AnimatePresence>{overlay}</AnimatePresence>
      </MonthViewport>
    </CalendarRoot>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
