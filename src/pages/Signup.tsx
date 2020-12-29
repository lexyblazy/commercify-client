import React, { useState } from "react";
import { SignupForm, Notification } from "../components";
import { NotificationType } from "../components/Notification";

export const Signup = () => {
  const [notificationState, toggleNotification] = useState({
    show: false,
    message: "",
    type: "" as NotificationType,
  });

  return (
    <div className="signup">
      {notificationState.show && (
        <Notification
          message={notificationState.message}
          type={notificationState.type}
          show={notificationState.show}
          toggleNotification={() =>
            toggleNotification({
              ...notificationState,
              show: !notificationState.show,
            })
          }
        />
      )}
      <div className="signup__items-container">
        <SignupForm
          styles={{ marginRight: "4rem" }}
          handleNotification={({
            message,
            show,
            type,
          }: {
            message: string;
            show: boolean;
            type: NotificationType;
          }) => toggleNotification({ message, show, type })}
        />
        <div className="signup__image">
          <div className="signup__stats">
            <h1 className="signup__stats-primary-text margin-bottom-2">
              You’re in good company
            </h1>
            <p className="signup__stats-secondary-text">
              Over 1,000,000 stores, in more than 175 countries, trust
              Commercify to run their business.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
