import { createContext, useEffect, useState } from "react";
import Pocketbase from "pocketbase";
export type KalendraContextType = {
  db: Pocketbase | undefined;
  pbUrl: string;
  setPbUrl: (url: string) => void;
};
export const KalendraContext = createContext<Partial<KalendraContextType>>({});

export const KalendraProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [pbUrl, setPbUrl] = useState<string>("");
  const [db, setDb] = useState<Pocketbase>();
  useEffect(() => {
    if (pbUrl) {
      const db = new Pocketbase(pbUrl);
      setDb(db);
    }
  }, [pbUrl]);

  return (
    <KalendraContext.Provider value={{ db, pbUrl, setPbUrl }}>
      {children}
    </KalendraContext.Provider>
  );
};
