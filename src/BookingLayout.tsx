import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";

export const META_WIDTH = 280;
export const MAIN_WIDTH = 460;
export const SLOTS_WIDTH = 280;
export const DESKTOP = "@media (min-width: 1080px)";

const hiddenWhen = (hidden?: boolean) =>
  hidden
    ? `
  display: none;
  ${DESKTOP} {
    display: block;
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.18s ease, visibility 0s linear 0.18s;
  }`
    : `
  ${DESKTOP} {
    visibility: visible;
    opacity: 1;
    transition: opacity 0.25s ease 0.1s;
  }`;

/** The card. On desktop its width animates when the time column opens. */
export const Shell = styled.div<{ $expanded: boolean }>`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  width: 100%;
  max-width: 520px;
  /* Mobile: natural height, the page itself scrolls (no trapped inner scroll). */
  background: ${(p) => p.theme.colors.background};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 16px;
  box-shadow: ${(p) => p.theme.shadows.card};
  color: ${(p) => p.theme.colors.text};

  ${DESKTOP} {
    max-width: none;
    grid-template-columns: ${META_WIDTH}px ${MAIN_WIDTH}px minmax(0, 1fr);
    width: ${(p) =>
      META_WIDTH + MAIN_WIDTH + (p.$expanded ? SLOTS_WIDTH : 0) + 2}px;
    transition: width 0.5s cubic-bezier(0.32, 0.72, 0, 1);
  }
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const MetaColumn = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  min-width: 0;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  ${DESKTOP} {
    border-bottom: none;
    grid-column: 1;
    grid-row: 1;
  }
`;

export const MainColumn = styled.div<{ $hidden?: boolean }>`
  padding: 20px 16px;
  min-width: 0;
  ${DESKTOP} {
    padding: 24px;
    grid-column: 2;
    grid-row: 1;
    border-left: 1px solid ${(p) => p.theme.colors.border};
  }
  ${(p) => hiddenWhen(p.$hidden)}
`;

export const SlotsColumn = styled.div<{
  $expanded: boolean;
  $hidden?: boolean;
}>`
  position: relative;
  min-width: 0;
  display: ${(p) => (p.$expanded ? "block" : "none")};
  border-top: 1px solid ${(p) => p.theme.colors.border};
  ${DESKTOP} {
    display: block;
    grid-column: 3;
    grid-row: 1;
    overflow: hidden;
    border-top: none;
    box-shadow: inset 1px 0 0
      ${(p) => (p.$expanded ? p.theme.colors.border : "transparent")};
  }
  ${(p) => hiddenWhen(p.$hidden)}
`;

export const SlotsInner = styled(motion.div)`
  display: flex;
  flex-direction: column;
  padding-top: 20px;
  ${DESKTOP} {
    position: absolute;
    top: 0;
    bottom: 0;
    inset-inline-start: 0;
    width: ${SLOTS_WIDTH}px;
    padding-top: 24px;
  }
`;

export const SlotsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  height: 32px;
  padding: 0 20px;
  margin-bottom: 12px;
`;

export const DayHeading = styled.h3`
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

export const SlotsScroller = styled.div`
  padding: 6px 20px 20px;
  ${DESKTOP} {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
    -webkit-mask-image: linear-gradient(
      to bottom,
      transparent 0,
      #000 12px,
      #000 calc(100% - 28px),
      transparent 100%
    );
    mask-image: linear-gradient(
      to bottom,
      transparent 0,
      #000 12px,
      #000 calc(100% - 28px),
      transparent 100%
    );
  }
`;

export const SlotList = styled(motion.ul)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const EmptySlots = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 32px 8px;
  text-align: center;
  font-size: 14px;
  color: ${(p) => p.theme.colors.textMuted};
  svg {
    color: ${(p) => p.theme.colors.textSubtle};
  }
`;

export const FormArea = styled(motion.div)`
  min-width: 0;
  padding: 20px 16px;
  ${DESKTOP} {
    position: relative;
    grid-column: 2;
    grid-row: 1;
    padding: 0;
    border-left: 1px solid ${(p) => p.theme.colors.border};
  }
`;

export const FormInner = styled.div`
  display: flex;
  flex-direction: column;
  ${DESKTOP} {
    position: absolute;
    inset: 0;
    padding: 24px 16px;
  }
`;

/* ---------- Meta column pieces ---------- */

export const HostName = styled.p`
  margin: 12px 0 2px;
  font-size: 14px;
  font-weight: 500;
  color: ${(p) => p.theme.colors.textMuted};
