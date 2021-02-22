import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Signup, Home, Dashboard } from "./pages";
import { withAuthentication } from "./components";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/signup" exact>
          <Signup />
        </Route>
        <Route
          path="/dashboard"
          exact
          component={withAuthentication(Dashboard)}
        ></Route>
        <Route path="/" exact>
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
