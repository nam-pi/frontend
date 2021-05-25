import { useAuth } from "nampi-use-api";
import { Route, Router, Switch } from "react-router";
import { Home } from "./components/Home";
import { LoadingPlaceholder } from "./components/LoadingPlaceholder";
import { Login } from "./components/Login";
import { Navbar } from "./components/Navbar";
import { NoMatch } from "./components/NoMatch";
import { Person } from "./components/Person";
import { Persons } from "./components/Persons";
import { PrivateRoute } from "./components/PrivateRoute";
import { Profile } from "./components/Profile";
import { HISTORY } from "./constants";

export const App = () => {
  const { initialized } = useAuth();
  return initialized ? (
    <Router history={HISTORY}>
      <div className="text-gray-800">
        <Navbar />
        <div className="max-w-7xl mx-auto px-2 mt-4 sm:px-6 lg:px-8">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/persons" component={Persons} />
            <Route exact path="/person/:idLocal" component={Person} />
            <PrivateRoute exact path="/profile" component={Profile} />
            <Route path="*" component={NoMatch} />
          </Switch>
        </div>
      </div>
    </Router>
  ) : (
    <LoadingPlaceholder delay={1000} />
  );
};
