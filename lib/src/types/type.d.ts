export type DynamicFormTypes = {
    disableIfPrefilled: boolean;
    id: string;
    identifier: string;
    label: string;
    options: {
        id: string;
        value: string;
    }[];
    required: boolean;
    type: string;
    placeholder: string;
    hidden?: boolean;
};
