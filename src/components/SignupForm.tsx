import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import _ from "lodash";

import * as apis from "../apis";
import * as utils from "../utils";

import { Button } from "./Button";
import { Loader } from "./Loader";
import { NotificationType } from "./Notification";

interface SignupProps {
  styles?: Object;
  handleNotification: (params: {
    message: string;
    show: boolean;
    type: NotificationType;
  }) => void;
}

export const SignupForm = ({ styles, handleNotification }: SignupProps) => {
  const [state, setState] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    touched: false,
    storeName: "",
  });
  const history = useHistory();

  useEffect(() => {
    const urlParams = utils.getUrlParams();
    if (urlParams.email) {
      setState({ ...state, email: urlParams.email });
    }
  }, []);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { email, password, firstName, lastName, storeName } = state;

    const response = await apis.merchants.signup({
      email,
      password,
      firstName,
      lastName,
      storeName,
    });

    if (response && response.ok && response.data) {
      utils.auth.save(response.data);
      await utils.sleep(1000);
      history.push("/dashboard");
    } else {
      utils.api.handleErrors({
        response,
        onClientError: () => {
          handleNotification({
            show: true,
            message: _.get(response.data, "error") ?? response.problem,
            type: "error",
          });
        },
      });
      console.log(response.problem);
    }

    setLoading(false);
  };

  const hasEmptyField =
    !state.email ||
    !state.password ||
    !state.firstName ||
    !state.lastName ||
    !state.storeName;
  const isValidEmail = utils.email.validate(state.email);

  const disabled = hasEmptyField || !isValidEmail || loading;
  const emailFieldError = (!state.email || !isValidEmail) && state.touched;
  const passwordFieldError = !state.password && state.touched;
  const firstNameFieldError = !state.firstName && state.touched;
  const lastNameFieldError = !state.lastName && state.touched;
  const storeNameFieldError = !state.storeName && state.touched;

  // const emailFieldError = state.email && state.touched && !isValidEmail;

  return (
    <form className="signup--form" style={styles} onSubmit={handleSubmit}>
      {loading ? (
        <Loader size="medium" withContainer center />
      ) : (
        <>
          <h1 className="primary-text margin-bottom-2">
            Start your 14-day free trial today
          </h1>
          <p className="secondary-text margin-bottom-2">
            Try Commercify for free, and explore all the tools and services you
            need to start, run, and grow your business.
          </p>
          <input
            className={`input input--block margin-bottom-2 ${
              emailFieldError ? "input--error" : ""
            }`}
            placeholder="Email Address"
            value={state.email}
            onChange={(e) =>
              setState({ ...state, email: e.target.value, touched: true })
            }
            type="email"
          />

          <input
            className={`input input--block margin-bottom-2 ${
              passwordFieldError ? "input--error" : ""
            }`}
            placeholder="Password"
            type="password"
            value={state.password}
            onChange={(e) =>
              setState({ ...state, touched: true, password: e.target.value })
            }
          />

          <input
            className={`input input--block margin-bottom-2 ${
              storeNameFieldError ? "input--error" : ""
            }`}
            placeholder="Your store name"
            type="text"
            value={state.storeName}
            onChange={(e) =>
              setState({ ...state, touched: true, storeName: e.target.value })
            }
          />

          <div className="margin-bottom-4">
            <input
              className={`input input--inline ${
                firstNameFieldError ? "input--error" : ""
              }`}
              placeholder="First Name"
              value={state.firstName}
              onChange={(e) =>
                setState({ ...state, touched: true, firstName: e.target.value })
              }
            />
            <input
              className={`input input--inline ${
                lastNameFieldError ? "input--error" : ""
              }`}
              placeholder="Last Name"
              value={state.lastName}
              onChange={(e) =>
                setState({ ...state, touched: true, lastName: e.target.value })
              }
            />
          </div>
          <Button
            text="Signup"
            onClick={handleSubmit}
            cssClasses={["btn--block", "btn--green"]}
            disabled={disabled}
          />
        </>
      )}
    </form>
  );
};
