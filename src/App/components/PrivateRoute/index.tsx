import { useAuth } from "nampi-use-api";
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
  const { authenticated } = useAuth();
  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated ? (
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
