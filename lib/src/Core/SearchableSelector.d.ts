import { CSSProperties } from "react";
type Props = {
    value: string;
    onChange: (value: string) => void;
    options: {
        label?: string;
        value: string;
    }[];
    label?: string;
    placeholder?: string;
    showSuffix?: (timezone: string) => string;
    selectorStyle?: CSSProperties;
    disabled?: boolean;
    showBorder?: boolean;
};
export declare const SearchableSelector: ({ value, onChange, options, label, placeholder, showSuffix, selectorStyle, disabled, showBorder, }: Props) => JSX.Element;
export {};
