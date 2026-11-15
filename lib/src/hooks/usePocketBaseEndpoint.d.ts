import type { SendOptions } from "pocketbase";
type Props = {
    url: string;
    options: SendOptions;
    skip?: boolean;
};
/** A PocketBase custom route read through the package's client. */
export declare const usePocketBaseEndpoint: <T>({ url, options, skip }: Props) => {
    data: T | undefined;
    isLoading: boolean;
    isError: boolean;
    refetch: () => Promise<void>;
};
export {};
