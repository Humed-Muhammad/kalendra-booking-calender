import type { SendOptions } from "pocketbase";
type Props = {
    url: string;
    options?: SendOptions;
    willNavigate?: boolean;
};
/** A PocketBase custom route write; rejects with the server's response body. */
export declare const usePocketBaseEndpointMutation: <T>({ url, options: defaultOptions, willNavigate }: Props) => {
    mutate: (body?: any) => Promise<T | undefined>;
    isLoading: boolean;
};
export {};
