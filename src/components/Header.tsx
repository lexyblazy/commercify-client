import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "../components";

import * as utils from "../utils";

export const Header = () => {
  let [state, setState] = useState({ email: "" });
  const history = useHistory();
  const isValidEmail = utils.email.validate(state.email);
  const disabled = state.email?.length < 1 || !isValidEmail;

  return (
    <header className="header">
      <div className="header__main">
        <h1 className="header__main-text">
          Anyone, anywhere, can start a business
        </h1>
        <div className="header__signup">
          <input
            type="email"
            className="input header__input"
            value={state.email}
            onChange={(e) => setState({ email: e.target.value })}
          />

          <Button
            text="Start free trial"
            cssClasses={["btn--green"]}
            onClick={(e) => {
              history.push(`/signup?email=${state.email}`);
            }}
            disabled={disabled}
          />
        </div>
        <small className="header__small">
          Try Commercify free for 14 days, no credit card required. By entering
          your email, you agree to receive marketing emails from Commercify
        </small>
      </div>
      <div className="header__image" />
    </header>
  );
};
