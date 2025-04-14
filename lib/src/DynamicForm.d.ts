/// <reference types="react" />
import { DynamicFormTypes } from "./types/type";
type DynamicFormProps = {
    onBack: () => void;
    fields: Array<DynamicFormTypes>;
    bookingQuestions?: any;
    onSubmit: (values: any) => void;
    isLoading: boolean;
};
export declare const DynamicForm: ({ onBack, onSubmit, isLoading, fields, bookingQuestions, }: DynamicFormProps) => JSX.Element;
export {};
