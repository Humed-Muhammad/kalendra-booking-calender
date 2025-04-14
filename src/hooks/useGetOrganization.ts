import { useEffect, useState } from "react";
import { Organization } from "../types";

export const useGetOrganization = () => {
  const [organization, setOrganization] = useState<Partial<Organization>>();
  useEffect(() => {
    const storedOrg = localStorage.getItem("currentOrganization");
    if (storedOrg) {
      setOrganization(storedOrg ? JSON.parse(storedOrg) : {});
    }
  }, []);
  return { organization };
};
