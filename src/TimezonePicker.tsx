import {
  type KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { format } from "date-fns";
import { Check, ChevronDown, Search } from "lucide-react";
import { listTimezones, matchesTimezone, type TimezoneOption } from "./timezones";
import { browserTimezone } from "./utils";

type Zone = TimezoneOption;

type Row = { zone: Zone; isYours?: boolean };

/** Scrolls the list only; scrollIntoView would also scroll the page (and slide rows under a resting pointer). */
const scrollOptionIntoView = (list: HTMLElement | null, index: number, center = false) => {
  const option = list?.children[index] as HTMLElement | undefined;
  if (!list || !option) return;
  const top = option.offsetTop;
  const bottom = top + option.offsetHeight;
  if (center) list.scrollTop = top - (list.clientHeight - option.offsetHeight) / 2;
  else if (top < list.scrollTop) list.scrollTop = top;
  else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight;
};

const LIST_MAX_HEIGHT = 280;
const LIST_MIN_HEIGHT = 120;
// Search box, footer and the gap to the trigger.
const POPOVER_CHROME = 110;

type Props = {
  value: string;
  onChange: (timezone: string) => void;
  /** The day being booked: offsets are shown for that day. Defaults to today. */
  date?: Date;
  disabled?: boolean;
};

/** Timezone picker: country, city and the GMT offset on the booked day; A–Z by country, searchable. */
export const TimezonePicker = ({ value, onChange, date, disabled }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  // Stable per instance (useId needs React 18; the peer range allows 17).
  const listId = useRef(
    `kalendra-tz-${Math.random().toString(36).slice(2, 8)}`,
  ).current;

  const day = date ?? new Date();
  const dayKey = day.toDateString();
  const yours = browserTimezone;
  // The picked and the viewer's zones may be aliases outside zone.tab, so they're added.
  // Recompute only when the day (not the Date instance) changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const zones = useMemo(() => listTimezones(day, [value, yours]), [dayKey, value, yours]);

  const selected = zones.find((zone) => zone.value === value);

  const rows = useMemo<Row[]>(() => {
    if (query.trim()) {
      return zones.filter((zone) => matchesTimezone(zone, query)).map((zone) => ({ zone }));
    }
    // With no search, the viewer's own zone is pinned on top (when it isn't the one picked).
    const yourZone =
      yours && yours !== value
        ? zones.find((zone) => zone.value === yours)
        : undefined;
    return [
      ...(yourZone ? [{ zone: yourZone, isYours: true }] : []),
      ...zones.map((zone) => ({ zone })),
    ];
  }, [query, zones, yours, value]);

  // Opens upward when there's more room above; the list then fits the room it gets.
  const [placement, setPlacement] = useState({ up: false, listMaxHeight: LIST_MAX_HEIGHT });
  const open = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      const below = window.innerHeight - rect.bottom;
      const above = rect.top;
      const up = below < LIST_MAX_HEIGHT + POPOVER_CHROME && above > below;
      const room = (up ? above : below) - POPOVER_CHROME;
      setPlacement({ up, listMaxHeight: Math.max(LIST_MIN_HEIGHT, Math.min(LIST_MAX_HEIGHT, room)) });
    }
    setIsOpen(true);
  };

  const close = (refocus = false) => {
    setIsOpen(false);
    setQuery("");
    if (refocus) triggerRef.current?.focus();
  };

  const pick = (zone: Zone) => {
    onChange(zone.value);
    close(true);
  };

  // On open, start on the picked zone and bring it into view.
  useEffect(() => {
    if (!isOpen) return;
    const index = rows.findIndex(
      (row) => row.zone.value === value && !row.isYours,
    );
    setActiveIndex(Math.max(index, 0));
    requestAnimationFrame(() =>
      scrollOptionIntoView(listRef.current, Math.max(index, 0), true),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // A new search starts at the first match.
  useEffect(() => setActiveIndex(0), [query]);

  useEffect(() => {
    scrollOptionIntoView(listRef.current, activeIndex);
  }, [activeIndex]);

  // Close on a click outside.
  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const onSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, rows.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (rows[activeIndex]) pick(rows[activeIndex].zone);
    } else if (event.key === "Escape") {
      event.preventDefault();
      close(true);
    }
  };

  return (
    <Root ref={rootRef}>
      <Trigger
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        title={selected ? `${selected.city}, ${selected.country} (${value})` : value}
        onClick={() => (isOpen ? close() : open())}
      >
        <TriggerCity>{selected?.city ?? (value || "Pick a timezone")}</TriggerCity>
        {selected && <Offset>{selected.offsetLabel}</Offset>}
        <Chevron $open={isOpen} aria-hidden />
      </Trigger>

      {isOpen && (
        <Popover $up={placement.up}>
          <SearchBox>
            <Search aria-hidden />
            <input
              autoFocus
              role="combobox"
              aria-expanded
              aria-controls={listId}
              aria-activedescendant={
                rows[activeIndex] ? `${listId}-${activeIndex}` : undefined
              }
              placeholder="Country, city or GMT offset"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={onSearchKeyDown}
            />
          </SearchBox>

          {rows.length ? (
            <List ref={listRef} id={listId} role="listbox" style={{ maxHeight: placement.listMaxHeight }}>
              {rows.map((row, index) => {
                const isSelected = row.zone.value === value;
                return (
                  <Option
                    key={`${row.isYours ? "yours-" : ""}${row.zone.value}`}
                    id={`${listId}-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    $active={index === activeIndex}
                    $divider={Boolean(row.isYours)}
                    // Move, not enter: a list scrolling under a still pointer mustn't steal the highlight.
                    onMouseMove={() => index !== activeIndex && setActiveIndex(index)}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => pick(row.zone)}
                  >
                    <OptionText>
                      <span>{row.zone.country}</span>
                      <small>
                        {row.isYours ? `Your timezone · ${row.zone.detail}` : row.zone.detail}
                      </small>
                    </OptionText>
                    <Offset>{row.zone.offsetLabel}</Offset>
                    <CheckSlot aria-hidden>
                      {isSelected && <Check />}
                    </CheckSlot>
                  </Option>
                );
              })}
            </List>
          ) : (
            <Empty>No timezone matches “{query}”</Empty>
          )}

          <Footer>Offsets on {format(day, "d MMM yyyy")}, daylight saving included</Footer>
        </Popover>
      )}
    </Root>
  );
};

const Root = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
`;

const Trigger = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  margin: 0;
  padding: 2px 0;
  border: 0;
  background: transparent;
  color: ${(p) => p.theme.colors.text};
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.primary};
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

const TriggerCity = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Offset = styled.span`
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  color: ${(p) => p.theme.colors.textMuted};
`;

const Chevron = styled(ChevronDown)<{ $open: boolean }>`
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  color: ${(p) => p.theme.colors.textMuted};
  transform: rotate(${(p) => (p.$open ? 180 : 0)}deg);
  transition: transform 0.2s ease;
`;

const Popover = styled.div<{ $up: boolean }>`
  position: absolute;
  ${(p) => (p.$up ? "bottom" : "top")}: calc(100% + 8px);
  left: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  width: 300px;
  max-width: calc(100vw - 32px);
  overflow: hidden;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 12px;
  background: ${(p) => p.theme.colors.background};
  box-shadow: ${(p) => p.theme.shadows.lg};
`;

const SearchBox = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px;
  padding: 0 10px;
  height: 36px;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 8px;
  color: ${(p) => p.theme.colors.textMuted};
  &:focus-within {
    border-color: ${(p) => p.theme.colors.primary};
  }
  svg {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
  }
  input {
    flex: 1;
    min-width: 0;
    margin: 0;
    padding: 0;
    border: 0;
    outline: 0;
    background: transparent;
    color: ${(p) => p.theme.colors.text};
    font: inherit;
    font-size: 14px;
  }
`;

const List = styled.ul`
  position: relative;
  margin: 0;
  padding: 0 4px 4px;
  overflow-y: auto;
  overscroll-behavior: contain;
  list-style: none;
`;

const Option = styled.li<{ $active: boolean; $divider: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
  background: ${(p) => (p.$active ? p.theme.colors.subtle : "transparent")};
  ${(p) =>
    p.$divider &&
    `margin-bottom: 4px; box-shadow: 0 1px 0 0 ${p.theme.colors.border};`}
`;

const OptionText = styled.span`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    font-weight: 500;
    color: ${(p) => p.theme.colors.text};
  }
  small {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
    color: ${(p) => p.theme.colors.textMuted};
  }
`;

const CheckSlot = styled.span`
  display: flex;
  flex-shrink: 0;
  width: 16px;
  color: ${(p) => p.theme.colors.primary};
  svg {
    width: 16px;
    height: 16px;
  }
`;

const Empty = styled.p`
  margin: 0;
  padding: 16px;
  text-align: center;
  font-size: 13px;
  color: ${(p) => p.theme.colors.textMuted};
`;

const Footer = styled.p`
  margin: 0;
  padding: 8px 12px;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  font-size: 11px;
  color: ${(p) => p.theme.colors.textSubtle};
`;
