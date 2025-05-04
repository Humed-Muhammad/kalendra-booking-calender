/// <reference types="react" />
import { ContentType } from "./types";
export declare const TabsContainer: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never>> & string;
export declare const TabsHeader: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never>> & string;
export declare const Title: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>, never>> & string;
export declare const TabsList: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never>> & string;
export declare const TabTrigger: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components/dist/types").Substitute<import("styled-components").FastOmit<Pick<import("react").DetailedHTMLProps<import("react").ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, "key" | keyof import("react").ButtonHTMLAttributes<HTMLButtonElement>> & {
    ref?: import("react").RefObject<HTMLButtonElement> | ((instance: HTMLButtonElement | null) => void) | null | undefined;
}, keyof import("./Core/common/types").CommonProps> & import("./Core/common/types").CommonProps, {
    active: boolean;
}>> & string;
export declare const TabsContent: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never>> & string;
export declare const TimeSlotContainer: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never>> & string;
export declare const TimeSlot: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components/dist/types").Substitute<import("styled-components").FastOmit<Pick<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "key" | keyof import("react").HTMLAttributes<HTMLDivElement>> & {
    ref?: import("react").RefObject<HTMLDivElement> | ((instance: HTMLDivElement | null) => void) | null | undefined;
}, keyof import("./Core/index").BoxProps> & import("./Core/index").BoxProps, {
    selected?: boolean | undefined;
}>> & string;
export declare const NoSlotsMessage: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never>> & string;
type Props = {
    options: string[];
    activeTab: string;
    onChange: (tab: string) => void;
    content: ContentType | undefined;
};
export declare const Tab: ({ options, activeTab, content, onChange }: Props) => JSX.Element;
export {};
