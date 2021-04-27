import { ReactKeycloakProvider, useKeycloak } from "@react-keycloak/web";
import { Route, Router, Switch } from "react-router-dom";
import { Home } from "./components/Home";
import { LoadingPlaceholder } from "./components/LoadingPlaceholder";
import { Login } from "./components/Login";
import { Navbar } from "./components/Navbar";
import { NoMatch } from "./components/NoMatch";
import { Persons } from "./components/Persons";
import { PrivateRoute } from "./components/PrivateRoute";
import { Profile } from "./components/Profile";
import { HISTORY, KEYCLOAK_CLIENT } from "./constants";

const PERSON_PATHS = ["/persons", "/person/:localId"];

const Routes = () => {
  const { initialized } = useKeycloak();
  return initialized ? (
    <Router history={HISTORY}>
      <div className="text-gray-800">
        <Navbar />
        <div className="m-3">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path={PERSON_PATHS} component={Persons} />
            <PrivateRoute exact path="/profile" component={Profile} />
            <Route path="*" component={NoMatch} />
          </Switch>
        </div>
      </div>
    </Router>
  ) : (
    <LoadingPlaceholder delay />
  );
};

export const App = () => {
  return (
    <ReactKeycloakProvider
      authClient={KEYCLOAK_CLIENT}
      initOptions={{ checkLoginIframe: false }}
    >
      <Routes />
    </ReactKeycloakProvider>
  );
};
