import type { CommonProps } from '../common/types';
import { ReactNode, RefObject } from 'react';
export interface BoxProps extends CommonProps {
    variant?: 'modal-container';
    hideScrollBar?: boolean;
}
export declare const Box: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components/dist/types").Substitute<Pick<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "key" | keyof import("react").HTMLAttributes<HTMLDivElement>> & {
    ref?: RefObject<HTMLDivElement> | ((instance: HTMLDivElement | null) => void) | null | undefined;
}, BoxProps>> & string;
export declare const Flex: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("styled-components").FastOmit<Pick<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "key" | keyof import("react").HTMLAttributes<HTMLDivElement>> & {
    ref?: RefObject<HTMLDivElement> | ((instance: HTMLDivElement | null) => void) | null | undefined;
}, keyof BoxProps> & BoxProps, never>> & string;
export declare const CenterRow: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("styled-components").FastOmit<import("styled-components").FastOmit<Pick<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "key" | keyof import("react").HTMLAttributes<HTMLDivElement>> & {
    ref?: RefObject<HTMLDivElement> | ((instance: HTMLDivElement | null) => void) | null | undefined;
}, keyof BoxProps> & BoxProps, never>, never>> & string;
export declare const CenterColumn: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("styled-components").FastOmit<import("styled-components").FastOmit<Pick<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "key" | keyof import("react").HTMLAttributes<HTMLDivElement>> & {
    ref?: RefObject<HTMLDivElement> | ((instance: HTMLDivElement | null) => void) | null | undefined;
}, keyof BoxProps> & BoxProps, never>, never>> & string;
export declare const Container: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("styled-components").FastOmit<import("styled-components").FastOmit<Pick<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "key" | keyof import("react").HTMLAttributes<HTMLDivElement>> & {
    ref?: RefObject<HTMLDivElement> | ((instance: HTMLDivElement | null) => void) | null | undefined;
}, keyof BoxProps> & BoxProps, never>, never>> & string;
export declare const ModalContentContainer: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("styled-components").FastOmit<Pick<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "key" | keyof import("react").HTMLAttributes<HTMLDivElement>> & {
    ref?: RefObject<HTMLDivElement> | ((instance: HTMLDivElement | null) => void) | null | undefined;
}, keyof BoxProps> & BoxProps, never>> & string;
export declare const ModalContent: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("styled-components").FastOmit<Pick<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "key" | keyof import("react").HTMLAttributes<HTMLDivElement>> & {
    ref?: RefObject<HTMLDivElement> | ((instance: HTMLDivElement | null) => void) | null | undefined;
}, keyof BoxProps> & BoxProps, never>> & string;
export declare const ChipComponent: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components").FastOmit<import("styled-components").FastOmit<import("styled-components").FastOmit<import("styled-components").FastOmit<Pick<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "key" | keyof import("react").HTMLAttributes<HTMLDivElement>> & {
    ref?: RefObject<HTMLDivElement> | ((instance: HTMLDivElement | null) => void) | null | undefined;
}, keyof BoxProps> & BoxProps, never>, never>, never>> & string;
export type ChipTypes = 'error' | 'success' | 'warning' | 'info' | 'default' | 'secondary';
interface ChipsProps extends BoxProps {
    value: string | number | undefined | ReactNode;
    type?: ChipTypes;
    ref?: RefObject<HTMLDivElement>;
    onClick?: () => void;
    id?: string;
    rightAdornment?: React.ReactNode;
    leftAdornment?: React.ReactNode;
    textTransform?: 'capitalize' | 'uppercase' | 'lowercase' | 'none';
}
export declare const Chip: ({ type, value, rightAdornment, textTransform, leftAdornment, ...rest }: ChipsProps) => JSX.Element;
interface OverflowProps {
    showScrollbar?: boolean;
}
export declare const Overflow: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components/dist/types").Substitute<import("styled-components").FastOmit<Pick<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "key" | keyof import("react").HTMLAttributes<HTMLDivElement>> & {
    ref?: RefObject<HTMLDivElement> | ((instance: HTMLDivElement | null) => void) | null | undefined;
}, keyof BoxProps> & BoxProps, OverflowProps>> & string;
export {};
