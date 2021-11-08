import { useAuth } from "nampi-use-api";
import { Route, Router, Switch } from "react-router";
import { About } from "./components/About";
import { AspectsPage } from "./components/AspectsPage";
import { AuthorsPage } from "./components/AuthorsPage";
import { Data } from "./components/Data";
import { DataModel } from "./components/DataModel";
import { EventsPage } from "./components/EventsPage";
import { GroupsPage } from "./components/GroupsPage";
import { Home } from "./components/Home";
import { Imprint } from "./components/Imprint";
import { LoadingPlaceholder } from "./components/LoadingPlaceholder";
import { Login } from "./components/Login";
import { Navbar } from "./components/Navbar";
import { NoMatch } from "./components/NoMatch";
import { PersonsPage } from "./components/PersonsPage";
import { PlacesPage } from "./components/PlacesPage";
import { Privacy } from "./components/Privacy";
import { PrivateRoute } from "./components/PrivateRoute";
import { Profile } from "./components/Profile";
import { SearchPage } from "./components/SearchPage";
import { SourcesPage } from "./components/SourcesPage";
import { HISTORY } from "./constants";

export const App = () => {
  const { initialized } = useAuth();
  return initialized ? (
    <Router history={HISTORY}>
      <div className="text-gray-800 h-screen flex flex-col">
        <Navbar className="sticky top-0 z-10" />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route
            exact
            path={["/aspects", "/aspects/:idLocal"]}
            component={AspectsPage}
          />
          <Route
            exact
            path={["/authors", "/authors/:idLocal"]}
            component={AuthorsPage}
          />
          <Route
            exact
            path={["/events", "/events/:idLocal"]}
            component={EventsPage}
          />
          <Route
            exact
            path={["/groups", "/groups/:idLocal"]}
            component={GroupsPage}
          />
          <Route
            exact
            path={["/persons", "/persons/:idLocal"]}
            component={PersonsPage}
          />
          <Route
            exact
            path={["/places", "/places/:idLocal"]}
            component={PlacesPage}
          />
          <Route
            exact
            path={["/sources", "/sources/:idLocal"]}
            component={SourcesPage}
          />
          <Route exact path="/search" component={SearchPage} />
          <Route exact path="/login" component={Login} />
          <PrivateRoute exact path="/profile" component={Profile} />
          <Route exact path="/info/about" component={About} />
          <Route exact path="/info/data" component={Data} />
          <Route exact path="/info/model" component={DataModel} />
          <Route exact path="/info/imprint" component={Imprint} />
          <Route exact path="/info/privacy" component={Privacy} />
          <Route path="*" component={NoMatch} />
        </Switch>
      </div>
    </Router>
  ) : (
    <LoadingPlaceholder className="text-gray-400" delay={2000} maximized />
  );
};
