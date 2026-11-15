import { useCallback, useEffect, useState } from "react";
import type { SendOptions } from "pocketbase";
import { useKalendra } from "../context/context";

type Props = {
  url: string;
  options: SendOptions;
  skip?: boolean;
};

/** A PocketBase custom route read through the package's client. */
export const usePocketBaseEndpoint = <T>({ url, options, skip }: Props) => {
  const { client } = useKalendra();
  const [isLoading, setIsLoading] = useState(!skip);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState<T | undefined>();

  const fetchData = useCallback(async () => {
    if (skip) return;
    setIsLoading(true);
    setIsError(false);
    try {
      setData(await client.send<T>(url, options));
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, url, JSON.stringify(options), skip]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, isError, refetch: fetchData };
};
