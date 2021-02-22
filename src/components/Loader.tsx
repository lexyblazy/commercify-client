import React from "react";

interface LoaderProps {
  size: "small" | "medium" | "large";
  withContainer?: boolean;
  center?: boolean;
  color?: "green";
}
export const Loader = ({ size, withContainer, center, color }: LoaderProps) => {
  const classes = ["loader", `loader--${size}`];

  if (color) {
    classes.push(`loader--${color}`);
  }

  const classNames = classes.join(" ");

  if (withContainer) {
    return (
      <div className="loader__container">
        <div className={classNames}></div>
      </div>
    );
  }
  return <div className={classNames}></div>;
};
