import { useKeycloak } from "@react-keycloak/web";
import { Redirect, Route, RouteComponentProps, RouteProps } from "react-router";

interface PrivateRouteParams extends RouteProps {
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>;
}

export const PrivateRoute = ({
  component: Component,
  ...rest
}: PrivateRouteParams) => {
  const { keycloak } = useKeycloak();
  return (
    <Route
      {...rest}
      render={(props) =>
        keycloak?.authenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: window.location.href },
            }}
          />
        )
      }
    />
  );
};
