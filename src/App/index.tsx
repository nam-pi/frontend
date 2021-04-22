import { ReactKeycloakProvider, useKeycloak } from "@react-keycloak/web";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Home } from "./components/Home";
import { LoadingPlaceholder } from "./components/LoadingPlaceholder";
import { Login } from "./components/Login";
import { Navbar } from "./components/Navbar";
import { NoMatch } from "./components/NoMatch";
import { Persons } from "./components/Persons";
import { PrivateRoute } from "./components/PrivateRoute";
import { Profile } from "./components/Profile";
import { KEYCLOAK_CLIENT } from "./constants";

const PERSON_PATHS = ["/persons", "/person/:localId"];

const Routes = () => {
  const { initialized } = useKeycloak();
  return initialized ? (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path={PERSON_PATHS} component={Persons} />
        <PrivateRoute exact path="/profile" component={Profile} />
        <Route path="*" component={NoMatch} />
      </Switch>
    </Router>
  ) : (
    <LoadingPlaceholder />
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
