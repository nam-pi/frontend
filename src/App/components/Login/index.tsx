import { useKeycloak } from "@react-keycloak/web";
import { useEffect } from "react";

export const Login = () => {
  const { initialized, keycloak } = useKeycloak();

  useEffect(() => {
    if (initialized && !keycloak.authenticated)
      keycloak.login({
        redirectUri: window.location.protocol + "//" + window.location.host,
      });
  }, [initialized, keycloak]);

  return <></>;
};
