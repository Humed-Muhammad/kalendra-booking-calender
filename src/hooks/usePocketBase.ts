import { useCallback, useEffect, useState } from "react";
import { db, flattenPocketBaseData } from "../utils";
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
export const usePocketBaseQuery = <T, K = T>({
  collectionName,
  options,
  id,
  skip,
  single,
  flattened,
  paginated,
  transformData,
}: PocketBaseQuery<T, K>) => {
  const [data, setData] = useState<unknown>();
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      if (single) {
        const response = await db
          .collection(collectionName)
          .getFirstListItem<T>(options?.filter as string, options);
        setData(response);
      } else if (id) {
        const response = await db
          .collection(collectionName)
          .getOne<T>(id, options);
        setData(response);
      } else if (paginated) {
        const response = await db
          .collection(collectionName)
          .getList<T>(options?.page, options?.perPage, options);
        setData(response);
      } else {
        const response = await db
          .collection(collectionName)
          .getFullList(options);
        setData(response);
      }
      setSuccess(true);
    } catch (err: any) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error("Failed to fetch data"));
    } finally {
      setIsLoading(false);
    }
  }, [collectionName, JSON.stringify(options), skip, id]);

  useEffect(() => {
    if (skip) {
      setIsLoading(false);
      return;
    }
    fetchData();
  }, [fetchData, skip]);

  const refetch = () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    setSuccess(false);
    fetchData();
  };
  const result = (flattened ? flattenPocketBaseData(data as any) : data) as T;
  return {
    data: (transformData ? transformData(result) : result) as K,
    error,
    isError,
    isLoading,
    success,
    refetch,
  };
};
interface PocketBaseMutation<T> extends Partial<PocketBaseQuery> {
  update?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
}
export const usePocketBaseMutation = <T>(
  payload?: Partial<PocketBaseMutation<T>>
) => {
  const collectionName = payload?.collectionName;
  const update = payload?.update;
  const options = payload?.options;
  const [data, setData] = useState<T | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isError, setIsError] = useState(false);
  const reset = () => {
    setData(null);
    setSuccess(false);
    setError(null);
    setIsError(false);
    setIsLoading(false);
  };
  const mutate = useCallback(
    async (
      data?: { [key: string]: any },
      mutateOptions?: PocketBaseMutation<T>
    ): Promise<T | undefined> => {
      try {
        let response;
        setIsLoading(true);
        setError(null);
        setIsError(false);
        setSuccess(false);
        if (update || mutateOptions?.update) {
          response = await db
            .collection(String(collectionName ?? mutateOptions?.collectionName))
            .update<T>(
              data?.id || mutateOptions?.id || payload?.id,
              data,
              options ?? mutateOptions?.options
            );
        } else {
          delete data?.id;
          response = await db
            .collection(String(collectionName ?? mutateOptions?.collectionName))
            .create<T>(data, options ?? mutateOptions?.options);
        }
        setData(response);
        setSuccess(true);
        payload?.onSuccess?.(response);
        return response;
      } catch (err: any) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch data")
        );
        setIsError(true);
        payload?.onError?.(err?.response);
        throw err?.response;
      } finally {
        setIsLoading(false);
      }
    },
    [JSON.stringify(payload)]
  );

  return {
    data,
    error,
    isLoading,
    success,
    mutate,
    reset,
    isError,
  };
};

// export const useGetOne = <T>(
//   collectionName: string,
//   id: string,
//   options?: RecordFullListOptions
// ) => {
//   const getOne = () => db.collection(collectionName).getOne<T>(id, options);
//   const { data, error, trigger, isMutating, reset } = useSWRMutation<T>(
//     `get-one-${collectionName}-${id}`,
//     getOne
//   );
//   return {
//     data,
//     error,
//     isLoading: isMutating,
//     trigger,
//     reset,
//   };
// };

// export const useGetFirstListItem = <T>(collectionName: string) => {
//   const getFirstListItem = (
//     url: string,
//     data: { arg: { filter: string; option?: RecordListOptions } }
//   ) =>
//     db
//       .collection(collectionName)
//       .getFirstListItem<T>(data.arg.filter, data.arg.option);
//   const { data, error, trigger, isMutating, reset } = useSWRMutation(
//     `get-first-list-item-${collectionName}`,
//     getFirstListItem
//   );
//   return {
//     data,
//     error,
//     isLoading: isMutating,
//     trigger,
//     reset,
//   };
// };
