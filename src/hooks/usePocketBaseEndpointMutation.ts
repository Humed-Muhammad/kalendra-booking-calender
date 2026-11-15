import { useCallback, useState } from "react";
import type { SendOptions } from "pocketbase";
import { useKalendra } from "../context/context";

type Props = {
  url: string;
  options?: SendOptions;
  willNavigate?: boolean;
};

/** A PocketBase custom route write; rejects with the server's response body. */
export const usePocketBaseEndpointMutation = <T>({ url, options: defaultOptions, willNavigate }: Props) => {
  const { client } = useKalendra();
  const [isLoading, setIsLoading] = useState(false);

  const mutate = useCallback(
    async (body?: any): Promise<T | undefined> => {
      setIsLoading(true);
      try {
        return await client.send<T>(url, { ...defaultOptions, body: body ?? defaultOptions?.body });
      } catch (err: any) {
        setIsLoading(false);
        throw err?.response || err;
      } finally {
        // The host navigates away on success; keep the spinner until it does.
        if (!willNavigate) setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [client, url, JSON.stringify(defaultOptions), willNavigate],
  );

  return { mutate, isLoading };
};
