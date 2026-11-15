/// <reference types="react" />
import type { ContentType, DynamicFormTypes } from "./types/type";
type DynamicFormProps = {
    onBack: () => void;
    fields: Array<DynamicFormTypes>;
    bookingQuestions?: any;
    onSubmit: (values: any) => void;
    isLoading: boolean;
    content?: ContentType | undefined;
    setBookingQuestions: (questions: any) => void;
};
export declare const DynamicForm: ({ onBack, onSubmit, setBookingQuestions, isLoading, fields, bookingQuestions, content, }: DynamicFormProps) => JSX.Element;
export {};
