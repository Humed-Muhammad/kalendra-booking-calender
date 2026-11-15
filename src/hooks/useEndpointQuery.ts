import { useCallback, useEffect, useRef, useState } from "react";
import { useKalendra } from "../context/context";

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
export const useEndpointQuery = <T>({ url, options, skip }: Props) => {
  const { apiUrl, client } = useKalendra();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<unknown>();
  const [data, setData] = useState<T | undefined>();
  // The request options `data` was fetched with.
  const [dataOptions, setDataOptions] = useState<RequestOptions | undefined>();

  // A slow stale answer must never overwrite a fresher one.
  const latestRequestRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    const requestId = ++latestRequestRef.current;
    const isLatest = () => requestId === latestRequestRef.current;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setIsError(false);
    setError(undefined);
    try {
      if (!skip) {
        const response = await fetch(`${apiUrl}${url}`, {
          method: options.method ?? "GET",
          headers: {
            "Content-Type": "application/json",
            // Same as the Kalendra frontend: a signed-in Kalendra user's token, when there is one.
            ...(client.authStore.token ? { Authorization: client.authStore.token } : {}),
          },
          body: options.data ? JSON.stringify(options.data) : undefined,
          signal: controller.signal,
        });
        if (!response.ok) throw response;
        const json = (await response.json()) as T;
        if (!isLatest()) return;
        setData(json);
        setDataOptions(options);
      }
    } catch (err) {
      if (!isLatest()) return;
      setIsError(true);
      setError(err);
    } finally {
      if (isLatest()) setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiUrl, client, url, JSON.stringify(options), skip]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => () => abortRef.current?.abort(), []);

  return { data, dataOptions, error, isLoading, isError, refetch: fetchData };
};
