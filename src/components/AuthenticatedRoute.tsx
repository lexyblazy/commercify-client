import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import * as utils from "../utils";

export function withAuthentication(WrappedComponent: React.ComponentClass) {
  return class extends Component {
    render() {
      const isAuthenticated = utils.auth.isAuthenticated();

      if (!isAuthenticated) {
        return <Redirect to="/signup" />;
      }

      return <WrappedComponent {...this.props} />;
    }
  };
}
