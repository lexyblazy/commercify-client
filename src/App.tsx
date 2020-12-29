import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Signup, Home } from "./pages";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
