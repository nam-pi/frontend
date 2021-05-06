import { useAuth } from "nampi-use-api";
import { useEffect } from "react";
import { useHistory, useLocation } from "react-router";

export const Login = () => {
  const history = useHistory();
  const location = useLocation<any>();
  const redirectUri =
    location?.state?.from ||
    window.location.protocol + "//" + window.location.host;
  const { authenticated, initialized, login } = useAuth();

  useEffect(() => {
    if (initialized) {
      if (authenticated) {
        history.push("/");
      } else {
        login({ redirectUri });
      }
    }
  }, [authenticated, history, initialized, login, redirectUri]);

  return <></>;
};