`;

export const EventTitle = styled.h1`
  margin: 0;
  font-size: 20px;
  line-height: 28px;
  font-weight: 600;
  letter-spacing: -0.015em;
  overflow-wrap: anywhere;
  color: ${(p) => p.theme.colors.text};
`;

export const DetailList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 20px;
`;

export const DetailRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  min-width: 0;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  color: ${(p) => p.theme.colors.text};
  > svg {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    margin-top: 2px;
    color: ${(p) => p.theme.colors.textMuted};
  }
`;

export const DetailText = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow-wrap: anywhere;
  small {
    font-size: 13px;
    font-weight: 400;
    color: ${(p) => p.theme.colors.textMuted};
  }
  s {
    font-weight: 400;
    color: ${(p) => p.theme.colors.textMuted};
  }
`;

export const DurationChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const DurationChip = styled.button<{ $active: boolean }>`
  height: 28px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid
    ${(p) => (p.$active ? p.theme.colors.available : p.theme.colors.border)};
  background: ${(p) =>
    p.$active ? p.theme.colors.available : p.theme.colors.background};
  color: ${(p) => (p.$active ? p.theme.colors.text : p.theme.colors.textMuted)};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
  &:hover {
    border-color: ${(p) => p.theme.colors.primary};
    color: ${(p) => p.theme.colors.text};
  }
  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const AvatarWrap = styled.div`
  & > div {
    width: 44px;
    height: 44px;
    background-color: ${(p) => p.theme.colors.available};
    color: ${(p) => p.theme.colors.text};
    box-shadow:
      0 0 0 3px ${(p) => p.theme.colors.background},
      0 0 0 4px ${(p) => p.theme.colors.border};
  }
`;

/* ---------- Loading skeletons ---------- */

const shimmer = keyframes`
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
`;

/** A shimmering placeholder block. Size it with width/height/radius props. */
export const Skeleton = styled.span<{
  $w?: number | string;
  $h?: number | string;
  $r?: number | string;
}>`
  display: block;
  flex-shrink: 0;
  width: ${(p) => (typeof p.$w === "number" ? `${p.$w}px` : (p.$w ?? "100%"))};
  height: ${(p) => (typeof p.$h === "number" ? `${p.$h}px` : (p.$h ?? "14px"))};
  border-radius: ${(p) =>
    typeof p.$r === "number" ? `${p.$r}px` : (p.$r ?? "6px")};
  background: linear-gradient(
    90deg,
    ${(p) => p.theme.colors.subtle} 0%,
    ${(p) => p.theme.colors.available} 50%,
    ${(p) => p.theme.colors.subtle} 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.6s ease-in-out infinite;
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const SkeletonStack = styled.div<{ $gap?: number }>`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.$gap ?? 8}px;
`;

/* ---------- Empty month notice ---------- */

export const MonthEmptyOverlay = styled(motion.div)`
  position: absolute;
  inset: -4px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 12px;
    background: ${(p) => p.theme.colors.background};
    opacity: 0.72;
    backdrop-filter: blur(2px);
  }
`;

export const MonthEmptyCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  max-width: 280px;
  padding: 22px 24px;
  border-radius: 14px;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.background};
  box-shadow: ${(p) => p.theme.shadows.card};
  text-align: center;
  svg {
    color: ${(p) => p.theme.colors.textSubtle};
    margin-bottom: 4px;
  }
  h4 {
    margin: 0;
    font-size: 15px;
    line-height: 22px;
    font-weight: 600;
    color: ${(p) => p.theme.colors.text};
  }
  p {
    margin: 0 0 10px;
    font-size: 13px;
    line-height: 19px;
    color: ${(p) => p.theme.colors.textMuted};
  }
`;

export const MonthEmptyButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 34px;
  padding: 0 12px 0 14px;
  border: none;
  border-radius: 9px;
  background: ${(p) => p.theme.colors.primary};
  color: ${(p) => p.theme.colors.primaryText};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    transform 0.1s ease;
  &:hover {
    background: ${(p) => p.theme.colors.primaryHover};
  }
  &:active {
    transform: scale(0.97);
  }
  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.primary};
    outline-offset: 2px;
  }
`;

/** Stacks its children in one grid cell so lists can crossfade in place. */
export const SlotStack = styled.div`
  display: grid;
  & > * {
    grid-area: 1 / 1;
    min-width: 0;
  }
`;
