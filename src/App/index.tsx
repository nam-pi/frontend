import { useAuth } from "nampi-use-api";
import { Route, Router, Switch } from "react-router";
import { ActsPage } from "./components/ActsPage";
import { AspectsPage } from "./components/AspectsPage";
import { AuthorsPage } from "./components/AuthorsPage";
import { EventsPage } from "./components/EventsPage";
import { GroupsPage } from "./components/GroupsPage";
import { Home } from "./components/Home";
import { LoadingPlaceholder } from "./components/LoadingPlaceholder";
import { Login } from "./components/Login";
import { Navbar } from "./components/Navbar";
import { NoMatch } from "./components/NoMatch";
import { PersonsPage } from "./components/PersonsPage";
import { PlacesPage } from "./components/PlacesPage";
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
        <div className="max-w-7xl mx-auto px-2 my-4 w-full sm:overflow-hidden sm:px-6 lg:px-8 h-full">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route
              exact
              path={["/acts", "/acts/:idLocal"]}
              component={ActsPage}
            />
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
            <Route path="*" component={NoMatch} />
          </Switch>
        </div>
      </div>
    </Router>
  ) : (
    <LoadingPlaceholder delay={2000} />
  );
};
