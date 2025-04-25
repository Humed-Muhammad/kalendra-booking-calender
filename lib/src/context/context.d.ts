/// <reference types="react" />
import Pocketbase from "pocketbase";
export type KalendraContextType = {
    db: Pocketbase | undefined;
    pbUrl: string;
    setPbUrl: (url: string) => void;
};
export declare const KalendraContext: import("react").Context<Partial<KalendraContextType>>;
export declare const KalendraProvider: ({ children, }: {
    children: React.ReactNode;
}) => JSX.Element;
