import { SendOptions } from "pocketbase";
type Props = {
    url: string;
    options: SendOptions;
    skip?: boolean;
};
export declare const usePocketBaseEndpoint: <T>({ url, options, skip }: Props) => {
    data: T | undefined;
    error: Error | undefined;
    isLoading: boolean;
    isError: boolean;
    success: boolean;
    reset: () => void;
    refetch: () => Promise<void>;
};
export {};
