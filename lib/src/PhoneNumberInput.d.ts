/// <reference types="react" />
import "react-phone-input-2/lib/style.css";
type PhoneNumberInputProps = {
    id: string;
    name: string;
    label?: string;
    placeholder?: string;
    handleChange?: (value: string) => void;
    values?: any;
    disabled?: boolean;
    field?: any;
    value?: string;
};
export declare const PhoneNumberInput: ({ id, name, label, placeholder, value, disabled, handleChange, }: PhoneNumberInputProps) => JSX.Element;
export {};
