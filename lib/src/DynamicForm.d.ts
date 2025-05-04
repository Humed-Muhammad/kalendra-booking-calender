/// <reference types="react" />
import { DynamicFormTypes } from "./types/type";
import { ContentType } from "./types";
type DynamicFormProps = {
    onBack: () => void;
    fields: Array<DynamicFormTypes>;
    bookingQuestions?: any;
    onSubmit: (values: any) => void;
    isLoading: boolean;
    content?: ContentType | undefined;
};
export declare const DynamicForm: ({ onBack, onSubmit, isLoading, fields, bookingQuestions, content, }: DynamicFormProps) => JSX.Element;
export {};
