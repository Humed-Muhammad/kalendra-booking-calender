import React, { useId } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import type { ContentType } from "./types/type";

/* ---------- Segmented 12hr / 24hr toggle ---------- */

const Segmented = styled.div`
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
  gap: 2px;
  padding: 3px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.subtle};
`;

const SegmentButton = styled.button<{ $active: boolean }>`
  position: relative;
  z-index: 0;
  border: none;
  background: transparent;
  padding: 4px 10px;
  border-radius: 7px;
  font-size: 12px;
  line-height: 18px;
  font-weight: 600;
  cursor: pointer;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.text : theme.colors.textMuted};
  transition: color 0.2s ease;
  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 1px;
  }
`;

const Pill = styled(motion.span)`
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: 7px;
  background: ${({ theme }) => theme.colors.toggleActive};
  box-shadow: ${({ theme }) => theme.shadows.toggle};
`;

type Props = {
  options: string[];
  activeTab: string;
  onChange: (tab: string) => void;
  content?: ContentType | undefined;
};
export const Tab = ({ options, activeTab, content, onChange }: Props) => {
  const id = useId();
  return (
    <Segmented role="tablist">
      {options.map((option) => {
        const active = activeTab === option;
        return (
          <SegmentButton
            key={option}
            type="button"
            role="tab"
            aria-selected={active}
            $active={active}
            onClick={() => onChange(option)}
          >
            {active && (
              <Pill
                layoutId={`segment-pill-${id}`}
                transition={{ type: "spring", stiffness: 520, damping: 40 }}
              />
            )}
            {content?.[option as keyof ContentType] ?? option}
          </SegmentButton>
        );
      })}
    </Segmented>
  );
};

/* ---------- Time slots ---------- */

export const SlotRow = styled.div`
  display: flex;
  width: 100%;
`;

export const SlotButton = styled.button<{ $selected?: boolean }>`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 auto;
  min-width: 0;
  height: 44px;
  border-radius: 10px;
  border: 1px solid
    ${({ $selected, theme }) =>
      $selected ? theme.colors.available : theme.colors.border};
  background: ${({ $selected, theme }) =>
    $selected ? theme.colors.available : theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background-color 0.2s ease,
    transform 0.1s ease;
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
  &:active {
    transform: scale(0.98);
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const ConfirmButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100% - 8px);
  height: 44px;
  margin-inline-start: 8px;
  border: none;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primaryText};
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    transform 0.1s ease;
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryHover};
  }
  &:active:not(:disabled) {
    transform: scale(0.97);
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.8;
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

/** The time text inside a slot; rolls vertically when the time changes. */
export const SlotLabel = styled(motion.span)`
  display: block;
  white-space: nowrap;
  will-change: transform, opacity;
`;
