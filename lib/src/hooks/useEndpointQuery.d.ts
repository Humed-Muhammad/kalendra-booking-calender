type RequestOptions = {
    method?: string;
    data?: Record<string, any>;
};
type Props = {
    url: string;
    options: RequestOptions;
    skip?: boolean;
};
/** POST/GET to Kalendra's custom routes (apiUrl), keeping only the latest request's answer. */
export declare const useEndpointQuery: <T>({ url, options, skip }: Props) => {
    data: T | undefined;
    dataOptions: RequestOptions | undefined;
    error: unknown;
    isLoading: boolean;
    isError: boolean;
    refetch: () => Promise<void>;
};
export {};
