import { RecordFullListOptions } from "pocketbase";
type PocketBaseQuery<T = unknown, K = T> = {
    collectionName: string;
    options?: RecordFullListOptions;
    id?: string;
    single?: boolean;
    skip?: boolean;
    /**
     * This will flatten the expanded data from the PocketBase response
     */
    flattened?: boolean;
    /**
     * An optional function to transform the data returned from the PocketBase query.
     * This function takes the raw data array of type `T[]` and returns a transformed type `K`.
     * This can be useful for flattening or restructuring the data to match your application's needs.
     */
    transformData?: (data: T) => K;
    paginated?: boolean;
};
/**
 * A React hook that provides a convenient way to fetch data from a PocketBase collection.
 * It handles the state management of the data, success, error, and loading states.
 * The hook also supports options for filtering, pagination, and flattening the response data.
 * T is the type of the data returned from the PocketBase query, and K is the transformed type.
 */
export declare const usePocketBaseQuery: <T, K = T>({ collectionName, options, id, skip, single, flattened, paginated, transformData, }: PocketBaseQuery<T, K>) => {
    data: K;
    error: Error | null;
    isError: boolean;
    isLoading: boolean;
    success: boolean;
    refetch: () => void;
};
interface PocketBaseMutation<T> extends Partial<PocketBaseQuery> {
    update?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
}
export declare const usePocketBaseMutation: <T>(payload?: Partial<PocketBaseMutation<T>> | undefined) => {
    data: T | null;
    error: Error | null;
    isLoading: boolean;
    success: boolean;
    mutate: (data?: {
        [key: string]: any;
    } | undefined, mutateOptions?: PocketBaseMutation<T> | undefined) => Promise<T | undefined>;
    reset: () => void;
    isError: boolean;
};
export {};
