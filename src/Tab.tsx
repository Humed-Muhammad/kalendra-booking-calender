import styled from "styled-components";
import { Box, Text } from "./Core/index";
import { Button } from "./Core/Button/Button";
import { ContentType } from "./types";

export const TabsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  width: 100%;
`;

export const TabsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  gap: 0.5rem;
`;

export const Title = styled.p`
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--foreground);
  min-width: fit-content;
`;

export const TabsList = styled.div`
  display: flex;
  gap: 0.5rem;
  border: 1px solid ${({ theme }: any) => theme.colors.border};
  border-radius: 6px;
  padding: 4px;
  scale: 0.9;
`;

export const TabTrigger = styled(Button)<{ active: boolean }>`
  padding: 6px 10px;
  border-radius: 0.25rem;
  font-weight: 600;
  border: none;
  background: ${({ active, theme }: any) =>
    active ? theme.colors.dayBg : "transparent"};
  cursor: pointer;
  transition: background 0.2s ease-in-out;
  &:hover {
    background: ${({ theme }: any) => theme.colors.lightGray};
    color: ${({ theme }: any) => theme.colors.text};
  }
`;

export const TabsContent = styled.div`
  min-height: calc(400px - 100px);
  width: 100%;
  ::-webkit-scrollbar {
    width: 0.25rem;
  }
  ::-webkit-scrollbar-thumb {
    background: ${(props: any) => props.theme.colors.lightGray};
    border-radius: 0.25rem;
  }
  ::-webkit-scrollbar-track {
    background: transparent !important;
  }
`;

export const TimeSlotContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow-y: scroll;

  max-height: 100%;
  align-items: center;
  padding: 0 1.5rem;
`;

export const TimeSlot = styled(Box)<{ selected?: boolean }>`
  display: flex;
  border: 1px solid ${(props: any) => props.theme.colors.lightGray};
  border-radius: 6px;
  padding: 6px;
  cursor: pointer;
  transition: background 0.2s ease-in-out;
  justify-content: center;
  align-items: center;
  width: 100%;
  &:hover {
    background: ${(props: any) =>
      !props.selected
        ? props.theme.colors.dayBg
        : props.theme.colors.lightGray};
  }
`;

export const NoSlotsMessage = styled.div`
  text-align: center;
`;

type Props = {
  options: string[];
  activeTab: string;
  onChange: (tab: string) => void;
  content: ContentType | undefined;
};
export const Tab = ({ options, activeTab, content, onChange }: Props) => {
  return (
    <TabsList>
      {options?.map((option) => (
        <TabTrigger
          key={option}
          active={activeTab === option}
          onClick={() => onChange(option)}
        >
          <Text color="inherit">
            {content?.[option as keyof ContentType] ?? option}
          </Text>
        </TabTrigger>
      ))}
    </TabsList>
  );
};
