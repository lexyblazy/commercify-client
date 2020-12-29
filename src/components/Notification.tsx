import React from "react";

export type NotificationType = "error" | "info" | "warning";

interface NotificationProps {
  message: string;
  type: NotificationType;
  show: boolean;
  toggleNotification: () => void;
}

export const Notification = ({
  show,
  message,
  type,
  toggleNotification,
}: NotificationProps) => {
  return show ? (
    <div className={`notification notification--${type}`}>
      {message}

      <span
        className="notification__close-icon"
        onClick={() => toggleNotification()}
      >
        X
      </span>
    </div>
  ) : (
    <div />
  );
};
