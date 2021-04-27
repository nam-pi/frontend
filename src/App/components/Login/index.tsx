import { useKeycloak } from "@react-keycloak/web";
import { useEffect } from "react";
import { useHistory, useLocation } from "react-router";

export const Login = () => {
  const history = useHistory();
  const location = useLocation<any>();
  const redirectUri =
    location?.state?.from ||
    window.location.protocol + "//" + window.location.host;
  const { initialized, keycloak } = useKeycloak();

  useEffect(() => {
    if (initialized) {
      if (keycloak.authenticated) {
        history.push("/");
      } else {
        keycloak.login({ redirectUri });
      }
    }
  }, [history, initialized, keycloak, redirectUri]);

  return <></>;
};
