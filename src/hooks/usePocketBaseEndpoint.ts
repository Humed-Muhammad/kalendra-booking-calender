import { useCallback, useContext, useEffect, useState } from "react";
import { SendOptions } from "pocketbase";
import { KalendraContext } from "../context/context";

type Props = {
  url: string;
  options: SendOptions;
  skip?: boolean;
};
export const usePocketBaseEndpoint = <T>({ url, options, skip }: Props) => {
  const { db } = useContext(KalendraContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | undefined>();
  const [success, setSuccess] = useState<boolean>(false);
  const [data, setData] = useState<T | undefined>();

  const reset = () => {
    setIsLoading(false);
    setIsError(false);
    setError(undefined);
    setSuccess(false);
    setData(undefined);
  };
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(undefined);
    setSuccess(false);
    try {
      if (!skip) {
        const response = await db?.send<T>(url, options);
        setData(response);
        setSuccess(true);
      }
    } catch (error) {
      setIsError(true);
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [url, JSON.stringify(options), skip, db]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    error,
    isLoading,
    isError,
    success,
    reset,
    refetch: fetchData,
  };
};
